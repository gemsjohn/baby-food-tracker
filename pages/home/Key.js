import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions, Button, Linking, ImageBackground, FlatList, PixelRatio, Modal } from 'react-native';
import { Styling, windowWidth, windowHeight, HeightRatio, WidthRatio } from '../../Styling';
import { MainStateContext } from '../../App';
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const resetActionHome = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Home', params: {} }]
});

async function deleteKey(key) {
    await SecureStore.deleteItemAsync(key);
}

export const KeyScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);

    const [key, setKey] = useState(null);
    const [keyPress, setKeyPress] = useState('');
    const [keyArray, setKeyArray] = useState([]);
    const [count, setCount] = useState(0);
    const [pageLoadComplete, setPageLoadComplete] = useState(false);

    const handleKeyPress = (value) => {
        setKeyPress(keyPress + value);
        setKeyArray(current => [...current, value])
        setCount(prev => prev + 1)
    };

    async function getValueFor(key) {
        console.log("getValueFor")
        let result = await SecureStore.getItemAsync(key);
        if (result) {
            setKey(result.split(''));
            setPageLoadComplete(true)
            console.log("PAGE LOAD COMPLETE?")

        } else {
            navigation.dispatch(resetActionHome);
        }
    }

    useEffect(() => {
        getValueFor('cosmicKey')

    }, [])

    function areArraysEqual(arr1, arr2) {
        // Check if the arrays have the same length
        return JSON.stringify(arr1) === JSON.stringify(arr2);
    }

    const updateAuth = async () => {
        let localBearerToken = await SecureStore.getItemAsync('bearerToken');
        let localUserID = await SecureStore.getItemAsync('userID');
        let localAuthState = await SecureStore.getItemAsync('authState');
        let updatedLocalAuthState;
        if (localAuthState == 'true') {
            updatedLocalAuthState = true;
        } else if (localAuthState == 'false' || !localAuthState) {
            updatedLocalAuthState = false;
        }

        setMainState({
            bearerToken: `${localBearerToken}`,
            userID: `${localUserID}`,
            authState: updatedLocalAuthState,
            initialKeyMoment: moment()
        })
    }


    useEffect(() => {
        if (count > 3 && areArraysEqual(key, keyArray)) {
            updateAuth();
            setTimeout(() => {
                navigation.dispatch(resetActionHome);

            }, 500)


        } else if (count > 3 && !areArraysEqual(key, keyArray)) {
            setKeyPress('')
            setKeyArray([])
            setCount(0)
        }
    }, [count])


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
            {pageLoadComplete ?
                <View
                    style={{ ...Styling.container, backgroundColor: '#161b21', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onLayout={onLayoutRootView}
                >
                    <StatusBar
                        barStyle="default"
                        hidden={false}
                        backgroundColor="transparent"
                        translucent={true}
                        networkActivityIndicatorVisible={true}
                    />
                    {/* <Image
                        source={require('../../assets/blink.gif')}
                        style={{
                            height: HeightRatio(150),
                            width: HeightRatio(150),
                            alignSelf: 'center',
                            marginTop: HeightRatio(30)
                        }}
                    /> */}
                    <Text
                        style={{
                            color: '#ffff00',
                            textAlign: 'center',
                            fontSize: HeightRatio(20),
                            fontFamily: 'GochiHand_400Regular',
                            marginTop: HeightRatio(10)
                        }}
                        allowFontScaling={false}
                    >
                        - NPC AI -
                    </Text>
                    <View style={{ margin: HeightRatio(20), alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            {count > 0 ?
                                <View style={{
                                    backgroundColor: '#09e049',
                                    height: HeightRatio(25),
                                    width: HeightRatio(25),
                                    margin: HeightRatio(5),
                                    borderTopLeftRadius: HeightRatio(25)
                                }} />

                                :
                                <View style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                    height: HeightRatio(25),
                                    width: HeightRatio(25),
                                    margin: HeightRatio(5),
                                    borderTopLeftRadius: HeightRatio(25)
                                }} />
                            }
                            {count > 1 ?
                                <View style={{
                                    backgroundColor: '#ff0076',
                                    height: HeightRatio(25),
                                    width: HeightRatio(25),
                                    margin: HeightRatio(5),
                                    borderTopRightRadius: HeightRatio(25)
                                }} />

                                :
                                <View style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                    height: HeightRatio(25),
                                    width: HeightRatio(25),
                                    margin: HeightRatio(5),
                                    borderTopRightRadius: HeightRatio(25)
                                }} />
                            }
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            {count > 3 ?
                                <View style={{
                                    backgroundColor: '#ff0076',
                                    height: HeightRatio(25),
                                    width: HeightRatio(25),
                                    margin: HeightRatio(5),
                                    borderBottomLeftRadius: HeightRatio(25)
                                }} />

                                :
                                <View style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                    height: HeightRatio(25),
                                    width: HeightRatio(25),
                                    margin: HeightRatio(5),
                                    borderBottomLeftRadius: HeightRatio(25)
                                }} />
                            }
                            {count > 2 ?
                                <View style={{
                                    backgroundColor: '#09e049',
                                    height: HeightRatio(25),
                                    width: HeightRatio(25),
                                    margin: HeightRatio(5),
                                    borderBottomRightRadius: HeightRatio(25)
                                }} />

                                :
                                <View style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                    height: HeightRatio(25),
                                    width: HeightRatio(25),
                                    margin: HeightRatio(5),
                                    borderBottomRightRadius: HeightRatio(25)
                                }} />
                            }
                        </View>


                    </View>
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <TouchableOpacity style={{ backgroundColor: 'rgba(9, 224, 73, 0.70)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('1')}>
                                <Text
                                    style={{ color: 'white', fontSize: HeightRatio(40), fontFamily: 'SofiaSansSemiCondensed-Regular', alignSelf: 'center' }}
                                    allowFontScaling={false}
                                >1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgba(9, 224, 73, 0.70)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('2')}>
                                <Text
                                    style={{ color: 'white', fontSize: HeightRatio(40), fontFamily: 'SofiaSansSemiCondensed-Regular', alignSelf: 'center', }}
                                    allowFontScaling={false}
                                >2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgba(9, 224, 73, 0.70)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('3')}>
                                <Text
                                    style={{ color: 'white', fontSize: HeightRatio(40), fontFamily: 'SofiaSansSemiCondensed-Regular', alignSelf: 'center', }}
                                    allowFontScaling={false}
                                >3</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <TouchableOpacity style={{ backgroundColor: 'rgba(9, 224, 73, 0.70)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('4')}>
                                <Text
                                    style={{ color: 'white', fontSize: HeightRatio(40), fontFamily: 'SofiaSansSemiCondensed-Regular', alignSelf: 'center', }}
                                    allowFontScaling={false}
                                >4</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgba(9, 224, 73, 0.70)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('5')}>
                                <Text
                                    style={{ color: 'white', fontSize: HeightRatio(40), fontFamily: 'SofiaSansSemiCondensed-Regular', alignSelf: 'center', }}
                                    allowFontScaling={false}
                                >5</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgba(9, 224, 73, 0.70)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('6')}>
                                <Text
                                    style={{ color: 'white', fontSize: HeightRatio(40), fontFamily: 'SofiaSansSemiCondensed-Regular', alignSelf: 'center', }}
                                    allowFontScaling={false}
                                >6</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <TouchableOpacity style={{ backgroundColor: 'rgba(9, 224, 73, 0.70)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('7')}>
                                <Text
                                    style={{ color: 'white', fontSize: HeightRatio(40), fontFamily: 'SofiaSansSemiCondensed-Regular', alignSelf: 'center', }}
                                    allowFontScaling={false}
                                >7</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgba(9, 224, 73, 0.70)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('8')}>
                                <Text
                                    style={{ color: 'white', fontSize: HeightRatio(40), fontFamily: 'SofiaSansSemiCondensed-Regular', alignSelf: 'center', }}
                                    allowFontScaling={false}
                                >8</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgba(9, 224, 73, 0.70)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('9')}>
                                <Text
                                    style={{ color: 'white', fontSize: HeightRatio(40), fontFamily: 'SofiaSansSemiCondensed-Regular', alignSelf: 'center', }}
                                    allowFontScaling={false}
                                >9</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>

                            <TouchableOpacity style={{ backgroundColor: 'rgba(9, 224, 73, 0.70)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('0')}>
                                <Text
                                    style={{ color: 'white', fontSize: HeightRatio(40), fontFamily: 'SofiaSansSemiCondensed-Regular', alignSelf: 'center', }}
                                    allowFontScaling={false}
                                >0</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                deleteKey('cosmicKey');
                                navigation.dispatch(resetActionHome);
                            }}
                            style={Styling.modalWordButton}>
                            <View style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.10)',
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
                                    Forgot Key?
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                :
                <View style={{ backgroundColor: 'black' }} />
            }
        </>
    )
}