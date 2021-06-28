import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";

function GuestElement(props) {
  // Ugly check to determine icon off of deviceName
  const checkIcon = (deviceName) => {
    // Needed for before data is loaded
    if (deviceName == null) return;
    var dName = deviceName.toString().toLowerCase();
    if (dName.includes("bulb")) {
      return "zap";
    }
    if (dName.includes("lock")) {
      return "lock";
    }
    if (dName.includes("speaker") || dName.includes("google")) {
      return "speaker";
    }
    return "smartphone";
  };

  return (
    <View>
      <TouchableOpacity onPress={() => props.navigation.navigate("Properties")}>
        <View style={styles.iconHolder}>
          <Icon
            name={checkIcon(props.deviceName)}
            type="feather"
            color="black"
            size={30}
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.text}>{props.deviceName} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconHolder: {
    justifyContent: "center",
    borderColor: "#60b8ff",
    borderWidth: 3,
    borderRadius: 10,
    width: 70,
    height: 70,
  },
  text: {
    fontSize: 13,
    width: 70,
    color: "black",
    textAlign: "center",
  },
});

export default GuestElement;
