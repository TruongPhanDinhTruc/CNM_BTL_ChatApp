import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Home" component={HomeScreen}  />
                <Stack.Screen name="Profile" component={ProfileScreen}  />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigator

const styles = StyleSheet.create({})