import React, { useEffect, useInsertionEffect, useState, useContext, useRef } from 'react';
import { View, Text, Button, Dimensions, Image, TouchableOpacity, PixelRatio, TouchableHighlight, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
// import { GET_USER_BY_ID, GET_ME } from '../utils/queries';
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
    const [fromHome, setFromHome] = useState(true);
    const [fromGame, setFromGame] = useState(false);
    const [fromProfile, setFromProfile] = useState(false);
    const [networkConnected, setNetworkConnected] = useState(true);


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

    // const { data: userByID, refetch, error } = useQuery(GET_USER_BY_ID, {
    //     variables: { id: mainState.current.userID }
    // });

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
        // refetch()
        if (props.from == 'home') {
            // console.log("Home")
            setFromHome(true)
            setFromGame(false)
            setFromProfile(false)

        }
        if (props.from == 'chat') {
            console.log("chat")
            setFromHome(false)
            setFromGame(true)
            setFromProfile(false)
        }
        if (props.from == 'profile') {
            // console.log("profile")
            setFromHome(false)
            setFromGame(false)
            setFromProfile(true)
        }

        authState.current = mainState.current.authState
        userID.current = mainState.current.userID;

        pingServer()
    }, [])

    // if (localKeyMoment != mainState.current.initialKeyMoment && mainState.current.bearerToken != null) {
    //     checkToken();
    // }

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
                            top: HeightRatio(-30),
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'

                        }}>
                            <Text style={{
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                color: 'rgba(255, 0, 118, 1.00)',
                                fontSize: HeightRatio(20),
                                alignSelf: 'center',
                                borderBottomWidth: 2,
                                borderColor: 'white'
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
                            props.nav.dispatch(resetActionHome);
                            setMainState({
                                isGameInProgress: false
                            })
                        }}
                        style={{ backgroundColor: fromHome ? 'rgba(22, 27, 33, 1.00)' : 'rgba(22, 27, 33, 0.25)', borderTopLeftRadius: HeightRatio(30) }}
                    >
                        <View
                            style={{

                                display: 'flex',
                                justifyContent: 'flex-start',
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(10),
                                alignSelf: 'center',
                                width: windowWidth / 4
                            }}
                            accessible={true}
                            accessibilityLabel="Home"
                        >
                            <Text
                                style={{
                                    color: 'white',
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
                            style={{ backgroundColor: fromProfile ? 'rgba(22, 27, 33, 1.00)' : 'rgba(22, 27, 33, 0.25)', borderTopRightRadius: HeightRatio(30) }}
                        >
                            <View
                                style={{

                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(10),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth / 4
                                }}
                                accessible={true}
                                accessibilityLabel="Home"
                            >
                                <Text
                                    style={{
                                        color: 'white',
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
                            style={{ backgroundColor: fromProfile ? 'rgba(22, 27, 33, 1.00)' : 'rgba(22, 27, 33, 0.25)', borderTopRightRadius: HeightRatio(30) }}
                        >
                            <View
                                style={{

                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(10),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth / 4
                                }}
                                accessible={true}
                                accessibilityLabel="Home"
                            >
                                <Text
                                    style={{
                                        color: 'white',
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
            
        </>
    )
}