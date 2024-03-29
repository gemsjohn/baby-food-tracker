import React, { useEffect, useState, useContext, useRef, useCallback, useLayoutEffect } from 'react';
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
import { HeightRatio, WidthRatio, windowWidth, windowHeight } from '../../../Styling';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_USER_ALLERGIES } from '../../../utils/mutations';
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
} from '../../../COLOR'
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
import { MainStateContext } from '../../../App';



export const AllergyTracking = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [allergyArray, setAllergyArray] = useState([]);
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedAllergyForDeletion, setSelectedAllergyForDeletion] = useState(null)
    const [updateUserAllergies] = useMutation(UPDATE_USER_ALLERGIES);
    const getAllergyData = () => {
        setAllergyArray([])
        if (props.subuser) {
            for (let i = 0; i < props.subuser.allergy.length; i++) {
                const allergy = props.subuser.allergy[i];
                if (!allergyArray.includes(allergy)) {
                    setAllergyArray((prevArray) => [...prevArray, allergy]);
                }

            }
        }

    }
    useEffect(() => {
        setAllergyArray([])
        getAllergyData()
    }, [])

    useEffect(() => {
        getAllergyData()
    }, [props.subuser])

    const handleUpdateUserAllergies = async (input) => {
        await updateUserAllergies({
            variables: {
                subuserid: props.subuser._id,
                item: `${input}`
            }
        });
    }



    return (
        <>
            <View
                style={{
                    flexDirection: 'column',
                    display: 'flex',
                    // alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <SafeAreaView
                    style={{
                        ...styles.container,
                        // backgroundColor: 'red',
                        height: HeightRatio(250)
                    }}
                >
                    <ScrollView style={styles.scrollView}>
                        {allergyArray.length > 0 ?
                            <>
                                {allergyArray.map((data, index) => (
                                    <View style={{ flexDirection: 'row', margin: HeightRatio(10), alignSelf: 'center' }} key={index}>
                                        <View
                                            style={{
                                                backgroundColor: '#1f1f27',
                                                padding: HeightRatio(10),
                                                borderRadius: HeightRatio(10),
                                                borderTopRightRadius: 0,
                                                borderBottomRightRadius: 0,
                                                width: WidthRatio(150)

                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: THEME_FONT_COLOR_WHITE,
                                                    fontSize: HeightRatio(24),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular",
                                                    textAlign: 'center',
                                                }}
                                                allowFontScaling={false}
                                            >
                                                {data}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => { setModalVisible(true); setSelectedAllergyForDeletion(data); setMainState({ userTouch: true }) }}
                                            style={{
                                                backgroundColor: THEME_COLOR_NEGATIVE,
                                                padding: HeightRatio(10),
                                                borderRadius: HeightRatio(10),
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0,
                                                width: WidthRatio(50),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'

                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faSolid, faX}
                                                style={{ color: THEME_FONT_COLOR_WHITE }}
                                                size={20}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </>
                            :
                            <View
                                style={{
                                    flexDirection: 'column',
                                    display: 'flex',
                                    // alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(24),
                                        fontFamily: "SofiaSansSemiCondensed-Regular",
                                        textAlign: 'center',
                                    }}
                                    allowFontScaling={false}
                                >
                                    Currently, you do not have any recorded allergies.
                                </Text>
                            </View>
                        }
                    </ScrollView>
                </SafeAreaView>

                <View
                    style={{
                        width: windowWidth - HeightRatio(15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            color: THEME_FONT_COLOR_BLACK,
                            fontSize: HeightRatio(24),
                            fontFamily: "SofiaSansSemiCondensed-Regular",
                            textAlign: 'left',
                            margin: HeightRatio(10),
                            marginLeft: 0
                        }}
                        allowFontScaling={false}
                    >
                        What foods most often cause a food allergy?
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: windowWidth - HeightRatio(15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // backgroundColor: 'red'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'column',
                                width: windowWidth / 3,
                            }}
                        >
                            <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                <View style={{ backgroundColor: '#1f1f27', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        fontSize: HeightRatio(20),
                                        color: THEME_FONT_COLOR_BLACK
                                    }}
                                    allowFontScaling={false}
                                >
                                    Milk
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                <View style={{ backgroundColor: '#1f1f27', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        fontSize: HeightRatio(20),
                                        color: THEME_FONT_COLOR_BLACK
                                    }}
                                    allowFontScaling={false}
                                >
                                    Eggs
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                <View style={{ backgroundColor: '#1f1f27', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        fontSize: HeightRatio(20),
                                        color: THEME_FONT_COLOR_BLACK
                                    }}
                                    allowFontScaling={false}
                                >
                                    Wheat
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                <View style={{ backgroundColor: '#1f1f27', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        fontSize: HeightRatio(20),
                                        color: THEME_FONT_COLOR_BLACK
                                    }}
                                    allowFontScaling={false}
                                >
                                    Soy
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', width: windowWidth / 3 }}>
                            <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                <View style={{ backgroundColor: '#1f1f27', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        fontSize: HeightRatio(20),
                                        color: THEME_FONT_COLOR_BLACK
                                    }}
                                    allowFontScaling={false}
                                >
                                    Tree nuts
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                <View style={{ backgroundColor: '#1f1f27', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        fontSize: HeightRatio(20),
                                        color: THEME_FONT_COLOR_BLACK
                                    }}
                                    allowFontScaling={false}
                                >
                                    Peanuts
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                <View style={{ backgroundColor: '#1f1f27', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        fontSize: HeightRatio(20),
                                        color: THEME_FONT_COLOR_BLACK
                                    }}
                                    allowFontScaling={false}
                                >
                                    Fish
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                <View style={{ backgroundColor: '#1f1f27', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        fontSize: HeightRatio(20),
                                        color: THEME_FONT_COLOR_BLACK
                                    }}
                                    allowFontScaling={false}
                                >
                                    Shellfish
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    }}
                >
                    <View
                        style={{
                            // flex: 1,
                            backgroundColor: '#1f1f27',
                            margin: 20,
                            zIndex: 999,
                            borderRadius: 10,
                            display: 'flex',
                            // alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute', bottom: HeightRatio(30), left: 0, right: 0
                        }}
                    >
                        <View
                            style={{
                                margin: HeightRatio(20),
                                // alignSelf: 'center'
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    display: 'flex',
                                    alignItems: 'center',
                                    // justifyContent: 'center'
                                }}
                            >
                                <Image
                                    source={require('../../../assets/favicon_0.png')}
                                    style={{
                                        height: HeightRatio(40),
                                        width: HeightRatio(40),
                                        // alignSelf: 'center'
                                    }}
                                />
                                <Text style={{ color: 'white', fontFamily: 'SofiaSansSemiCondensed-ExtraBold', fontSize: HeightRatio(14) }}>
                                    Baby Food Tracker
                                </Text>
                            </View>
                            <View style={{ height: HeightRatio(10) }}></View>
                            <View
                                style={{
                                    padding: HeightRatio(10)
                                }}
                            >
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        textAlign: 'left',
                                        fontSize: HeightRatio(20),
                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                        marginTop: HeightRatio(10)
                                    }}
                                    allowFontScaling={false}
                                >
                                    Are you sure that you want to delete this allergy?
                                </Text>
                            </View>

                            <View style={styles.modalContainer_1_B}>
                                <TouchableOpacity onPress={() => { setModalVisible(false); setSelectedAllergyForDeletion(null); setMainState({ userTouch: true }) }}>
                                    <View style={{ ...styles.modalButton, backgroundColor: THEME_COLOR_POSITIVE }}>
                                        <Text
                                            style={{ ...styles.modalButton_Text, color: THEME_FONT_COLOR_BLACK }}
                                            allowFontScaling={false}
                                        >
                                            Close
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleUpdateUserAllergies(selectedAllergyForDeletion);
                                        getAllergyData();
                                        setModalVisible(false);
                                        setMainState({ userTouch: true })
                                    }}
                                >
                                    <View style={{ ...styles.modalButton, backgroundColor: THEME_COLOR_NEGATIVE }}>
                                        <Text
                                            style={styles.modalButton_Text}
                                            allowFontScaling={false}
                                        >
                                            Delete
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>


                        </View>
                    </View>
                </View>

            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        // marginTop: HeightRatio(10),
        height: HeightRatio(450),
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
        // backgroundColor: THEME_COLOR_POSITIVE
    },
    scrollView: {
        // backgroundColor: THEME_COLOR_BACKDROP_DARK,
        width: windowWidth - HeightRatio(20),
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10)
    },
    chartContainer: {
        marginVertical: 8,
    },
    chartLabel: {
        textAlign: 'center',
        marginBottom: 8,
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(20),
        fontFamily: "SofiaSansSemiCondensed-Regular",
    },
    modalContainer_0: {
        flex: 1,
        backgroundColor: THEME_COLOR_BLACKOUT
    },
    modalContainer_1: {
        backgroundColor: 'rgba(31, 31, 39, 1.00)',
        margin: 20,
        zIndex: 999,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: HeightRatio(30),
        left: 0,
        right: 0
    },
    modalContainer_1_A: {
        margin: HeightRatio(20),
        alignSelf: 'center'
    },
    modalContainer_1_A_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(30),
        width: (windowWidth - WidthRatio(100)),
    },
    modalContainer_1_B: {
        flexDirection: 'row',
        alignSelf: 'center'
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