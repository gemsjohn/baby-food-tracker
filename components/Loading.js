import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    ImageBackground,
    Image,
    RefreshControl,
    Animated
} from 'react-native';
import { Styling, HeightRatio, WidthRatio, windowHeight, windowWidth } from '../Styling';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
    THEME_COLOR_POSITIVE,
    THEME_COLOR_POSITIVE_LOW_OPACITY,
    THEME_COLOR_NEGATIVE,
    THEME_COLOR_BACKDROP_DARK,
    THEME_COLOR_BACKDROP_LIGHT,
    THEME_COLOR_BLACK_LOW_OPACITY,
    THEME_COLOR_BLACK_HIGH_OPACITY,
    THEME_FONT_COLOR_WHITE,
    THEME_FONT_COLOR_WHITE_LOW_OPACITY,
    THEME_FONT_COLOR_BLACK,
    THEME_COLOR_ATTENTION,
    THEME_TRANSPARENT,
    THEME_COLOR_PURPLE,
    THEME_COLOR_PURPLE_LOW_OPACITY,
    THEME_COLOR_BLACKOUT
} from '../COLOR';

export const Loading = () => {
    const [fontsLoaded] = useFonts({
        'GochiHand_400Regular': require('../assets/fonts/GochiHand-Regular.ttf'),
        'SofiaSansSemiCondensed-Regular': require('../assets/fonts/SofiaSansSemiCondensed-Regular.ttf'),
        'SofiaSansSemiCondensed-ExtraBold': require('../assets/fonts/SofiaSansSemiCondensed-ExtraBold.ttf')
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{ alignSelf: 'center', flexDirection: 'column' }}>
            <Image
                source={require('../assets/favicon_0.png')}
                style={{
                    height: HeightRatio(80),
                    width: HeightRatio(80),
                    alignSelf: 'center'
                }}
            />
            <Text
                style={{
                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                    color: THEME_FONT_COLOR_WHITE,
                    fontSize: HeightRatio(50),
                    top: HeightRatio(20),
                    textAlign: 'center',
                    width: WidthRatio(200)
                }}
                allowFontScaling={false}
            >Baby Food Tracker</Text>
            <Text
                style={{
                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                    color: THEME_COLOR_ATTENTION,
                    fontSize: HeightRatio(30),
                    top: HeightRatio(20),
                    alignSelf: 'center'
                }}
                allowFontScaling={false}
            >Loading...</Text>
        </View>
    )
}