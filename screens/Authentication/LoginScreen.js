import { Auth } from 'aws-amplify';
import React from 'react';
<<<<<<< HEAD
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, StyleSheet, } from 'react-native';
=======
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
>>>>>>> 92b8422c44bad0ad90e412a09cc60c63f7fa08d0
import { connect } from 'react-redux';
import { currentSessionAction } from '../../redux/Action/currentSessionAction';
import appStyle from '../../styles/AppStyle';
import authStyle from '../../styles/AuthStyle';
import ConfirmCodePopup from '../../components/popup/ConfirmCodePopup';
import ForgotPasswordPopup from '../../components/popup/ForgotPasswordPopup';
import ForgotPasswordConfirmPopup from '../../components/popup/ForgotPasswordConfirmPopup';
import { Keyboard } from 'react-native';

class LoginScreen extends React.Component {
<<<<<<< HEAD
	static navigationOptions = {
		header: () => false,
		/* No more header config here! */
	};
	state = {
		username: '', // 'secondary@example.com'
		password: '',
		errorMessage: null,
		message: null,
		isLoading: false,
		rememberMe: false
	};

	handleLogin = async () => {
		this.setState({ errorMessage: '' });
		const { username, password } = this.state;

		if (username === '') this.setState({ errorMessage: 'Missing email address' });
		else if (password === '') this.setState({ errorMessage: 'Missing password' });
		else {
			try {
				this.props.screenProps.setLoadingTrue();

				const user = await Auth.signIn(username, password)
					.then(async (user) => {
						console.log('Login successful!');

						this.setState({ errorMessage: '' });
						this.setState({ message: 'Login successful!' });
						this.setState({ isLoading: false });

						await this.props.getSession();

						this.props.screenProps.setLoadingFalse();

						this.props.navigation.navigate('App');
					})
					.catch((err) => {
						this.setState({ errorMessage: err.message });
						this.setState({ message: '' });
						this.setState({ isLoading: false });
						this.props.screenProps.setLoadingFalse();
					});
			} catch (error) {
				this.setState({ errorMessage: error.message });
				this.setState({ message: '' });
				this.setState({ isLoading: false });
				this.props.screenProps.setLoadingFalse();
			}
			this.setState({ isLoading: false });
		}
	};

	// Complete the forgot password auth
	forgotPassword = async (username) => {
		this.setState({ errorMessage: '' });
		this.setState({ message: '' });
		this.setState({ forgotPassword: false });

		// Form validation
		if (username == '') {
			this.setState({ message: 'Please enter the email address of your account' });
			this.setState({ errorMessage: '' });
		} else {
			console.log(username);
			console.log('-----------');
			this.setState({ isLoading: true });
			const user = await Auth.forgotPassword(username)
				.then(async (user) => {
					console.log('forgot password request successful!');

					this.setState({ errorMessage: '' });
					this.setState({ message: 'Request successful, check your email for further instructions.' });
					this.setState({ isLoading: false });
				})
				.catch((err) => {
					this.setState({ errorMessage: err.message });
					this.setState({ message: '' });
					this.setState({ isLoading: false });
				});
			this.setState({ isLoading: false });
		}
	};

