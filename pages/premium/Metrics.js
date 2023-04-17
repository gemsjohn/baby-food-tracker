import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
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
    Button,
    StyleSheet,
    TextInput,
    FlatList,
    ActivityIndicator,
    StatusBar
} from 'react-native';
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
import { Styling, windowHeight, windowWidth, HeightRatio, WidthRatio } from '../../Styling';
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
    THEME_COLOR_BLACKOUT,
    THEME_FONT_GREY
} from '../../COLOR.js';
import { MainStateContext } from '../../App';
import { LinearGradient } from 'expo-linear-gradient';
import { Navbar } from '../../components/Navbar';
import { CommonActions } from '@react-navigation/native';
import { FoodGroupMetrics } from './metrics/FoodGroupMetrics';
import { AllergyTracking } from './metrics/AllergyTracking';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../utils/queries';

const resetActionHome = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Home', params: {} }]
});

export const MetricsScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });
    const [openFoodGroup, setOpenFoodGroup] = useState(true);
    const [openAllergies, setOpenAllergies] = useState(false);

    // useEffect(() => {
    //     console.log("= = = = = = = ")
    //     console.log(mainState.current.subuserIndex)
    //     console.log(userByID?.user.subuser[mainState.current.subuserIndex].subusername)
    //     console.log(mainState.current.currentDateReadable)
    //     console.log("= = = = = = = ")

    // }, [])


    return (
        <>
            <LinearGradient
                // colors={['#8bccde', '#d05bb6']}
                colors={['#ecece6', '#ecece6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.homePrimary_Container}
            >
                <View
                    style={{ flexDirection: 'column', padding: HeightRatio(10) }}
                >
                    <View
                        style={{
                            height: windowHeight * 0.1,
                            flexDirection: 'row',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setMainState({ userTouch: true });
                                setOpenAllergies(false);
                                setOpenFoodGroup(true);
                            }}
                        >

                            <View>
                                <View style={{ ...styles.modalButton, ...styles.button_Drop_Shadow, backgroundColor: openFoodGroup ? THEME_COLOR_POSITIVE : '#1f1f27' }}>
                                    <Text
                                        style={{ ...styles.modalButton_Text, color: openFoodGroup ? THEME_FONT_COLOR_BLACK : THEME_FONT_COLOR_WHITE }}
                                        allowFontScaling={false}
                                    >
                                        Food Group
                                    </Text>
                                </View>

                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setMainState({ userTouch: true });
                                setOpenFoodGroup(false);
                                setOpenAllergies(true);

                            }}
                        >

                            <View>
                                <View style={{ ...styles.modalButton, ...styles.button_Drop_Shadow, backgroundColor: openAllergies ? THEME_COLOR_POSITIVE : '#1f1f27' }}>
                                    <Text
                                        style={{ ...styles.modalButton_Text, color: openAllergies ? THEME_FONT_COLOR_BLACK : THEME_FONT_COLOR_WHITE }}
                                        allowFontScaling={false}
                                    >
                                        Allergies
                                    </Text>
                                </View>

                            </View>

                        </TouchableOpacity>

                    </View>

                    {openFoodGroup &&
                        <View
                            style={{
                                height: windowHeight * 0.75,
                                width: windowWidth - HeightRatio(10),
                            }}
                        >
                            {/* <FoodGroupMetrics /> */}
                            <FoodGroupMetrics
                                date={mainState.current.currentDateReadable}
                                subuser={userByID?.user.subuser[mainState.current.subuserIndex]}
                            />
                        </View>
                    }

                    {openAllergies &&
                        <View
                            style={{
                                height: windowHeight * 0.75,
                                width: windowWidth - HeightRatio(10),
                            }}
                        >
                            <AllergyTracking
                                subuser={userByID?.user.subuser[mainState.current.subuserIndex]}
                            />
                        </View>
                    }
                    <View
                        style={{
                            height: windowHeight * 0.15
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => { 
                                // navigation.dispatch(resetActionHome); 
                                navigation.navigate('Home')
                                setMainState({ userTouch: true }); 
                            }}
                        >

                            <View>
                                <View style={{ ...styles.modalButton, ...styles.button_Drop_Shadow, backgroundColor: THEME_COLOR_NEGATIVE }}>
                                    <Text
                                        style={{ ...styles.modalButton_Text, color: THEME_FONT_COLOR_WHITE }}
                                        allowFontScaling={false}
                                    >
                                        Close
                                    </Text>
                                </View>

                            </View>

                        </TouchableOpacity>
                    </View>
                </View>

            </LinearGradient>
            <Navbar nav={navigation} auth={mainState.current.authState} position={'absolute'} from={'metrics'} />
            <StatusBar
                barStyle="default"
                hidden={true}
                backgroundColor="transparent"
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
        </>
    )

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: THEME_FONT_COLOR_WHITE,
        borderRadius: 10,
        borderWidth: 3,
        padding: 35,
        alignItems: "center",
        shadowColor: THEME_FONT_COLOR_BLACK,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: WidthRatio(300)
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
    },
    homePrimary_Container: {
        flex: 1,
        backgroundColor: THEME_COLOR_BACKDROP_DARK,
        display: 'flex',
        alignItems: 'center',
        width: windowWidth
    },
    modalButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        width: (windowWidth - WidthRatio(100)) / 2,
        margin: HeightRatio(10)
    },
    modalButton_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(25),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
});