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
import { StatusBar } from 'expo-status-bar';
import { Styling, windowHeight, windowWidth, HeightRatio, WidthRatio } from '../../Styling';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import moment from 'moment'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import { Navbar } from '../../components/Navbar';
import { MainStateContext } from '../../App';
import { convertDateFormat } from './auxilliary/ConvertDateFormat';
import { SelectedFoodDetails } from './auxilliary/SelectedFoodDetails';
import { DisplayDailyEntry } from './auxilliary/DisplayDailyEntry';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_ENTRY } from '../../utils/mutations';
import { GET_USER_BY_ID } from '../../utils/queries';
import { DailySchedule } from './auxilliary/DailySchedule';
import { set } from 'traverse';



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


    const onRefresh = useCallback(() => {
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
            setDisplaySignUpModal(true)
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
            if (mainState.current.triggerRefresh) {
                setRefreshing(true)
                refetch()
            } else {
                setRefreshing(false)
            }
        }, 500)
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
            url: `http://192.168.1.198:3001/query-usda/${prompt}`
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
        const data = {
            search: input,
            quantity: mainState.current.selectedFood_Quantity,
            measurement: mainState.current.selectedFood_Measurement
        };

        if (recentFoodData!= [] && selectRecentlyUsed != null && recentFoodData[selectRecentlyUsed].number == data.quantity && recentFoodData[selectRecentlyUsed].measurement == data.measurement) {
            console.log("# - getNutritionValue / recentFoodData[selectRecentlyUsed]")
            const nutrients_JSON = JSON.stringify(recentFoodData[selectRecentlyUsed].nutrients);
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
                url: `http://192.168.1.198:3001/api/npc/${prompt}`
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

                            await addEntry({
                                variables: {
                                    date: `${currentDateReadable}`,
                                    schedule: `${mainState.current.selectedFood_Schedule}`,
                                    item: `${input.description}`,
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

        // return (
        //     <>
        //         {recentFoodData.map((data, index) => (
        //             <View
        //                 style={{
        //                     backgroundColor: '#a39bc9',
        //                     borderRadius: HeightRatio(10),
        //                     margin: HeightRatio(10),
        //                     width: windowWidth - HeightRatio(80),
        //                     alignSelf: 'center'
        //                 }}
        //                 key={index}
        //             >
        //                 <View
        //                     style={{
        //                         width: windowWidth - HeightRatio(120),
        //                         alignSelf: 'center'
        //                     }}
        //                 >
        //                     <TouchableOpacity
        //                         onPress={() => {
        //                             // setDisplayBreakfastNutrients(current => displayBreakfastNutrientsForIndex == index ? !current : true);
        //                             // setDisplayBreakfastNutrientsForIndex(index)
        //                             console.log(`${data.item}`)
        //                         }}
        //                         style={{
        //                             display: "flex",
        //                             alignItems: "center",
        //                             justifyContent: "space-between", // changed to 'space-between'
        //                             flexDirection: 'row',
        //                             padding: HeightRatio(5),
        //                             paddingTop: HeightRatio(10)
        //                         }}
        //                     >
        //                         <View
        //                             style={{ flexDirection: 'column' }}
        //                         >
        //                             <View
        //                                 style={{
        //                                     borderBottomWidth: 2,
        //                                     borderBottomColor: 'black'
        //                                 }}
        //                             >
        //                                 <Text
        //                                     style={{
        //                                         color: 'black',
        //                                         fontSize: HeightRatio(25),
        //                                         fontFamily: "SofiaSansSemiCondensed-ExtraBold"
        //                                     }}
        //                                 >
        //                                     {data.item}
        //                                 </Text>
        //                             </View>
        //                             <View
        //                                 style={{
        //                                     backgroundColor: 'rgba(30, 228, 168, 1.0)',
        //                                     margin: HeightRatio(10),
        //                                     padding: HeightRatio(4),
        //                                     paddingLeft: HeightRatio(20),
        //                                     paddingRight: HeightRatio(20),
        //                                     borderRadius: HeightRatio(10)
        //                                 }}
        //                             >
        //                                 <Text
        //                                     style={{
        //                                         color: 'black',
        //                                         fontSize: HeightRatio(20),
        //                                         fontFamily: "SofiaSansSemiCondensed-Regular"
        //                                     }}
        //                                 >
        //                                     {data.amount}
        //                                 </Text>
        //                             </View>
        //                         </View>
        //                         {/* <View
        //                             style={{
        //                                 padding: HeightRatio(10),
        //                                 borderRadius: HeightRatio(30),
        //                                 height: HeightRatio(40),
        //                                 width: HeightRatio(40),
        //                                 display: 'flex',
        //                                 alignItems: "flex-end",
        //                                 justifyContent: "center",
        //                             }}
        //                         >
        //                             <FontAwesomeIcon
        //                                 icon={faSolid, faBars}
        //                                 style={{
        //                                     color: 'black',
        //                                 }}
        //                                 size={20}
        //                             />
        //                         </View> */}
        //                     </TouchableOpacity>


        //                 </View>
        //             </View>
        //         ))}


        //     </>
        // )
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
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: '90%',
                            padding: HeightRatio(15),
                            margin: HeightRatio(4),
                            borderRadius: HeightRatio(10),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            alignSelf: 'center',
                        }}
                        key={item.fdcId}
                    >
                        <Text
                            style={{
                                color: "black",
                                fontSize: HeightRatio(25),
                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                textAlign: 'center',
                                width: '80%',
                                display: 'flex',
                                flexWrap: 'wrap',
                            }}
                            allowFontScaling={false}
                        >
                            {item.description}
                        </Text>

                        {displayDetails ?
                            <>
                                <TouchableOpacity
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
                                        top: 0,
                                        right: HeightRatio(0),
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
                                </TouchableOpacity>
                                <SelectedFoodDetails />
                            </>
                            :
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedItem(item);
                                    setDisplayDetails(true)
                                }}
                                style={{
                                    height: HeightRatio(46),
                                    width: HeightRatio(40),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    right: HeightRatio(0),
                                    borderTopRightRadius: HeightRatio(10),
                                    borderBottomRightRadius: HeightRatio(10)

                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faPlus}
                                    style={{
                                        color: 'green',
                                    }}
                                    size={20}
                                />
                            </TouchableOpacity>
                        }
                    </View>
                }
            </>
        );
    };

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
            <View
                style={{ ...Styling.container, backgroundColor: 'rgba(71, 66, 106, 1.00)', display: 'flex', alignItems: 'center', width: windowWidth }}
                onLayout={onLayoutRootView}
            >

                <View
                    style={{
                        backgroundColor: 'rgba(71, 66, 106, 1.00)',
                        width: windowWidth,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: HeightRatio(100)
                    }}
                >
                    <TouchableOpacity
                        onPress={() => handlePreviousDay()}
                        style={{
                            height: '100%',
                            width: HeightRatio(90),
                            borderRadius: HeightRatio(20),
                            margin: HeightRatio(40),
                            marginRight: HeightRatio(10),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
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
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: HeightRatio(30),
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                marginLeft: HeightRatio(10),
                                marginRight: HeightRatio(10)

                            }}
                            allowFontScaling={false}
                        >
                            {currentDateReadable}
                        </Text>
                        {currentDate != moment().format(formatString) &&
                            <TouchableOpacity
                                onPress={() => setCurrentDate(moment().format(formatString))}
                                style={{
                                    backgroundColor: 'rgba(235, 35, 81, 0.50)',
                                    width: HeightRatio(100),
                                    borderRadius: HeightRatio(10),
                                    position: 'absolute',
                                    alignSelf: 'center',
                                    top: HeightRatio(40),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: HeightRatio(10)
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
                                    Reset
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>


                    <TouchableOpacity
                        onPress={() => handleNextDay()}
                        style={{
                            height: '100%',
                            width: HeightRatio(90),
                            borderRadius: HeightRatio(20),
                            margin: HeightRatio(40),
                            marginLeft: HeightRatio(10),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
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

                {/* {displayNutritionValueLoading ?
                    <>

                        <View
                            style={{
                                alignSelf: 'center',
                                backgroundColor: "#47426a",
                                margin: 20,
                                borderRadius: 10,
                                padding: HeightRatio(10),
                                width: '80%'
                            }}
                        >
                            {nutritionFacts !== [] &&
                                <>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: HeightRatio(30),
                                            borderBottomWidth: 1,
                                            borderBottomColor: 'white'
                                        }}
                                    >
                                        {selectedItem.description}
                                    </Text>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: HeightRatio(20)
                                        }}
                                    >
                                        Nutrition Details
                                    </Text>
                                    <ActivityIndicator />
                                </>
                            }

                        </View>
                    </>
                    :
                    <>
                        {nutritionFacts != [] && nutritionTable != null &&
                            <DisplayDailyEntry facts={nutritionFacts} table={nutritionTable} />
                        }
                    </>
                } */}


                {!refreshing && !refreshing_Nutrition ?
                    <>
                        <DailySchedule date={currentDateReadable} userID={mainState.current.userID} />




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

                            }}
                            style={{
                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: HeightRatio(20),
                                borderRadius: HeightRatio(10),
                                alignSelf: 'center',
                                width: windowWidth - WidthRatio(50),
                                margin: HeightRatio(4)
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: HeightRatio(30),
                                    alignSelf: 'center',
                                    fontFamily: 'SofiaSansSemiCondensed-Regular'
                                }}
                                allowFontScaling={false}
                            >
                                Add Food
                            </Text>
                        </TouchableOpacity>
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
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "#2f2c4f",
                        margin: 20,
                        zIndex: 999,
                        borderRadius: 10,
                    }}
                >
                    <TextInput
                        type="text"
                        name="search"
                        placeholder="Search"
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
                                margin: HeightRatio(10),
                                borderTopWidth: 2,
                                borderTopColor: 'white'
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
                                                            backgroundColor: '#a39bc9',
                                                            borderRadius: HeightRatio(10),
                                                            margin: HeightRatio(10),
                                                            width: windowWidth - HeightRatio(80),
                                                            alignSelf: 'center'
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
                                                                    padding: HeightRatio(5),
                                                                    paddingTop: HeightRatio(10)
                                                                }}
                                                            >
                                                                <View
                                                                    style={{ flexDirection: 'column' }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            borderBottomWidth: 2,
                                                                            borderBottomColor: 'black'
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                color: 'black',
                                                                                fontSize: HeightRatio(25),
                                                                                fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                                                            }}
                                                                        >
                                                                            {data.item}
                                                                        </Text>
                                                                    </View>
                                                                    <View
                                                                        style={{
                                                                            backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                                                            margin: HeightRatio(10),
                                                                            padding: HeightRatio(4),
                                                                            paddingLeft: HeightRatio(20),
                                                                            paddingRight: HeightRatio(20),
                                                                            borderRadius: HeightRatio(10)
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                color: 'black',
                                                                                fontSize: HeightRatio(20),
                                                                                fontFamily: "SofiaSansSemiCondensed-Regular"
                                                                            }}
                                                                        >
                                                                            {data.amount}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                                <TouchableOpacity
                                                                    onPress={() => {setSelectRecentlyUsed(index);}}
                                                                    style={{
                                                                        backgroundColor: 'rgba(26, 105, 125, 1.00)',
                                                                        margin: HeightRatio(10),
                                                                        padding: HeightRatio(10),
                                                                        borderRadius: HeightRatio(10),
                                                                        height: HeightRatio(40),
                                                                        // width: HeightRatio(40),
                                                                        display: 'flex',
                                                                        alignItems: "flex-end",
                                                                        justifyContent: "center",
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            color: 'white',
                                                                            fontSize: HeightRatio(20),
                                                                            fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                                                        }}
                                                                    >
                                                                        Use
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>

                                                        </View>
                                                    </View>
                                                    :
                                                    <>
                                                        {selectRecentlyUsed == index &&
                                                            <View
                                                                style={{
                                                                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                                                                    width: '90%',
                                                                    padding: HeightRatio(15),
                                                                    margin: HeightRatio(4),
                                                                    borderRadius: HeightRatio(10),
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    alignSelf: 'center',
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color: "black",
                                                                        fontSize: HeightRatio(25),
                                                                        fontFamily: "SofiaSansSemiCondensed-Regular",
                                                                        textAlign: 'center',
                                                                        width: '80%',
                                                                        display: 'flex',
                                                                        flexWrap: 'wrap',
                                                                    }}
                                                                    allowFontScaling={false}
                                                                >
                                                                    {data.item}
                                                                </Text>
                                                                <SelectedFoodDetails textInputValue={`${data.number}`} selectedItem={`${data.measurement}`} />
                                                            </View>
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
                                <FlatList
                                    data={selectedItem ? [selectedItem] : foodData}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.fdcId.toString()}
                                />
                            }
                        </View>
                    }

                    <View
                        style={{
                            flexDirection: 'row',
                            alignSelf: 'center'
                        }}
                    >
                        {selectedItem || selectRecentlyUsed != null ?
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
                                        getNutritionValue(selectedItem || recentFoodData.item);
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

            {/* SIGN UP MODAL */}
            <Modal
                animationType="none"
                transparent={true}
                visible={displaySignUpModal}
                onRequestClose={() => {
                    setDisplaySignUpModal(!displaySignUpModal);

                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#47426a", }}>
                    <View style={{ borderTopRightRadius: HeightRatio(10) }}>

                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                            {/* <Image
                                source={require('../../assets/blink.gif')}
                                style={{
                                    height: HeightRatio(150),
                                    width: HeightRatio(150),
                                    alignSelf: 'center',
                                    marginTop: HeightRatio(10)
                                }}
                            /> */}
                            <Text
                                style={{
                                    color: '#ffff00',
                                    textAlign: 'center',
                                    fontSize: HeightRatio(30),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                    marginTop: HeightRatio(10)
                                }}
                                allowFontScaling={false}
                            >
                                Baby Food Tracker
                            </Text>
                            <View style={{ height: 10 }}></View>


                            <TouchableOpacity
                                onPress={() => navigation.dispatch(resetActionAuth)}
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
                            <TouchableOpacity
                                onPress={() => {
                                    setDisplaySignUpModal(!displaySignUpModal);
                                    setMainState({
                                        displaySignUpModal: false
                                    })
                                }}
                                style={{
                                    borderWidth: 3,
                                    borderColor: '#ff0076',
                                    borderRadius: 100,
                                    height: HeightRatio(60),
                                    width: HeightRatio(60),
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faX}
                                    style={{
                                        color: '#ff0076',
                                    }}
                                />
                            </TouchableOpacity>


                        </View>
                    </View>
                </View>
            </Modal>

            <Navbar nav={navigation} auth={mainState.current.authState} position={'absolute'} from={'home'} />

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
        height: HeightRatio(460)

    },
    scrollView: {
        //   backgroundColor: 'blue',
        width: windowWidth - HeightRatio(20),
        alignSelf: 'center'
    },
});