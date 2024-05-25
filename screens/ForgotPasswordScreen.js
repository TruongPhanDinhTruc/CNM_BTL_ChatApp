import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'

const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [password, setPassword] = useState("");

    // const handleChangePassword = async () => {
    //     if (newPassword != password) {
    //         Alert.alert(
    //             "Enter wrong password"
    //         );
    //         setPassword("");
    //         return;
    //     }
    //     // setPassword(newPassword);
    //     const newPassword = {
    //         email: email,
    //         password: password,
    //     };

    //     try {
    //         const response = await fetch("http://192.168.1.5:8000/changePassword", {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json", // Required for JSON data
    //           },
    //           body: JSON.stringify(newPassword),
    //         });

    //         if (!response.ok) {
    //           // Handle non-2xx status codes (errors)
    //           const errorData = await response.json();
    //           throw new Error(errorData.message || "Change password failed");
    //         }

    //         const responseData = await response.json();
    //         console.log("Registration successful:", responseData);

    //         Alert.alert(
    //           "Change Password Successful"
    //         );        
    //         navigation.navigate("Login");

    //       } catch (error) {
    //         console.error("Change password failed:", error.message);
    //         Alert.alert("Change password Error", error.message || "Change password failed");
    //       }
    // };

    const handleChangePassword = async () => {
        if (newPassword != password) {
            Alert.alert(
                "Enter wrong password"
            );
            setPassword("");
            return;
        }

        // Create the newPassword object after verification
        const newPasswordObject = {
            email: email,
            password: newPassword,
        };

        try {
            const response = await fetch("http://192.168.1.5:8000/changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Required for JSON data
                },
                body: JSON.stringify(newPasswordObject),
            });

            if (response.ok) {
                Alert.alert(
                    "Change Password Successful"
                );        
                navigation.navigate("Login");
            }
            // ... rest of the code remains the same (handling response, error, etc.)
        } catch (error) {
            console.error("Change password failed:", error.message);
            Alert.alert("Change password Error", error.message || "Change password failed");
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView>
                <View style={styles.containerSign}>
                    <Text style={styles.textSignIn}>Change Your Account</Text>
                </View>

                <View>
                    <View>
                        <Text style={styles.textEmail}>Email</Text>
                        <TextInput
                            style={styles.textInputEmail}
                            placeholderTextColor={"black"}
                            placeholder='Enter your email'
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                        />
                    </View>
                    <View>
                        <Text style={styles.textEmail}>New Password</Text>
                        <TextInput
                            style={styles.textInputEmail}
                            placeholderTextColor={"black"}
                            placeholder='Enter your new password'
                            onChangeText={(text) => setNewPassword(text)}
                            value={newPassword}
                            secureTextEntry={true}
                        />
                    </View>

                    <View>
                        <Text style={styles.textEmail}>Enter the password</Text>
                        <TextInput
                            style={styles.textInputEmail}
                            placeholderTextColor={"black"}
                            placeholder='Enter your password again'
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            secureTextEntry={true} />
                    </View>

                    <Pressable
                        onPress={handleChangePassword}
                        style={styles.btnLogin}>
                        <Text style={styles.textLogin}>Change Password</Text>
                    </Pressable>

                    <Pressable
                        style={{ marginTop: 10 }}
                        onPress={() => navigation.goBack()}>
                        <Text style={styles.textSignUp}>Already have an account? Sign in</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ForgotPasswordScreen

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
    }
})