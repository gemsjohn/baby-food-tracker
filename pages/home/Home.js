import { useEffect, useState, useContext, useRef, useCallback } from 'react';
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
    ActivityIndicator
} from 'react-native';
import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faX,
    faArrowRight,
    faArrowLeft,
    faPlus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Styling, windowHeight, windowWidth, HeightRatio, WidthRatio } from '../../Styling';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import moment from 'moment'
import axios from 'axios'
import { Navbar } from '../../components/Navbar';
import { MainStateContext } from '../../App';
import { convertDateFormat } from './auxilliary/ConvertDateFormat';


export const HomeScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);

    // # - DATE
    const formatString = 'DD/MM/YYYY';
    const [currentDate, setCurrentDate] = useState(moment().format(formatString));
    const [currentDataReadable, setCurrentDateReadable] = useState('')

    // # - ADD FOOD
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [foodData, setFoodData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [displayDetails, setDisplayDetails] = useState(false);
    const [displayLoading, setDisplayLoading] = useState(false);

    // # - NUTRITION
    const [nutritionFacts, setNutritionFacts] = useState([])
    const [nutritionTable, setNutritionTable] = useState(null)

    const handlePreviousDay = () => {
        setCurrentDate(moment(currentDate, formatString).subtract(1, 'days').format(formatString));
    }

    const handleNextDay = () => {
        setCurrentDate(moment(currentDate, formatString).add(1, 'days').format(formatString));
    }

    useEffect(() => {
        setNutritionFacts([])
    }, [])

    useEffect(() => {
        setCurrentDateReadable(convertDateFormat(currentDate));
    }, [currentDate])

    const handleSearch = async() => {
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

    const getNutritionValue = async(input) => {
        setNutritionFacts([])
        const data = {
            search: input
        };
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
                    setNutritionFacts({food: input.description, nutrition: response.data.result})
                    Table(response.data.result)
                    console.log(response.data.result)
                    // setDisplayLoading(false)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const Table = (data) => {

        setNutritionTable(
          <View style={styles.table}>
            {Object.keys(data).map((key) => (
              <View style={styles.row} key={key}>
                <Text style={styles.cell}>{key.replace('_', ' ')}</Text>
                <Text style={styles.cell}>{data[key].amount} {data[key].unit}</Text>
              </View>
            ))}
          </View>
        )
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
                                <View>
                                    <Text>
                                        Quantity
                                    </Text>
                                </View>
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
                style={{ ...Styling.container, backgroundColor: 'white', display: 'flex', alignItems: 'center', width: windowWidth }}
                onLayout={onLayoutRootView}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        width: windowWidth,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: HeightRatio(140)
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
                                color: 'black',
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
                                color: 'black',
                                fontSize: HeightRatio(30),
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                marginLeft: HeightRatio(10),
                                marginRight: HeightRatio(10)

                            }}
                            allowFontScaling={false}
                        >
                            {currentDataReadable}
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
                                        color: 'black',
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
                                color: 'black',
                            }}
                            size={25}
                        />
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        alignSelf: 'center'
                    }}
                >
                    {nutritionFacts !== [] &&
                    <>
                    <Text
                        style={{
                            color: 'black',
                            fontSize: HeightRatio(20)
                        }}
                    >
                        {nutritionFacts.food}
                    </Text>
                    
                    {nutritionTable}
                    </>
                }

                </View>


                {/* Add Button */}
                <TouchableOpacity
                    onPress={() => {
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
            </View>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "#47426a",
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
                        <TouchableOpacity onPress={() => {getNutritionValue(selectedItem); setModalVisible(false);}}>
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
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
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
                    </View>

                </View>

            </Modal>

            <Navbar nav={navigation} auth={mainState.current.authState} position={'absolute'} from={'home'} />
        </>
    )
}

const styles = StyleSheet.create({
    table: {
      borderWidth: 1,
      borderColor: '#ccc',
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
      textAlign: 'center',
    },
  });