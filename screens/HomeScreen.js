import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { UserType } from '../UseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import User from '../components/User';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={styles.headerText}>Chat App</Text>
      ),
      headerRight: () => (
        <View style={styles.headerView}>
          <Ionicons onPress={() => navigation.navigate("Chats")} name="chatbox-ellipses-outline" size={24} color="black" />
          <FontAwesome onPress={() => navigation.navigate("GroupChat")} name="group" size={24} color="black" />
          <MaterialIcons onPress={() => navigation.navigate("Friends")} name="people-outline" size={24} color="black" />
          <Pressable onPress={() => navigation.navigate("Profile")}>
            <AntDesign name="profile" size={24} color="black" />
          </Pressable>
        </View>
      )
    })
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://localhost:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((err) => {
          console.log("Error retrieving users", err);
        });
    };

    fetchUsers();
  }, []);

  console.log("users ", users);
  return (
    <View>
      <View style={{padding: 10}}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
      
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  }
})