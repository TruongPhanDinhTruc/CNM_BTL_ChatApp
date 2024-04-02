import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import axios from 'axios';

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();
  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
    }

    axios.post("http://localhost:8000/register", user).then((respone) => {
      console.log(respone);
      Alert.alert(
        "Registration successfull",
        "You have been registered successfully"
      );
      setName("");
      setEmail("");
      setPassword("");
      setImage("");
    }).catch((error) => {
      Alert.alert(
        "Registration error",
        "An error occurred while registering"
      );
      console.log("Registration failed", error);
    })
  }
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <View style={styles.containerSign}>
          <Text style={styles.textSign}>Register</Text>
          <Text style={styles.textSignIn}>Register to Your Account</Text>
        </View>

        <View>
          <View>
            <Text style={styles.textEmail}>Name</Text>
            <TextInput
              style={styles.textInputEmail}
              placeholderTextColor={"black"}
              placeholder='Enter your name'
              onChangeText={(text) => setName(text)}
              value={name} />
          </View>
          <View>
            <Text style={styles.textEmail}>Email</Text>
            <TextInput
              style={styles.textInputEmail}
              placeholderTextColor={"black"}
              placeholder='Enter your email'
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

          <View>
            <Text style={styles.textEmail}>Image</Text>
            <TextInput
              style={styles.textInputEmail}
              placeholderTextColor={"black"}
              placeholder='Enter your image'
              onChangeText={(text) => setImage(text)}
              value={image} />
          </View>

          <Pressable
            onPress={handleRegister}
            style={styles.btnLogin}>
            <Text style={styles.textLogin}>Register</Text>
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

export default RegisterScreen

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