import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { UserType } from '../UseContext';

const User = ({ item }) => {
    const {userId, setUserId} = useContext(UserType);
    const [requestSent, setRequestSent] = useState(false);
    const sendFriendRequest = async(currentUserId, selectedUserId) => {
        try {
            const respone = await fetch("http://localhost:8000/friend-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({currentUserId, selectedUserId}),
            })

            if (respone.ok) {
                setRequestSent(true);
                console.log("request sent");
            }
        } catch (error) {
            console.log("error message", error);
        }
    };
    return (
        <Pressable style={styles.viewFriendItem}>
            <View>
                <Image style={styles.imageAvatar} source={{ uri: item.image }} />
            </View>

            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.txtName}>{item?.name}</Text>
                <Text style={styles.txtEmail}>{item?.email}</Text>
            </View>

            <Pressable onPress={() => sendFriendRequest(userId, item._id)}
            style={styles.btnAddFriend}>
                <Text style={styles.txtAdd}>Add Friend</Text>
            </Pressable>
        </Pressable>
    )
}

export default User

const styles = StyleSheet.create({
    imageAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover'
    },
    viewFriendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    btnAddFriend: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 6,
        width: 105,
    },
    txtName: {
        fontWeight: 'bold',
    },
    txtEmail: {
        marginTop: 4,
        color: "gray"
    },
    txtAdd: {
        textAlign: 'center',
        color: "white",
        fontSize: 13
    }
})