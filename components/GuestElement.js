import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

function GuestElement(props) {
  return (
    <View>
      <TouchableOpacity onPress={() => props.navigation.navigate('Properties')}>
        <View style={styles.iconHolder}></View>
      </TouchableOpacity>
      <Text style={styles.text}>{props.deviceName} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconHolder: {
    backgroundColor: 'green',
    borderRadius: 41,
    width: 70,
    height: 70,
  },
  text: {
    fontSize: 10,
    width: 70,
    color: 'blue',
    textAlign: 'center',
  },
});

export default GuestElement;
