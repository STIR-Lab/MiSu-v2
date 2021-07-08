import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { Button, Icon } from "react-native-elements";
import { connect } from "react-redux";
import { getHubInfoAction } from "../../redux/Action/getHubInfoAction";
import { registerHubAction } from "../../redux/Action/registerHubAction";
import appStyle from "../../styles/AppStyle";

function DeviceControlScreen(props) {
  const [deviceTitle, setDeviceTitle] = useState("Unknown");
  const [toggledOn, setToggle] = useState(false);

  useEffect(() => {
    console.log(props);
    fetchValues();
  }, []);

  async function fetchValues() {
    const response = await fetch(
      "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getvalues",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.route.params.bearerId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: props.route.params.device.login_credentials_id,
          device: props.route.params.device.shared_device_properties_id,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message.attributes.friendly_name != null) {
          setDeviceTitle(data.message.attributes.friendly_name);
        }

        if (data.message.state == "unlocked" || data.message.state == "on") {
          setToggle(true);
        }
      });
  }

  async function handleClick(value) {
    // Handles the action for when button is currently toggled
    if ((value == "unlock" && toggledOn) || (value == "lock" && !toggledOn)) {
      return;
    }

    await fetch(
      "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.route.params.bearerId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: props.route.params.device.login_credentials_id,
          device_id: props.route.params.device.shared_device_properties_id,
          action: value,
        }),
      }
    );
    setToggle(!toggledOn);
  }

  return (
    <View style={appStyle.container}>
      <View style={styles.appbar}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.pop();
          }}
        >
          <Icon name="arrow-left" type="feather" color="black" size={45} />
        </TouchableOpacity>
      </View>

      <View style={styles.title}>
        <Text style={{ fontSize: 23, fontWeight: "bold", color: "#353535" }}>
          {deviceTitle}
        </Text>
      </View>

      <View style={styles.card}>
        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Image source={require("../../assets/DeviceIcons/Lock.png")} />

          {toggledOn ? (
            <View style={styles.row}>
              <Icon
                name="circle"
                type="feather"
                color="red"
                size={17}
                style={{ marginRight: 5 }}
              />
              <Text style={{ color: "red", fontWeight: "bold" }}>Unlocked</Text>
            </View>
          ) : (
            <View style={styles.row}>
              <Icon
                name="circle"
                type="feather"
                color="green"
                size={17}
                style={{ marginRight: 5 }}
              />
              <Text style={{ color: "green", fontWeight: "bold" }}>Locked</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.scheduleContainer}></View>

      <View style={styles.col}>
        <Text style={{ fontSize: 23, fontWeight: "bold", color: "#353535" }}>
          Actions
        </Text>

        <View style={[styles.lineContainer, { marginTop: 10 }]} />
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <TouchableOpacity onPress={() => handleClick("lock")}>
            <View
              style={[
                styles.button,
                { backgroundColor: toggledOn == true ? "#5bd3ff" : "#f5f5f5" },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", color: "black", fontSize: 30 }}
              >
                Lock
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleClick("unlock")}>
            <View
              style={[
                styles.button,
                { backgroundColor: toggledOn == true ? "#f5f5f5" : "#5bd3ff" },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", color: "black", fontSize: 30 }}
              >
                Unlock
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "#60B8FF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    width: 160,
    height: 70,
  },
  appbar: {
    marginTop: 10,
    paddingBottom: 0,
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  title: {
    marginTop: 10,
    marginBottom: 20,
  },
  row: {
    marginTop: 10,
    flexDirection: "row",
  },
  col: {
    flexDirection: "column",
    alignSelf: "stretch",
  },
  card: {
    height: 150,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",

    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 5,
    shadowRadius: 20.41,
    borderBottomWidth: 3,
    borderBottomColor: "#a8a8a8",
    elevation: 3,
    marginBottom: 20,
  },
  scheduleContainer: {
    height: 120,
    width: 330,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",

    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 10,
    shadowRadius: 20.41,
    borderBottomWidth: 3,
    borderBottomColor: "#a8a8a8",
    elevation: 4,
    marginBottom: 20,
  },
  lineContainer: {
    backgroundColor: "#c3c3c3",
    height: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
});

export default DeviceControlScreen;
