import React, { useEffect, useInsertionEffect, useState, useContext, useRef } from 'react';
import { View, Text, Button, Dimensions, Image, TouchableOpacity, PixelRatio, TouchableHighlight, Linking, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID, GET_ME } from '../utils/queries';
import { MainStateContext } from '../App';
import moment from 'moment';
import { Styling, windowHeight, windowWidth, HeightRatio, WidthRatio } from '../Styling';
import { GLOBAL_GRAPHQL_API_URL } from '../App';
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
} from '../COLOR';

export const Navbar = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    // const version = Constants.manifest2.extra.expoClient.version;

    const [isTokenValid, setIsTokenValid] = useState(null);
    const [minimizeNav, setMinimizeNav] = useState(false);
    const [displayTokenModal, setDisplayTokenModal] = useState(mainState.current.displayTokenModal);
    const [fromHome, setFromHome] = useState(false);
    const [fromGame, setFromGame] = useState(false);
    const [fromProfile, setFromProfile] = useState(false);
    const [networkConnected, setNetworkConnected] = useState(true);
    const [displaySignUpModal, setDisplaySignUpModal] = useState(false);


    const authState = useRef(false);
    const userID = useRef(null);

    let localKeyMoment = moment();

    const checkToken = async () => {
        try {
            const response = await fetch(`${GLOBAL_GRAPHQL_API_URL}/protected-route`, {
                method: 'GET',
                headers: {
                    'Authorization': `${mainState.current.bearerToken}`
                }
            });
            if (response.ok) {
                // Token is still valid
                // console.log("NAV - Token is still valid")
                setIsTokenValid(true)
                return true;
            } else {
                // Token is no longer valid
                // console.log("NAV - Token is no longer valid")

                setIsTokenValid(false)
                return false;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const pingServer = async () => {
        console.log("# - Ping Server: " + GLOBAL_GRAPHQL_API_URL)
        try {
            const response = await fetch(`${GLOBAL_GRAPHQL_API_URL}/ping`, {
                method: 'GET',
            });
            if (response.ok) {
                setNetworkConnected(true)
                return true;
            } else {
                setNetworkConnected(false)
                return false;
            }
        } catch (error) {
            setNetworkConnected(false)
        }
    }

    const { data: userByID, refetch, error } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    const resetActionHome = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Home', params: {} }]
    });
    const resetActionChat = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Chat', params: {} }]
    });
    const resetActionProfile = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Profile', params: {} }]
    });
    const resetActionAuth = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Auth', params: {} }]
    });

    useEffect(() => {
        refetch()
        if (props.from == 'home') {
            // console.log("Home")
            setFromHome(true)
            // setFromGame(false)
            setFromProfile(false)

        }
        // if (props.from == 'chat') {
        //     console.log("chat")
        //     setFromHome(false)
        //     setFromGame(true)
        //     setFromProfile(false)
        // }
        if (props.from == 'profile') {
            // console.log("profile")
            setFromHome(false)
            // setFromGame(false)
            setFromProfile(true)
        }

        authState.current = mainState.current.authState
        userID.current = mainState.current.userID;

        pingServer()
    }, [])

    if (localKeyMoment != mainState.current.initialKeyMoment && mainState.current.bearerToken != null) {
        checkToken();
    }

    return (
        <>

            <>

                <View
                    style={{
                        position: `${props.position}`,
                        zIndex: 10,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '',
                        flexDirection: 'row',
                    }}
                >
                    {!networkConnected ?
                        <View style={{
                            position: 'absolute',
                            top: HeightRatio(-40),
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: THEME_COLOR_NEGATIVE,
                            padding: HeightRatio(10),
                            borderRadius: HeightRatio(10)

                        }}>
                            <Text style={{
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                color: THEME_FONT_COLOR_WHITE,
                                fontSize: HeightRatio(20),
                                alignSelf: 'center',
                            }}
                                allowFontScaling={false}
                                ellipsizeMode='tail'
                                numberOfLines={1}>
                                Network Error
                            </Text>
                        </View>
                        :
                        null
                    }

                    {/* [[[HOME]]] */}
                    <TouchableOpacity
                        onPress={() => {
                            isTokenValid ? props.nav.dispatch(resetActionHome) : setDisplaySignUpModal(true);
                            setMainState({ userTouch: true })
                        }}
                        style={{ backgroundColor: fromHome ? THEME_COLOR_POSITIVE : THEME_FONT_COLOR_BLACK, borderTopLeftRadius: HeightRatio(30) }}
                    >
                        <View
                            style={{

                                display: 'flex',
                                justifyContent: 'flex-start',
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(10),
                                alignSelf: 'center',
                                width: windowWidth / 2
                            }}
                            accessible={true}
                            accessibilityLabel="Home"
                        >
                            <Text
                                style={{
                                    color: fromHome ? THEME_FONT_COLOR_BLACK : THEME_FONT_COLOR_WHITE,
                                    fontSize: HeightRatio(20),
                                    alignSelf: 'center',
                                    fontFamily: 'SofiaSansSemiCondensed-Regular'
                                }}
                                allowFontScaling={false}
                            >
                                HOME
                            </Text>
                        </View>
                    </TouchableOpacity>



                    {/* [[[PROFILE]]] */}
                    {isTokenValid ?
                        <TouchableOpacity
                            onPress={() => {
                                props.nav.dispatch(resetActionProfile);
                                setMainState({
                                    isGameInProgress: false
                                })
                                setMainState({ userTouch: true })
                            }}
                            style={{ backgroundColor: fromProfile ? THEME_COLOR_POSITIVE : THEME_FONT_COLOR_BLACK, borderTopRightRadius: HeightRatio(30) }}
                        >
                            <View
                                style={{

                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(10),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth / 2
                                }}
                                accessible={true}
                                accessibilityLabel="Home"
                            >
                                <Text
                                    style={{
                                        color: fromProfile ? THEME_FONT_COLOR_BLACK : THEME_FONT_COLOR_WHITE,
                                        fontSize: HeightRatio(20),
                                        alignSelf: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                                    }}
                                    allowFontScaling={false}
                                >
                                    PROFILE
                                </Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => { props.nav.dispatch(resetActionAuth); setMainState({ userTouch: true }) }}
                            style={{ backgroundColor: fromProfile ? THEME_COLOR_POSITIVE : THEME_FONT_COLOR_BLACK, borderTopRightRadius: HeightRatio(30) }}
                        >
                            <View
                                style={{

                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(10),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth / 2
                                }}
                                accessible={true}
                                accessibilityLabel="Home"
                            >
                                <Text
                                    style={{
                                        color: fromProfile ? THEME_FONT_COLOR_BLACK : THEME_FONT_COLOR_WHITE,
                                        fontSize: HeightRatio(20),
                                        alignSelf: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                                    }}
                                    allowFontScaling={false}
                                >
                                    LOGIN / SIGN UP
                                </Text>
                            </View>
                        </TouchableOpacity>

                    }
                </View>
            </>

            {/* SIGN UP MODAL */}
            <Modal
                animationType="none"
                transparent={true}
                visible={displaySignUpModal}
                onRequestClose={() => {
                    setDisplaySignUpModal(!displaySignUpModal);

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
                                    source={require('../assets/favicon_0.png')}
                                    style={{
                                        height: HeightRatio(40),
                                        width: HeightRatio(40),
                                        // alignSelf: 'center'
                                    }}
                                />
                                <Text style={{color: 'white', fontFamily: 'SofiaSansSemiCondensed-ExtraBold', fontSize: HeightRatio(14)}}>
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
                                    Hello there, friend! &#128075;
                                </Text>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        textAlign: 'left',
                                        fontSize: HeightRatio(20),
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                        marginTop: HeightRatio(2)
                                    }}
                                    allowFontScaling={false}
                                >
                                    To use the Baby Food Tracker you must sign up and login. 
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    setDisplaySignUpModal(!displaySignUpModal);
                                    setMainState({
                                        displaySignUpModal: false
                                    })
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

        </>
    )
}