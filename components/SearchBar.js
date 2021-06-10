import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';

function SearchBar(props) {

    const barWidth = (props.screen == "Guests") ? "65%" : "100%";

    const styles = StyleSheet.create({
      container: {
        height: 70,
        width: barWidth,
        justifyContent: 'center',
        paddingLeft: 20,
        borderRadius: 15,
        backgroundColor: "white"
      }
    });
    
    return (
        <View style={styles.container}>
            {/* <View style={styles.iconInput}>
              <Image source={require('../../assets/icons/email-icon.png')} />
            </View> */}
            <TextInput
              style={styles.formInput}
              autoCapitalize="none"
              onChangeText={(searchParam) => props.setSearchParam(searchParam)}
              placeholder={"Search " + (props.screen == "Guests" ? "Guests" : "Devices") + "..."}
              placeholderTextColor="#808080"
            ></TextInput>
        </View>     
    );
}




export default SearchBar;