import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { ADD_ENTRY } from '../../../utils/mutations';
import { GET_USER_BY_ID } from '../../../utils/queries';
import { MainStateContext } from '../../../App';

import { top_100 } from "./TOP_100";




export const useCheckUserTop100 = (input) => {
    // console.log(input)
    const { mainState, setMainState } = useContext(MainStateContext);
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });
    

    let array_0 = top_100;
    let array_1 = [];
    const commonIndex = [];

    // for (let i = 0; i < userByID?.user.tracker.length; i++) {
    //     const item = userByID?.user.tracker[i].entry[0].item;
    //     if (!array_1.includes(item)) {
    //         array_1.push(item);
    //     }

    // }
    // // console.log(array_1);
  
    // array_1.forEach((item1, index1) => {
    //   array_0.forEach((item2, index2) => {
    //     const itemName = item2.name.toUpperCase();
    //     if (item1.includes(itemName)) {
    //       commonIndex.push(index2);
    //     }
    //   });
    // });

    // function updateArray(arr, indexArr) {
    //     return arr.map((item, index) => {
    //         if (indexArr.includes(index)) {
    //             return {...item, tried: true};
    //         } else {
    //             return {...item, tried: false};
    //         }
    //     });
    // }
    
    // array_0 = updateArray(array_0, commonIndex);
    return { top_100_Filtered: array_0 };
}