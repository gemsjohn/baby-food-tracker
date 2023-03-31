import React, { useEffect, useState, useRef, useContext } from 'react';
import { Platform, Text, View, FlatList, Alert, TouchableOpacity, Modal, Image, ActivityIndicator, } from 'react-native';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { HeightRatio, WidthRatio, windowHeight, windowWidth } from '../../../../Styling';
import { MainStateContext } from '../../../../App';


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
    };

    getPackages();

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
            // setLoading(true)
            setIsPurchasing(false);
        }
    };

    const Item = ({ title, identifier, description, priceString, purchasePackage }) => (
        <TouchableOpacity
            onPress={() => {onSelection(purchasePackage); setMainState({ userTouch: true });}}
        >

            <View>
                {identifier == 'baby_food_tracker_premium_month' &&
                    <>
                        <View style={{
                            backgroundColor: 'rgba(30, 228, 168, 0.5)',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            padding: HeightRatio(20),
                            borderRadius: HeightRatio(10),
                            alignSelf: 'center',
                            width: windowWidth - WidthRatio(50),
                            margin: HeightRatio(4)
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
                                Premium - Month
                            </Text>
                        </View>
                    </>
                }

            </View>

        </TouchableOpacity>
    );

    return (
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
    )
}
