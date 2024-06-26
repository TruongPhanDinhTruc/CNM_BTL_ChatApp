import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const UserListItem = ({ item, handleFunction, isSelected }) => {
    const isSelecte = isSelected.includes(item._id);
    return (
        <Pressable
            onPress={handleFunction}
            style={[{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                borderWidth: 0.7,
                borderColor: "lightgray",
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                padding: 10,
                backgroundColor: "white"
            },
            isSelecte && { backgroundColor: "#dbdbdc", borderWidth: 1, borderColor: "#cccccc",}
            ]}>
            <Image style={styles.imageAvatar} source={{ uri: item?.image }} />

            <View>
                <Text style={styles.txtName}>{item?.name}</Text>
                <Text style={styles.txtLastMess}>{item?.email}</Text>
            </View>
        </Pressable>
    )
}

export default UserListItem

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