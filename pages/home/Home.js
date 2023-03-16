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
    Button
} from 'react-native';
import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faX,
    faArrowRight,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Styling, windowHeight, windowWidth, HeightRatio, WidthRatio } from '../../Styling';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import moment from 'moment'

export const HomeScreen = () => {
    const formatString = 'DD/MM/YYYY';
    const [currentDate, setCurrentDate] = useState(moment().format(formatString));
    const [currentDataReadable, setCurrentDateReadable] = useState('')

    const handlePreviousDay = () => {
        setCurrentDate(moment(currentDate, formatString).subtract(1, 'days').format(formatString));

    }

    const handleNextDay = () => {
        setCurrentDate(moment(currentDate, formatString).add(1, 'days').format(formatString));
    }

    const convertDateFormat = (dateString) => {
        const inputFormat = 'DD/MM/YYYY';
        const outputFormat = 'MMMM Do YYYY';
        const dateObject = moment(dateString, inputFormat);
        const convertedDate = dateObject.format(outputFormat);
        return convertedDate;
    }

    useEffect(() => {
        setCurrentDateReadable(convertDateFormat(currentDate));
    }, [currentDate])

    // API REQ
    




    // FONTS
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
        <View
            style={{ ...Styling.container, backgroundColor: 'white', display: 'flex', alignItems: 'center', width: windowWidth }}
            onLayout={onLayoutRootView}
        >
            <View
                style={{
                    backgroundColor: 'rgba(152, 97, 234, 1.00)',
                    width: windowWidth,
                    // padding: HeightRatio(30),
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
                        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
                            // marginTop: HeightRatio(30),
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
                        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
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


            <Text style={{
                color: 'white',
                fontSize: HeightRatio(50),
                fontFamily: 'SofiaSansSemiCondensed-Regular',

            }}>
                Calories
            </Text>
            <Text style={{
                color: 'white',
                fontSize: HeightRatio(50),
                fontFamily: 'SofiaSansSemiCondensed-Regular',

            }}>
                Nutrients
            </Text>

            {/* <View
                style={{
                    backgroundColor: 'transparent',
                    width: windowWidth / 1.2,
                    height: HeightRatio(70),
                    margin: HeightRatio(4),
                    borderWidth: 1,
                    borderRadius: HeightRatio(10),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{
                    color: 'white',
                    fontSize: HeightRatio(30),
                    fontFamily: 'SofiaSansSemiCondensed-Regular',

                }}>
                    Today: entry 1
                </Text>
            </View>
            <View
                style={{
                    backgroundColor: 'transparent',
                    width: windowWidth / 1.2,
                    height: HeightRatio(70),
                    margin: HeightRatio(4),
                    borderWidth: 1,
                    borderRadius: HeightRatio(10),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{
                    color: 'white',
                    fontSize: HeightRatio(30),
                    fontFamily: 'SofiaSansSemiCondensed-Regular',

                }}>
                    Today: entry 2
                </Text>
            </View>
            <View
                style={{
                    backgroundColor: 'transparent',
                    width: windowWidth / 1.2,
                    height: HeightRatio(70),
                    margin: HeightRatio(4),
                    borderWidth: 1,
                    borderRadius: HeightRatio(10),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{
                    color: 'white',
                    fontSize: HeightRatio(30),
                    fontFamily: 'SofiaSansSemiCondensed-Regular',

                }}>
                    Today: entry 2
                </Text>
            </View> */}
            {/* Add Button */}
            <TouchableOpacity
                onPress={() => console.log("ADD FODD")}
                style={{
                    backgroundColor: '#5fea96',
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
    )
}