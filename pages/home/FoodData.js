import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { HeightRatio, windowWidth } from '../../Styling';

const API_KEY = 'M3ETsRX3moxUxiFLb6fdMsN5u3ZueGnbhj0v7r53';
const FOOD_NAME = 'banana';

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        padding: 10,
    },
    table: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: windowWidth
    },
    tableHeader: {
        fontWeight: 'bold',
        flex: 1,
    },
    tableData: {
        flex: 1,
    },
    foodDescription: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export const FoodData = (input) => {
    const [foodData, setFoodData] = useState([]);
    console.log(input)

    useEffect(() => {
        axios
            .get(
                `https://api.nal.usda.gov/fdc/v1/search?api_key=${API_KEY}&generalSearchInput=${input}&pageSize=20&fields=description,labelNutrients`
            )
            .then((response) => {
                const foods = response.data.foods
                    .filter((food) => food.description && food.description.trim().length > 0)
                    .reduce((uniqueFoods, food) => {
                        const formattedDescription = food.description
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase());
                        if (
                            !uniqueFoods.find(
                                (uniqueFood) => uniqueFood.description === formattedDescription
                            )
                        ) {
                            uniqueFoods.push({
                                fdcId: food.fdcId,
                                description: formattedDescription,
                            });
                        }
                        return uniqueFoods;
                    }, []);

                // setFoodData(foods);
                return foods;
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const renderItem = ({ item }) => {
        return (
            <>
                {item.description != '' &&
                    <View
                        style={{
                            backgroundColor: "transparent",
                            width: windowWidth / 1.2,
                            height: HeightRatio(70),
                            margin: HeightRatio(4),
                            borderWidth: 1,
                            borderRadius: HeightRatio(10),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        key={item.fdcId}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: HeightRatio(30),
                                fontFamily: "SofiaSansSemiCondensed-Regular",
                            }}
                        >
                            {item.description}
                        </Text>
                    </View>
                }
            </>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={foodData}
                renderItem={renderItem}
                keyExtractor={(item) => item.fdcId.toString()}
            />
        </View>
    );
};

