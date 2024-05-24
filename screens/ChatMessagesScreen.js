import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { UserType } from '../UseContext';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";

const ChatMessagesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recepientData, setRecepientData] = useState();
  const { userId, setUserId } = useContext(UserType);
  const { recepientId } = route.params;
  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false })
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://192.168.1.5:8000/messages/${userId}/${recepientId}`);

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
        const response = await fetch(`http://192.168.1.5:8000/user/${recepientId}`);

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
    if (message === "") {
      setMessage("");
      fetchMessages();
      return;
    }
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

      const response = await fetch("http://192.168.1.5:8000/messages", {
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

  console.log("=================");
  console.log("Recepient Data: ", recepientData);
  console.log("Messages: ", messages);
  console.log("Selected Messages: ", selectedMessages);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={styles.viewHeader}>
          <Ionicons onPress={() => navigation.goBack()} name="arrow-back" size={24} color="black" />

          {selectedMessages.length > 0 ? (
            <View>
              <Text style={styles.txtSelectedMess}>{selectedMessages.length}</Text>
            </View>
          ) : (
            <View style={styles.viewDetailReceptient}>
              <Image style={styles.imageAvatar} source={{ uri: recepientData?.image }} />

              <Text style={styles.txtNameReceptient}>{recepientData?.name}</Text>
            </View>
          )
          }

        </View >
      ),
      headerRight: () => selectedMessages.length > 0 ? (
        <View style={styles.viewOptionSelect}>
          <Ionicons name="arrow-redo" size={24} color="black" />
          <Ionicons name="arrow-undo" size={24} color="black" />
          <FontAwesome name="star" size={24} color="black" />
          <MaterialIcons onPress={() => deleteMessages(selectedMessages)} name="delete" size={24} color="black" />
        </View>
      ) : null
    });
  }, [recepientData, selectedMessages]);

  const deleteMessages = async (messageIds) => {
    try {
      const response = await fetch("http://192.168.1.5:8000/deleteMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: messageIds })
      })

      if (response.ok) {
        setSelectedMessages((previousMessages) => previousMessages.filter((id) => !messageIds.includes(id)));

        fetchMessages();
      }else {
        console.log("Error deleting messages: ", response.status);
      }
    } catch (error) {
      console.log("Error deleting messages", error);
    }
  }

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
      handleSend("image", result.uri);
      console.log("Image assets : ", result.assets);
      // console.log("Image url: ", result.assets[0].uri);
    }
  }

  const handleSelectMessage = (message) => {
    const isSelected = selectedMessages.includes(message._id);

    if (isSelected) {
      setSelectedMessages((previousMessages) => previousMessages.filter((id) => id !== message._id));
    } else {
      setSelectedMessages((previousMessages) => [...previousMessages, message._id]);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.containChatMess}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}>
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectedMessages.includes(item._id)
            return (
              <Pressable
                onPress={() => handleSelectMessage(item)}
                key={index} style={[
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

                  isSelected && { width: "100%", backgroundColor: "#dbdbdc" }
                ]}>
                <Text style={{ fontSize: 13, textAlign: isSelected ? 'right' : 'left' }}>{item?.message}</Text>
                <Text style={styles.txtTime}>{formatTime(item.timeStamp)}</Text>
              </Pressable>
            )
          }

          if (item.messageType === "image") {
            const baseUrl = "/truc/CongNgheMoi/CNM_BTL_ChatApp/api/files/";
            const imageUrl = item.imageUrl;
            const fileName = imageUrl.split("/").pop();
            const source = { uri: baseUrl + fileName };

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

                <View>
                  <Image source={source} style={styles.imageMessage} />
                  <Text style={styles.txtTime}>{formatTime(item?.timeStamp)}</Text>
                </View>
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
        <Feather onPress={pickImage} style={{ marginLeft: 5 }} name="camera" size={24} color="black" />
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
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 7,
  },
  txtSelectedMess: {
    fontSize: 16,
    fontWeight: '500'
  },
  viewOptionSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  }
})