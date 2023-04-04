import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Alert, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, KeyboardAvoidingView, Dimensions, Button, Linking, ImageBackground, FlatList, PixelRatio, Modal, StyleSheet } from 'react-native';
import { Styling, windowWidth, windowHeight, HeightRatio, WidthRatio } from '../../Styling';
import { MainStateContext } from '../../App';
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_FOOD } from '../../utils/mutations';
import { GET_USER_BY_ID, GET_FOOD } from '../../utils/queries';
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
import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faX,
    faArrowRight,
    faArrowLeft,
    faPlus,
    faBars,
    faCheck,
    faChartSimple,
    faStar,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
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
    const [foodItem, setFoodItem] = useState('');
    

    const [editFoods] = useMutation(EDIT_FOOD);
    const { data: foodByItem, refetch } = useQuery(GET_FOOD, {
        variables: { item: foodItem }
    });

    // useEffect(() => {
    //     console.log(foodByItem)
    // }, [foodByItem])

    const FoodData = (props) => {
        const { __typename, ...nutrientsData } = props.foodData.nutrients;
        const [nutrients, setNutrients] = useState(nutrientsData);
        const [foodItemFoodGroup, setFoodItemFoodGroup] = useState('');

        const handleAmountChange = (key, amount) => {
            const updatedNutrients = { ...nutrients, [key]: { ...nutrients[key], amount } };
            setNutrients(updatedNutrients);
        };

        const handleUnitChange = (key, unit) => {
            const updatedNutrients = { ...nutrients, [key]: { ...nutrients[key], unit } };
            setNutrients(updatedNutrients);
        };

        const handleSave = async (category, amount, unit, foodGroup) => {
            // Call API to save changes to nutrients
            let foodid = props.foodData._id;
            let nutritioncategory = category;
            let amount_local = amount;
            let unit_local = unit;
            let foodGroup_local = foodGroup;

            // console.log("# - - - - - - - - - ")
            // console.log("# - - - - - - - - - ")
            // console.log(foodid)
            // console.log("# - - - - - - - - - ")
            // console.log(nutritioncategory)
            // console.log("# - - - - - - - - - ")
            // console.log(amount_local)
            // console.log("# - - - - - - - - - ")
            // console.log(unit_local)
            // console.log("# - - - - - - - - - ")
            // console.log(foodGroup)

            await editFoods({
                variables: {
                    foodid: `${foodid}`,
                    nutritioncategory: `${nutritioncategory}`,
                    amount: `${amount_local}`,
                    unit: `${unit_local}`,
                    foodGroup: `${foodGroup_local}`
                }
            })
            refetch({ item: foodItem })
        };

        useEffect(() => {
            handleAmountChange()
            handleUnitChange()
        }, [])

        // useEffect(() => {
        //     console.log(nutrients)
        // }, [nutrients])

        return (
            <View>
                <TextInput
                    type="text"
                    name="foodItem"
                    placeholder="Food Category"
                    placeholderTextColor="white"
                    value={foodItemFoodGroup}
                    onChangeText={setFoodItemFoodGroup}
                    style={Styling.textInputStyle}
                    disableFullscreenUI={false}
                    allowFontScaling={false}
                />
                <TouchableOpacity
                    style={{
                        backgroundColor: THEME_COLOR_POSITIVE,
                        borderRadius: HeightRatio(10),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: HeightRatio(10),
                        margin: HeightRatio(10)
                    }}
                    onPress={() => handleSave(null, null, null, foodItemFoodGroup)}
                >
                    <Text
                        style={{
                            color: THEME_FONT_COLOR_BLACK,
                            fontSize: HeightRatio(22),
                            // textAlign: 'center',
                            fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                        }}
                    >
                        Save
                    </Text>
                </TouchableOpacity>
                {Object.entries(nutrients).map(([key, value]) => (
                    <View
                        style={{
                            flexDirection: 'row',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: HeightRatio(130),
                            margin: HeightRatio(5)
                        }}
                        key={key}
                    >
                        <View
                            style={{
                                width: (windowWidth - HeightRatio(50)) * 0.8,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                padding: HeightRatio(10),
                                height: HeightRatio(130),
                                borderTopLeftRadius: HeightRatio(10),
                                borderBottomLeftRadius: HeightRatio(10)
                            }}

                        >

                            <Text
                                style={{
                                    color: THEME_COLOR_ATTENTION,
                                    fontSize: HeightRatio(22),
                                    fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                    margin: HeightRatio(5)
                                }}
                            >
                                {key.toUpperCase()}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                }}
                            >
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
                                        onChangeText={(amount) => handleAmountChange(key, amount)}
                                        style={{
                                            ...Styling.textInputStyle,
                                            width: windowWidth / 6,
                                            fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                        }}
                                        keyboardType='decimal-pad' // Allow decimal numbers with a decimal point
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
                                            ...Styling.textInputStyle,
                                            width: windowWidth / 6,
                                            fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                        }}
                                    />
                                </View>



                            </View>



                        </View>
                        <View
                            style={{
                                width: (windowWidth - HeightRatio(50)) * 0.2,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    backgroundColor: THEME_COLOR_POSITIVE,
                                    height: HeightRatio(130),
                                    borderTopRightRadius: HeightRatio(10),
                                    borderBottomRightRadius: HeightRatio(10),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => handleSave(key.toLowerCase(), value.amount, value.unit, props.foodData.foodGroup)}
                            >
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(22),
                                        // textAlign: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                    }}
                                >
                                    Save
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <View style={{ height: HeightRatio(50) }} />
            </View>
        );
    };
    return (
        <>
            <View style={{ ...styles.keyContainer, backgroundColor: '#1f1f27' }} behavior="padding">
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
                        margin: HeightRatio(10),
                        padding: HeightRatio(20),
                        marginTop: HeightRatio(100)
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setMainState({ userTouch: true });
                            navigation.dispatch(resetActionProfile);
                        }}
                        style={{
                            marginTop: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faSolid, faArrowLeft}
                            style={{ color: THEME_FONT_COLOR_WHITE }}
                            size={25}
                        />
                    </TouchableOpacity>
                </LinearGradient>

                <SafeAreaView style={{ height: '80%', marginBottom: 20, marginTop: 20 }}>
                    <ScrollView style={{}} keyboardShouldPersistTaps={'always'} keyboardDismissMode="on-drag">
                        <TextInput
                            type="text"
                            name="foodItem"
                            placeholder="Food Item"
                            placeholderTextColor="white"
                            value={foodItem}
                            onChangeText={setFoodItem}
                            style={Styling.textInputStyle}
                            disableFullscreenUI={true}
                            allowFontScaling={false}
                        />

                        {foodByItem?.food &&
                            <FoodData foodData={foodByItem?.food} />
                        }
                    </ScrollView>
                </SafeAreaView>


            </View>


            <StatusBar
                barStyle="default"
                hidden={false}
                backgroundColor="transparent"
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
        </>
    );

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
        height: HeightRatio(30),
        width: HeightRatio(30),
        alignSelf: 'center'
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