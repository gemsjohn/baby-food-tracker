import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, Button, Share, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Modal, Image, ActivityIndicator } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { SEND_PDFCONTENT } from '../../utils/mutations';
import { GET_USER_BY_ID } from '../../utils/queries';
import { windowHeight, windowWidth, HeightRatio, WidthRatio } from '../../Styling';
import { Navbar } from '../../components/Navbar';
import { StatusBar } from 'expo-status-bar';
import { Calendar } from 'react-native-calendars';
import moment from 'moment'
import { convertDateFormat } from '../home/auxilliary/ConvertDateFormat';
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
    THEME_FONT_GREY,
    THEME_LIGHT_GREEN
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
    faGlasses,
    faFileExport,
    faCheck,
    faStar
} from '@fortawesome/free-solid-svg-icons'
import { CommonActions } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { MainStateContext } from '../../App';
import { usePullDailyContent } from '../home/auxilliary/PullDailyContent';
import { DailyScheduleSimplified } from '../home/auxilliary/DailyScheduleSimplified';

const resetActionHome = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Home', params: {} }]
});

export const ExportScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    const emailOnFile = useRef(userByID?.user.email)
    const [emailInput, setEmailInput] = useState('')
    const [validEmail, setValidEmail] = useState(false);
    const [currentEmail, setCurrentEmail] = useState(false)
    const [alternateEmail, setAlternateEmail] = useState(false)
    const [selectedCalendarModalDate, setSelectedCalendarModalDate] = useState('');
    const [selectedDateFromCalendar, setSelectedDateFromCalendar] = useState(null)
    const [selectedDateFromCalendarEmailFormat, setSelectedDateFromCalendarEmailFormat] = useState(null)
    const { calendarModalCalorieTotal, calendarModalDate, calendarModalFoods, calendarModalEmotion } = usePullDailyContent(`${convertDateFormat(selectedDateFromCalendar)}`);
    const [displayExportModal, setDisplayExportModal] = useState(true)
    const [displayEmailSentModal, setDisplayEmailSentModal] = useState(false)
    const [displayEmailFailedModal, setDisplayEmailFailedModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const formatString = 'DD/MM/YYYY';
    const formatString_AlternateFormat = 'DDMMMYYYY';

    const [sendPDFContent] = useMutation(SEND_PDFCONTENT)

    const setupHTMLContent = () => {
        setLoading(true)
        let tableContent = '';
        if (userByID?.user && userByID?.user.subuser[mainState.current.subuserIndex]) {
            for (let i = 0; i < userByID?.user.subuser[mainState.current.subuserIndex].tracker.length; i++) {
                if (userByID?.user.subuser[mainState.current.subuserIndex].tracker[i].date == convertDateFormat(selectedDateFromCalendar)) {
                    const emotion = `${userByID?.user.subuser[mainState.current.subuserIndex].tracker[i].entry[0].emotion}`;
                    const item = `${userByID?.user.subuser[mainState.current.subuserIndex].tracker[i].entry[0].item}`;
                    const amount = userByID?.user.subuser[mainState.current.subuserIndex].tracker[i].entry[0].amount;
                    const schedule = userByID?.user.subuser[mainState.current.subuserIndex].tracker[i].entry[0].schedule;
                    const allergy = userByID?.user.subuser[mainState.current.subuserIndex].tracker[i].entry[0].allergy;

                    tableContent += `
                <tr>
                  <td style="text-align: left; border: 1px solid white; padding: 10">${emotion}</td>
                  <td style="text-align: left; border: 1px solid white; padding: 10">${item}</td>
                  <td style="text-align: left; border: 1px solid white; padding: 10">${amount}</td>
                  <td style="text-align: left; border: 1px solid white; padding: 10">${schedule}</td>
                  <td style="text-align: left; border: 1px solid white; padding: 10">${allergy}</td>
                </tr>
              `;
                }
            }
        }
        const htmlContent = `
        
            <h1>Baby Food Tracker Export</h1>
            <p>Selected Date: ${convertDateFormat(selectedDateFromCalendar)}</p>
            <p>Child: ${userByID?.user.subuser[mainState.current.subuserIndex].subusername}</p>

            <table style="border-collapse: collapse;">
                <thead>
                <tr>
                    <th style="text-align: left; border: 1px solid white; padding: 10">Emotion</th>
                    <th style="text-align: left; border: 1px solid white; padding: 10">Item</th>
                    <th style="text-align: left; border: 1px solid white; padding: 10">Amount</th>
                    <th style="text-align: left; border: 1px solid white; padding: 10">Schedule</th>
                    <th style="text-align: left; border: 1px solid white; padding: 10">Allergy</th>
                </tr>
                </thead>
                <tbody>
                ${tableContent}
                </tbody>
            </table>

            <p>Note: You may have to show the quoted text above to see the exported table.</p>
            <p>Keep in mind that this feature is in beta. The data will improve. In the near future, some services may require a nominal fee or a Premium subscription.</p>

        `;



        handleShareContent(htmlContent);
    };


    const handleShareContent = async (input) => {
        console.log("# - handleShareContent")
        try {
            if (currentEmail) {
                await sendPDFContent({
                    variables: {
                        email: `${emailOnFile.current}`,
                        html: input

                    }
                })
            } else if (alternateEmail) {

                await sendPDFContent({
                    variables: {
                        email: `${emailInput}`,
                        html: input

                    }
                })
            }
            setLoading(false)
            setDisplayEmailSentModal(true)

        } catch (error) {
            console.error(error);
            setLoading(false)
            setDisplayEmailFailedModal(true)
        }
    };

    const isEmailValid = (email) => {
        console.log(email)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    useEffect(() => {
        let altEmail;

        altEmail = isEmailValid(emailInput)
        setValidEmail(altEmail)
    }, [emailInput])

    const onDateSelect = (day) => {
        const selectedDate = moment(day.dateString).format(formatString); // convert date to desired format

        setSelectedCalendarModalDate(day.dateString);
        setSelectedDateFromCalendar(selectedDate);
    };


    return (
        <>
            <View
                style={{
                    // ...styles.homePrimary_Container,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: HeightRatio(30)
                    }}
                >
                    <TouchableOpacity
                        onPress={() => console.log("1")}
                    >
                        <View
                            style={{
                                ...styles.homePrimary_Add_Button,
                                ...styles.button_Drop_Shadow,
                                width: windowWidth / 5,
                                height: windowWidth / 5

                            }}
                        >
                            <View
                                style={{ flexDirection: 'column' }}
                            >
                                <Text
                                    style={{
                                        ...styles.renderItem_Search_Result_Container_Text,
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(16),
                                        fontFamily: "SofiaSansSemiCondensed-Regular",
                                        textAlign: 'center',
                                        marginTop: HeightRatio(10)
                                    }}
                                    allowFontScaling={false}
                                >
                                    Export by Day
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => console.log("1")}
                        disabled={true}
                    >
                        <View
                            style={{
                                ...styles.homePrimary_Add_Button,
                                // ...styles.button_Drop_Shadow,
                                width: windowWidth / 5,
                                height: windowWidth / 5,
                                backgroundColor: 'rgba(0, 0, 0, 0.25)'

                            }}
                        >
                            <View
                                style={{ flexDirection: 'column' }}
                            >
                                {/* <FontAwesomeIcon
                                    icon={faSolid, faStar}
                                    style={{ color: THEME_FONT_COLOR_BLACK, alignSelf: 'center' }}
                                    size={25}
                                /> */}
                                <Text
                                    style={{
                                        ...styles.renderItem_Search_Result_Container_Text,
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(16),
                                        fontFamily: "SofiaSansSemiCondensed-Regular",
                                        textAlign: 'center',
                                        marginTop: HeightRatio(10)
                                    }}
                                    allowFontScaling={false}
                                >
                                    Export by Week
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => console.log("1")}
                        disabled={true}
                    >
                        <View
                            style={{
                                ...styles.homePrimary_Add_Button,
                                // ...styles.button_Drop_Shadow,
                                width: windowWidth / 5,
                                height: windowWidth / 5,
                                backgroundColor: 'rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <View
                                style={{ flexDirection: 'column' }}
                            >
                                {/* <FontAwesomeIcon
                                    icon={faSolid, faStar}
                                    style={{ color: THEME_FONT_COLOR_BLACK, alignSelf: 'center' }}
                                    size={25}
                                /> */}
                                <Text
                                    style={{
                                        ...styles.renderItem_Search_Result_Container_Text,
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(16),
                                        fontFamily: "SofiaSansSemiCondensed-Regular",
                                        textAlign: 'center',
                                        marginTop: HeightRatio(10)
                                    }}
                                    allowFontScaling={false}

                                >
                                    Export by Month
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                {!loading ?
                <SafeAreaView
                    style={{
                        ...styles.container,
                        height: HeightRatio(670),

                        // backgroundColor: 'red'
                    }}
                >
                    <ScrollView style={styles.scrollView}>
                        <View
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Calendar
                                onDayPress={(day) => onDateSelect(day)}
                                markedDates={{ [selectedCalendarModalDate]: { selected: true } }}
                                theme={{
                                    calendarBackground: 'white',
                                    textMonthFontSize: HeightRatio(20),
                                    monthTextColor: THEME_FONT_COLOR_BLACK,
                                    arrowColor: THEME_FONT_COLOR_WHITE,
                                    selectedDayBackgroundColor: THEME_FONT_COLOR_BLACK,
                                    selectedDayTextColor: THEME_FONT_COLOR_WHITE,
                                    todayTextColor: 'red',
                                    dayTextColor: THEME_FONT_COLOR_BLACK,
                                    textDisabledColor: 'grey',
                                    textDayFontFamily: 'SofiaSansSemiCondensed-Regular',
                                    textDayFontSize: HeightRatio(15),

                                }}
                                style={{
                                    width: windowWidth - HeightRatio(40),
                                    marginTop: HeightRatio(5),
                                    borderRadius: HeightRatio(5)
                                }}
                            />
                            <Text
                                style={{
                                    ...styles.modalVisible_Button_Text,
                                    margin: HeightRatio(10)
                                }}
                                allowFontScaling={false}
                            >
                                Export: {convertDateFormat(selectedDateFromCalendar)}
                            </Text>

                            <View style={{ marginTop: HeightRatio(20) }}>
                                <Text
                                    style={{
                                        ...styles.modalVisible_Button_Text,
                                        margin: HeightRatio(4),
                                        fontSize: HeightRatio(15),
                                        alignSelf: 'flex-start',
                                        marginLeft: HeightRatio(30)

                                    }}
                                    allowFontScaling={false}
                                >
                                    Sample data
                                </Text>
                                <DailyScheduleSimplified
                                    date={calendarModalDate}
                                    userID={userByID?.user._id}
                                    containerHeight={HeightRatio(250)}
                                    from={"export"}
                                    subuser={userByID?.user.subuser[mainState.current.subuserIndex]}
                                    premium={false}
                                    nav={navigation}
                                />
                            </View>
                        </View>


                        {/* ****** CURRENT EMAIL ****** */}
                        <View
                            style={{
                                width: windowWidth,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: HeightRatio(30),
                                    margin: WidthRatio(10),
                                    textAlign: 'center'
                                }}
                            >
                                Choose a recipient email!
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: HeightRatio(10),
                                    marginBottom: HeightRatio(10)
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'black',
                                        fontSize: HeightRatio(18),
                                        marginLeft: WidthRatio(50)
                                    }}
                                >
                                    Use current email
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <TextInput
                                        type="text"
                                        name="user_input"
                                        placeholder="..."
                                        placeholderTextColor='black'
                                        value={emailOnFile.current}
                                        style={styles.textInputStyle}
                                        disableFullscreenUI={true}
                                        allowFontScaling={false}
                                        editable={false}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            setCurrentEmail(current => !current)
                                            setAlternateEmail(false)
                                            setMainState({ userTouch: true });
                                        }}
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#1f1f27',
                                            height: WidthRatio(35),
                                            width: WidthRatio(35),
                                            borderRadius: HeightRatio(5),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {currentEmail ?
                                            <>
                                                <FontAwesomeIcon
                                                    icon={faSolid, faCheck}
                                                    style={{ color: THEME_FONT_COLOR_BLACK }}
                                                    size={25}
                                                />
                                            </>
                                            :
                                            null
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>


                            {/* ****** ALTERNATE EMAIL ****** */}
                            <View
                                style={{
                                    flexDirection: 'column',
                                    display: 'flex',
                                    // alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: HeightRatio(10),
                                    marginBottom: HeightRatio(10)
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'black',
                                        fontSize: HeightRatio(18),
                                        marginLeft: WidthRatio(50)
                                    }}
                                >
                                    Enter an alternate email
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <TextInput
                                        type="text"
                                        name="user_input"
                                        placeholder="..."
                                        placeholderTextColor='black'
                                        value={emailInput}
                                        onChangeText={setEmailInput}
                                        style={styles.textInputStyle}
                                        disableFullscreenUI={true}
                                        allowFontScaling={false}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            setAlternateEmail(current => !current)
                                            setCurrentEmail(false)
                                            setMainState({ userTouch: true });
                                        }}
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#1f1f27',
                                            height: WidthRatio(35),
                                            width: WidthRatio(35),
                                            borderRadius: HeightRatio(5),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {alternateEmail ?
                                            <>
                                                <FontAwesomeIcon
                                                    icon={faSolid, faCheck}
                                                    style={{ color: THEME_FONT_COLOR_BLACK }}
                                                    size={25}
                                                />
                                            </>
                                            :
                                            null
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* ****** BUTTONS ****** */}
                            {currentEmail || validEmail && alternateEmail ?
                                <TouchableOpacity
                                    onPress={() => {
                                        // handleShareContent(); 
                                        setupHTMLContent()
                                        setMainState({ userTouch: true })
                                    }}

                                >
                                    <View style={{
                                        backgroundColor: '#f7ff6c',
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        padding: HeightRatio(10),
                                        borderRadius: HeightRatio(5),
                                        alignSelf: 'center',
                                        width: windowWidth - WidthRatio(50),
                                        margin: HeightRatio(10),
                                        ...styles.button_Drop_Shadow
                                    }}>

                                        <Text
                                            style={{
                                                color: 'black',
                                                fontSize: HeightRatio(30),
                                                // fontWeight: 'bold',
                                                alignSelf: 'center',
                                                fontFamily: 'SofiaSansSemiCondensed-Regular'
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Send Email
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                null
                            }

                            <TouchableOpacity
                                onPress={() => {
                                    setMainState({ userTouch: true });
                                    navigation.dispatch(resetActionHome)
                                }}

                            >
                                <View style={{
                                    backgroundColor: THEME_COLOR_NEGATIVE,
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(10),
                                    borderRadius: HeightRatio(5),
                                    alignSelf: 'center',
                                    width: windowWidth - WidthRatio(50),
                                    margin: HeightRatio(10),
                                    ...styles.button_Drop_Shadow
                                }}>

                                    <Text
                                        style={{
                                            color: THEME_FONT_COLOR_WHITE,
                                            fontSize: HeightRatio(30),
                                            // fontWeight: 'bold',
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
                        <View style={{ height: HeightRatio(100) }} />
                    </ScrollView>
                </SafeAreaView>
                :
                <View 
                    style={{
                        // flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: HeightRatio(300),
                        width: windowWidth,
                        // backgroundColor: '#ecece6'
                    }}
                >
                    <ActivityIndicator size={100} color={THEME_COLOR_NEGATIVE} />
                </View>
                }
                
            </View>

            <Modal
                animationType="none"
                transparent={true}
                visible={displayExportModal}
                onRequestClose={() => {
                    setDisplayExportModal(!displayExportModal);

                }}
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
                                    source={require('../../assets/favicon_0.png')}
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
                                    Export Beta Feature! &#128640;
                                </Text>
                                <Text
                                    style={{
                                        color: THEME_COLOR_ATTENTION,
                                        textAlign: 'left',
                                        fontSize: HeightRatio(20),
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        margin: HeightRatio(5)
                                    }}
                                    allowFontScaling={false}
                                >
                                    FOR NOW
                                </Text>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        textAlign: 'left',
                                        fontSize: HeightRatio(20),
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        margin: HeightRatio(5)
                                    }}
                                    allowFontScaling={false}
                                >
                                   You can freely export core entry data for a selected day.
                                </Text>
                                <Text
                                    style={{
                                        color: THEME_COLOR_ATTENTION,
                                        textAlign: 'left',
                                        fontSize: HeightRatio(20),
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        margin: HeightRatio(5)
                                    }}
                                    allowFontScaling={false}
                                >
                                    FUTURE
                                </Text>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        textAlign: 'left',
                                        fontSize: HeightRatio(20),
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        margin: HeightRatio(5)
                                    }}
                                    allowFontScaling={false}
                                >
                                    The data will include nutritional details.
                                </Text>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        textAlign: 'left',
                                        fontSize: HeightRatio(20),
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        margin: HeightRatio(5)
                                    }}
                                    allowFontScaling={false}
                                >
                                    Day, week, and month options will be available for premium users. 
                                </Text>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        textAlign: 'left',
                                        fontSize: HeightRatio(20),
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        margin: HeightRatio(5)
                                    }}
                                    allowFontScaling={false}
                                >
                                    Freemium users can pay a nominal price for the export. But for now, this feature is FREE!                        
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    setDisplayExportModal(!displayExportModal);
                                    setMainState({ userTouch: true })
                                }}
                                style={{
                                    backgroundColor: THEME_COLOR_NEGATIVE,
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
                                        color: THEME_FONT_COLOR_WHITE,
                                        fontSize: HeightRatio(25),
                                        alignSelf: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                                    }}
                                    allowFontScaling={false}
                                >
                                    Close
                                </Text>
                            </TouchableOpacity>


                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="none"
                transparent={true}
                visible={displayEmailSentModal}
                onRequestClose={() => {
                    setDisplayEmailSentModal(!displayEmailSentModal);

                }}
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
                                    source={require('../../assets/favicon_0.png')}
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
                                    Email sent! &#128640;
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    setDisplayEmailSentModal(!displayEmailSentModal);
                                    setMainState({ userTouch: true })
                                }}
                                style={{
                                    backgroundColor: THEME_COLOR_NEGATIVE,
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
                                        color: THEME_FONT_COLOR_WHITE,
                                        fontSize: HeightRatio(25),
                                        alignSelf: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                                    }}
                                    allowFontScaling={false}
                                >
                                    Close
                                </Text>
                            </TouchableOpacity>


                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="none"
                transparent={true}
                visible={displayEmailFailedModal}
                onRequestClose={() => {
                    setDisplayEmailFailedModal(!displayEmailFailedModal);

                }}
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
                                    source={require('../../assets/favicon_0.png')}
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
                                    Error: email was not sent! &#128533;
                                </Text>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        textAlign: 'left',
                                        fontSize: HeightRatio(20),
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        marginTop: HeightRatio(10)
                                    }}
                                    allowFontScaling={false}
                                >
                                    Potential network error.
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    setDisplayEmailFailedModal(!displayEmailFailedModal);
                                    setMainState({ userTouch: true })
                                }}
                                style={{
                                    backgroundColor: THEME_COLOR_NEGATIVE,
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
                                        color: THEME_FONT_COLOR_WHITE,
                                        fontSize: HeightRatio(25),
                                        alignSelf: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                                    }}
                                    allowFontScaling={false}
                                >
                                    Close
                                </Text>
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
    );
}


const styles = StyleSheet.create({
    homePrimary_Container: {
        flex: 1,
        backgroundColor: '#ecece6',
        display: 'flex',
        alignItems: 'center',
        height: windowHeight,
        width: windowWidth,
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
    textInputStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        color: 'black',
        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
        fontSize: HeightRatio(18),
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(14),
        paddingLeft: HeightRatio(20),
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        margin: HeightRatio(8),
        width: windowWidth - HeightRatio(120)
    },
    container: {
        height: '80%'

    },
    scrollView: {
        width: '80%',
        alignSelf: 'center'
    },
    homePrimary_Add_Button: {
        backgroundColor: THEME_COLOR_POSITIVE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // padding: HeightRatio(20),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        margin: HeightRatio(4)
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
    renderItem_Search_Result_Container_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(25),
        fontFamily: "SofiaSansSemiCondensed-Regular",
        display: 'flex',
        flexWrap: 'wrap',
    },
    modalVisible_HalfButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        width: (windowWidth - WidthRatio(100)) / 2,
        margin: HeightRatio(10)
    },
    modalVisible_Button_Text: {
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(25),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
})