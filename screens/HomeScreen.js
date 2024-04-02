import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { UserType } from '../UseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import User from '../components/User';

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
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          <MaterialIcons name="people-outline" size={24} color="black" />
        </View>
      )
    })
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId)

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