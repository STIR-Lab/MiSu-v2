import { Auth } from 'aws-amplify';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { currentSessionAction } from '../../redux/Action/currentSessionAction';
import appStyle from '../../styles/AppStyle';
import authStyle from '../../styles/AuthStyle';
import ConfirmCodePopup from '../../components/popup/ConfirmCodePopup';
import ForgotPasswordPopup from '../../components/popup/ForgotPasswordPopup';
import ForgotPasswordConfirmPopup from '../../components/popup/ForgotPasswordConfirmPopup';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

function LoginScreen(props) {
  // static navigationOptions = {
  //   header: () => false,
  //   /* No more header config here! */
  // };
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordState, setForgotPasswordState] = useState(false);
  const [forgotPasswordConfirmState, setForgotPasswordConfirmState] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [confirmingCode, setConfirmingCode] = useState(false);

  handleLogin = async () => {
    setErrorMessage('');

    // setUsername(username.split(" ").join(""));
    // console.log(username, "A");
    let str = username.split(" ").join("");
    // console.log(str);
    if (str === '')
      setErrorMessage('Missing email address');
    else if (password === '')
      setErrorMessage('Missing password');
    else {
      try {
        props.route.params.setLoadingTrue(true);

        const user = await Auth.signIn(str, password)
          .then(async (user) => {
            console.log('Login successful!');

            setErrorMessage('');
            // setMessage('Login successful!');
            setIsLoading(false);

            await props.getSession();

            props.route.params.setLoadingFalse(false);

            props.route.params.setGoToAppTrue(true);
            // this.props.route.params.setGoToAuthFalse();
            props.navigation.navigate('App');
          })
          .catch((err) => {
            setErrorMessage(err.message);
            setMessage('');
            setIsLoading(false);
            props.route.params.setLoadingFalse(false);
          });
      } catch (error) {
        setErrorMessage(err.message);
            setMessage('');
            setIsLoading(false);
            props.route.params.setLoadingFalse(false);
      }
      setIsLoading(false);
    }
  };

  // Verify sign up code
  confirmSignUp = async () => {
    setErrorMessage('');
    setMessage('');

    // setUsername(username.split(" ").join(""));
    //console.log(username, "A");
    let str = username.split(" ").join("");

    // console.log("Inside confirmSignUp")
    // Form validation
    if (str == '') {
      setMessage("Please enter the email you're verifying");
      setErrorMessage('');
    } else if (confirmCode == '') {
      setMessage('Please enter the code sent to your email');
      setErrorMessage('');
    } else {
      setIsLoading(true);
      const user = await Auth.confirmSignUp(str, confirmCode)
        .then(async (user) => {
          console.log('confirmed sign up successful!');

          setErrorMessage('');
          setMessage('Confirm successful, please sign in.');
          setIsLoading(false);
        })
        .catch((err) => {
          setErrorMessage(err.Message);
          setMessage('');
          setIsLoading(false);
        });
    }
    setConfirmingCode(false);
  };

  // Complete the forgot password auth
  forgotPassword = async (username) => {
    setErrorMessage('');
    setMessage('');
    setForgotPasswordState(false);

    // setUsername(username.split(" ").join(""));
    //console.log(username, "A");
    let str = username.split(" ").join("");
    // Form validation
    if (str == '') {
      setMessage('Please enter the email address of your account');
      setErrorMessage('');
    } else {
      // console.log(username);
      // console.log('-----------');
      setIsLoading(true);
      const user = await Auth.forgotPassword(str)
        .then(async (user) => {
          // console.log('forgot password request successful!');

          setErrorMessage('');
          setMessage('Request successful, check your email for further instructions.');
          setIsLoading(false);
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setMessage('');
          setIsLoading(false);
        });
      setIsLoading(false);
    }
  };

  // Complete the forgot password auth
  forgotPasswordConfirm = async () => {
    setErrorMessage('');
    setMessage('');

    console.log(
      'attempting to confirm password ' +
        username +
        ', ' +
        confirmCode +
        ', ' +
        password
    );
    // Form validation

    let str = username.split(" ").join("");;

    if (str == '') {
      setMessage('Please enter the email address of your account');
      setErrorMessage('');
    } else {
      setIsLoading(true);
      const user = await Auth.forgotPasswordSubmit(str, confirmCode, password)
        .then(async (user) => {
          console.log('forgot password successful!');

          setErrorMessage('');
          setMessage('Reset successful, login with your new credentials.');
          setIsLoading(false);
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setMessage('');
          setIsLoading(false);
        });
      setIsLoading(false);
    }
    setForgotPasswordConfirmState(false);
  };

  // console.log(this.props);
  // The loading element will restrict input during networked operations
  let loadingElement = null;
  if (isLoading) {
    loadingElement = (
      <View style={[appStyle.loadingHolder]}>
        <ActivityIndicator size="large" style={[appStyle.loadingElement]} />
      </View>
    );
  }

  // The confirm code popup will appear if there is actually an error
  let forgotPasswordPopupElement = null;
  if (forgotPasswordState) {
    forgotPasswordPopupElement = (
      <ForgotPasswordPopup
        onCancel={() => setForgotPasswordState(false)}
        onSubmit={forgotPassword}
        username={username}
      />
    );
  }

  // The confirm code popup will appear if there is actually an error
  // let forgotPasswordConfirmPopupElement = null;
  // if (forgotPasswordConfirmState) {
  //   forgotPasswordConfirmPopupElement = (
  //     <ForgotPasswordConfirmPopup
  //       onCancel={() => setForgotPasswordConfirmState(false)}
  //       onSubmit={forgotPasswordConfirm}
  //       username={username}
  //     />
  //   );
  // }

  // The message element will be set if there is actually an error
  let messageElement = null;
  if (message) {
    messageElement = (
      <View style={authStyle.message}>
        {message && (
          <Text style={authStyle.message}>{message}</Text>
        )}
      </View>
    );
  }

  // The error element will be set if there is actually an error
  let errorElement = null;
  if (errorMessage) {
    errorElement = (
      <View style={authStyle.errorMessage}>
        {errorMessage && (
          <Text style={authStyle.errorMessage}>
            {errorMessage}
          </Text>
        )}
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Render the app icon */}
        <View style={styles.iconHolder}>
          <Image
            style={styles.icon}
            source={require('../../assets/MISUv2.png')}
          />
        </View>

        {/* Render the greeting */}
        <View style={styles.firstLine}>
          <Text style={[styles.greeting]}>
            Welcome to
            <Text style={styles.appName}> MiSu</Text>
          </Text>
        </View>

        {/* Render the login form */}
        <View style={styles.authForm}>
          <View style={styles.iconAndInput}>
            <View style={styles.iconInput}>
              <Image source={require('../../assets/icons/email-icon.png')} />
            </View>
            <TextInput
              style={styles.formInput}
              autoCapitalize="none"
              onChangeText={(username) => setUsername(username)}
              value={username}
              placeholder="Email Address"
              placeholderTextColor="#808080"
            ></TextInput>
          </View>

          {!confirmingCode && (
            <View style={styles.iconAndInput}>
              <View style={styles.iconInput}>
                <Image source={require('../../assets/icons/lock.png')} />
              </View>
              <TextInput
                style={styles.formInput}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={(password) => setPassword(password)}
                value={password}
                placeholder={forgotPasswordConfirmState ? "New Password" : "Password"}
                placeholderTextColor="#808080"
              ></TextInput>
            </View>)}

          { (confirmingCode || forgotPasswordConfirmState) && (
            <View style={styles.iconAndInput}>
              <View style={styles.iconInput}>
                <Image source={require('../../assets/icons/lock.png')} />
              </View>
              <TextInput
                style={styles.formInput}
                keyboardType='numeric'
                autoCapitalize="none"
                onChangeText={(confirmCode) => setConfirmCode(confirmCode)}
                value={confirmCode}
                placeholder="Confirm Code"
                placeholderTextColor="#808080"
              ></TextInput>
           </View>)}
        </View>

        {/* Render the forgot password btn */}
        <View>
          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 0 }}
            onPress={() => {
              setForgotPasswordState(true);
            }}
          >
            <Text style={{ color: '#414959', fontSize: 13 }} Password>
              Forgot your password?{' '}
              <Text style={{ color: '#71ccf0', fontWeight: '500' }}>
                Get code
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render the submit button */}
        <View style={authStyle.authFormButtonHolder}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={confirmingCode ? confirmSignUp : (forgotPasswordConfirmState ? forgotPasswordConfirm : handleLogin)}
          >
            <Text style={{ color: '#FFF', fontSize: 25 }}>{confirmingCode ? 'Confirm' : (forgotPasswordConfirmState ? 'Reset' : 'Login')}</Text>
          </TouchableOpacity>
        </View>

        {/* Render the error message */}
        {errorElement}

        {/* Render the message */}
        {messageElement}

        {/* Render the forgot popup */}
        {forgotPasswordPopupElement}

        {/* Render the forgot confirm popup */}
        {/* {forgotPasswordConfirmPopupElement} */}

        {/* Render the register toggle */}
        <View>
          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 40 }}
            onPress={() => props.navigation.navigate('Register')}
          >
            <Text style={{ color: '#414959', fontSize: 13 }} Password>
              Need an account?{' '}
              <Text style={{ color: '#71ccf0', fontWeight: '500' }}>
                Sign up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render the confirm forgot password confirm btn */}
        <View>
          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 2 }}
            onPress={() => {
              confirmingCode ?
                setConfirmingCode(false) : setConfirmingCode(true);
              setForgotPasswordConfirmState(false);
            }}
          >
            <Text style={{ color: '#414959', fontSize: 13 }} Password>
              {confirmingCode ? 'Already Confirmed? ':'Have an Account Verification code? '}
              <Text style={{ color: '#71ccf0', fontWeight: '500' }}>
                Click Here
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 2 }}
            onPress={() => {
              forgotPasswordConfirmState ?
                setForgotPasswordConfirmState(false) : setForgotPasswordConfirmState(true);
              setConfirmingCode(false);
            }}
          >
            <Text style={{ color: '#414959', fontSize: 13 }} Password>
              {forgotPasswordConfirmState ? 'Go back to Login ':'Have a Password reset code? '}
              <Text style={{ color: '#71ccf0', fontWeight: '500' }}>
                Click Here
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render the loading element */}
        {loadingElement}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  appName: {
    fontWeight: 'bold',
  },
  authForm: {
    // backgroundColor: "green",
    height: height * 0.30,
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  firstLine:{
    // backgroundColor: "blue"
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
  },
  formInput: {
    // backgroundColor: "red",,
    fontSize: 15,
    marginLeft: 20,
    height: 50,
    width: 280,
  },
  greeting: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '100',
    marginLeft: -15,
  },
  icon: {
    height: height / 3,
    width: height / 3,
    marginBottom: -30,
    marginTop: -45,
  },
  iconInput: {
    width: 20,
    height: "80%",
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconHolder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconAndInput: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#F3F3F3',
    borderColor: '#D6D6D6',
    borderWidth: 1,
    height: height * 0.08,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: '#008CFF',
    marginTop: 20,
    borderRadius: 10,
    height: height / 15,
    width: "50%",
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 10,
    marginBottom: -10
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    getSession: () => dispatch(currentSessionAction()),
  };
};

export default connect(undefined, mapDispatchToProps)(LoginScreen);
