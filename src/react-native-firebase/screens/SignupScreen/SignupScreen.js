import React, { useState, useContext } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { firebase } from '../../firebase/config';
import { UserContext, UserDispatchContext } from '../../UserProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const user = useContext(UserContext);
  const setUser = useContext(UserDispatchContext);

  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  const onRegisterPress = () => {
    if (password != confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          email,
          fullName,
        };
        const usersRef = firebase.firestore().collection('users');
        usersRef.doc(uid).set(data);
        setUser(data); // add this to global state, like some sort of token
        AsyncStorage.setItem('token', uid);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps='always'
      >
        <Image
          style={styles.logo}
          source={require('../../assets/images/icon.png')}
        />
        <TextInput
          style={styles.input}
          placeholder='Full Name'
          placeholderTextColor='#aaaaaa'
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          underlineColorAndroid='transparent'
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          placeholder='E-mail'
          placeholderTextColor='#aaaaaa'
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid='transparent'
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          placeholderTextColor='#aaaaaa'
          secureTextEntry
          placeholder='Password'
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid='transparent'
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          placeholderTextColor='#aaaaaa'
          secureTextEntry
          placeholder='Confirm Password'
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid='transparent'
          autoCapitalize='none'
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}
        >
          <Text style={styles.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
