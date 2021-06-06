import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';

function SearchBar(props) {

    return (
        <View style={styles.container}>
            {/* <View style={styles.iconInput}>
              <Image source={require('../../assets/icons/email-icon.png')} />
            </View> */}
            <TextInput
              style={styles.formInput}
              autoCapitalize="none"
              onChangeText={(searchParam) => props.setSearchParam(searchParam)}
              placeholder="Search Devices..."
              placeholderTextColor="#808080"
            ></TextInput>
        </View>     
    );
}

const styles = StyleSheet.create({
    container: {
		  height: 70,
      width: '97%',
      justifyContent: 'center',
      paddingLeft: 20,
      borderRadius: 15,
      marginVertical: 10,
      marginTop: 50,
      backgroundColor: "white"
    }
  });


export default SearchBar;