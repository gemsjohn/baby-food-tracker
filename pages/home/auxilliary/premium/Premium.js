import React, { useEffect, useState, useRef, useContext } from 'react';
import { Platform, Text, View, FlatList, Alert, TouchableOpacity, Modal, Image, ActivityIndicator, StyleSheet } from 'react-native';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { HeightRatio, WidthRatio, windowHeight, windowWidth } from '../../../../Styling';
import { MainStateContext } from '../../../../App';
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
} from '../../../../COLOR';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_PREMIUM } from '../../../../utils/mutations';
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

const APIKeys = {
    google: "goog_caDqiYZPHvJIwlqyFoZDgTqOywO",
};

export const Premium = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);


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
        Purchases.configure({ apiKey: APIKeys.google, appUserID: props.userID });
        try {

            const offerings = await Purchases.getOfferings();

            if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                // console.log(offerings.current.availablePackages)
                setPackages(offerings.current.availablePackages);

            }
        } catch (e) {
            Alert.alert('Error getting offers', e.message);
        }
        setLoading(false)
    };

    useEffect(() => {
        getPackages();
    }, [])

    const onSelection = async (input) => {
        setIsPurchasing(true);
        setIsPurchaseSuccessful(false);
        // setMainState({
        //     tokens_isPurchaseSuccessful: false
        // })

        const customerInfo = await Purchases.getCustomerInfo();
        // transactionLength.current = customerInfo.nonSubscriptionTransactions.length;

        try {
            setDisplayModal(false)
            setMainState({
                tokens_display: false
            })
            await Purchases.purchasePackage(input);
        } catch (e) {
            if (!e.userCancelled) {
                // Alert.alert('Error purchasing package', e.message);
            }
        } finally {
            checkCustomerInfo(input)
            // setIsPurchasing(false);
        }

    };

    const handleUpdateToPremium = async (expiration) => {
        console.log("# - HANDLE UPDATE TO PREMIUM")
        handlerUpdateToPremiumCalled.current = true;
        setMainState({
            triggerRefresh: true
        })

        await updatePremium({
            variables: {
                status: true,
                expiration: `${expiration}`
            }
        });
        clearInterval(intervalID.current);
        setMainState({
            triggerRefresh: false
        })
    }

    const checkCustomerInfo = async (input) => {

        const customerInfo = await Purchases.getCustomerInfo();
        console.log("- - - - - - - - - ")
        console.log("- - - - - - - - - ")
        console.log(input)
        console.log("- - - - - - - - - ")
        // console.log(customerInfo)
        console.log(customerInfo.allExpirationDates.baby_food_tracker_premium_month)

        setTimeout(() => {
            clearInterval(intervalID.current)
            console.log("# - STOP Checking User Subscription")
            setCheckCustomerInfoInitiated(false)
        }, 5000)

        intervalID.current = setInterval(() => {
            // setCheckCustomerInfoInitiated(true)
            console.log("# - Checking User Subscription")
            for (let i = 0; i < customerInfo.activeSubscriptions.length; i++) {
                if (customerInfo.activeSubscriptions[i] === "baby_food_tracker_premium_month" && !handlerUpdateToPremiumCalled.current) {
                    handleUpdateToPremium(customerInfo.allExpirationDates.baby_food_tracker_premium_month)
                }
            }

        }, 1000)
    }



    const Item = ({ title, identifier, description, priceString, purchasePackage }) => (
        <>


            <TouchableOpacity
                onPress={() => { onSelection(purchasePackage); setMainState({ userTouch: true }); }}
            >

                <View>
                    {identifier == 'baby_food_tracker_premium_month' &&
                        <>
                            <View style={{
                                backgroundColor: THEME_COLOR_ATTENTION,
                                ...styles.button_Drop_Shadow,
                                display: 'flex',
                                justifyContent: 'flex-start',
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(20),
                                alignSelf: 'center',
                                width: '100%',
                                margin: HeightRatio(10)
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View
                                        style={{
                                            height: HeightRatio(50),
                                            width: HeightRatio(50),
                                            borderRadius: HeightRatio(100),
                                            borderWidth: 3,
                                            borderColor: 'black',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginLeft: HeightRatio(10)
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSolid, faGlasses}
                                            style={{ color: THEME_FONT_COLOR_BLACK }}
                                            size={25}
                                        />

                                    </View>
                                    <Text
                                        style={{
                                            color: THEME_FONT_COLOR_BLACK,
                                            fontSize: HeightRatio(30),
                                            alignSelf: 'center',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                            marginLeft: HeightRatio(20)
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Continue
                                    </Text>
                                </View>

                            </View>
                        </>
                    }
                </View>

            </TouchableOpacity>


        </>
    );

    return (
        <>
            {!loading ?
                <>
                    <View
                        style={{
                            flexDirection: 'row',
                            display: 'flex',
                            alignItems: 'center',
                            // justifyContent: 'center'
                        }}
                    >
                        <Image
                            source={require('../../../../assets/favicon_0.png')}
                            style={{
                                height: HeightRatio(40),
                                width: HeightRatio(40),
                            }}
                        />
                        <Text style={{ color: 'white', fontFamily: 'SofiaSansSemiCondensed-ExtraBold', fontSize: HeightRatio(14) }}>
                            Baby Food Tracker
                        </Text>
                    </View>
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
                            Purchase a Premium subscription for $2.99/month.
                        </Text>

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
                <View
                    stlye={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: HeightRatio(20)
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
                            source={require('../../../../assets/favicon_0.png')}
                            style={{
                                height: HeightRatio(40),
                                width: HeightRatio(40),
                            }}
                        />
                        <Text style={{ color: 'white', fontFamily: 'SofiaSansSemiCondensed-ExtraBold', fontSize: HeightRatio(14) }}>
                            Baby Food Tracker
                        </Text>
                    </View>
                    <ActivityIndicator
                        size={70}
                        color={THEME_COLOR_ATTENTION}
                    />
                    <Text
                        style={{
                            fontSize: HeightRatio(25),
                            textAlign: 'center',
                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                            color: THEME_COLOR_ATTENTION
                        }}
                    >
                        Loading subscription option. This can take a moment.
                    </Text>
                </View>
            }
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
});