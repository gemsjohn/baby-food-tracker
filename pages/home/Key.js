import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Alert, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions, Button, Linking, ImageBackground, FlatList, PixelRatio, Modal, StyleSheet } from 'react-native';
import { Styling, windowWidth, windowHeight, HeightRatio, WidthRatio } from '../../Styling';
import { MainStateContext } from '../../App';
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../utils/queries';
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
} from '../../COLOR';

import { LinearGradient } from 'expo-linear-gradient';

const resetActionHome = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Home', params: {} }]
});

const resetActionAuth = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Auth', params: {} }]
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
    


    async function getValueFor(key) {
        console.log("# - GET VALUE FOR COSMIC KEY")
        let result = await SecureStore.getItemAsync(key);
        if (result) {
            setKey(result.split(''));
            setPageLoadComplete(true)
        } else {
            navigation.dispatch(resetActionAuth);
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
        console.log("# - UPDATE AUTHORIZATION")
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

    const handleKeyPress = (value) => {
        setKeyPress(keyPress + value);
        setKeyArray(current => [...current, value])
        setCount(prev => prev + 1)
    };


    const [fontsLoaded] = useFonts({
        'GochiHand_400Regular': require('../../assets/fonts/GochiHand-Regular.ttf'),
        'SofiaSansSemiCondensed-Regular': require('../../assets/fonts/SofiaSansSemiCondensed-Regular.ttf'),
        'CormorantGaramond-Regular': require('../../assets/fonts/CormorantGaramond-Regular.ttf'),
        'CormorantGaramond-Bold': require('../../assets/fonts/CormorantGaramond-Bold.ttf')
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) { return null }

    return (
        <>
            {pageLoadComplete ?
                <LinearGradient
                    colors={['#8bccde', '#d05bb6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keyContainer}
                >
                    <View
                        style={styles.keyContainer}
                        onLayout={onLayoutRootView}
                    >

                        <StatusBar
                            barStyle="default"
                            hidden={false}
                            backgroundColor="transparent"
                            translucent={true}
                            networkActivityIndicatorVisible={true}
                        />
                        <Image
                            source={require('../../assets/favicon_0.png')}
                            style={styles.image_Favicon}
                        />
                        <Text
                            style={styles.title_Text}
                            allowFontScaling={false}
                        >
                            Baby Food Tracker
                        </Text>
                        <View style={{ margin: HeightRatio(20), alignSelf: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                {count > 0 ?
                                    <View style={styles.key_Full} />
                                    :
                                    <View style={styles.key_Empty} />
                                }
                                {count > 1 ?
                                    <View style={styles.key_Full} />
                                    :
                                    <View style={styles.key_Empty} />
                                }
                                {count > 2 ?
                                    <View style={styles.key_Full} />
                                    :
                                    <View style={styles.key_Empty} />
                                }
                                {count > 3 ?
                                    <View style={styles.key_Full} />
                                    :
                                    <View style={styles.key_Empty} />
                                }
                            </View>

                        </View>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <TouchableOpacity style={{ ...styles.button, ...styles.button_Drop_Shadow }} onPress={() => handleKeyPress('1')}>
                                    <Text style={styles.button_Text} allowFontScaling={false} >
                                        1
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...styles.button, ...styles.button_Drop_Shadow }} onPress={() => handleKeyPress('2')}>
                                    <Text style={styles.button_Text} allowFontScaling={false}>
                                        2
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...styles.button, ...styles.button_Drop_Shadow }} onPress={() => handleKeyPress('3')}>
                                    <Text style={styles.button_Text} allowFontScaling={false}>
                                        3
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <TouchableOpacity style={{ ...styles.button, ...styles.button_Drop_Shadow }} onPress={() => handleKeyPress('4')}>
                                    <Text style={styles.button_Text} allowFontScaling={false}>
                                        4
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...styles.button, ...styles.button_Drop_Shadow }} onPress={() => handleKeyPress('5')}>
                                    <Text style={styles.button_Text} allowFontScaling={false}>
                                        5
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...styles.button, ...styles.button_Drop_Shadow }} onPress={() => handleKeyPress('6')}>
                                    <Text style={styles.button_Text} allowFontScaling={false}>
                                        6
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <TouchableOpacity style={{ ...styles.button, ...styles.button_Drop_Shadow }} onPress={() => handleKeyPress('7')}>
                                    <Text style={styles.button_Text} allowFontScaling={false}>
                                        7
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...styles.button, ...styles.button_Drop_Shadow }} onPress={() => handleKeyPress('8')}>
                                    <Text style={styles.button_Text} allowFontScaling={false}>
                                        8
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...styles.button, ...styles.button_Drop_Shadow }} onPress={() => handleKeyPress('9')}>
                                    <Text style={styles.button_Text} allowFontScaling={false}>
                                        9
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>

                                <TouchableOpacity style={{ ...styles.button, ...styles.button_Drop_Shadow }} onPress={() => handleKeyPress('0')}>
                                    <Text style={styles.button_Text} allowFontScaling={false}>
                                        0
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    deleteKey('cosmicKey');
                                    navigation.dispatch(resetActionAuth);
                                }}
                                style={Styling.modalWordButton}>
                                <View style={{ ...styles.forgotKey_Button, ...styles.button_Drop_Shadow }}>
                                    <Text style={styles.forgotKey_Button_Text} allowFontScaling={false}>
                                        Forgot Key?
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                :
                <View style={{ backgroundColor: 'black' }} />
            }
        </>
    )
}

const styles = StyleSheet.create({
    keyContainer: {
        flex: 1,
        // backgroundColor: THEME_COLOR_BACKDROP_DARK,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image_Favicon: {
        height: HeightRatio(80),
        width: HeightRatio(80),
        alignSelf: 'center'
    },
    title_Text: {
        color: THEME_FONT_COLOR_BLACK,
        textAlign: 'center',
        fontSize: HeightRatio(30),
        fontFamily: 'SofiaSansSemiCondensed-Regular',
        marginTop: HeightRatio(10)
    },
    key_Full: {
        backgroundColor: THEME_FONT_COLOR_WHITE,
        height: HeightRatio(50),
        width: windowWidth / 8,
        margin: HeightRatio(5),
        borderRadius: HeightRatio(10)
    },
    key_Empty: {
        backgroundColor: THEME_COLOR_BLACK_LOW_OPACITY,
        height: HeightRatio(50),
        width: windowWidth / 8,
        margin: HeightRatio(5),
        borderRadius: HeightRatio(10)
    },
    button: {
        backgroundColor: THEME_COLOR_ATTENTION,
        height: HeightRatio(70),
        width: HeightRatio(70),
        borderRadius: HeightRatio(20),
        margin: HeightRatio(10),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button_Text: {
        color: 'black',
        fontSize: HeightRatio(40),
        fontFamily: 'SofiaSansSemiCondensed-Regular',
        alignSelf: 'center'
    },
    forgotKey_Button: {
        backgroundColor: THEME_COLOR_ATTENTION,
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(20),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        width: windowWidth - WidthRatio(150)
    },
    forgotKey_Button_Text: {
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(30),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
    button_Drop_Shadow: {
        padding: 10,
        borderRadius: 5,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
            },
            android: {
                elevation: 5,
            },
        }),
    }
});