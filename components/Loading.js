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

export const Loading = () => {
    const [fontsLoaded] = useFonts({
        'GochiHand_400Regular': require('../assets/fonts/GochiHand-Regular.ttf'),
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
        <View style={{alignSelf: 'center', flexDirection: 'column'}}>
        {/* <Image 
            source={require('../assets/npc_loading.gif')}
            style={{height: HeightRatio(200), width: HeightRatio(200)}}
        /> */}
        <Text
            style={{
                fontFamily: 'GochiHand_400Regular',
                color: 'white',
                fontSize: HeightRatio(50),
                // fontWeight: 'bold',
                top: HeightRatio(20),
                textAlign: 'center',
                width: WidthRatio(200)
            }}
            allowFontScaling={false}
        >Baby Food Tracker</Text>
        <Text
            style={{
                fontFamily: 'GochiHand_400Regular',
                color: '#ffff00',
                fontSize: HeightRatio(30),
                // fontWeight: 'bold',
                top: HeightRatio(20),
                alignSelf: 'center'
            }}
            allowFontScaling={false}
        >Loading...</Text>
    </View>
    )
}