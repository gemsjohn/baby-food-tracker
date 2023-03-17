import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { MainStateContext } from '../../App';
import { HeightRatio, Styling } from '../../Styling';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function deleteKey(key) {
  await SecureStore.deleteItemAsync(key);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
}

export const SecureStorage = () => {
  const { mainState, setMainState } = useContext(MainStateContext);

  const [key, onChangeKey] = useState('Your key here');
  const [value, onChangeValue] = useState('Your value here');
  const [prompKeyInput, setPromptKeyInput] = useState()
  const userID = useRef(null);
  const [keyPress, setKeyPress] = useState('');
  const [keyArray, setKeyArray] = useState([]);
  const [count, setCount] = useState(0);
  const [warning, setWarning] = useState(false);
  const [displayKeycode, setDisplayKeycode] = useState(false)
  const [displaySetCode, setDisplaySetCode] = useState(false)
  const [combinedStringState, setCombinedStringState] = useState('')

  const handleKeyPress = (value) => {
    setKeyPress(keyPress + value);
    setKeyArray(current => [...current, value])
    setCount(prev => prev + 1)
  };

  const clearKeyCode = () => {
    setKeyPress('');
    setKeyArray([])
    setCount(0)
  }

  const setKeyCode = () => {
    if (count > 3) {
      let combinedString = keyArray.join('');
      save('cosmicKey', `${combinedString}`);
      setCombinedStringState(combinedString)
      setKeyPress('');
      setKeyArray([])
      setCount(0)
      setDisplayKeycode(false)
      setDisplaySetCode(true)
      // setTimeout(() => {
      //   setDisplaySetCode(false)
      // }, 5000);
    } else {
      setWarning(true)
      setTimeout(() => {
        setWarning(false)
        setCombinedStringState('')
      }, 3000);
    }

  }

  useEffect(() => {
    userID.current = mainState.current.userID;
  }, [])


  const [fontsLoaded] = useFonts({
    'GochiHand_400Regular': require('../../assets/fonts/GochiHand-Regular.ttf'),
    'SofiaSansSemiCondensed-Regular': require('../../assets/fonts/SofiaSansSemiCondensed-Regular.ttf')

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
      {!displaySetCode ?
      <View style={{  }}>
        <Text
          style={{ 
            color: 'white', 
            fontSize: HeightRatio(40), 
            fontFamily: 'SofiaSansSemiCondensed-Regular',
            textAlign: 'center', 
            margin: HeightRatio(20) 
          }}
          allowFontScaling={false}>
          Set a Keycode for easy login!
        </Text>
        <>
          <View style={{ marginTop: HeightRatio(30), flexDirection: 'row', alignSelf: 'center' }}>
            {count > 0 ?
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 1.0)',
                height: HeightRatio(30),
                width: HeightRatio(30),
                margin: HeightRatio(10),
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{
                  color: 'black',
                  fontSize: HeightRatio(20),
                  fontWeight: 'bold',
                  alignSelf: 'center'
                }}
                  allowFontScaling={false}>
                  {keyArray[0]}
                </Text>
              </View>

              :
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                height: HeightRatio(30),
                width: HeightRatio(30),
                margin: HeightRatio(10)
              }} />
            }
            {count > 1 ?
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 1.0)',
                height: HeightRatio(30),
                width: HeightRatio(30),
                margin: HeightRatio(10),
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{
                  color: 'black',
                  fontSize: HeightRatio(20),
                  fontWeight: 'bold',
                  alignSelf: 'center'
                }}
                  allowFontScaling={false}>
                  {keyArray[1]}
                </Text>
              </View>

              :
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                height: HeightRatio(30),
                width: HeightRatio(30),
                margin: HeightRatio(10)
              }} />
            }
            {count > 2 ?
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 1.0)',
                height: HeightRatio(30),
                width: HeightRatio(30),
                margin: HeightRatio(10),
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{
                  color: 'black',
                  fontSize: HeightRatio(20),
                  fontWeight: 'bold',
                  alignSelf: 'center'
                }}
                  allowFontScaling={false}>
                  {keyArray[2]}
                </Text>
              </View>

              :
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                height: HeightRatio(30),
                width: HeightRatio(30),
                margin: HeightRatio(10)
              }} />
            }
            {count > 3 ?
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 1.0)',
                height: HeightRatio(30),
                width: HeightRatio(30),
                margin: HeightRatio(10),
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{
                  color: 'black',
                  fontSize: HeightRatio(20),
                  fontWeight: 'bold',
                  alignSelf: 'center'
                }}
                  allowFontScaling={false}>
                  {keyArray[3]}
                </Text>
              </View>

              :
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                height: HeightRatio(30),
                width: HeightRatio(30),
                margin: HeightRatio(10)
              }} />
            }



          </View>

          {warning &&
            <Text style={{ color: 'red', fontSize: HeightRatio(20), alignSelf: 'center', marginTop: 20 }}>
              Must be 4 #'s!
            </Text>
          }

          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <TouchableOpacity style={{ backgroundColor: 'rgba(30, 228, 168, 0.10)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('1')}>
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(40), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular' }}
                  allowFontScaling={false}
                >1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'rgba(30, 228, 168, 0.10)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('2')}>
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(40), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular'  }}
                  allowFontScaling={false}
                >2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'rgba(30, 228, 168, 0.10)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('3')}>
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(40), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular'  }}
                  allowFontScaling={false}
                >3</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <TouchableOpacity style={{ backgroundColor: 'rgba(30, 228, 168, 0.10)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('4')}>
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(40), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular'  }}
                  allowFontScaling={false}
                >4</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'rgba(30, 228, 168, 0.10)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('5')}>
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(40), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular'  }}
                  allowFontScaling={false}
                >5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'rgba(30, 228, 168, 0.10)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('6')}>
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(40), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular'  }}
                  allowFontScaling={false}
                >6</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <TouchableOpacity style={{ backgroundColor: 'rgba(30, 228, 168, 0.10)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('7')}>
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(40), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular'  }}
                  allowFontScaling={false}
                >7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'rgba(30, 228, 168, 0.10)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('8')}>
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(40), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular'  }}
                  allowFontScaling={false}
                >8</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'rgba(30, 228, 168, 0.10)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('9')}>
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(40), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular'  }}
                  allowFontScaling={false}
                >9</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <TouchableOpacity
                style={{ backgroundColor: 'red', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => clearKeyCode()}>
                <Text style={{ color: 'white', fontSize: HeightRatio(20), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular'  }}
                  allowFontScaling={false}
                >Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'rgba(30, 228, 168, 0.10)', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeyPress('0')}>
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(40), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular'  }}
                  allowFontScaling={false}
                >0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: 'green', height: HeightRatio(70), width: HeightRatio(70), borderRadius: HeightRatio(20), margin: HeightRatio(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setKeyCode()}>
                <Text style={{ color: 'white', fontSize: HeightRatio(20), alignSelf: 'center', fontStyle: 'SofiaSansSemiCondensed-Regular'  }}
                  allowFontScaling={false}
                >Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      </View>
      :
      <View style={{alignSelf: 'center'}}>
        <Text style={{
          color: 'white',
          fontSize: HeightRatio(100), 
          fontFamily: 'GochiHand_400Regular',
          }}>
        &nbsp; Saved &nbsp;
        </Text>
      </View>
      }
    </>

  );
}