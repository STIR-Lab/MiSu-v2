import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, TouchableWithoutFeedback } from 'react-native';
import { Icon } from "react-native-elements";

function DeviceElement(props) {

    return (
        <View>
            <View style={styles.iconHolder}>
                {props.type == "lock" ? 
                    <Icon name="lock" type="simple-line-icon" size={45} /> :
                    <View/>}
            </View>
            <Text style={styles.text}>{props.name} </Text>
        </View>     
    );
}

const styles = StyleSheet.create({
    iconHolder: {
        borderWidth: 2,
        borderColor: "#60B8FF",
        justifyContent: "center",
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