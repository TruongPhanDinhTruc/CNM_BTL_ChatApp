import { StyleSheet, Text, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useContext, useLayoutEffect } from 'react'
import axios from 'axios';
import { UserType } from '../UseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [loginUser, setLoginUser] = useState("");
    const { userId, setUserId } = useContext(UserType);

    useLayoutEffect(() => {

    }, []);

    useEffect(() => {
        const fetchLoginUser = async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                console.log('No auth token found, user not logged in.');
                return; // Exit the function if no token is found
            }
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            // console.log("userId: ", userId);

            setUserId(userId);

            axios
                .get(`http://localhost:8000/profile/${userId}`)
                .then((respone) => {
                    console.log("login user: ", respone.data);
                    setLoginUser(respone.data);
                })
                .catch((err) => {
                    console.log("Not found loggin user", err);
                });
        };

        fetchLoginUser();
    }, []);

    console.log("loggin user: ", loginUser);
    return (
        <View>
            <View style={styles.viewFriendItem}>
                <View>
                    <Image style={styles.imageAvatar} source={{ uri: loginUser.image }} />
                </View>

                <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.txtName}>{loginUser?.name}</Text>
                    <Text style={styles.txtEmail}>{loginUser?.email}</Text>
                </View>
            </View>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    imageAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover'
    },
    txtName: {
        fontWeight: 'bold',
    },
    txtEmail: {
        marginTop: 4,
        color: "gray"
    },
    viewProfile: {
        marginHorizontal: 30,
        marginVertical: 20,
    }
})