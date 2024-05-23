import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from './screens/HomeScreen'
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ChatScreen from './screens/ChatScreen';
import FriendsScreen from './screens/FriendsScreen';
import GroupChatScreen from './screens/GroupChatScreen';

const Tab = createBottomTabNavigator();

const TagNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarHideOnKeyboard: true,
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: styles.tabBarStyle,
        }}>
            <Tab.Screen name='Home' component={HomeScreen} options={{
                tabBarIcon: () => (
                    <Entypo name="home" size={24} color="black" />
                )
            }} />
            <Tab.Screen name='Chat' component={ChatScreen} options={{
                tabBarIcon: () => (
                    <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
                )
            }} />
            <Tab.Screen name='GroupChat' component={GroupChatScreen} options={{
                tabBarIcon: () => (
                    <FontAwesome name="group" size={24} color="black" />
                )
            }} />
            <Tab.Screen name='Friends' component={FriendsScreen} options={{
                tabBarIcon: () => (
                    <MaterialIcons name="people-outline" size={24} color="black" />
                )
            }} />
        </Tab.Navigator>
    )
}

export default TagNavigator

const styles = StyleSheet.create({
    tabBarStyle: {
        height: 80,
        position: 'absolute',
        backgroundColor: "white",
        borderTopWidth: 0,
        elevation: 0,
        borderTopColor: 'transparent'
    }
})