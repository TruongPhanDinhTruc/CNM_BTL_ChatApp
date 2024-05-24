import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UseContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GroupChat from '../components/GroupChat';

const GroupChatScreen = () => {
  const [groupChat, setGroupChat] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  useEffect(() => {
    const groupChatList = async () => {
      try {
        const response = await fetch(`http://192.168.1.5:8000/group-chat/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setGroupChat(data);
        }
      } catch (error) {
        console.log("Error showing list group chat", error);
      }
    };

    groupChatList();
  }, [])

  console.log("Group chat: ", groupChat);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable onPress={() => navigation.navigate("CreateGroup")} style={styles.btnCreate}>
        <Text style={styles.txtCreate}>Create Group Chat</Text>
        <FontAwesome6 name="add" size={24} color="black" />
      </Pressable>

      <Pressable>
        {groupChat.map((item, index) => (
          <GroupChat key={index} item={item}/>
        ))}
      </Pressable>
    </ScrollView>
  )
}

export default GroupChatScreen

const styles = StyleSheet.create({
  btnCreate: {
    flexDirection: 'row',
    backgroundColor: "lightgray",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
    justifyContent: 'space-around'
  },
  txtCreate: {
    fontWeight: 'bold',
    fontSize: 20
  }
})