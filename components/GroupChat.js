import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UseContext';

const GroupChat = ({ item }) => {
    const navigation = useNavigation();
    const { userId, setUserId } = useContext(UserType);
    const [messages, setMessages] = useState([]);

    const members = item?.members.length;
    const groupId = item._id
    // console.log("groupId: ", groupId);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://192.168.1.5:8000/group-messages/${groupId}`);

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

    console.log("Messages: ", messages);
    console.log("Last Messages: ", lastMessage);

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    }

    return (
        <Pressable
            onPress={() => {
                navigation.navigate("GroupChatMessages", {
                    groupId: groupId,
                })
            }}
            style={styles.viewFriendChat}>

            <View style={{ flex: 1 }}>
                <Text style={styles.txtName}>{item?.name}</Text>
                <Text style={styles.txtLastMess}>{members} members</Text>
                {lastMessage && (
                    <Text style={styles.txtLastMess}>{lastMessage?.message}</Text>
                )}
            </View>
            {/* <View style={{ flex: 1 }}>
                <Text style={styles.txtName}>{item?.name}</Text>
                <Text style={styles.txtLastMess}>{members} members</Text>
                <Text style={styles.txtLastMess}>last message</Text>
            </View> */}

            <View>
                <Text style={styles.txtLastTime}>{lastMessage && formatTime(lastMessage?.timeStamp)}</Text>
            </View>
        </Pressable>
    )
}

export default GroupChat

const styles = StyleSheet.create({
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