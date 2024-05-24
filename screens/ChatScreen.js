import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UseContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';

const ChatScreen = () => {
  const [accepedtFriends, setAccepedtFriends] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  useEffect(() => {
    const accepedtFriendsList = async () => {
      try {
        const response = await fetch(`http://192.168.1.5:8000/accepted-friends/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setAccepedtFriends(data);
        }
      } catch (error) {
        console.log("Error showing list friends", error);
      }
    };

    accepedtFriendsList();
  },[]);
  console.log("List friends: ", accepedtFriends);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
        {accepedtFriends.map((item, index) => (
          <UserChat key={index} item={item}/>
        ))}
      </Pressable>
    </ScrollView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})