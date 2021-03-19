import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
import AppTitleText from '../app/AppTitleText';
import RegisterHubPopup from '../popup/RegisterHubPopup';

class AccountCard extends Component {
  // Holds all of our global variables
  state = {
    registering: false,
    registered: false,
  };

  UNSAFE_componentWillReceiveProps(props) {
    if (props.registerData.loading) {
      //close bar and show success
      this.setState({ registering: false });
    }

    if (props.registerData.error) {
      //close bar and show success
    }

    if (props.registerData.success) {
      //close bar and show success
    }
  }

  crazyCheck() {
    console.log('INTO CRAZYCHECk');

    if (typeof this.props.user.city === 'undefined') {
      console.log('Something funky');
    }
  }

  render() {
    return (
      <View style={[appStyle.card, { paddingHorizontal: 20 }]}>
        <Image
          style={[style.icon, { marginBottom: 0, marginLeft: 20 }]}
          source={require('../../assets/icons/user.png')}
        />
        {/* Show user's name */}
        <AppHeaderText style={style.name}>{this.props.user.name}</AppHeaderText>
        <AppText>{this.props.user.phone}</AppText>

        <AppText>
          {typeof this.props.user.address === ('undefined' || 'null')
            ? ''
            : this.props.user.address}
        </AppText>

        {/* Weird undefined behavior w/ city, state */}
        <AppText>
          {typeof this.props.user.city === ('undefined' || 'null')
            ? ''
            : this.props.user.city + ', '}
          {this.crazyCheck()}

          {/* propsValid(this.props.user.city) ? 'Pr' : this.props.user.city */}
          {typeof this.props.user.state !== 'string'
            ? ''
            : this.props.user.state}
        </AppText>

        {/* Show RegisterHubPopup when registering */}
        {this.state.registering == true && (
          <RegisterHubPopup
            idToken={this.props.idToken}
            edit={this.props.hub_url != ''}
            setHubInfo={this.props.setHubInfo}
            registerHub={this.props.register}
            onCancel={() => {
              this.setState({ registering: false });
            }}
          />
        )}
        {/********************************************
         *************** Show Your Hub Title ********
         ********************************************/}
        {/* Your Hub Title */}
        <View style={appStyle.row}>
          <AppTitleText style={appStyle.rowLeft}>Your Hub</AppTitleText>
        </View>
        {/********************************************
         *************** IF Has Hub Set *************
         ********************************************/}
        {/* Hub URL Text */}
        {this.props.hub_url != '' && (
          <View style={appStyle.row}>
            <AppText style={appStyle.rowLeft}>Hub URL:</AppText>
            <View style={appStyle.rowRight}>
              <AppText>{this.props.hub_url}</AppText>
            </View>
          </View>
        )}
        {/* Hub Email Text */}
        {this.props.hub_url != '' && (
          <View style={appStyle.row}>
            <AppText style={appStyle.rowLeft}>Hub Email:</AppText>
            <View style={appStyle.rowRight}>
              <AppText>{this.props.hub_email}</AppText>
            </View>
          </View>
        )}
        {/********************************************
         ************** IF No Hub Set ***************
         ********************************************/}
        {/* No Hub */}
        {this.props.hub_url == '' && (
          <View style={appStyle.row}>
            <AppText style={appStyle.rowLeft}>
              No device is registered...
            </AppText>
          </View>
        )}
        {/* Register Button */}
        {
          <TouchableOpacity
            style={appStyle.regularButton}
            onPress={this.registerHub}
          >
            {this.props.hub_url == '' && <AppText>Register my Hub </AppText>}
            {this.props.hub_url != '' && <AppText>Edit my Hub </AppText>}
          </TouchableOpacity>
        }
      </View>
    );
  }

  registerHub = () => {
    this.setState({
      registering: true,
    });
    //({}, this.props.idToken)
  };
}

const style = StyleSheet.create({
  name: {
    fontWeight: 'bold',
  },
  icon: {
    marginTop: 10,
    height: 100,
    width: 100,
  },
});

//here is  enters the state : loading : successfful etc

const propsValid = (props) =>
  Object.values(props).every((prop) => prop !== (undefined || null));

const mapStateToProps = (state) => {
  const { registerData } = state;
  return { registerData };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
//this inject the redux state into the class components
export default connect(mapStateToProps, mapDispatchToProps)(AccountCard);
