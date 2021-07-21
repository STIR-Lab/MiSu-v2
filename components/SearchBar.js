import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";

import { Icon } from "react-native-elements";

function SearchBar(props) {
  const barWidth = props.screen == "Guests" ? "65%" : "100%";

  const styles = StyleSheet.create({
    container: {
      height: 50,
      width: barWidth,
      justifyContent: "center",
      paddingLeft: 20,
      borderRadius: 10,
      backgroundColor: "white",
      elevation: 5,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    icon: {
      marginLeft: -4,
    },
    formInput: {
      marginLeft: 10,
      fontSize: 18,
      width: "80%",
    },
  });

  return (
    <View style={styles.container}>
      {/* <View style={styles.iconInput}>
              <Image source={require('../../assets/icons/email-icon.png')} />
            </View> */}
      <Icon name="search" style={styles.icon} size={30} />
      <TextInput
        style={styles.formInput}
        autoCapitalize="none"
        onChangeText={(searchParam) => props.setSearchParam(searchParam)}
        placeholder={
          "Search " + (props.screen == "Guests" ? "Guests" : "Devices") + "..."
        }
        placeholderTextColor="#808080"
      ></TextInput>
    </View>
  );
}

export default SearchBar;
