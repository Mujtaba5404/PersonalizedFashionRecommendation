import { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import RNBlobUtil from 'react-native-blob-util';

/**
 * Removes the near-white background from a product image and returns a cropped
 * transparent PNG (data URI) via `onResult`. Mirrors ar_tryon.py `garment_cutout`.
 *
 * How it avoids CORS canvas tainting: the remote image is first fetched to
 * base64 (native, not subject to CORS) and fed into an offscreen WebView canvas
 * as a same-origin data: URI, so getImageData()/toDataURL() are allowed.
 *
 * Renders an invisible 1x1 WebView; unmount it once you have the result.
 */
const buildHtml = (dataUri: string) => `<!DOCTYPE html><html><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head><body>
<script>
(function(){
  function post(m){ if(window.ReactNativeWebView){ window.ReactNativeWebView.postMessage(m); } }
  try{
    var img = new Image();
    img.onload = function(){
      try{
        var c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var d = ctx.getImageData(0, 0, c.width, c.height);
        var a = d.data;
        var minX = c.width, minY = c.height, maxX = 0, maxY = 0, found = false;
        for (var y = 0; y < c.height; y++){
          for (var x = 0; x < c.width; x++){
            var i = (y * c.width + x) * 4;
            var r = a[i], g = a[i+1], b = a[i+2];
            var mx = r > g ? (r > b ? r : b) : (g > b ? g : b);
            var mn = r < g ? (r < b ? r : b) : (g < b ? g : b);
            if (mn > 218 && (mx - mn) < 30){ a[i+3] = 0; }   // near-white -> transparent
            else { found = true;
              if (x < minX) minX = x; if (x > maxX) maxX = x;
              if (y < minY) minY = y; if (y > maxY) maxY = y; }
          }
        }
        ctx.putImageData(d, 0, 0);
        var out = c;
        if (found){                                         // crop to the garment
          var cw = maxX - minX + 1, ch = maxY - minY + 1;
          var c2 = document.createElement('canvas');
          c2.width = cw; c2.height = ch;
          c2.getContext('2d').drawImage(c, minX, minY, cw, ch, 0, 0, cw, ch);
          out = c2;
        }
        post(out.toDataURL('image/png'));
      } catch(e){ post('ERR:' + (e && e.message)); }
    };
    img.onerror = function(){ post('ERR:imgload'); };
    img.src = ${JSON.stringify(dataUri)};
  } catch(e){ post('ERR:' + (e && e.message)); }
})();
</script></body></html>`;

type Props = {
  source: ImageSourcePropType;
  onResult: (pngDataUri: string) => void;
  onError?: (msg: string) => void;
};

const GarmentCutout = ({ source, onResult, onError }: Props) => {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const uri =
        typeof source === 'number'
          ? Image.resolveAssetSource(source)?.uri
          : (source as any)?.uri;
      if (!uri) return;
      try {
        const res = await RNBlobUtil.config({ timeout: 30000 }).fetch('GET', uri);
        const status = res.info().status;
        if (status < 200 || status >= 300) {
          onError?.(`fetch ${status}`);
          return;
        }
        const b64 = res.base64();
        const mime = /\.png(\?|$)/i.test(uri) ? 'image/png' : 'image/jpeg';
        if (alive) setHtml(buildHtml(`data:${mime};base64,${b64}`));
      } catch (e: any) {
        onError?.(e?.message || 'fetch failed');
      }
    })();
    return () => {
      alive = false;
    };
  }, [source, onError]);

  if (!html) return null;

  return (
    <View style={styles.hidden} pointerEvents="none">
      <WebView
        source={{ html }}
        originWhitelist={['*']}
        javaScriptEnabled
        onMessage={e => {
          const m = e.nativeEvent.data || '';
          if (m.startsWith('data:image/png')) onResult(m);
          else onError?.(m);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: { position: 'absolute', width: 1, height: 1, opacity: 0, left: -1000, top: -1000 },
});

export default GarmentCutout;
