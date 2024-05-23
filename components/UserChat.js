import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UseContext';

const UserChat = ({ item }) => {
    const { userId, setUserId } = useContext(UserType);
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:8000/messages/${userId}/${item._id}`);

            const data = await response.json();

            if (response.ok) {
                setMessages(data);
            } else {
                console.log("Error showing messages: ", response.status.message);
            }
        } catch (error) {
            console.log("Error fetch message: ", error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const getLastMessage = () => {
        const userMessages = messages.filter((message) => message.messageType === "text");

        const n = userMessages.length;
        return userMessages[n - 1];
    }
    const lastMessage = getLastMessage();
    console.log("Last Messages: ", lastMessage);
    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    }
    return (
        <Pressable
            onPress={() => {
                navigation.navigate("Messages", {
                    recepientId: item._id,
                })
            }}
            style={styles.viewFriendChat}>
            <Image style={styles.imageAvatar} source={{ uri: item?.image }} />

            <View style={{ flex: 1 }}>
                <Text style={styles.txtName}>{item?.name}</Text>
                {lastMessage && (
                    <Text style={styles.txtLastMess}>{lastMessage?.message}</Text>
                )}
            </View>

            <View>
                <Text style={styles.txtLastTime}>{lastMessage && formatTime(lastMessage?.timeStamp)}</Text>

            </View>
        </Pressable>
    )
}

export default UserChat

const styles = StyleSheet.create({
    imageAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover'
    },
    viewFriendChat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 0.7,
        borderColor: "lightgray",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
    },
    txtName: {
        fontSize: 15,
        fontWeight: '500'
    },
    txtLastMess: {
        marginTop: 3,
        color: 'gray',
        fontWeight: '500',
    },
    txtLastTime: {
        fontSize: 11,
        fontWeight: '400',
        color: 'gray'
    }
})