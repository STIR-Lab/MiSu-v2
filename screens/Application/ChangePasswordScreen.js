import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';


function ChangePasswordScreen(props) {
  

  return (
    <View>
      <Text>I am a change password screen</Text>
    </View>
  );
}


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


export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen);