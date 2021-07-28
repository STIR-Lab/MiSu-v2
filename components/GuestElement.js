import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import UserAvatar from 'react-native-user-avatar';

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

  useEffect(() => {
    // console.log("Guest Element:", props.currGuest);
  });

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("Properties", {
            accObject: props.currGuest,
            deviceName: props.title,
            currDevice: {
              login_credentials_id: props.currGuest.login_credentials_id,
              entity_id: props.entityId,
              shared_device_properties_id: props.currGuest.shared_device_properties_id,
              name: props.title,
              type: props.deviceType,
              properties: props.properties
              },
            navigation: props.navigation,
            idToken: props.idToken
          })
          // console.log(props)
        }
      >
        <View style={styles.iconHolder}>
          <UserAvatar size={70} borderRadius={41} name={props.guestName} />
        </View>
      </TouchableOpacity>
      <Text style={styles.text}>{props.guestName} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconHolder: {
    justifyContent: "center",
    alignSelf: "center",
    borderColor: "#60b8ff",
    borderWidth: 0,
    borderRadius: 41,
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
