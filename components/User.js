import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const User = ({ item }) => {
    return (
        <Pressable style={styles.viewFriendItem}>
            <View>
                <Image style={styles.imageAvatar} source={{ uri: item.image }} />
            </View>

            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.txtName}>{item?.name}</Text>
                <Text style={styles.txtEmail}>{item?.email}</Text>
            </View>

            <Pressable style={styles.btnAddFriend}>
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