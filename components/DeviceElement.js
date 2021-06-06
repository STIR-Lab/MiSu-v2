import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, TouchableWithoutFeedback } from 'react-native';


function DeviceElement(props) {

    return (
        <View>
            <View style={styles.iconHolder}></View>
            <Text style={styles.text}>{props.deviceName} </Text>
        </View>     
    );
}

const styles = StyleSheet.create({
    iconHolder: {
        borderWidth: 2,
        borderColor: "#60B8FF",
        borderRadius: 6,
        width: 70,
        height: 70
    },
    text: {
        fontSize: 10,
        width: 70,
        textAlign: "center"
    }
  });


export default DeviceElement;