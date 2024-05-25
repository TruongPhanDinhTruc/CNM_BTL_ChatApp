import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './screens/ProfileScreen';
import FriendsScreen from './screens/FriendsScreen';
import ChatScreen from './screens/ChatScreen';
import ChatMessagesScreen from './screens/ChatMessagesScreen';
import GroupChatScreen from './screens/GroupChatScreen';
import GroupChatMessagesScreen from './screens/GroupChatMessagesScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';
import TagNavigator from './TagNavigator';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true }} />
                <Stack.Screen name='Tag' component={TagNavigator} options={{animation: 'slide_from_bottom', headerShown: false}}/>
                <Stack.Screen name="Home" component={HomeScreen}  />
                <Stack.Screen name="Profile" component={ProfileScreen}  />
                <Stack.Screen name="Friends" component={FriendsScreen}  />
                <Stack.Screen name="Chats" component={ChatScreen}  />
                <Stack.Screen name="Messages" component={ChatMessagesScreen}  />
                <Stack.Screen name="GroupChat" component={GroupChatScreen}  />
                <Stack.Screen name="GroupChatMessages" component={GroupChatMessagesScreen}  />
                <Stack.Screen name="CreateGroup" component={CreateGroupScreen}  />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}  />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigator

const styles = StyleSheet.create({})