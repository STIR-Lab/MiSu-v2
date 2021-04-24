import React, { Component, useState } from 'react';
import { Image, View, TouchableOpacity, TextInput, Text } from 'react-native';
import authStyle from '../../styles/AuthStyle';

import { Picker } from '@react-native-picker/picker'; // likely remove

function RegisterStep3(props) {
  console.log(props);

  return (
    <View style={authStyle.authForm}>
      <View>
        <Text>{`Step ${props.getCurrentStep()} of ${props.getTotalSteps()}`}</Text>
      </View>
    </View>
  );
}

export default RegisterStep3;
