import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { getHubInfoAction } from '../../redux/Action/getHubInfoAction';
import { registerHubAction } from '../../redux/Action/registerHubAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const windowHeight = Dimensions.get('window').height;

function HubScreen(props) {

    // console.log(props);

  const [url, setUrl] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState('');

  const handleClick = () => {
    if (
      url == '' ||
      url == null ||
      email == '' ||
      email == null ||
      password == '' ||
      password == null
    ) {
      setError('Some fields have not been completed');
      return;
    } 
        else
        {
            const state = props.register({
                hub_url: url, 
                hub_email: email,
                hub_password: password},
                props.sessionData.idToken);
            setError('It probably worked..');
        }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={style.container}>
        <Text>Register Your Hub</Text>
        <View style={style.form}>
          <TextInput
            style={style.input}
            autoCapitalize="none"
            onChangeText={(e) => setUrl(e)}
            value={url}
            placeholder="Hub URL"
            placeholderTextColor="#808080"
          ></TextInput>
          <TextInput
            style={style.input}
            autoCapitalize="none"
            onChangeText={(e) => setEmail(e)}
            value={email}
            placeholder="Hub Email"
            placeholderTextColor="#808080"
          ></TextInput>
          <TextInput
            style={style.input}
            autoCapitalize="none"
            secureTextEntry
            onChangeText={(e) => setPassword(e)}
            value={password}
            placeholder="Hub Password"
            placeholderTextColor="#808080"
          ></TextInput>
          <Text style={style.error}>{error}</Text>
        </View>
        <TouchableOpacity style={style.button} onPress={() => handleClick()}>
          <Text style={{ color: 'white' }}>Add Hub</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12.5,
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#008CFF',
    width: 158,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  error: {
    color: 'red',
  },
  form: {
    marginTop: 60,
    height: windowHeight * 0.38,
    width: '100%',
    paddingHorizontal: 25,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderColor: '#9A9A9A',
    borderWidth: 0.5,
    elevation: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
  },
});

const mapStateToProps = (state) => {
  const { hubInfoData, sessionData, sharedAccountsData, registerData } = state;
  return { hubInfoData, sessionData, sharedAccountsData, registerData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (data, idToken) => dispatch(registerHubAction(data, idToken)),
    getHub: (idToken) => dispatch(getHubInfoAction(idToken)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HubScreen);
