import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UseContext';

const User = ({ item }) => {
    const { userId, setUserId } = useContext(UserType);
    const [requestSent, setRequestSent] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const respone = await fetch(`http://localhost:8000/friend-requests/sent/${userId}`);

                const data = await respone.json();
                // console.log("Data: ", data);
                if (respone.ok) {
                    setFriendRequests(data);
                } else {
                    console.log("Error: ", respone.status);
                }
            } catch (error) {
                console.log("Error message: ", error);
            }
        };

        fetchFriendRequests();
    }, []);

    useEffect(() => {
        const fetchUserFriends = async () => {
            try {
                const respone = await fetch(`http://localhost:8000/friends/${userId}`);

                const data = await respone.json();
                if (respone.ok) {
                    setUserFriends(data);
                } else {
                    console.log("Error: ", respone.status);
                }
            } catch (error) {
                console.log("Error: ", error);
            }
        }
        fetchUserFriends();
    }, [])

    const sendFriendRequest = async (currentUserId, selectedUserId) => {
        try {
            const respone = await fetch("http://localhost:8000/friend-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentUserId, selectedUserId }),
            });
            console.log("sendFriendRequest");
            if (respone.ok) {
                setRequestSent(true);
                console.log("request sent");
            }
        } catch (error) {
            console.log("error message", error);
        }
    };

    console.log("Friends request: ", friendRequests);
    console.log("User friends: ", userFriends);

    return (
        <Pressable style={styles.viewFriendItem}>
            <View>
                <Image style={styles.imageAvatar} source={{ uri: item.image }} />
            </View>

            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.txtName}>{item?.name}</Text>
                <Text style={styles.txtEmail}>{item?.email}</Text>
            </View>

            {userFriends.includes(item._id) ? (
                <Pressable style={styles.btnFriend}>
                    <Text style={styles.txtAdd}>Friends</Text>
                </Pressable>
            ) : requestSent || friendRequests.some((friend) => friend._id === item._id) ? (
                <Pressable style={styles.btnSendFriend}>
                    <Text style={styles.txtAdd}>Request send</Text>
                </Pressable>
            ) : (
                <Pressable onPress={() => sendFriendRequest(userId, item._id)}
                    style={styles.btnAddFriend}>
                    <Text style={styles.txtAdd}>Add Friend</Text>
                </Pressable>
            )}

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
    },
    btnFriend: {
        backgroundColor: "lightgreen",
        padding: 10,
        borderRadius: 6,
        width: 105,
    },
    btnSendFriend: {
        backgroundColor: "gray",
        padding: 10,
        borderRadius: 6,
        width: 105,
    }
})