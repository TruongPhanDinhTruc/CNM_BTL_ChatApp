import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    // useEffect(() => {
    //   const checkLoginStatus = async() => {
    //     try {
    //       const token = await AsyncStorage.getItem("authToken");
        
    //     if (token) {
    //       navigation.replace("Home");
    //     } else {
          
    //     }
    //     } catch (error) {
    //       console.log("error", error);
    //     }
        
    //   };
    //   checkLoginStatus();
    // },[])
    // const handleLogin = () => {
    //     const user = {
    //         email: email,
    //         password: password,
    //     };

    //     axios
    //       .post("http://localhost:8000/login", user)
    //       .then((respone) => {
    //         // console.log(respone);
    //         const token = respone.data.token;
    //         AsyncStorage.setItem("authToken", token);

    //         navigation.replace("Tag")
    //     }).catch((error) => {
    //         if (axios.isAxiosError(error)) {
    //             // Xử lý lỗi mạng
    //             console.error("Lỗi mạng:", error.message);
    //             Alert.alert("Lỗi đăng nhập", "Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối mạng của bạn hoặc thử lại sau.");
    //           } else {
    //             // Xử lý các lỗi khác
    //             console.error("Lỗi đăng nhập:", error);
    //             Alert.alert("Lỗi đăng nhập", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    //           }
    //     })
    // }

    //Fetch
    const handleLogin = async () => {
        const user = {
          email: email,
          password: password,
        };
      
        try {
          const response = await fetch("http://192.168.1.5:8000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });
      
          const responseData = await response.json();
          const token = responseData.token;
      
          await AsyncStorage.setItem("authToken", token);
          navigation.replace("Tag");
        } catch (error) {
          console.error("Lỗi đăng nhập:", error);
          Alert.alert("Lỗi đăng nhập", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
      };
      
    
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView>
                <View style={styles.containerSign}>
                    <Text style={styles.textSign}>Sign In</Text>
                    <Text style={styles.textSignIn}>Sign In to Your Account</Text>
                </View>

                <View>
                    <View>
                        <Text style={styles.textEmail}>Email</Text>
                        <TextInput
                            style={styles.textInputEmail}
                            placeholderTextColor={"black"}
                            placeholder='Enter your Email'
                            onChangeText={(text) => setEmail(text)}
                            value={email} />
                    </View>
                    <View>
                        <Text style={styles.textEmail}>Password</Text>
                        <TextInput
                            style={styles.textInputEmail}
                            placeholderTextColor={"black"}
                            placeholder='Enter your password'
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            secureTextEntry={true} />
                    </View>

                    <Pressable onPress={() => navigation.navigate("ForgotPassword")} style={styles.btnForgotPass}>
                        <Text style={styles.textEmail}>Forgot your password</Text>
                    </Pressable>

                    <Pressable style={styles.btnLogin}
                        onPress={handleLogin}>
                        <Text style={styles.textLogin}>Login</Text>
                    </Pressable>

                    <Pressable
                        style={{ marginTop: 10 }}
                        onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.textSignUp}>Don't have an account? Sign up</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: 'center',
    },
    textSign: {
        color: "blue",
        fontSize: 17,
        fontWeight: '600'
    },
    textSignIn: {
        fontSize: 17,
        fontWeight: '600',
        marginTop: 15
    },
    containerSign: {
        marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInputEmail: {
        borderBottomColor: "gray",
        borderWidth: 1,
        marginVertical: 10,
        width: 300,
        fontSize: 18,
    },
    textEmail: {
        fontSize: 18,
        fontWeight: '600',
        color: "gray"
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
    textSignUp: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center'
    },
    btnForgotPass: {
        // justifyContent: 'flex-end',
        alignItems: 'flex-end'
    }
})