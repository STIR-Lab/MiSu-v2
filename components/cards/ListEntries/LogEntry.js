import * as React from "react";
import { TouchableOpacity, StyleSheet, View, Text, Image } from "react-native";
import { Card, Icon, Avatar } from "react-native-elements";
import appStyle from "../../../styles/AppStyle";
import LogStyle from "../../../styles/LogStyle";

const formatEntryText = (log) => {
  if (log.operation !== undefined) {
    if (log.operation === "Create")
      return (
        <Text>
          <Text
            onPress={() => {}}
            style={{ fontWeight: "bold", color: "#2393FB" }}
          >
            {log.primary_user}{" "}
          </Text>
          shared access with you
        </Text>
      );
    else if (log.operation === "Delete")
      return (
        <Text>
          <Text
            onPress={() => {}}
            style={{ fontWeight: "bold", color: "#2393FB" }}
          >
            {log.primary_user}{" "}
          </Text>
          revoked your access
        </Text>
      );
    else if (log.operation === "Ended sharing early")
      return (
        <Text>
          <Text
            onPress={() => {}}
            style={{ fontWeight: "bold", color: "#2393FB" }}
          >
            You{" "}
          </Text>
          ended sharing early
        </Text>
      );
    else if (log.operation === "Accept") {
      return (
        <Text>
          <Text
            onPress={() => {}}
            style={{ fontWeight: "bold", color: "#2393FB" }}
          >
            You{" "}
          </Text>
          accepted access
        </Text>
      );
    } else return log.operation;
  }
  return (
    <Text>
      <Text onPress={() => {}} style={{ fontWeight: "bold", color: "#2393FB" }}>
        {log.secondary_user}{" "}
      </Text>
      set the {log.property_name} property of {log.device_name} to{" "}
      {log.value == true ? "On" : log.value == false ? "Off" : log.value}
    </Text>
  );
};

const LogEntry = (props) => {
  var log = props.log;
  return (
    <View style={LogStyle.Lcard}>
      <Icon
        containerStyle={{
          alignItems: "flex-start",
          marginTop: 10,
        }}
        size={45}
        color="#7DEA7B"
        rounded
        name="unlock"
        type="antdesign"
      />

      <Text style={LogStyle.textLog}>{formatEntryText(log)}</Text>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            marginTop: -7,
            marginRight: 10,
            padding: 10,
            fontSize: 12,
            textAlign: "right",
            alignItems: "flex-end",
            flex: 1,
          }}
        >
          {log.date} - {log.time}
        </Text>
      </View>
    </View>
  );
};

export default LogEntry;
