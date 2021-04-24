import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Auth } from 'aws-amplify';
import appStyle from '../../styles/AppStyle';
import authStyle from '../../styles/AuthStyle';
import ConfirmCodePopup from '../../components/popup/ConfirmCodePopup';

import AnimatedMultistep from 'react-native-animated-multistep';
import Step1 from './RegisterStep1';
import Step2 from './RegisterStep2';
import RegistrationFinal from './RegistrationFinal';

const allSteps = [
  { name: 'step 1', component: Step1 },
  { name: 'step 2', component: Step2 },
  { name: 'step 3', component: RegistrationFinal },
];

export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    header: () => false,
  };
  state = {
    name: '',
    username: '',
    password: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    apartmentNo: '',
    userId: null,
    errorMessage: null,
    message: null,
    signedUp: false,
    authCode: '',
    confirmingCode: false,
    isLoading: false,
  };

  handleSignUp = async () => {
    this.setState({ errorMessage: '' });
    this.setState({ message: '' });
    this.setState({ isLoading: true });
    const { username, password, name, phone, street, city, state } = this.state;
    const passwordRegex = new RegExp(
      '^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$',
      'g'
    );
    if (this.state.name === '') this.setState({ errorMessage: 'Missing name' });
    else if (this.state.username === '')
      this.setState({ errorMessage: 'Missing email address' });
    else if (this.state.password === '')
      this.setState({ errorMessage: 'Missing password' });
    else if (passwordRegex.test(this.state.password) == false)
      this.setState({
        errorMessage:
          'Password Must contain 8 characters, a number, a symbol, an upper case letter, and a lower case letter',
      });
    else {
      console.log(username, password, name);
      const response = await Auth.signUp({
        username,
        password,
        attributes: {
          name,
          email: username,
          phone_number: '+1' + phone.replace(/\D/g, ''),
          address: street,
          'custom:city': city,
          'custom:state': state,
        },
      })
        .then((response) => {
          this.setState({
            error: null,
            userId: response.userSub,
            signedUp: true,
            message: 'A confirmation code was sent to your email! ',
          });
          this.setState({ errorMessage: '' });
          this.setState({ confirmingCode: true }); // According to Mamtaj's feedback, open confirm code popup to save user time.
          console.log('sign up successful!');
          console.log(response.userSub);
        })
        .catch((error) => {
          this.setState({ errorMessage: error.message });
          console.log('Error', error.message);
        });
    }
    this.setState({ isLoading: false });
  };

  // Verify sign up code
  confirmSignUp = async (username, authCode) => {
    this.setState({ errorMessage: '' });
    this.setState({ message: '' });
    this.setState({ confirmingCode: false });

    // Form validation
    if (username == '') {
      this.setState({ message: "Please enter the email you're verifying" });
      this.setState({ errorMessage: '' });
    } else if (authCode == '') {
      this.setState({ message: 'Please enter the code sent to your email' });
      this.setState({ errorMessage: '' });
    } else {
      this.setState({ isLoading: true });
      const user = await Auth.confirmSignUp(username, authCode)
        .then(async (user) => {
          console.log('confirmed sign up successful!');

          this.setState({ errorMessage: '' });
          this.setState({ message: 'Confirm successful, please sign in.' });
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          this.setState({ errorMessage: err.message });
          this.setState({ message: '' });
          this.setState({ isLoading: false });
        });
    }
  };

  onNext = () => {
    console.log('Next');
  };

  /* define the method to be called when you go on back step */

  onBack = () => {
    console.log('Back');
  };

  /* define the method to be called when the wizard is finished */

  finish = (finalState) => {
    this.handleSignUp();
    console.log(finalState);
  };

  render() {
    // The loading element will restrict input during networked operations
    let loadingElement = null;
    if (this.state.isLoading) {
      loadingElement = (
        <View style={[appStyle.loadingHolder]}>
          <ActivityIndicator size="large" style={[appStyle.loadingElement]} />
        </View>
      );
    }

    // The error element will be set if there is actually an error
    let errorElement = null;
    if (this.state.errorMessage) {
      errorElement = (
        <View style={authStyle.errorMessage}>
          {this.state.errorMessage && (
            <Text style={authStyle.errorMessage}>
              {this.state.errorMessage}
            </Text>
          )}
        </View>
      );
    }
    // The message element will be set if there is actually an error
    let messageElement = null;
    if (this.state.message) {
      messageElement = (
        <View style={authStyle.message}>
          {this.state.message && (
            <Text style={authStyle.message}>{this.state.message}</Text>
          )}
        </View>
      );
    }

    // The confirm code popup will appear if there is actually an error
    let confirmPopupElement = null;
    if (this.state.confirmingCode) {
      confirmPopupElement = (
        <ConfirmCodePopup
          onCancel={() => this.setState({ confirmingCode: false })}
          onSubmit={this.confirmSignUp}
          username={this.state.username}
        />
      );
    }

    return (
      <KeyboardAvoidingView
        enabled={true}
        behavior="height"
        style={authStyle.container}
      >
        <ScrollView style={authStyle.container} bounces={false}>
          {/* Render the loading element */}
          {loadingElement}

          {/* Render the Confirm Popup */}
          {confirmPopupElement}

          {/* Render the app icon */}
          <View style={authStyle.iconHolder}>
            <Image
              style={authStyle.icon}
              source={require('../../assets/MISUv2.png')}
            />
          </View>

          {/* Render the greeting */}
          <Text style={authStyle.greeting}>
            {`Create your`}
            <Text style={authStyle.appName}> {'MiSu'} </Text>
            account
          </Text>

          {/* Render the register form */}
          <View style={authStyle.authForm}>
            <AnimatedMultistep
              steps={allSteps}
              onFinish={this.finish}
              onBack={this.onBack}
              onNext={this.onNext}
              comeInOnNext="bounceInUp"
              OutOnNext="bounceOutDown"
              comeInOnBack="bounceInDown"
              OutOnBack="bounceOutUp"
            />
          </View>

          {/* Render the submit button 
          <View style={authStyle.authFormButtonHolder}>
            <TouchableOpacity
              style={authStyle.authFormButton}
              onPress={this.handleSignUp}
            >
              <Text style={{ color: '#FFF', fontWeight: '500' }}>Sign up</Text>
            </TouchableOpacity>
          </View>*/}

          {/* Render the error message */}
          {errorElement}

          {/* Render the message */}
          {messageElement}

          {/* Render the confirm code toggle */}
          <View>
            <TouchableOpacity
              style={{ alignSelf: 'center', marginTop: 16 }}
              onPress={() => {
                this.setState({ confirmingCode: true });
              }}
            >
              <Text style={{ color: '#414959', fontSize: 13 }} Password>
                Have a confirmation code?{' '}
                <Text style={{ color: '#71ccf0', fontWeight: '500' }}>
                  Confirm
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Render the register toggle */}
          <View>
            <TouchableOpacity
              style={{ alignSelf: 'center' }}
              onPress={() => this.props.navigation.navigate('Login')}
            >
              <Text style={{ color: '#414959', fontSize: 13 }} Password>
                Already have an account?{' '}
                <Text style={{ color: '#71ccf0', fontWeight: '500' }}>
                  Sign In
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
