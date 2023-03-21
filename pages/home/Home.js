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
} from 'react-native';
import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faX,
    faArrowRight,
    faArrowLeft,
    faPlus,
    faBars
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Styling, windowHeight, windowWidth, HeightRatio, WidthRatio } from '../../Styling';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import moment from 'moment'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import { Navbar } from '../../components/Navbar';
import { MainStateContext } from '../../App';
import { GLOBAL_GRAPHQL_API_URL } from '../../App'
import { convertDateFormat } from './auxilliary/ConvertDateFormat';
import { SelectedFoodDetails } from './auxilliary/SelectedFoodDetails';
import { DisplayDailyEntry } from './auxilliary/DisplayDailyEntry';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_ENTRY } from '../../utils/mutations';
import { GET_USER_BY_ID } from '../../utils/queries';
import { DailySchedule } from './auxilliary/DailySchedule';
import { Loading } from '../../components/Loading';




export const HomeScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [loading, setLoading] = useState(false);
    const [displayUsername, setDisplayUsername] = useState(false);
    const [displaySignUpModal, setDisplaySignUpModal] = useState(false);
    const authState = useRef(false);
    const userID = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshing_Nutrition, setRefreshing_Nutrition] = useState(false);
    const [recentFoodData, setRecentFoodData] = useState([])
    const [clearSuggestions, setClearSuggestions] = useState(false)
    const [selectRecentlyUsed, setSelectRecentlyUsed] = useState(null)
    const [totalCalorieCount, setTotalCalorieCount] = useState(null)
    const [selectRecentlyUsedData, setSelectRecentlyUsedData] = useState(null)
    const [selectedFoodDataEntrered, setSelectedFoodDataEntrered] = useState(false);

    const onRefresh = useCallback(() => {
        setLoading(true)
        refetch();
        setRefreshing(true);
        setRefreshing_Nutrition(true)
        setTimeout(() => {
            setRefreshing(false);
            setRefreshing_Nutrition(false)
        }, 2000);
    }, []);

    const [addEntry] = useMutation(ADD_ENTRY);
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    // # - DATE
    const formatString = 'DD/MM/YYYY';
    const [currentDate, setCurrentDate] = useState(moment().format(formatString));
    const [currentDateReadable, setCurrentDateReadable] = useState('')


    // # - ADD FOOD
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [foodData, setFoodData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [displayDetails, setDisplayDetails] = useState(false);
    const [displayLoading, setDisplayLoading] = useState(false);
    const refreshHandlerInterval = useRef(null);

    // # - NUTRITION
    const [nutritionFacts, setNutritionFacts] = useState([])
    const [nutritionTable, setNutritionTable] = useState(null)
    const [displayNutritionValueLoading, setDisplayNutritionValueLoading] = useState(false);

    const handlePreviousDay = () => {
        setCurrentDate(moment(currentDate, formatString).subtract(1, 'days').format(formatString));
    }

    const handleNextDay = () => {
        setCurrentDate(moment(currentDate, formatString).add(1, 'days').format(formatString));
    }

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if (result && authState.current) {
            setDisplayUsername(true)
        } else if (!result && !authState.current) {
            // setDisplaySignUpModal(true)
            // setDisplayUsername(false)
        }
    }

    useEffect(() => {
        setNutritionFacts([])
        setLoading(true)

        setTimeout(() => {

            authState.current = mainState.current.authState
            userID.current = mainState.current.userID;


            getValueFor('cosmicKey')
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }, 500)

        setInterval(() => {
            getTotalCalorieCount()

            if (mainState.current.triggerRefresh) {
                setRefreshing(true)
                refetch()
            } else {
                setRefreshing(false)
            }

            if (mainState.current.selectedFood_Quantity != null && mainState.current.selectedFood_Measurement != null && mainState.current.selectedFood_Schedule != null) {
                setSelectedFoodDataEntrered(true)
            } else {
                setSelectedFoodDataEntrered(false)

            }
        }, 200)
    }, [])


    useEffect(() => {
        setCurrentDateReadable(convertDateFormat(currentDate));
    }, [currentDate])

    const handleSearch = async () => {
        setClearSuggestions(true)
        console.log(`Searching for: ${searchQuery}`);
        setDisplayLoading(true)
        const data = {
            search: searchQuery
        };

        const prompt = encodeURIComponent(JSON.stringify(data));

        const config = {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            url: `${GLOBAL_GRAPHQL_API_URL}/query-usda/${prompt}`
        }

        axios(config)
            .then((response) => {
                if (response.data.result[0] === "ERROR") {
                    // setErrorResponse(
                    //     <View>
                    //         <Text style={{ color: 'red', alignSelf: 'center' }}>
                    //             Error: This service is temporarily down.
                    //         </Text>
                    //     </View>
                    // )
                    console.log("ERROR")
                } else {
                    setFoodData(response.data.result);
                    setDisplayLoading(false)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getNutritionValue = async (input) => {
        setDisplayNutritionValueLoading(true)
        setNutritionFacts([])
        setRefreshing_Nutrition(true)
        console.log('# - INPUT: ')
        console.log(input)
        console.log(typeof input)

        const data = {
            search: input,
            quantity: mainState.current.selectedFood_Quantity,
            measurement: mainState.current.selectedFood_Measurement
        };

        if (recentFoodData != [] && selectRecentlyUsed != null && recentFoodData[selectRecentlyUsed].number == data.quantity && recentFoodData[selectRecentlyUsed].measurement == data.measurement) {
            console.log("# - getNutritionValue / recentFoodData[selectRecentlyUsed]")
            const nutrients_JSON = JSON.stringify(recentFoodData[selectRecentlyUsed].nutrients);
            console.log(input)
            console.log(data.search)
            const updateUserEntry = async () => {

                await addEntry({
                    variables: {
                        date: `${currentDateReadable}`,
                        schedule: `${mainState.current.selectedFood_Schedule}`,
                        item: `${recentFoodData[selectRecentlyUsed].item}`,
                        amount: `${mainState.current.selectedFood_Quantity} ${mainState.current.selectedFood_Measurement}`,
                        nutrients: `${nutrients_JSON}`
                    }
                });
                onRefresh();
            }
            updateUserEntry();
        } else {
            console.log("# - getNutritionValue / newFoodData")

            const prompt = encodeURIComponent(JSON.stringify(data));

            const config = {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                url: `${GLOBAL_GRAPHQL_API_URL}/api/npc/${prompt}`
            }

            axios(config)
                .then((response) => {
                    if (response.data.result[0] === "ERROR") {
                        // setErrorResponse(
                        //     <View>
                        //         <Text style={{ color: 'red', alignSelf: 'center' }}>
                        //             Error: This service is temporarily down.
                        //         </Text>
                        //     </View>
                        // )
                        console.log("ERROR")
                    } else {
                        console.log("# - getNutritionvalue:")
                        console.log(mainState.current.selectedFood_Quantity)
                        console.log(mainState.current.selectedFood_Measurement)
                        console.log(mainState.current.selectedFood_Schedule)
                        console.log("# --------------------------------------")
                        setNutritionFacts({ food: input.description, nutrition: response.data.result, schedule: mainState.current.selectedFood_Schedule })
                        Table(response.data.result)

                        const nutrients_JSON = JSON.stringify(response.data.result);
                        console.log(nutrients_JSON)
                        const updateUserEntry = async () => {

                            let itemData = input.description;

                            if (input.description == undefined && recentFoodData[selectRecentlyUsed].item != '') {
                                itemData = recentFoodData[selectRecentlyUsed].item;
                            }   

                            await addEntry({
                                variables: {
                                    date: `${currentDateReadable}`,
                                    schedule: `${mainState.current.selectedFood_Schedule}`,
                                    item: `${itemData}`,
                                    amount: `${mainState.current.selectedFood_Quantity} ${mainState.current.selectedFood_Measurement}`,
                                    nutrients: `${nutrients_JSON}`
                                }
                            });
                            onRefresh();
                        }
                        updateUserEntry();


                        // console.log(response.data.result)
                        // setDisplayLoading(false)
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

        }



    };

    const RecentFood = () => {
        setRecentFoodData([])
        setSelectRecentlyUsed(null)
        const data = userByID?.user.tracker;
        const data_array = data.slice(-5);

        for (let i = 0; i < data_array.length; i++) {
            function removeBackslashes(str) {
                let pattern = /(?<!\\)\\(?!\\)/g;
                let replacement = '';
                let updatedStr = str.replace(pattern, replacement);

                return updatedStr;
            }

            const removeQuotes = (str) => {
                return str.replace(/^"(.*)"$/, '$1');
            }

            // data_array[0].entry[0].item
            let item = JSON.stringify(data_array[i].entry[0].item);
            item = removeQuotes(item);
            let amount = JSON.stringify(data_array[i].entry[0].amount);
            amount = removeQuotes(amount)
            let nutrients = JSON.stringify(data_array[i].entry[0].nutrients);
            nutrients = removeBackslashes(nutrients)
            nutrients = removeQuotes(nutrients)
            nutrients = JSON.parse(nutrients)
            let id = data_array[i]._id;

            function separateMeasurement(inputString) {
                const regex = /(\d+\.\d+|\d+)\s*(\w+)/;
                const matches = inputString.match(regex);

                if (matches && matches.length === 3) {
                    const number = parseFloat(matches[1]);
                    const measurement = matches[2];

                    return { number, measurement };
                }

                return null;
            }

            const result = separateMeasurement(amount);


            let item_amount = { item: item, amount: amount, number: result.number, measurement: result.measurement, nutrients: nutrients, id: id }
            setRecentFoodData(prev => [...prev, item_amount])

        }


    }

    const Table = (data) => {

        setNutritionTable(
            <View style={styles.table}>
                {Object.keys(data).map((key) => (
                    <View
                        style={{
                            ...styles.row,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            margin: HeightRatio(2),
                            padding: HeightRatio(2),
                            borderRadius: HeightRatio(4)
                        }}
                        key={key}
                    >
                        <Text
                            style={{
                                ...styles.cell,
                                fontSize: HeightRatio(20),
                                fontFamily: "SofiaSansSemiCondensed-Regular"
                            }}
                            allowFontScaling={false}
                        >
                            {key.replace('_', ' ')}
                        </Text>
                        <Text
                            style={{
                                ...styles.cell,
                                fontSize: HeightRatio(20),
                                fontFamily: "SofiaSansSemiCondensed-Regular",
                            }}
                            allowFontScaling={false}
                        >
                            {data[key].amount} {data[key].unit}
                        </Text>
                    </View>
                ))}
            </View>
        )
        setDisplayNutritionValueLoading(false)

    };


    const renderItem = ({ item }) => {
        return (
            <>

                {item.description != '' &&
                    <View
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: HeightRatio(10),
                            margin: HeightRatio(4),
                            width: windowWidth - HeightRatio(80),
                            alignSelf: 'center',
                            display: 'flex',
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: 'row',
                            padding: HeightRatio(10)
                        }}
                        key={item.fdcId}
                    >



                        {displayDetails ?
                            <>
                                {/* <TouchableOpacity
                                    onPress={() => {
                                        setSelectedItem(null);
                                        setDisplayDetails(false)
                                    }}
                                    style={{
                                        height: HeightRatio(46),
                                        width: HeightRatio(40),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'absolute',
                                        zIndex: 1000,
                                        top: HeightRatio(-10),
                                        right: HeightRatio(-10),
                                        borderTopRightRadius: HeightRatio(10),
                                        borderBottomRightRadius: HeightRatio(10)

                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faSolid, faX}
                                        style={{
                                            color: 'red',
                                        }}
                                        size={20}
                                    />
                                </TouchableOpacity> */}
                                <SelectedFoodDetails />
                            </>
                            :
                            <>
                                <View
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between", // changed to 'space-between'
                                        flexDirection: 'row',
                                        padding: HeightRatio(8),
                                        width: windowWidth - HeightRatio(140),
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: HeightRatio(25),
                                            fontFamily: "SofiaSansSemiCondensed-Regular",
                                            // textAlign: 'center',
                                            // width: '80%',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                        }}
                                        allowFontScaling={false}
                                    >
                                        {item.description}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedItem(item);
                                        setDisplayDetails(true)
                                    }}
                                    style={{
                                        backgroundColor: 'rgba(247, 255, 108, 1.00)',
                                        borderRadius: HeightRatio(10),
                                        height: HeightRatio(40),
                                        width: HeightRatio(40),
                                        display: 'flex',
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: HeightRatio(30),
                                            fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                        }}
                                    >
                                        +
                                    </Text>
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                }
            </>
        );
    };

    const getTotalCalorieCount = async () => {
        try {
            const value = await AsyncStorage.getItem('@TotalCalorieCount')
            if (value !== null) {
                // value previously stored
                setTotalCalorieCount(value)
                setTimeout(() => {
                    setLoading(false)
                }, 100)
            }
        } catch (e) {
            // error reading value
        }
    }

    const [fontsLoaded] = useFonts({
        'GochiHand_400Regular': require('../../assets/fonts/GochiHand-Regular.ttf'),
        'SofiaSansSemiCondensed-Regular': require('../../assets/fonts/SofiaSansSemiCondensed-Regular.ttf'),
        'SofiaSansSemiCondensed-ExtraBold': require('../../assets/fonts/SofiaSansSemiCondensed-ExtraBold.ttf')
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
            {!loading ?
                <>
                    {refreshing || refreshing_Nutrition &&
                        <View
                            style={{
                                // backgroundColor: refreshing ? 'rgba(0, 0, 0, 0.75)' : null,
                                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                position: 'absolute',
                                zIndex: 100,
                                height: windowHeight,
                                width: windowWidth,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    color: '#ffff00',
                                    textAlign: 'center',
                                    fontSize: HeightRatio(30),
                                    fontFamily: 'GochiHand_400Regular',
                                    marginTop: HeightRatio(10)
                                }}
                                allowFontScaling={false}
                            >
                                Updating...
                            </Text>
                        </View>
                    }
                    {modalVisible && <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', height: '100%', width: '100%', position: 'absolute', zIndex: 10 }} />}
                    <View
                        style={{ ...Styling.container, backgroundColor: '#1f1f27', display: 'flex', alignItems: 'center', width: windowWidth }}
                        onLayout={onLayoutRootView}
                    >


                        <View
                            style={{
                                // backgroundColor: 'rgba(71, 66, 106, 0.25)',
                                width: windowWidth,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: HeightRatio(80)
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    handlePreviousDay();
                                    setLoading(true);
                                }}
                                style={{
                                    height: '100%',
                                    width: HeightRatio(90),
                                    // borderRadius: HeightRatio(20),
                                    // margin: HeightRatio(40),
                                    // marginRight: HeightRatio(10),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: windowWidth * 0.2,
                                    backgroundColor: 'rgba(71, 66, 106, 0.25)',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faArrowLeft}
                                    style={{
                                        color: 'white',
                                    }}
                                    size={25}
                                />
                            </TouchableOpacity>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    width: windowWidth / 1.5,
                                    backgroundColor: 'rgba(71, 66, 106, 0.25)',
                                    // backgroundColor: ' rgba(218, 140, 242, 1.00)',
                                    // padding: HeightRatio(10),
                                    // borderRadius: HeightRatio(10)
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: HeightRatio(30),
                                        fontFamily: 'GochiHand_400Regular',
                                        marginLeft: HeightRatio(10),
                                        marginRight: HeightRatio(10)

                                    }}
                                    allowFontScaling={false}
                                >
                                    {currentDateReadable}
                                </Text>
                                {currentDate != moment().format(formatString) &&
                                    <TouchableOpacity
                                        onPress={() => {
                                            setCurrentDate(moment().format(formatString));
                                            setLoading(true)
                                        }}
                                        style={{
                                            backgroundColor: 'rgba(235, 35, 81, 1.00)',
                                            // width: HeightRatio(100),
                                            borderRadius: HeightRatio(10),
                                            position: 'absolute',
                                            alignSelf: 'center',
                                            top: HeightRatio(65),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: HeightRatio(4),
                                            paddingLeft: HeightRatio(10),
                                            paddingRight: HeightRatio(10)

                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(20),
                                                fontFamily: 'SofiaSansSemiCondensed-Regular',


                                            }}
                                            allowFontScaling={false}
                                        >
                                            Return to Today
                                        </Text>
                                    </TouchableOpacity>
                                }
                            </View>


                            <TouchableOpacity
                                onPress={() => {
                                    handleNextDay();
                                    setLoading(true);
                                }}
                                style={{
                                    height: '100%',
                                    width: HeightRatio(90),
                                    // borderRadius: HeightRatio(20),
                                    // margin: HeightRatio(40),
                                    // marginLeft: HeightRatio(10),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: windowWidth * 0.2,
                                    backgroundColor: 'rgba(71, 66, 106, 0.25)',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faArrowRight}
                                    style={{
                                        color: 'white',
                                    }}
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>

                        {!refreshing && !refreshing_Nutrition ?
                            <>
                                <Image
                                    source={require('../../assets/pattern_1.png')}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        opacity: 0.02,
                                        position: 'absolute',
                                        zIndex: -10
                                    }}
                                />
                                <DailySchedule date={currentDateReadable} userID={mainState.current.userID} />

                                <View style={{ flexDirection: 'row', marginTop: HeightRatio(10) }}>
                                    <View
                                        style={{
                                            alignSelf: 'center',
                                            backgroundColor: ' rgba(247, 255, 108, 1.00)',
                                            margin: HeightRatio(5),
                                            // marginTop: HeightRatio(20),
                                            borderRadius: 10,
                                            padding: HeightRatio(10),

                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'black',
                                                fontSize: HeightRatio(60),
                                                textAlign: 'center',
                                                fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                            }}
                                        >
                                            {totalCalorieCount}
                                            {/* 1000 */}

                                        </Text>
                                        <Text
                                            style={{
                                                color: 'black',
                                                fontSize: HeightRatio(20),
                                                textAlign: 'center',
                                                fontFamily: 'SofiaSansSemiCondensed-ExtraBold',

                                            }}
                                        >
                                            CALORIES

                                        </Text>
                                    </View>

                                    {/* Add Button */}
                                    <TouchableOpacity
                                        onPress={() => {
                                            setClearSuggestions(false)
                                            RecentFood()
                                            setModalVisible(true);
                                            setSearchQuery('');
                                            setSelectedItem(null);
                                            setDisplayDetails(false);
                                            setFoodData([]);
                                            setMainState({
                                                selectedFood_Quantity: null,
                                                selectedFood_Measurement: null,
                                                selectedFood_Schedule: null
                                            })

                                        }}
                                        style={{
                                            backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: HeightRatio(20),
                                            borderRadius: HeightRatio(10),
                                            alignSelf: 'center',
                                            // height: HeightRatio(100),
                                            // width: HeightRatio(150),
                                            margin: HeightRatio(4)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'black',
                                                fontSize: HeightRatio(30),
                                                textAlign: 'center',
                                                fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                            }}
                                            allowFontScaling={false}
                                        >
                                            ADD
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                            :
                            <View
                                style={{
                                    // backgroundColor: refreshing ? 'rgba(0, 0, 0, 0.75)' : null,
                                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                    position: 'absolute',
                                    zIndex: 100,
                                    height: windowHeight,
                                    width: windowWidth,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#ffff00',
                                        textAlign: 'center',
                                        fontSize: HeightRatio(30),
                                        fontFamily: 'GochiHand_400Regular',
                                        marginTop: HeightRatio(10)
                                    }}
                                    allowFontScaling={false}
                                >
                                    Updating...
                                </Text>
                            </View>
                        }
                    </View>


                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        style={{
                            width: windowWidth,
                        }}
                    >

                        <View
                            style={{
                                // flex: 1,
                                backgroundColor: "#1f1f27",
                                zIndex: 999,
                                width: windowWidth - HeightRatio(10),
                                // height: '100%',
                                padding: HeightRatio(20),
                                borderRadius: HeightRatio(10),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                margin: HeightRatio(10)
                            }}
                        >
                            <Image
                                source={require('../../assets/pattern_1.png')}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    opacity: 0.02,
                                    position: 'absolute',
                                    zIndex: -10,
                                    margin: HeightRatio(20),
                                    borderRadius: HeightRatio(10)
                                }}
                            />
                            <TextInput
                                type="text"
                                name="search"
                                placeholder="Search for food"
                                placeholderTextColor="white"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                                style={{
                                    ...Styling.textInputStyle,
                                    marginTop: HeightRatio(20),
                                    height: HeightRatio(70),
                                    fontSize: HeightRatio(30),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular'
                                }}
                                disableFullscreenUI={true}
                                allowFontScaling={false}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    handleSearch()
                                }}

                            >
                                <View style={{
                                    backgroundColor: 'rgba(30, 228, 168, 0.50)',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(10),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth - WidthRatio(100),
                                    margin: HeightRatio(10)
                                }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: HeightRatio(25),
                                            alignSelf: 'center',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular'
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Search
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                // flex: 1,
                                backgroundColor: "#1f1f27",
                                zIndex: 999,
                                padding: HeightRatio(20),
                                borderRadius: HeightRatio(10),
                                width: windowWidth - HeightRatio(10),
                                height: windowHeight / 1.9,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                // margin: HeightRatio(10)
                            }}
                        >
                            <Image
                                source={require('../../assets/pattern_1.png')}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    opacity: 0.02,
                                    position: 'absolute',
                                    zIndex: -10,
                                    margin: HeightRatio(20),
                                    alignSelf: 'center'
                                }}
                            />

                            {!clearSuggestions && !searchQuery &&
                                <>
                                    {/* <RecentFood /> */}
                                    <View style={{
                                        // backgroundColor: 'rgba(30, 228, 168, 0.50)',
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        padding: HeightRatio(10),
                                        alignSelf: 'center',
                                        width: windowWidth - WidthRatio(100),
                                        marginTop: HeightRatio(10),
                                        // borderTopWidth: 2,
                                        // borderTopColor: 'white'
                                    }}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(30),
                                                alignSelf: 'center',
                                                fontFamily: 'GochiHand_400Regular'
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Recently Used
                                        </Text>
                                    </View>
                                    <SafeAreaView style={styles.container}>
                                        <ScrollView
                                            style={styles.scrollView}
                                        // refreshControl={
                                        //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                        // }
                                        >
                                            <View>
                                                {recentFoodData.map((data, index) => (
                                                    <View key={index}>
                                                        {selectRecentlyUsed == null ?

                                                            <View
                                                                style={{
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                                    borderRadius: HeightRatio(10),
                                                                    margin: HeightRatio(4),
                                                                    width: windowWidth - HeightRatio(80),
                                                                    alignSelf: 'center',
                                                                    display: 'flex',
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                }}

                                                            >
                                                                <View
                                                                    style={{
                                                                        width: windowWidth - HeightRatio(120),
                                                                        alignSelf: 'center'
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "space-between", // changed to 'space-between'
                                                                            flexDirection: 'row',
                                                                            padding: HeightRatio(8),
                                                                            // paddingTop: HeightRatio(10)
                                                                        }}
                                                                    >
                                                                        <View
                                                                            style={{ flexDirection: 'column' }}
                                                                        >
                                                                            <View>
                                                                                <Text
                                                                                    style={{
                                                                                        color: 'white',
                                                                                        fontSize: HeightRatio(25),
                                                                                        fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                                                                    }}
                                                                                >
                                                                                    {data.item}
                                                                                </Text>
                                                                            </View>
                                                                            <View
                                                                                style={{
                                                                                    marginLeft: HeightRatio(5),
                                                                                }}
                                                                            >
                                                                                <Text
                                                                                    style={{
                                                                                        color: 'white',
                                                                                        fontSize: HeightRatio(20),
                                                                                        fontFamily: "SofiaSansSemiCondensed-Regular"
                                                                                    }}
                                                                                >
                                                                                    {data.amount}
                                                                                </Text>
                                                                            </View>
                                                                        </View>
                                                                        <TouchableOpacity
                                                                            onPress={() => { setSelectRecentlyUsed(index); setSelectRecentlyUsedData(data); console.log(data) }}
                                                                            style={{
                                                                                backgroundColor: 'rgba(247, 255, 108, 1.00)',
                                                                                borderRadius: HeightRatio(10),
                                                                                height: HeightRatio(40),
                                                                                width: HeightRatio(40),
                                                                                display: 'flex',
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                            }}
                                                                        >
                                                                            <Text
                                                                                style={{
                                                                                    color: 'black',
                                                                                    fontSize: HeightRatio(30),
                                                                                    fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                                                                }}
                                                                            >
                                                                                +
                                                                            </Text>
                                                                        </TouchableOpacity>
                                                                    </View>

                                                                </View>
                                                            </View>
                                                            :
                                                            <>
                                                                {selectRecentlyUsed == index &&
                                                                    <>
                                                                        <View
                                                                            style={{
                                                                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                                                borderRadius: HeightRatio(10),
                                                                                margin: HeightRatio(4),
                                                                                width: windowWidth - HeightRatio(80),
                                                                                alignSelf: 'center',
                                                                                display: 'flex',
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                            }}
                                                                        >
                                                                            <Text
                                                                                style={{
                                                                                    color: "white",
                                                                                    fontSize: HeightRatio(25),
                                                                                    fontFamily: "SofiaSansSemiCondensed-Regular",
                                                                                    textAlign: 'center',
                                                                                    width: '80%',
                                                                                    display: 'flex',
                                                                                    flexWrap: 'wrap',
                                                                                    margin: HeightRatio(5)
                                                                                }}
                                                                                allowFontScaling={false}
                                                                            >
                                                                                {data.item}
                                                                            </Text>
                                                                            <SelectedFoodDetails textInputValue={`${data.number}`} selectedItem={`${data.measurement}`} />
                                                                        </View>
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                setSelectRecentlyUsed(null)
                                                                                setSelectRecentlyUsedData(null)
                                                                            }}
                                                                            style={{
                                                                                height: HeightRatio(30),
                                                                                width: HeightRatio(30),
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                position: 'absolute',
                                                                                zIndex: 1000,
                                                                                top: HeightRatio(5),
                                                                                right: HeightRatio(5),
                                                                                borderRadius: HeightRatio(10),
                                                                                backgroundColor: 'red'

                                                                            }}
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faSolid, faX}
                                                                                style={{
                                                                                    color: 'white',
                                                                                }}
                                                                                size={20}
                                                                            />
                                                                        </TouchableOpacity>
                                                                    </>
                                                                }
                                                            </>
                                                        }
                                                    </View>
                                                ))}


                                            </View>

                                        </ScrollView>
                                    </SafeAreaView>
                                </>
                            }

                            {foodData != [] &&
                                <View style={{ flex: 1 }}>
                                    {displayLoading ?
                                        <ActivityIndicator />
                                        :
                                        <>
                                            {displayDetails &&
                                                <>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setSelectedItem(null);
                                                            setDisplayDetails(false)
                                                        }}
                                                        style={{
                                                            height: HeightRatio(30),
                                                            width: HeightRatio(30),
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            position: 'absolute',
                                                            zIndex: 1000,
                                                            top: HeightRatio(-10),
                                                            right: HeightRatio(-25),
                                                            borderRadius: HeightRatio(10),
                                                            backgroundColor: 'red'

                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faX}
                                                            style={{
                                                                color: 'white',
                                                            }}
                                                            size={20}
                                                        />
                                                    </TouchableOpacity>
                                                </>
                                            }

                                            <FlatList
                                                data={selectedItem ? [selectedItem] : foodData}
                                                renderItem={renderItem}
                                                keyExtractor={(item) => item.fdcId.toString()}
                                            />
                                        </>
                                    }
                                </View>
                            }

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignSelf: 'center'
                                }}
                            >
                                {selectedFoodDataEntrered ? // {selectedItem || selectRecentlyUsed != null && selectedFoodDataEntrered ?
                                    <>
                                        <TouchableOpacity onPress={() => { setModalVisible(false); }}>
                                            <View style={{
                                                backgroundColor: 'rgba(255, 0, 75, 0.50)',
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                padding: HeightRatio(10),
                                                borderRadius: HeightRatio(10),
                                                alignSelf: 'center',
                                                width: (windowWidth - WidthRatio(100)) / 2,
                                                margin: HeightRatio(10)
                                            }}>
                                                <Text
                                                    style={{
                                                        color: 'white',
                                                        fontSize: HeightRatio(25),
                                                        alignSelf: 'center',
                                                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                                                    }}
                                                    allowFontScaling={false}
                                                >
                                                    Close
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                getNutritionValue(selectedItem == null && selectRecentlyUsedData.item != null ? selectRecentlyUsedData.item : selectedItem); // selectedItem == null && recentFoodData.item != null ? recentFoodData.item : selectedItem
                                                setModalVisible(false);
                                            }}
                                        >
                                            <View style={{
                                                backgroundColor: 'rgba(30, 228, 168, 0.5)',
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                padding: HeightRatio(10),
                                                borderRadius: HeightRatio(10),
                                                alignSelf: 'center',
                                                width: (windowWidth - WidthRatio(100)) / 2,
                                                margin: HeightRatio(10)
                                            }}>
                                                <Text
                                                    style={{
                                                        color: 'white',
                                                        fontSize: HeightRatio(25),
                                                        alignSelf: 'center',
                                                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                                                    }}
                                                    allowFontScaling={false}
                                                >
                                                    Save
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                    :
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <View style={{
                                            backgroundColor: 'rgba(255, 0, 75, 0.50)',
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(10),
                                            alignSelf: 'center',
                                            width: (windowWidth - WidthRatio(100)),
                                            margin: HeightRatio(10)
                                        }}>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontSize: HeightRatio(25),
                                                    alignSelf: 'center',
                                                    fontFamily: 'SofiaSansSemiCondensed-Regular'
                                                }}
                                                allowFontScaling={false}
                                            >
                                                Close
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                }

                            </View>

                        </View>

                    </Modal>

                    


                </>
                :
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: HeightRatio(505),
                        backgroundColor: 'rgba(71, 66, 106, 1.00)'
                    }}
                >
                    {/* <ActivityIndicator size="large" color="#1ee4a8" /> */}
                    <Loading />
                </View>
            }
            {!modalVisible &&
                <Navbar nav={navigation} auth={mainState.current.authState} position={'absolute'} from={'home'} />
            }
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
    table: {
        //   borderWidth: 1,
        //   borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        width: windowWidth - HeightRatio(100)
    },
    cell: {
        flex: 1,
        textAlign: 'left',

    },
    container: {
        //   flex: 1,
        height: '80%'

    },
    scrollView: {
        //   backgroundColor: 'blue',
        width: '80%',
        alignSelf: 'center'
    },
});