import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions, Button, Linking, ImageBackground, FlatList, PixelRatio, Modal } from 'react-native';
import { Styling, windowWidth, windowHeight, HeightRatio, WidthRatio } from '../../Styling';
import { MainStateContext } from '../../App';
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Tokens } from '../purchase/Tokens';
import { GoogleProducts } from './GoogProducts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faGamepad,
    faX
} from '@fortawesome/free-solid-svg-icons'

const resetActionHome = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Home', params: {} }]
});
const resetActionAuth = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Auth', params: {} }]
});
const resetActionChat = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Chat', params: {} }]
});
const resetActionProfile = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Profile', params: {} }]
});

async function deleteKey(key) {
    await SecureStore.deleteItemAsync(key);
}

export const PurchaseFilter = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const authState = useRef(false);
    const userID = useRef(null);
    const [displaytokens, setDisplayTokens] = useState(false);


    useEffect(() => {
        // setLoading(true)
            authState.current = mainState.current.authState
            userID.current = mainState.current.userID;

            // setTimeout(() => {
            //     setLoading(false)
            // }, 500)
    }, [])

    const [fontsLoaded] = useFonts({
        'GochiHand_400Regular': require('../../assets/fonts/GochiHand-Regular.ttf'),
        'SofiaSansSemiCondensed-Regular': require('../../assets/fonts/SofiaSansSemiCondensed-Regular.ttf')

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
        <>
            <View
                style={{ ...Styling.container, backgroundColor: '#161b21', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onLayout={onLayoutRootView}
            >
                <View
                    style={{
                        padding: HeightRatio(10),
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                            color: 'white',
                            fontSize: HeightRatio(50),
                            alignSelf: 'center',
                            marginTop: HeightRatio(30),
                            marginBottom: HeightRatio(10),
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: windowWidth / 1.25,
                            textAlign: 'center'
                        }}
                        allowFontScaling={false}
                    >
                        Want access to more chapters?
                    </Text>
                    {!authState.current ?
                        <>
                            <TouchableOpacity
                                onPress={() => props.nav.dispatch(resetActionAuth)}
                                style={{ ...Styling.modalWordButton, marginTop: 10 }}
                            >
                                <View style={{
                                    backgroundColor: 'rgba(30, 228, 168, 0.5)',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(20),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth - WidthRatio(50)
                                }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: HeightRatio(30),
                                            alignSelf: 'center',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular'
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Sign Up or Login
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                    color: '#ffff00',
                                    fontSize: HeightRatio(30),
                                    alignSelf: 'center',
                                    marginTop: HeightRatio(4),
                                    marginBottom: HeightRatio(10),
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    width: windowWidth / 1.25,
                                    textAlign: 'center'
                                }}
                                allowFontScaling={false}
                            >
                                Then purchase tokens. 1 token per chapter.
                            </Text>
                        </>
                    :
                        <>
                            <TouchableOpacity
                                onPress={() => setDisplayTokens(current => !current)}
                                style={{ ...Styling.modalWordButton, marginTop: 10 }}
                            >
                                <View style={{
                                    backgroundColor: 'rgba(0, 118, 255, 0.50)',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(20),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth - WidthRatio(50)
                                }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: HeightRatio(30),
                                            alignSelf: 'center',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular'
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Purchase Tokens
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                    color: '#ffff00',
                                    fontSize: HeightRatio(30),
                                    alignSelf: 'center',
                                    marginTop: HeightRatio(4),
                                    marginBottom: HeightRatio(10),
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    width: windowWidth / 1.25,
                                    textAlign: 'center'
                                }}
                                allowFontScaling={false}
                            >
                                1 token per chapter.
                            </Text>

                            {displaytokens &&
                                <GoogleProducts userID={userID.current} />
                            }
                        </>
                    }
                </View>
                
            </View>

            <StatusBar
                barStyle="default"
                hidden={false}
                backgroundColor="transparent"
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
        </>
    )
}