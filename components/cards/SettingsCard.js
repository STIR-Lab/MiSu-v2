import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

function SettingsCard(props) {

    return (
        <View style={style.container}>
            <Text>Hello</Text>
        </View>       
    );
}

const style = StyleSheet.create({
    container: {
        flex: .25,
        flexDirection: "column",
        width: "100%"
    },
});

export default SettingsCard;