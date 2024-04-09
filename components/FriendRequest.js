import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { UserType } from '../UseContext';
import { useNavigation } from '@react-navigation/native';

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
    const {userId, setUserId} = useContext(UserType);
    const navigation = useNavigation();

    const acceptRequest = async (friendRequestsId) => {
        try {
            const respone = await fetch("http://localhost:8000/friend-request/accept", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderId: friendRequestsId,
                    recepientId: userId
                })
            });

            if (respone.ok) {
                setFriendRequests(friendRequests.filter((request) => {
                    request._id !== friendRequestsId
                }));
                navigation.navigate("Chats");
            }
        } catch (error) {
            console.log("Error accept in the friend request", error);
        }
    }
    return (
        <Pressable style={styles.viewFriendItem}>
            <Image
                style={styles.imageAvatar}
                source={{ uri: item.image }} />
            <Text style={styles.txtName}>{item?.name} sent a friend request</Text>

            <Pressable onPress={() => acceptRequest(item._id)}
                style={styles.btnAccept}>
                <Text style={styles.txtAccept}>Accept</Text>
            </Pressable>
        </Pressable>
    )
}

export default FriendRequest

const styles = StyleSheet.create({
    imageAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    btnAccept: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 6,
    },
    txtAccept: {
        textAlign: 'center',
        color: "white"
    },
    viewFriendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    txtName: {
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
        flex: 1
    }
})