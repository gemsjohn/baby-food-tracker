import React, { createContext, useEffect, useRef, useState, useCallback } from 'react';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, ApolloError } from "@apollo/client";
import { setContext } from '@apollo/link-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { HomeScreen } from './pages/home/Home';
// import { KeyScreen } from './pages/home/Key';
// import { ProfileScreen } from './pages/profile/Profile';
// import { Auth } from './pages/auth/auth';
import * as SecureStore from 'expo-secure-store';

export const MainStateContext = createContext();
// export const GLOBAL_GRAPHQL_API_URL = "https://npc-ai.herokuapp.com";
export const GLOBAL_GRAPHQL_API_URL = "http://192.168.1.198:3001";


const Stack = createNativeStackNavigator();

export default function App() {
  const mainStateRef = useRef({});
  const setMainState = (newState) => {
    mainStateRef.current = { ...mainStateRef.current, ...newState };
  };

  const [initRoute, setInitRoute] = useState("Key");

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setInitRoute("Key")

    } else {
      setInitRoute("Home")
    }
  }

  useEffect(() => {
    getValueFor('cosmicKey')
  }, [])

  const GRAPHQL_API_URL = `${GLOBAL_GRAPHQL_API_URL}/graphql`
  const asyncAuthLink = setContext(async () => {
    return {
      headers: {
        Authorization: mainStateRef.current.bearerToken,
      },
    };
  });

  

  const httpLink = new HttpLink({
    uri: GRAPHQL_API_URL,
  });


  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: asyncAuthLink.concat(httpLink),
  });



  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });


  return (
    <>
      <ApolloProvider client={apolloClient}>
        <MainStateContext.Provider
          value={{ mainState: mainStateRef, setMainState }}>
          <NavigationContainer 
            // onStateChange={(state) => { console.log('New state is', state.routes); }}
          >
            <Stack.Navigator
              // initialRouteName={initRoute}
              initialRouteName={"Home"}
              screenOptions={{
                headerShown: false,
                
              }}
            >
              {/* <Stack.Screen
                name="Auth"
                component={Auth}
                options={{
                  headerShown: false,
                  orientation: 'portrait_up',
                }}
              /> */}
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerShown: false,
                  orientation: 'portrait_up',
                  
                }}
              />
              {/* <Stack.Screen
                name="Key"
                component={KeyScreen}
                options={{
                  headerShown: false,
                  orientation: 'portrait_up',
                  
                }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                  headerShown: false,
                  orientation: 'portrait_up',
                  
                }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                  headerShown: false,
                  orientation: 'portrait_up',
                }}
              /> */}

            </Stack.Navigator>
          </NavigationContainer>
        </MainStateContext.Provider>
      </ApolloProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161b21',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
