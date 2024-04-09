import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { UserType } from '../UseContext';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ChatMessagesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recepientData, setRecepientData] = useState();
  const { userId, setUserId } = useContext(UserType);
  const { recepientId } = route.params;
  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8000/messages/${userId}/${recepientId}`);

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

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/${recepientId}`);

        const data = await response.json();
        // console.log("Data: ",response);
        setRecepientData(data);
      } catch (error) {
        console.log("Error retrieving details: ", error);
      }
    };

    fetchRecepientData();
  }, []);
  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);

      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg"
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);

      }

      const response = await fetch("http://localhost:8000/messages", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("");
        setSelectedImage("");

        fetchMessages();
      }
    } catch (error) {
      console.log("Error send message: ", error);
    }
  };

  console.log("Recepient Data: ", recepientData);
  console.log("=================");
  console.log("Messages: ", messages);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={styles.viewHeader}>
          <Ionicons onPress={() => navigation.goBack()} name="arrow-back" size={24} color="black" />

          <View style={styles.viewDetailReceptient}>
            <Image style={styles.imageAvatar} source={{ uri: recepientData?.image }} />

            <Text style={styles.txtNameReceptient}>{recepientData?.name}</Text>
          </View>
        </View>
      )
    })
  }, [recepientData]);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  }

  return (
    <KeyboardAvoidingView style={styles.containChatMess}>
      <ScrollView>
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            return (
              <Pressable key={index} style={[
                item?.senderId?._id === userId ? {
                  alignSelf: 'flex-end',
                  backgroundColor: '#44d8f8',
                  padding: 8,
                  maxWidth: '60%',
                  margin: 10,
                  borderRadius: 7,
                } : {
                  alignSelf: 'flex-start',
                  backgroundColor: 'lightgray',
                  padding: 8,
                  margin: 10,
                  borderRadius: 7,
                  maxWidth: '60%'
                },
              ]}>
                <Text style={styles.txtChat}>{item?.message}</Text>
                <Text style={styles.txtTime}>{formatTime(item.timeStamp)}</Text>
              </Pressable>
            )
          }
        })}
      </ScrollView>

      <View style={styles.viewInput}>
        <Entypo onPress={handleEmojiPress} style={{ marginRight: 5 }} name="emoji-happy" size={24} color="black" />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={styles.inputTextMess}
          placeholder='Input your message' />
        <Feather style={{ marginLeft: 5 }} name="camera" size={24} color="black" />
        <Pressable
          onPress={() => handleSend("")}
          style={styles.btnSend}>
          <Text style={styles.txtSend}>Send</Text>
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 250 }} />
      )}
    </KeyboardAvoidingView>
  )
}

export default ChatMessagesScreen

const styles = StyleSheet.create({
  containChatMess: {
    flex: 1,
    backgroundColor: 'white'
  },
  inputTextMess: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 10
  },
  viewInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'black',
    marginBottom: 25,
  },
  txtSend: {
    fontWeight: 'bold',
    color: 'white'
  },
  btnSend: {
    backgroundColor: "blue",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
  imageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'cover'
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  viewDetailReceptient: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtNameReceptient: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: 'bold'
  },
  txtChat: {
    fontSize: 13,
    color: 'black',
    textAlign: 'left'
  },
  txtTime: {
    textAlign: 'right',
    fontSize: 9,
    color: 'black',
    marginTop: 5
  }
})