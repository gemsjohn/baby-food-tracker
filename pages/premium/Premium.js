import React, { useEffect, useState, useRef, useContext } from 'react';
import { Platform, Text, View, FlatList, Alert, TouchableOpacity, Modal, Image, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { HeightRatio, WidthRatio, windowHeight, windowWidth } from '../../Styling';
import { MainStateContext } from '../../App';
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
} from '../../COLOR';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_PREMIUM } from '../../utils/mutations';
import { GET_USER_BY_ID } from '../../utils/queries';
import { LinearGradient } from 'expo-linear-gradient';
import { Navbar } from '../../components/Navbar';

import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faX,
    faArrowRight,
    faArrowLeft,
    faPlus,
    faBars,
    faGlasses
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { CommonActions } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const APIKeys = {
    google: "goog_caDqiYZPHvJIwlqyFoZDgTqOywO",
};

const resetActionHome = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Home', params: {} }]
});

export const PremiumScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);

    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });


    const [packages, setPackages] = useState([]);
    // - State for displaying an overlay view
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [loading, setLoading] = useState(false);

    const transactionLength = useRef(null);
    const [updateComplete, setUpdateComplete] = useState(false);
    const [displayModal, setDisplayModal] = useState(mainState.current.tokens_display)
    const [isPuchaseSuccessful, setIsPurchaseSuccessful] = useState(mainState.current.tokens_isPurchaseSuccessful)
    const [updatePremium] = useMutation(UPDATE_PREMIUM);
    const handlerUpdateToPremiumCalled = useRef(false);
    const intervalID = useRef(null);
    const [checkCustomerInfoInitiated, setCheckCustomerInfoInitiated] = useState(false);


    const getPackages = async () => {
        setLoading(true)
        setCheckCustomerInfoInitiated(false)
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        Purchases.configure({ apiKey: APIKeys.google, appUserID: userByID?.user._id });
        try {

            const offerings = await Purchases.getOfferings();

            if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                // console.log(offerings.current.availablePackages)
                setPackages(offerings.current.availablePackages);

            }
        } catch (e) {
            // Alert.alert('Error getting offers', e.message);
            console.log(e.message)
        }
        setLoading(false)
    };

    useEffect(() => {
        getPackages();
    }, [])

    const onSelection = async (input) => {
        console.log("# - SUBSCRIBE SELECTED")
        await SecureStore.setItemAsync("DAY_HOUR", '');
        try {
            await Purchases.purchasePackage(input);
        } catch (e) {
            if (!e.userCancelled) {
                console.log(e.message)
            }
        } finally {
            handleRestorePurchases()
        }
    };

    const handleRestorePurchases = async () => {
        console.log("# - RESTORE PURCHASES")

        Purchases.configure({ apiKey: APIKeys.google, appUserID: mainState.current.userID });
        try {
            await Purchases.restorePurchases();
            handleUpdateToSubscription()

        } catch (e) {
            console.log(e)
        }

    }

    const handleUpdateToSubscription = async (expiration) => {
        
        const customerInfo = await Purchases.getCustomerInfo();
        if (customerInfo.activeSubscriptions.length > 0 && !userByID?.user.subscription || userByID?.user.subscription === null) {
            console.log("# - HANDLE UPDATE SUBSCRIPTION")

            await updatePremium({
                variables: {
                    status: true,
                    expiration: `${expiration}`
                }
            });
            await SecureStore.setItemAsync("PREMIUM", 'true');
            navigation.navigate('Home')

        } else {
            console.log("# - NO SUBSCRIPTION UPDATES")

        }

    }

    const Item = ({ title, identifier, description, priceString, purchasePackage }) => (
        <>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => { 
                        // navigation.dispatch(resetActionHome);
                        navigation.navigate('Home') 
                        setMainState({ userTouch: true }); 
                    }}
                >

                    <View>
                        {identifier == 'baby_food_tracker_premium_month' &&
                            <>
                                <View style={{ ...styles.modalButton, ...styles.button_Drop_Shadow, backgroundColor: THEME_COLOR_NEGATIVE }}>
                                    <Text
                                        style={{ ...styles.modalButton_Text, color: THEME_FONT_COLOR_WHITE }}
                                        allowFontScaling={false}
                                    >
                                        Close
                                    </Text>
                                </View>

                            </>
                        }
                    </View>

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { onSelection(purchasePackage); setMainState({ userTouch: true }); }}
                >

                    <View>
                        {identifier == 'baby_food_tracker_premium_month' &&
                            <>
                                <View style={{ ...styles.modalButton, ...styles.button_Drop_Shadow, backgroundColor: THEME_COLOR_POSITIVE }}>
                                    <Text
                                        style={{ ...styles.modalButton_Text, color: THEME_FONT_COLOR_BLACK }}
                                        allowFontScaling={false}
                                    >
                                        Continue
                                    </Text>
                                </View>

                            </>
                        }
                    </View>

                </TouchableOpacity>
            </View>


        </>
    );

    return (
        <>
            <LinearGradient
                colors={['#8bccde', '#d05bb6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.homePrimary_Container}
            >
                {!loading ?
                    <>
                        <View
                            style={{
                                flexDirection: 'row',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: HeightRatio(20)
                            }}
                        >
                            <Image
                                source={require('../../assets/favicon_0.png')}
                                style={{
                                    height: HeightRatio(70),
                                    width: HeightRatio(70),
                                }}
                            />
                            <View style={{ margin: HeightRatio(10) }}>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                        fontSize: HeightRatio(30),
                                    }}
                                    allowFontScaling={false}
                                >
                                    Premium Service
                                </Text>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                        fontSize: HeightRatio(20),
                                    }}
                                    allowFontScaling={false}
                                >
                                    $2.99/month
                                </Text>

                            </View>

                        </View>

                        <View style={{}}>
                            <View
                                style={{
                                    display: 'flex',
                                }}
                            >
                                {/* FEATURE 6 */}
                                <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                    <View style={{ backgroundColor: '#2da94b', height: HeightRatio(20), width: HeightRatio(20), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                            fontSize: HeightRatio(20),
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Add and track multiple children
                                    </Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: THEME_COLOR_POSITIVE, width: windowWidth - HeightRatio(100), margin: HeightRatio(10) }} />
                                {/* FEATURE 1 */}
                                <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                    <View style={{ backgroundColor: '#FF6384', height: HeightRatio(20), width: HeightRatio(20), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                            fontSize: HeightRatio(20),
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Daily nutrition metrics (e.g. food group ratios)
                                    </Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: THEME_COLOR_POSITIVE, width: windowWidth - HeightRatio(100), margin: HeightRatio(10) }} />

                                {/* FEATURE 5 */}
                                <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)) }}>
                                    <View style={{ backgroundColor: '#9966FF', height: HeightRatio(20), width: HeightRatio(20), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                            fontSize: HeightRatio(20),
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Additional nutrition data
                                    </Text>

                                </View>
                                <View style={{ display: 'flex', flexDirection: 'column', paddingLeft: HeightRatio(30) }}>
                                    <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                        <View style={{ backgroundColor: 'white', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                        <Text
                                            style={{
                                                textAlign: 'left',
                                                fontSize: HeightRatio(18),
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Iron
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                        <View style={{ backgroundColor: 'white', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                        <Text
                                            style={{
                                                textAlign: 'left',
                                                fontSize: HeightRatio(18),
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Zinc
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                        <View style={{ backgroundColor: 'white', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                        <Text
                                            style={{
                                                textAlign: 'left',
                                                fontSize: HeightRatio(18),
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Omega-3 Fatty Acids
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                        <View style={{ backgroundColor: 'white', height: HeightRatio(10), width: HeightRatio(10), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                        <Text
                                            style={{
                                                textAlign: 'left',
                                                fontSize: HeightRatio(18),
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Vitamin D
                                        </Text>
                                    </View>

                                </View>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: THEME_COLOR_POSITIVE, width: windowWidth - HeightRatio(100), margin: HeightRatio(10) }} />

                                {/* FEATURE 4 */}
                                <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                    <View style={{ backgroundColor: '#4BC0C0', height: HeightRatio(20), width: HeightRatio(20), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                            fontSize: HeightRatio(20),
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Allergy tracking
                                    </Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: THEME_COLOR_POSITIVE, width: windowWidth - HeightRatio(100), margin: HeightRatio(10) }} />

                                {/* FEATURE 3 */}
                                <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                    <View style={{ backgroundColor: '#FFCE56', height: HeightRatio(20), width: HeightRatio(20), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                    <View style={{flexDirection: 'column'}}>
                                        <Text
                                            style={{
                                                color: THEME_FONT_COLOR_BLACK,
                                                textAlign: 'left',
                                                fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                                fontSize: HeightRatio(20),
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Beta Feature
                                        </Text>
                                        <Text
                                            style={{
                                                textAlign: 'left',
                                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                fontSize: HeightRatio(20),
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Export food entry data via Email
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: THEME_COLOR_POSITIVE, width: windowWidth - HeightRatio(100), margin: HeightRatio(10) }} />

                                <View style={{ marginBottom: HeightRatio(20), alignSelf: 'center', }}>

                                    {/* <Image
                                    source={require('../../assets/developer_icon.png')}
                                    style={{ height: HeightRatio(100), width: windowWidth - HeightRatio(100), margin: HeightRatio(4) }}
                                /> */}
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                            fontSize: HeightRatio(20),
                                            color: THEME_FONT_COLOR_BLACK
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Additional Services in Development
                                    </Text>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                            fontSize: HeightRatio(15),
                                            color: THEME_FONT_COLOR_BLACK
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Available soon.
                                    </Text>
                                </View>

                                {/* FEATURE 2 */}
                                <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', width: (windowWidth - WidthRatio(120)), }}>
                                    <View style={{ backgroundColor: '#36A2EB', height: HeightRatio(20), width: HeightRatio(20), borderRadius: HeightRatio(4), margin: HeightRatio(10) }} />
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                            fontSize: HeightRatio(20),
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Personalized insights and recommendations
                                    </Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: THEME_COLOR_POSITIVE, width: windowWidth - HeightRatio(100), margin: HeightRatio(10) }} />

                                

                            </View>

                        </View>

                        <FlatList
                            data={packages}
                            renderItem={({ item }) =>
                                <View style={{ alignSelf: 'center' }}>
                                    <Item
                                        title={item.product.title}
                                        identifier={item.product.identifier}
                                        description={item.product.description}
                                        priceString={item.product.priceString}
                                        purchasePackage={item}
                                    />
                                </View>
                            }
                            keyExtractor={(item) => item.identifier}
                        />
                    </>
                    :
                    <>
                    <View
                            style={{
                                flexDirection: 'row',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: HeightRatio(20)
                            }}
                        >
                            <Image
                                source={require('../../assets/favicon_0.png')}
                                style={{
                                    height: HeightRatio(70),
                                    width: HeightRatio(70),
                                }}
                            />
                            <View style={{ margin: HeightRatio(10) }}>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                        fontSize: HeightRatio(30),
                                    }}
                                    allowFontScaling={false}
                                >
                                    Premium Service
                                </Text>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        textAlign: 'left',
                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                        fontSize: HeightRatio(20),
                                    }}
                                    allowFontScaling={false}
                                >
                                    $2.99/month
                                </Text>

                            </View>

                        </View>
                        <View
                            style={{
                                flexDirection: 'column',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: HeightRatio(20)
                            }}
                        >
                            <ActivityIndicator
                                size={70}
                                color={THEME_COLOR_POSITIVE}
                            />
                            <Text
                                style={{
                                    fontSize: HeightRatio(25),
                                    textAlign: 'center',
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                    color: THEME_FONT_COLOR_BLACK,
                                    marginTop: HeightRatio(20)
                                }}
                                allowFontScaling={false}
                            >
                                Loading subscription option.
                            </Text>
                        </View>
                    </>
                }
            </LinearGradient>
            <Navbar nav={navigation} auth={mainState.current.authState} position={'absolute'} from={'premium'} />
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: THEME_FONT_COLOR_WHITE,
        borderRadius: 10,
        borderWidth: 3,
        padding: 35,
        alignItems: "center",
        shadowColor: THEME_FONT_COLOR_BLACK,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: WidthRatio(300)
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
    homePrimary_Container: {
        flex: 1,
        backgroundColor: THEME_COLOR_BACKDROP_DARK,
        display: 'flex',
        alignItems: 'center',
        width: windowWidth
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