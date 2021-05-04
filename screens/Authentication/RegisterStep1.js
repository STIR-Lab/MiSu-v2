import React, { Component } from 'react';
import { Image, View, TouchableOpacity, TextInput, Text } from 'react-native';
import authStyle from '../../styles/AuthStyle';

import Icon from 'react-native-vector-icons/Feather';

class RegisterStep1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      password: '',
      passwordConfirm: '',
      totalSteps: '',
      currentStep: '',
    };
  }

  static getDerivedStateFromProps = (props) => {
    const { getTotalSteps, getCurrentStep } = props;
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep(),
    };
  };

  nextStep = () => {
    const { next, saveState } = this.props;
    if (this.state.password != this.state.passwordConfirm) this.goBack();
    // Save state for use in other steps
    saveState({
      name: this.state.name,
      username: this.state.username,
      password: this.state.password,
    });

    // Go to next step
    next();
  };

  goBack() {
    const { back } = this.props;
    // Go to previous step
    back();
  }

  render() {
    const { currentStep, totalSteps } = this.state;
    // checks the password complexity as it is being filled
    let passwordErrorElement = null;
    if (this.state.password) {
      // regex for all five complexity requirements
      let passwordPolicy = [
        RegExp('.{8,}$', 'g'),
        RegExp('[A-Z]', 'g'),
        RegExp('[a-z]', 'g'),
        RegExp('[0-9]', 'g'),
        RegExp('\\W', 'g'),
      ];
      // matching error messages
      let passwordPolicyMessages = [
        ' * Must contain atleast 8 characters',
        ' * Must contain atleast 1 upper case character',
        ' * Must contain atleast 1 lower case character',
        ' * Must contain atleast 1 number',
        ' * Must contain atleast 1 symbol',
      ];
      // empty string to hold the error messages put to the screen
      var passwordPolicyErrorString = '';

      for (var i = 0; i < passwordPolicy.length; i++) {
        if (!passwordPolicy[i].test(this.state.password)) {
          passwordPolicyErrorString += passwordPolicyMessages[i] + '\n';
        }
      }

      //console.log(passwordPolicyMessages);
      if (passwordPolicyErrorString != '')
        passwordErrorElement = (
          <Text style={{ color: 'red' }}>{passwordPolicyErrorString}</Text>
        );
    }
    return (
      <View style={authStyle.container}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 30,
            paddingLeft: 60,
            paddingTop: 10,
            paddingRight: 60,
          }}
        >
          <View style={authStyle.stepTrackerIcon}>
            <TouchableOpacity>
              <Icon name="user" size={30} color={'#008CFF'} />
              <Text style={{ color: '#008CFF' }}>Profile</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => this.props.next()}>
            <View style={authStyle.stepTrackerIcon}>
              <Icon name="file-text" size={30} />
              <Text>Contact Info</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={authStyle.stepTrackerIcon}>
              <Icon name="thumbs-up" size={30} />
              <Text>Finish</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={authStyle.authForm}>
          <TextInput
            onChangeText={(name) => this.setState({ name })}
            style={authStyle.authFormInput}
            autoCapitalize="words"
            value={this.state.name}
            placeholder={'Name'}
          />
          <TextInput
            onChangeText={(username) => this.setState({ username })}
            style={authStyle.authFormInput}
            autoCapitalize="none"
            value={this.state.username}
            placeholder={'Email Address'}
          />
          <TextInput
            onChangeText={(password) => this.setState({ password })}
            secureTextEntry
            style={authStyle.authFormInput}
            autoCapitalize="none"
            value={this.state.password}
            placeholder={'Password'}
          />
          <TextInput
            onChangeText={(passwordConfirm) =>
              this.setState({ passwordConfirm })
            }
            secureTextEntry
            style={authStyle.authFormInput}
            autoCapitalize="none"
            value={this.state.passwordConfirm}
            placeholder={'Re-Type Password'}
          />
          <View style={authStyle.passwordError}>{passwordErrorElement}</View>

          {/* Render the next button */}
          <View style={authStyle.authFormButtonHolder}>
            <TouchableOpacity
              style={authStyle.authFormButton}
              onPress={this.nextStep}
            >
              <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 24 }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default RegisterStep1;
