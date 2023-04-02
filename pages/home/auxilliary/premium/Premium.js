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



    const getPackages = async () => {
        setLoading(true)
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        Purchases.configure({ apiKey: APIKeys.google, appUserID: props.userID });
        try {

            const offerings = await Purchases.getOfferings();

            if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                console.log(offerings.current.availablePackages)
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
        setMainState({
            tokens_isPurchaseSuccessful: false
        })

        const customerInfo = await Purchases.getCustomerInfo();
        transactionLength.current = customerInfo.nonSubscriptionTransactions.length;
        console.log("# - onSelection")
        console.log(customerInfo)

        try {
            setDisplayModal(false)
            // setLoading(true)
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
            console.log()
            // setLoading(true)
            setIsPurchasing(false);
        }

    };

    // const checkCustomerInfo = async (input) => {
    //     const customerInfo = await Purchases.getCustomerInfo();
    //     console.log("* * * * * * * *")
    //     console.log(input)

    //     const intervalID = setInterval(() => {
    //         if (
    //             customerInfo.nonSubscriptionTransactions.length > transactionLength.current &&
    //             customerInfo.nonSubscriptionTransactions[customerInfo.nonSubscriptionTransactions.length - 1].productIdentifier == `${input.product.identifier}`
    //         ) {

    //             if (!updateComplete) {
    //                 setUpdateComplete(true)
    //                 setLoading(false)
    //                 console.log("UPDATE DB WITH: " + input.product.identifier)
    //                 console.log("#1: clear INTERVAL!")

    //                 const handleUpdateTokenCount = async () => {
    //                     if (input.identifier === 'tokens_25') {
    //                         await updateTokenCount({
    //                             variables: {
    //                                 remove: "false",
    //                                 add: "true",
    //                                 amount: "25",
    //                                 userid: props.userID
    //                             }
    //                         });
    //                     } else if (input.identifier === 'tokens_50') {
    //                         await updateTokenCount({
    //                             variables: {
    //                                 remove: "false",
    //                                 add: "true",
    //                                 amount: "50",
    //                                 userid: props.userID
    //                             }
    //                         });
    //                     } else if (input.identifier === 'tokens_100') {
    //                         await updateTokenCount({
    //                             variables: {
    //                                 remove: "false",
    //                                 add: "true",
    //                                 amount: "100",
    //                                 userid: props.userID
    //                             }
    //                         });
    //                     } else if (input.identifier === 'tokens_200') {
    //                         await updateTokenCount({
    //                             variables: {
    //                                 remove: "false",
    //                                 add: "true",
    //                                 amount: "200",
    //                                 userid: props.userID
    //                             }
    //                         });
    //                     }
    //                 }

    //                 handleUpdateTokenCount();




    //                 clearInterval(intervalID);
    //                 setIsPurchaseSuccessful(true);
    //                 setMainState({
    //                     tokens_isPurchaseSuccessful: true
    //                 })
    //             }



    //         } else {
    //             if (updateComplete) {
    //                 console.log("#2: clear INTERVAL!")
    //                 clearInterval(intervalID);
    //                 return;
    //             }
    //             console.log("NO UPDATE")

    //         }
    //     }, 5000)

    //     setTimeout(() => {
    //         console.log("#3: clear INTERVAL!")
    //         clearInterval(intervalID);
    //         setUpdateComplete(false)
    //         setLoading(false)
    //     }, 300000);




    // }


    const Item = ({ title, identifier, description, priceString, purchasePackage }) => (
        <>


            <TouchableOpacity
                onPress={() => { onSelection(purchasePackage); setMainState({ userTouch: true }); }}
            >

                <View>
                    {identifier == 'baby_food_tracker_premium_month' &&
                        <>
                            <View style={{
                                backgroundColor: THEME_COLOR_POSITIVE,
                                ...styles.button_Drop_Shadow,
                                display: 'flex',
                                justifyContent: 'flex-start',
                                padding: HeightRatio(20),
                                borderRadius: HeightRatio(10),
                                alignSelf: 'center',
                                width: windowWidth - WidthRatio(50),
                                margin: HeightRatio(10)
                            }}>
                                <Text
                                    style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(30),
                                        // fontWeight: 'bold',
                                        alignSelf: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                                    }}
                                    allowFontScaling={false}
                                >
                                    Premium - Month
                                </Text>
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
                :
                <View
                    stlye={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: HeightRatio(20)
                    }}
                >
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