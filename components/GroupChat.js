import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const GroupChat = ({ item }) => {
    const navigation = useNavigation();
    const members = item?.members.length;
    const groupId = item._id
    // console.log("groupId: ", groupId);
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
                <Text style={styles.txtLastMess}>last message</Text>
            </View>

            <View>
                <Text style={styles.txtLastTime}>3:00 pm</Text>

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