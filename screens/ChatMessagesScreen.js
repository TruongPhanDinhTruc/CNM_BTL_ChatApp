import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [message, setMessage] = useState("");
  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  }
  return (
    <KeyboardAvoidingView style={styles.containChatMess}>
      <ScrollView>

      </ScrollView>

      <View style={styles.viewInput}>
        <Entypo onPress={handleEmojiPress} style={{ marginRight: 5 }} name="emoji-happy" size={24} color="black" />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={styles.inputTextMess}
          placeholder='Input your message' />
        <Feather style={{ marginLeft: 5 }} name="camera" size={24} color="black" />
        <Pressable style={styles.btnSend}>
          <Text style={styles.txtSend}>Send</Text>
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector style={{ height: 250 }} />
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
    marginBottom: 25
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
  }
})