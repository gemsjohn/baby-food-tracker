import React, { createContext, useEffect, useRef, useState, useCallback } from 'react';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, ApolloError } from "@apollo/client";
import { setContext } from '@apollo/link-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { HomeScreen } from './pages/home/Home';
import { PremiumScreen } from './pages/premium/Premium';
import { KeyScreen } from './pages/home/Key';
import { ProfileScreen } from './pages/profile/Profile';
import { Auth } from './pages/auth/auth';
import * as SecureStore from 'expo-secure-store';

export const MainStateContext = createContext();
export const GLOBAL_GRAPHQL_API_URL = "https://baby-food-tracker.herokuapp.com";
// export const GLOBAL_GRAPHQL_API_URL = "http://192.168.1.198:3001";


const Stack = createNativeStackNavigator();

export default function App() {
  const mainStateRef = useRef({});
  const setMainState = (newState) => {
    mainStateRef.current = { ...mainStateRef.current, ...newState };
  };

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


  return (
    <>
      <ApolloProvider client={apolloClient}>
        <MainStateContext.Provider
          value={{ mainState: mainStateRef, setMainState }}>
          <NavigationContainer 
            // onStateChange={(state) => { console.log('New state is', state.routes); }}
          >
            <Stack.Navigator
              initialRouteName={"Key"}
              screenOptions={{
                headerShown: false,
                
              }}
            >
              <Stack.Screen
                name="Auth"
                component={Auth}
                options={{
                  headerShown: false,
                  orientation: 'portrait_up',
                }}
              />
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    headerShown: false,
                    orientation: 'portrait_up',
                    
                  }}
                />
                <Stack.Screen
                  name="Premium"
                  component={PremiumScreen}
                  options={{
                    headerShown: false,
                    orientation: 'portrait_up',
                    
                  }}
                />
              <Stack.Screen
                name="Key"
                component={KeyScreen}
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
              />

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
