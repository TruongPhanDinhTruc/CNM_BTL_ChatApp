import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { UserType } from '../UseContext';
import FriendRequest from '../components/FriendRequest';

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  useEffect(() => {
    fetchFriendRequest();
  }, []);

  const fetchFriendRequest = async () => {
    try {
      const respone = await axios.get(`http://192.168.1.5:8000/friend-request/${userId}`);
      if (respone.status === 200) {
        const friendRequestsData = respone.data.map((friendRequests) => ({
          _id: friendRequests._id,
          name: friendRequests.name,
          email: friendRequests.name,
          image: friendRequests.image,
        }))

        setFriendRequests(friendRequestsData);
      }
    } catch (error) {
      console.log("Error friend request ", error);
    }
  }

  console.log("Friend request: ",friendRequests);
  return (
    <View style={styles.viewFriendList}>
      {friendRequests.length > 0 && <Text>Your friend requests!</Text>}

      {friendRequests.map((item, index) => (
        // console.log("friend request");
        <FriendRequest
          key={index}
          item={item}
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
        />
      ))}
    </View>
  )
}

export default FriendsScreen

const styles = StyleSheet.create({
  viewFriendList: {
    padding: 10,
    marginHorizontal: 12
  }
})