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
    Animated,
    StyleSheet
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
import { LinearGradient } from 'expo-linear-gradient';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_PREMIUM } from '../utils/mutations';
import * as SecureStore from 'expo-secure-store';

// const APIKeys = {
//     google: "goog_caDqiYZPHvJIwlqyFoZDgTqOywO",
// };

export const Loading = () => {
    // const [updatePremium] = useMutation(UPDATE_PREMIUM);

    // const checkCustomerInfo = async () => {
    //     let localUserID = await SecureStore.getItemAsync('userID');
    //     Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    //     Purchases.configure({ apiKey: APIKeys.google, appUserID: localUserID });

    //     const customerInfo = await Purchases.getCustomerInfo();
    //     // console.log(customerInfo)

    //     if (typeof customerInfo.entitlements.active["Premium"] !== "undefined") {
    //         // console.log(customerInfo.entitlements.active["Premium"])
    //         console.log("# - Premium service access granted.")
    //         await updatePremium({
    //             variables: {
    //                 status: true,
    //                 expiration: `${customerInfo.allExpirationDates.baby_food_tracker_premium_month}`
    //             }
    //         });

    //     } else {
    //         console.log("# - Premium service access revoked.")
    //         await updatePremium({
    //             variables: {
    //                 status: false,
    //                 expiration: ''
    //             }
    //         });
    //     }
    // }

    // useEffect(() => {
    //     checkCustomerInfo()
    // }, [])

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
        <View>
            <LinearGradient
                colors={['#8bccde', '#d05bb6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.homePrimary_Container}
            >
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
                        color: THEME_FONT_COLOR_BLACK,
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
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    homePrimary_Container: {
        flex: 1,
        backgroundColor: THEME_COLOR_BACKDROP_DARK,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth,
    },
})