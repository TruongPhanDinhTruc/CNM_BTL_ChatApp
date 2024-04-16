import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Image, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { UserType } from '../UseContext';
import UserChat from '../components/UserChat';
import UserListItem from '../components/UserListItem';

const CreateGroupScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [nameGroup, setNameGroup] = useState("");
    const [accepedtFriends, setAccepedtFriends] = useState([]);
    const [userToAdd, setUserToAdd] = useState("");
    const [selectedFriendsId, setSelectedFriendsId] = useState([userId]);

    const handleAddFriend = (userToAdd) => {
        // const userToAddId = userToAdd._id;
        setSelectedFriendsId([...selectedFriendsId, userToAdd]);
    }

    const handleCreateGroup = () => {
        const group = {
            name: nameGroup,
            members: selectedFriendsId,
        }
        axios.post("http://localhost:8000/create-group", group).then((respone) => {
            console.log(respone);
            Alert.alert(
                "Create group successfull",
            );
            setNameGroup("");
            setSelectedFriendsId([userId]);
        }).catch((error) => {
            Alert.alert(
                "Create group error",
            );
            console.log("Create group failed", error);
        })
    }

    useEffect(() => {
        const accepedtFriendsList = async () => {
            try {
                const response = await fetch(`http://localhost:8000/accepted-friends/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setAccepedtFriends(data);
                }
            } catch (error) {
                console.log("Error showing list friends", error);
            }
        };
        // handleAddFriend();
        accepedtFriendsList();
    }, []);
    console.log("List friends: ", accepedtFriends);
    console.log("addFriendId: ", selectedFriendsId);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.textEmail}>Name Group</Text>
                <TextInput
                    style={styles.textInputEmail}
                    placeholderTextColor={"black"}
                    placeholder='Enter your name group'
                    onChangeText={(text) => setNameGroup(text)}
                    value={nameGroup} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Pressable>
                    {accepedtFriends.map((item, index) => (
                        // <UserChat key={index} item={item} />
                        <UserListItem key={index} item={item} handleFunction={() => handleAddFriend(item)} />
                    ))}
                </Pressable>
            </ScrollView>

            <Pressable
                onPress={handleCreateGroup}
                style={styles.btnLogin}>
                <Text style={styles.textLogin}>Create</Text>
            </Pressable>
        </View>
    )
}

export default CreateGroupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: 'center',
    },
    textEmail: {
        fontSize: 18,
        fontWeight: '600',
        color: "gray"
    },
    textInputEmail: {
        borderBottomColor: "gray",
        borderWidth: 1,
        marginVertical: 10,
        width: 300,
        fontSize: 18,
    },
    btnLogin: {
        width: 200,
        backgroundColor: 'blue',
        padding: 15,
        marginTop: 50,
        // marginVertical: 'auto',
        marginHorizontal: 'auto',
        borderRadius: 6
    },
    textLogin: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    txtName: {
        fontSize: 15,
        fontWeight: '500'
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
    imageAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover'
    },
})