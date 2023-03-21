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
        console.log(GLOBAL_GRAPHQL_API_URL)
        try {
            const response = await fetch(`${GLOBAL_GRAPHQL_API_URL}/ping`, {
                method: 'GET',
            });
            console.log
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
                            backgroundColor: 'rgba(235, 35, 81, 1.00)',
                            padding: HeightRatio(10),
                            borderRadius: HeightRatio(10)

                        }}>
                            <Text style={{
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                color: 'white',
                                fontSize: HeightRatio(20),
                                alignSelf: 'center',
                                // borderBottomWidth: 2,
                                // borderColor: 'red'
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
                        }}
                        style={{ backgroundColor: fromHome ? 'rgba(30, 228, 168, 1.0)' : 'black', borderTopLeftRadius: HeightRatio(30) }}
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
                                    color: fromHome ? 'black' : 'white',
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
                            }}
                            style={{ backgroundColor: fromProfile ? 'rgba(30, 228, 168, 1.0)' : 'black', borderTopRightRadius: HeightRatio(30) }}
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
                                        color: fromProfile ? 'black' : 'white',
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
                            onPress={() => { props.nav.dispatch(resetActionAuth); }}
                            style={{ backgroundColor: fromProfile ? 'rgba(30, 228, 168, 1.0)' : 'black', borderTopRightRadius: HeightRatio(30) }}
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
                                        color: fromProfile ? 'black' : 'white',
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
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#47426a", }}>
                    <View style={{ borderTopRightRadius: HeightRatio(10) }}>

                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>

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
                                <Text>CLOSE</Text>
                            </TouchableOpacity>


                        </View>
                    </View>
                </View>
            </Modal>

        </>
    )
}