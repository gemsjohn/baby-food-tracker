import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { CommonActions } from '@react-navigation/native';
import { UserDetails } from './UserDetails';
// import { SavedGame } from './SavedGame';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../utils/queries';
import { HeightRatio, WidthRatio, Styling } from '../../Styling';
import { Navbar } from '../../components/Navbar';
import * as SecureStore from 'expo-secure-store';
import { MainStateContext } from '../../App';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Loading } from '../../components/Loading';
// import { Tokens } from '../purchase/Tokens';
// import { GoogleProducts } from '../purchase/GoogProducts';
// import { PurchaseFilter } from '../purchase/PurchaseFilter';

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
    Keyboard
} from 'react-native';
import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faGamepad,
    faX
} from '@fortawesome/free-solid-svg-icons'
import { SecureStorage } from './SecureStorage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

async function deleteKey(key) {
    await SecureStore.deleteItemAsync(key);
}

export const ProfileScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [displaySetUpCosmicKeyModal, setDisplaySetUpCosmicKeyModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [expand_0, setExpand_0] = useState(false)
    const [displayNavbar, setDisplayNavbar] = useState(true);
    const [displayTokens, setDisplayTokens] = useState(false);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);


    const authState = useRef(false);
    const userID = useRef(null);

    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    const resetActionAuth = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Auth', params: {} }]
    });

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if (result && authState) {
            return;
        } else if (!result && authState.current) {
            setDisplaySetUpCosmicKeyModal(true)
        }
    }


    useEffect(() => {
        setLoading(true)
        refetch();
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (event) => {
                setDisplayNavbar(false)
            },
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setDisplayNavbar(true)
            },
        );

        setTimeout(() => {
            authState.current = mainState.current.authState
            userID.current = mainState.current.userID;
            getValueFor('cosmicKey')
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }, 500)



        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };

    }, [])

    const [fontsLoaded] = useFonts({
        'GochiHand_400Regular': require('../../assets/fonts/GochiHand-Regular.ttf'),
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

                    <View
                        style={{ ...Styling.container, backgroundColor: '#1f1f27' }}
                        onLayout={onLayoutRootView}
                    >

                        <SafeAreaView style={{}}>
                            <ScrollView
                                style={{ backgroundColor: '#1f1f27' }}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                            >
                                <View style={{}}>
                                    {mainState.current.authState &&
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
                                            <View style={{}}>
                                                <View style={{ flexDirection: 'column', marginTop: HeightRatio(40), alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text
                                                        style={{
                                                            ...Styling.modalScoringVarText,
                                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                        }}
                                                        allowFontScaling={false}>
                                                        User Details
                                                    </Text>
                                                    {/* <View style={{
                                                        height: HeightRatio(50),
                                                        width: HeightRatio(270),
                                                        flexDirection: 'column',
                                                    }}>
                                                        <Text style={{
                                                            color: '#ffff00',
                                                            fontSize: HeightRatio(20),
                                                            fontFamily: 'GochiHand_400Regular',
                                                            textAlign: 'center',
                                                            marginTop: HeightRatio(20)
                                                        }} allowFontScaling={false}>
                                                            TOKENS {userByID?.user.tokens}
                                                        </Text>
                                                    </View> */}

                                                    <UserDetails nav={navigation} />
                                                </View>

                                                {/* <View
                                                    style={{
                                                        borderRadius: HeightRatio(20),
                                                        padding: HeightRatio(15),
                                                        width: windowWidth - WidthRatio(50),
                                                        flexDirection: 'column',
                                                        margin: HeightRatio(5),
                                                        alignSelf: 'center',
                                                        backgroundColor: 'rgba(0, 118, 255, 0.50)'
                                                    }}

                                                >
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ flexDirection: 'column' }}>

                                                            <Text
                                                                style={{
                                                                    color: 'white',
                                                                    fontSize: HeightRatio(28),
                                                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                                    margin: HeightRatio(5)
                                                                }}
                                                                allowFontScaling={false}
                                                            >
                                                                Tokens
                                                            </Text>

                                                            <Text
                                                                style={{
                                                                    color: '#ffff00',
                                                                    // alignSelf: 'center', 
                                                                    fontSize: HeightRatio(15),
                                                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                                    margin: HeightRatio(10),
                                                                    marginLeft: HeightRatio(20),
                                                                    width: WidthRatio(150)
                                                                }}
                                                                numberOfLines={1}
                                                                ellipsizeMode='tail'
                                                                allowFontScaling={false}
                                                            >
                                                                1234
                                                            </Text>
                                                        </View><TouchableOpacity
                                                            onPress={() => setDisplayTokens(current => !current)}
                                                            style={{}}
                                                        >
                                                            <View style={{
                                                                backgroundColor: 'rgba(0, 118, 255, 0.50)',
                                                                display: 'flex',
                                                                padding: HeightRatio(20),
                                                                borderRadius: HeightRatio(10),
                                                                alignSelf: 'center',
                                                                width: windowWidth / 3
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
                                                                    Buy
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>


                                                    </View>


                                                </View> */}
                                                {/* {displaytokens &&
                                                    <View style={{ margin: HeightRatio(10) }}>
                                                        <Tokens from={'profile'} />
                                                    </View>
                                                } */}
                                                {/* {displayTokens &&
                                                    // <View style={{ position: 'absolute', top: 0 }}>
                                                    //     <GoogleProducts from={'profile'} />
                                                    // </View>
                                                    <PurchaseFilter nav={navigation} />
                                                } */}


                                                <View style={{ flexDirection: 'column' }}>



                                                </View>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        deleteKey('cosmicKey');
                                                        setTimeout(() => {
                                                            setDisplaySetUpCosmicKeyModal(true)
                                                        }, 500)
                                                    }}
                                                    style={Styling.modalWordButton}>
                                                    <View style={{
                                                        backgroundColor: 'rgba(255, 0, 118, 0.50)',
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
                                                                // fontWeight: 'bold',
                                                                alignSelf: 'center',
                                                                fontFamily: 'SofiaSansSemiCondensed-Regular'
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            Remove/Reset Keycode
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        deleteKey('cosmicKey');

                                                        setMainState({
                                                            bearerToken: null,
                                                            userID: null,
                                                            authState: false
                                                        })
                                                        navigation.dispatch(resetActionAuth)
                                                    }}
                                                    style={{ ...Styling.modalWordButton, marginTop: 0 }}
                                                >
                                                    <View style={{
                                                        backgroundColor: 'rgba(255, 0, 118, 0.50)',
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
                                                                // fontWeight: 'bold',
                                                                alignSelf: 'center',
                                                                fontFamily: 'SofiaSansSemiCondensed-Regular'
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            Switch User
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>

                                            </View>

                                            <View style={{ marginBottom: 200 }}></View>
                                        </>
                                    }
                                </View >
                            </ScrollView>
                        </SafeAreaView>



                    </View>
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
                    <Loading />
                </View>
            }

            {displayNavbar && !displayTokens &&
                <Navbar nav={navigation} auth={mainState.current.authState} position={'absolute'} from={'profile'} />
            }
            {displayTokens &&
                <View style={{ position: 'absolute', zIndex: 20, width: windowWidth, height: windowHeight }}>
                    {/* <PurchaseFilter nav={navigation} from={'profile'} /> */}
                    <View style={{ alignSelf: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                setDisplayTokens(false)
                            }}
                            style={{
                                borderWidth: 3,
                                borderColor: '#ff0076',
                                borderRadius: 100,
                                height: HeightRatio(60),
                                width: HeightRatio(60),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
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
            }
            <Modal
                animationType="slide"
                transparent={true}
                visible={displaySetUpCosmicKeyModal}
                onRequestClose={() => {
                    setDisplaySetUpCosmicKeyModal(!displaySetUpCosmicKeyModal);
                }}
            >
                <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1f1f27' }}>
                    <View style={{ padding: HeightRatio(20) }}>
                        <View style={{ flexDirection: 'column' }}>

                            <SecureStorage />

                            <TouchableOpacity
                                onPress={() => setDisplaySetUpCosmicKeyModal(!displaySetUpCosmicKeyModal)}
                                style={Styling.modalWordButton}>
                                <View style={{
                                    backgroundColor: '#f7ff6c',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(20),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth - WidthRatio(150)
                                }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: HeightRatio(30),
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
                </View>
            </Modal>
            {/* 
            <Modal
                animationType="slide"
                transparent={true}
                visible={displayTokens}
                onRequestClose={() => {
                    setDisplayTokens(!displayTokens);
                }}>
                    <View
                        style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}
                    >
                        <GoogleProducts from={'profile'} />
                    </View>
            </Modal> */}

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