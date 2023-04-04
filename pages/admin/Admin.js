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

const resetActionProfile = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Profile', params: {} }]
});

const resetActionAuth = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Auth', params: {} }]
});

async function deleteKey(key) {
    await SecureStore.deleteItemAsync(key);
}

const foodJson = [
    {
        "_id": "64259a810664f6fb0dc66c2a",
        "item": "RASPBERRIES",
        "foodGroup": "\"fruit\"",
        "nutrients": {
            "calories": {
                "amount": 52,
                "unit": ""
            },
            "protein": {
                "amount": 1.2,
                "unit": "g"
            },
            "fat": {
                "amount": 0.7,
                "unit": "g"
            },
            "carbohydrates": {
                "amount": 11.9,
                "unit": "g"
            },
            "fiber": {
                "amount": 6.5,
                "unit": "g"
            },
            "sugar": {
                "amount": 4.4,
                "unit": "g"
            },
            "iron": {
                "amount": 0.7,
                "unit": "mg"
            },
            "zinc": {
                "amount": 0.4,
                "unit": "mg"
            },
            "omega3": {
                "amount": 0,
                "unit": ""
            },
            "vitaminD": {
                "amount": 0,
                "unit": ""
            }
        }
    },
]







export const AdminScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);

    const FoodData = (props) => {
        console.log(props.foodData[0].nutrients)
        const [nutrients, setNutrients] = useState(props.foodData[0].nutrients);

        const handleAmountChange = (key, amount) => {
            const updatedNutrients = { ...nutrients, [key]: { ...nutrients[key], amount } };
            setNutrients(updatedNutrients);
        };

        const handleUnitChange = (key, unit) => {
            const updatedNutrients = { ...nutrients, [key]: { ...nutrients[key], unit } };
            setNutrients(updatedNutrients);
        };

        const handleSave = () => {
            // Call API to save changes to nutrients
        };

        useEffect(() => {
            handleAmountChange()
            handleUnitChange()
        }, [])

        useEffect(() => {
            console.log(nutrients)
        }, [nutrients])

        return (
            <View>
                <View
                    style={{
                        backgroundColor: 'black',
                        padding: HeightRatio(10),
                        borderRadius: HeightRatio(5)
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: HeightRatio(22),
                            fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                        }}
                    >
                        {props.foodData[0].item}
                    </Text>
                </View>
                {Object.entries(nutrients).map(([key, value]) => (
                    <View
                        style={{
                            width: windowWidth - HeightRatio(50),
                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                            padding: HeightRatio(10),
                            margin: HeightRatio(4),
                            borderRadius: HeightRatio(5)
                        }}
                        key={key}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: HeightRatio(22),
                                fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                            }}
                        >
                            {key.toUpperCase()}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', margin: HeightRatio(5) }}>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        fontSize: HeightRatio(22),
                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                    }}
                                >
                                    Amount
                                </Text>
                                <TextInput
                                    value={String(value.amount)}
                                    onChangeText={(amount) => handleAmountChange(key, Number(amount))}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'white',
                                        width: windowWidth / 6,
                                        borderRadius: HeightRatio(5),
                                        padding: HeightRatio(4),
                                        fontSize: HeightRatio(20),
                                        color: 'white',
                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                    }}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', margin: HeightRatio(5) }}>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        fontSize: HeightRatio(22),
                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                    }}
                                >
                                    Unit
                                </Text>
                                <TextInput
                                    value={value.unit}

                                    onChangeText={(unit) => handleUnitChange(key, unit)}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'white',
                                        width: windowWidth / 6,
                                        borderRadius: HeightRatio(5),
                                        padding: HeightRatio(4),
                                        fontSize: HeightRatio(20),
                                        color: 'white',
                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                    }}
                                />
                            </View>

                        </View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: THEME_COLOR_POSITIVE,
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(5),
                                margin: HeightRatio(10)
                            }}
                            onPress={handleSave}
                        >
                            <Text
                                style={{
                                    color: THEME_FONT_COLOR_BLACK,
                                    fontSize: HeightRatio(22),
                                    textAlign: 'center',
                                    fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                }}
                            >
                                Save
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={{ height: HeightRatio(50) }} />
            </View>
        );
    };
    return (
        <>
            <LinearGradient
                colors={['#8bccde', '#d05bb6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ ...styles.keyContainer, flex: 1 }}
            >
                <View
                    style={styles.keyContainer}
                // onLayout={onLayoutRootView}
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
                        style={{
                            color: 'white',
                            fontSize: HeightRatio(15),

                        }}
                        allowFontScaling={false}
                    >
                        Admin
                    </Text>

                </View>
                <SafeAreaView
                    style={{
                        // backgroundColor: 'red',
                        height: windowHeight / 1.5
                    }}
                >
                    <ScrollView>
                        <FoodData foodData={foodJson} />
                    </ScrollView>
                </SafeAreaView>

                <LinearGradient
                    colors={['#2990ef', '#b81aeb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        ...styles.button_Drop_Shadow,
                        display: 'flex',
                        justifyContent: 'flex-start',
                        padding: HeightRatio(5),
                        borderRadius: HeightRatio(100),
                        alignSelf: 'center',
                        width: windowWidth - WidthRatio(50),
                        margin: HeightRatio(10)
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setMainState({ userTouch: true })
                            navigation.dispatch(resetActionProfile)
                        }}
                        style={{
                            ...Styling.modalWordButton,
                            marginTop: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                color: THEME_FONT_COLOR_WHITE,
                                fontSize: HeightRatio(24),
                                // fontWeight: 'bold',
                                alignSelf: 'center',
                                fontFamily: 'SofiaSansSemiCondensed-ExtraBold'
                            }}
                            allowFontScaling={false}
                        >
                            PROFILE
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>

            </LinearGradient>
        </>
    )
}

const styles = StyleSheet.create({
    keyContainer: {
        // flex: 1,
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
        // backgroundColor: THEME_COLOR_BLACK_LOW_OPACITY,
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