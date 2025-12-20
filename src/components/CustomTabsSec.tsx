import { useEffect, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { fontFamily } from '../assets/Fonts';
import { height } from '../utilities';
import { colors } from '../utilities/colors';
import { fontSizes } from '../utilities/fontsizes';

const { width } = Dimensions.get('window');

interface CustomTabsProps {
    tabs: string[];
    tabContents: React.ComponentType[];
    activeTabLoad?: number;
}

const CustomTabsSec: React.FC<CustomTabsProps> = ({
    tabs,
    tabContents,
    activeTabLoad = 0,
}) => {
    const [activeTab, setActiveTab] = useState<number>(activeTabLoad);
    const TAB_WIDTH = (width * 0.85) / tabs.length;

    useEffect(() => {
        if (activeTabLoad !== undefined) {
            setActiveTab(activeTabLoad);
        } 
    }, [activeTabLoad]);

    const renderActiveScreen = () => {
        const ActiveScreenComponent = tabContents[activeTab];
        return <ActiveScreenComponent />;
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.tabWrapper}>
                    <View style={styles.tabContainer}>
                        {tabs.map((tab, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.tab,
                                    activeTab === index && styles.tabActive,
                                    { width: TAB_WIDTH },
                                ]}
                                onPress={() => setActiveTab(index)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === index && styles.activeText,
                                    ]}
                                >
                                    {tab}
                                </Text>
                                {activeTab === index && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.screenContainer}>{renderActiveScreen()}</View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    tabWrapper: {
        width: width * 0.95,
        height: height * 0.045,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.white,
        paddingHorizontal: width * 0.02,
    },
    tabContainer: {
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: colors.Gray,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    tabText: {
        fontSize: fontSizes.sm2,
        color: colors.black,
        fontFamily: fontFamily.GilroyMedium,
    },
    activeText: {
        fontSize: fontSizes.sm2,
        color: colors.black,
        fontFamily: fontFamily.GilroyMedium,
    },
    screenContainer: {
        height: height * 0.99,
        width: width,
    },
    tabActive: {
        borderBottomWidth: 0.7, 
        borderBottomColor: colors.black, 
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -1,
        height: 2,
        width: width * 0.5,
        backgroundColor: colors.black,
        borderRadius: 2,
    },
});

export default CustomTabsSec;