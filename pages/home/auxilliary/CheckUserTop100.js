import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { ADD_ENTRY } from '../../../utils/mutations';
import { GET_USER_BY_ID } from '../../../utils/queries';
import { MainStateContext } from '../../../App';

import { top_100 } from "./TOP_100";




export const useCheckUserTop100 = (subuser) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    // const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
    //     variables: { id: mainState.current.userID }
    // });
    

    let array_0 = top_100;
    let array_1 = [];
    const commonIndex = [];
    if (subuser && subuser.tracker) {

        for (let i = 0; i < subuser.tracker.length; i++) {
            const item = subuser.tracker[i].entry[0].item;
            if (!array_1.includes(item)) {
                array_1.push(item);
            }
    
        }
      
        array_1.forEach((item1, index1) => {
          array_0.forEach((item2, index2) => {
            const itemName = item2.name.toUpperCase();
            if (item1.includes(itemName)) {
              commonIndex.push(index2);
            }
          });
        });
    
        
    }

    function updateArray(arr, indexArr) {
        return arr.map((item, index) => {
            if (indexArr.includes(index)) {
                return {...item, tried: true};
            } else {
                return {...item, tried: false};
            }
        });
    }
    
    array_0 = updateArray(array_0, commonIndex);
    return { top_100_Filtered: array_0 };
}