	// Complete the forgot password auth
	forgotPasswordConfirm = async (username, code, password) => {
		this.setState({ errorMessage: '' });
		this.setState({ message: '' });
		this.setState({ forgotPasswordConfirm: false });

		console.log('attempting to confirm password ' + username + ', ' + code + ', ' + password);
		// Form validation
		if (username == '') {
			this.setState({ message: 'Please enter the email address of your account' });
			this.setState({ errorMessage: '' });
		} else {
			this.setState({ isLoading: true });
			const user = await Auth.forgotPasswordSubmit(username, code, password)
				.then(async (user) => {
					console.log('forgot password successful!');

					this.setState({ errorMessage: '' });
					this.setState({ message: 'Reset successful, login with your new credentials.' });
					this.setState({ isLoading: false });
				})
				.catch((err) => {
					this.setState({ errorMessage: err.message });
					this.setState({ message: '' });
					this.setState({ isLoading: false });
				});
			this.setState({ isLoading: false });
		}
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

		// The confirm code popup will appear if there is actually an error
		let forgotPasswordPopupElement = null;
		if (this.state.forgotPassword) {
			forgotPasswordPopupElement = (
				<ForgotPasswordPopup
					onCancel={() => this.setState({ forgotPassword: false })}
					onSubmit={this.forgotPassword}
					username={this.state.username}
				/>
			);
		}

		// The confirm code popup will appear if there is actually an error
		let forgotPasswordConfirmPopupElement = null;
		if (this.state.forgotPasswordConfirm) {
			forgotPasswordConfirmPopupElement = (
				<ForgotPasswordConfirmPopup
					onCancel={() => this.setState({ forgotPasswordConfirm: false })}
					onSubmit={this.forgotPasswordConfirm}
					username={this.state.username}
				/>
			);
		}

		// The message element will be set if there is actually an error
		let messageElement = null;
		if (this.state.message) {
			messageElement = (
				<View style={authStyle.message}>
					{this.state.message && <Text style={authStyle.message}>{this.state.message}</Text>}
				</View>
			);
		}

		// The error element will be set if there is actually an error
		let errorElement = null;
		if (this.state.errorMessage) {
			errorElement = (
				<View style={authStyle.errorMessage}>
					{this.state.errorMessage && <Text style={authStyle.errorMessage}>{this.state.errorMessage}</Text>}
				</View>
			);
		}

		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.container}>
					{/* Render the app icon */}
					<View style={styles.iconHolder}>
						<Image style={styles.icon} source={require('../../assets/MISU.png')} />
					</View>

					{/* Render the greeting */}
					<Text style={[styles.greeting]}>
						Welcome to
						<Text style={styles.appName}> MiSu</Text>
					</Text>

					{/* Render the login form */}
					<View style={styles.authForm}>
						<View style={styles.iconAndInput}>
							<View style={styles.iconInput}>
								<Image source={require('../../assets/icons/email-icon.png')} />
							</View>
							<TextInput
								style={styles.formInput}
								autoCapitalize="none"
								onChangeText={(username) => this.setState({ username })}
								value={this.state.username}
								placeholder="Email Address"
								placeholderTextColor = "#808080"
							></TextInput>
						</View>

						<View style={styles.iconAndInput}>
							<View style={styles.iconInput}>
								<Image source={require('../../assets/icons/lock.png')} />
							</View>
							<TextInput
								style={styles.formInput}
								secureTextEntry
								autoCapitalize="none"
								onChangeText={(password) => this.setState({ password })}
								value={this.state.password}
								placeholder="Password"
								placeholderTextColor = "#808080"
							></TextInput>
						</View>
					</View>

					{/* Render the forgot password btn */}
					<View>
						<TouchableOpacity
							style={{ alignSelf: 'center', marginTop: 0 }}
							onPress={() => {
								this.setState({ forgotPassword: true });
							}}
						>
							<Text style={{ color: '#414959', fontSize: 13 }} Password>
								Forgot your password? <Text style={{ color: '#71ccf0', fontWeight: '500' }}>Get code</Text>
							</Text>
						</TouchableOpacity>
					</View>

					{/* Render the submit button */}
					<View style={authStyle.authFormButtonHolder}>
						<TouchableOpacity style={styles.loginButton} onPress={this.handleLogin}>
							<Text style={{ color: '#FFF', fontSize: 25 }}>Login</Text>
						</TouchableOpacity>
					</View>

					{/* Render the error message */}
					{errorElement}

					{/* Render the message */}
					{messageElement}

					{/* Render the forgot popup */}
					{forgotPasswordPopupElement}

					{/* Render the forgot confirm popup */}
					{forgotPasswordConfirmPopupElement}

					{/* Render the register toggle */}
					<View>
						<TouchableOpacity
							style={{ alignSelf: 'center', marginTop: 40 }}
							onPress={() => this.props.navigation.navigate('Register')}
						>
							<Text style={{ color: '#414959', fontSize: 13 }} Password>
								Need an account? <Text style={{ color: '#71ccf0', fontWeight: '500' }}>Sign up</Text>
							</Text>
						</TouchableOpacity>
					</View>

					{/* Render the confirm forgot password confirm btn */}
					<View>
						<TouchableOpacity
							style={{ alignSelf: 'center', marginTop: 2 }}
							onPress={() => {
								this.setState({ forgotPasswordConfirm: true });
							}}
						>
							<Text style={{ color: '#414959', fontSize: 13 }} Password>
								Have a forgot password confirm code?{' '}
								<Text style={{ color: '#71ccf0', fontWeight: '500' }}>Confirm</Text>
							</Text>
						</TouchableOpacity>
					</View>

