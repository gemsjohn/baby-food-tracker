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
import { HeightRatio, WidthRatio, windowWidth, windowHeight } from '../../../../Styling';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../../../utils/queries';
import { UPDATE_USER_ALLERGIES } from '../../../../utils/mutations';
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
} from '../../../../COLOR'
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
import { PieChart } from 'react-native-chart-kit';
import { MainStateContext } from '../../../../App';

const styles = StyleSheet.create({
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

export const AllergyTracking = () => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [allergyArray, setAllergyArray] = useState([]);
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedAllergyForDeletion, setSelectedAllergyForDeletion] = useState(null)
    const [updateUserAllergies] = useMutation(UPDATE_USER_ALLERGIES);


    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    const getAllergyData = () => {
        setAllergyArray([])
        console.log("# - getAllergyData()")
        refetch()
        for (let i = 0; i < userByID?.user.allergy.length; i++) {
            const allergy = userByID?.user.allergy[i];
            if (!allergyArray.includes(allergy)) {
                setAllergyArray((prevArray) => [...prevArray, allergy]);
            }

        }

    }
    useEffect(() => {
        console.log('# --------------------------------------')
        setAllergyArray([])
        getAllergyData()
    }, [])

    useEffect(() => {
        getAllergyData()
    }, [userByID?.user])

    const handleUpdateUserAllergies = async (input) => {
        await updateUserAllergies({
            variables: {
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
            <Text
                style={{
                    color: THEME_FONT_COLOR_WHITE,
                    fontSize: HeightRatio(40),
                    fontFamily: "SofiaSansSemiCondensed-Regular",
                    textAlign: 'left',
                    margin: HeightRatio(10),
                    marginLeft: 0
                }}
            >
                Allergies
            </Text>
            {allergyArray.length > 0 ?
            <>
                {allergyArray.map((data, index) => (
                    <View style={{ flexDirection: 'row', margin: HeightRatio(10) }}>
                        <View
                            style={{
                                backgroundColor: THEME_COLOR_ATTENTION,
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(10),
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                width: WidthRatio(150)

                            }}
                        >
                            <Text
                                style={{
                                    color: THEME_FONT_COLOR_BLACK,
                                    fontSize: HeightRatio(30),
                                    fontFamily: "SofiaSansSemiCondensed-Regular",
                                    textAlign: 'center',
                                }}
                            >
                                {data}
                            </Text>
                        </View>
                        <TouchableOpacity
                        onPress={() => {setModalVisible(true); setSelectedAllergyForDeletion(data);}}
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
                            color: THEME_FONT_COLOR_WHITE,
                            fontSize: HeightRatio(30),
                            fontFamily: "SofiaSansSemiCondensed-Regular",
                            textAlign: 'center',
                        }}
                    >
                        None
                    </Text>
                </View>
            }
        </View>
        <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer_0}>
                    <View style={styles.modalContainer_1}>
                        <View style={styles.modalContainer_1_A}>
                            <Text
                                style={styles.modalContainer_1_A_Text}
                                allowFontScaling={false}
                            >
                                Are you sure that you want to delete this allergy?
                            </Text>
                        </View>
                        <View style={styles.modalContainer_1_B}>
                            <TouchableOpacity onPress={() => {setModalVisible(false); setSelectedAllergyForDeletion(null)}}>
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

            </Modal>
        </>
    );
};

