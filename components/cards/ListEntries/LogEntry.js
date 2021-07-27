import * as React from "react";
import { TouchableOpacity, StyleSheet, View, Text, Image } from "react-native";
import { Card, Icon, Avatar } from "react-native-elements";
import appStyle from "../../../styles/AppStyle";
import LogStyle from "../../../styles/LogStyle";

const formatImage = (log) => {
  if (log.operation !== undefined) {
    if (log.operation === "Create")
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#7DEA7B"
          name="mail"
          type="feather"
        />
      );
    else if (log.operation === "Delete")
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#ea5f5f"
          rounded
          name="x"
          type="feather"
        />
      );
    else if (log.operation === "Ended sharing early")
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#ea5f5f"
          rounded
          name="x"
          type="feather"
        />
      );
    else if (log.operation === "Accept") {
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#7DEA7B"
          rounded
          name="check"
          type="feather"
        />
      );
    } else if (log.operation === "Decline") {
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#ea5f5f"
          rounded
          name="x"
          type="feather"
        />
      );
    } else
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#44ABFF"
          rounded
          name="calendar"
          type="feather"
        />
      );
  } else
    return (
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
    );
};

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
          has invited you to their hub
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
          accepted {log.primary_user}'s invitation
        </Text>
      );
    } else if (log.operation === "Decline") {
      return (
        <Text>
          <Text
            onPress={() => {}}
            style={{ fontWeight: "bold", color: "#2393FB" }}
          >
            You{" "}
          </Text>
          declined {log.primary_user}'s invitation
        </Text>
      );
    } else return log.operation;
  }
  return (
    <Text>
      <Text onPress={() => {}} style={{ fontWeight: "bold", color: "#2393FB" }}>
        {log.secondary_user}{" "}
      </Text>
      performed the {log.device_action} action on the {log.device_name}
      {log.value == true ? "On" : log.value == false ? "Off" : log.value}
    </Text>
  );
};

const LogEntry = (props) => {
  var log = props.log;
  return (
    <View style={LogStyle.Lcard}>
      {formatImage(log)}
      {/* {console.log(log.operation)} */}

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