					{/* Render the loading element */}
					{loadingElement}
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	appName: {
		fontWeight: 'bold'
	},
	authForm: {
		marginTop : 60,
		marginBottom: 15,
		marginHorizontal: 30
	},
	container: {
		flex : 1,
		backgroundColor : '#FFFFFF',
		paddingTop : 60
	},
	formInput: {
		fontSize: 15,
		marginLeft: 20
	},
	greeting: {
		fontSize: 20,
		textAlign: 'center',
		fontWeight: '100',
		marginLeft: -15
	},
	icon: {
		height: 285,
		width: 285,
		marginBottom: -65,
		marginTop: -45
	},
	iconInput: {
		width: 20,
		marginLeft: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconHolder: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconAndInput: {
		flexDirection: 'row',
		borderRadius: 10,
		backgroundColor: '#F3F3F3',
		borderColor: '#D6D6D6',
		borderWidth: 1,
		height: 50,
		marginTop: 30,
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
		height: 60,
		width: 200,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
    	shadowOffset: { width: 0, height: 1 },
    	shadowOpacity: 0.8,
    	shadowRadius: 1, 
		elevation: 10
	},
  });

const mapDispatchToProps = (dispatch) => {
	return {
		getSession: () => dispatch(currentSessionAction())
	};
=======
  static navigationOptions = {
    header: () => false,
    /* No more header config here! */
  };
  state = {
    username: '', // 'secondary@example.com'
    password: '',
    errorMessage: null,
    message: null,
    isLoading: false,
    rememberMe: false,
  };

  handleLogin = async () => {
    this.setState({ errorMessage: '' });
    const { username, password } = this.state;

    if (username === '')
      this.setState({ errorMessage: 'Missing email address' });
    else if (password === '')
      this.setState({ errorMessage: 'Missing password' });
    else {
      try {
        this.props.screenProps.setLoadingTrue();

        const user = await Auth.signIn(username, password)
          .then(async (user) => {
            console.log('Login successful!');

            this.setState({ errorMessage: '' });
            this.setState({ message: 'Login successful!' });
            this.setState({ isLoading: false });

            await this.props.getSession();

            this.props.screenProps.setLoadingFalse();

            this.props.navigation.navigate('App');
          })
          .catch((err) => {
            this.setState({ errorMessage: err.message });
            this.setState({ message: '' });
            this.setState({ isLoading: false });
            this.props.screenProps.setLoadingFalse();
          });
      } catch (error) {
        this.setState({ errorMessage: error.message });
        this.setState({ message: '' });
        this.setState({ isLoading: false });
        this.props.screenProps.setLoadingFalse();
      }
      this.setState({ isLoading: false });
    }
  };

  // Complete the forgot password auth
  forgotPassword = async (username) => {
    this.setState({ errorMessage: '' });
    this.setState({ message: '' });
    this.setState({ forgotPassword: false });

    // Form validation
    if (username == '') {
      this.setState({
        message: 'Please enter the email address of your account',
      });
      this.setState({ errorMessage: '' });
    } else {
      console.log(username);
      console.log('-----------');
      this.setState({ isLoading: true });
      const user = await Auth.forgotPassword(username)
        .then(async (user) => {
          console.log('forgot password request successful!');

          this.setState({ errorMessage: '' });
          this.setState({
            message:
              'Request successful, check your email for further instructions.',
          });
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          this.setState({ errorMessage: err.message });
          this.setState({ message: '' });
          this.setState({ isLoading: false });
        });
      this.setState({ isLoading: false });
    }
  };

  // Complete the forgot password auth
  forgotPasswordConfirm = async (username, code, password) => {
    this.setState({ errorMessage: '' });
    this.setState({ message: '' });
    this.setState({ forgotPasswordConfirm: false });

    console.log(
      'attempting to confirm password ' +
        username +
        ', ' +
        code +
        ', ' +
        password
    );
    // Form validation
    if (username == '') {
      this.setState({
        message: 'Please enter the email address of your account',
      });
      this.setState({ errorMessage: '' });
    } else {
      this.setState({ isLoading: true });
      const user = await Auth.forgotPasswordSubmit(username, code, password)
        .then(async (user) => {
          console.log('forgot password successful!');

          this.setState({ errorMessage: '' });
          this.setState({
            message: 'Reset successful, login with your new credentials.',
          });
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          this.setState({ errorMessage: err.message });
          this.setState({ message: '' });
          this.setState({ isLoading: false });
        });
      this.setState({ isLoading: false });
    }
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

    // The confirm code popup will appear if there is actually an error
    let forgotPasswordPopupElement = null;
    if (this.state.forgotPassword) {
      forgotPasswordPopupElement = (
        <ForgotPasswordPopup
          onCancel={() => this.setState({ forgotPassword: false })}
          onSubmit={this.forgotPassword}
          username={this.state.username}
        />
      );
    }

    // The confirm code popup will appear if there is actually an error
    let forgotPasswordConfirmPopupElement = null;
    if (this.state.forgotPasswordConfirm) {
      forgotPasswordConfirmPopupElement = (
        <ForgotPasswordConfirmPopup
          onCancel={() => this.setState({ forgotPasswordConfirm: false })}
          onSubmit={this.forgotPasswordConfirm}
          username={this.state.username}
        />
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

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Render the app icon */}
          <View style={styles.iconHolder}>
            <Image
              style={styles.icon}
              source={require('../../assets/MISU.png')}
            />
          </View>

          {/* Render the greeting */}
          <Text style={[styles.greeting]}>
            Welcome to
            <Text style={styles.appName}> MiSu</Text>
          </Text>

          {/* Render the login form */}
          <View style={styles.authForm}>
            <View style={styles.iconAndInput}>
              <View style={styles.iconInput}>
                <Image source={require('../../assets/icons/email-icon.png')} />
              </View>
              <TextInput
                style={styles.formInput}
                autoCapitalize="none"
                onChangeText={(username) => this.setState({ username })}
                value={this.state.username}
                placeholder="Email Address"
                placeholderTextColor="#808080"
              ></TextInput>
            </View>

            <View style={styles.iconAndInput}>
              <View style={styles.iconInput}>
                <Image source={require('../../assets/icons/lock.png')} />
              </View>
              <TextInput
                style={styles.formInput}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
                placeholder="Password"
                placeholderTextColor="#808080"
              ></TextInput>
            </View>
          </View>

          {/* Render the forgot password btn */}
          <View>
            <TouchableOpacity
              style={{ alignSelf: 'center', marginTop: 0 }}
              onPress={() => {
                this.setState({ forgotPassword: true });
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
              onPress={this.handleLogin}
            >
              <Text style={{ color: '#FFF', fontSize: 25 }}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Render the error message */}
          {errorElement}

          {/* Render the message */}
          {messageElement}

          {/* Render the forgot popup */}
          {forgotPasswordPopupElement}

          {/* Render the forgot confirm popup */}
          {forgotPasswordConfirmPopupElement}

          {/* Render the register toggle */}
          <View>
            <TouchableOpacity
              style={{ alignSelf: 'center', marginTop: 40 }}
              onPress={() => this.props.navigation.navigate('Register')}
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
                this.setState({ forgotPasswordConfirm: true });
              }}
            >
              <Text style={{ color: '#414959', fontSize: 13 }} Password>
                Have a forgot password confirm code?{' '}
                <Text style={{ color: '#71ccf0', fontWeight: '500' }}>
                  Confirm
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
}

const styles = StyleSheet.create({
  appName: {
    fontWeight: 'bold',
  },
  authForm: {
    marginTop: 60,
    marginBottom: 15,
    marginHorizontal: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  formInput: {
    fontSize: 15,
    marginLeft: 20,
  },
  greeting: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '100',
    marginLeft: -15,
  },
  icon: {
    height: 285,
    width: 285,
    marginBottom: -65,
    marginTop: -45,
  },
  iconInput: {
    width: 20,
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
    height: 50,
    marginTop: 30,
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
    height: 60,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 10,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    getSession: () => dispatch(currentSessionAction()),
  };
>>>>>>> 92b8422c44bad0ad90e412a09cc60c63f7fa08d0
};

export default connect(undefined, mapDispatchToProps)(LoginScreen);
