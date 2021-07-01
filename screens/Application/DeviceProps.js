import { Route53 } from "aws-sdk";
import React, { useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Switch,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import DeviceCard from "../../components/cards/DeviceCard";
import appStyle from "../../styles/AppStyle";

// importing set schedule card from ./cards
import SetScheduleCard from "../../components/cards/SetScheduleCard";

function DeviceProps(props) {
  var deviceProperties = props.route.params.currDevice.properties;
  console.log("=====" + JSON.stringify(deviceProperties) + "======");

  return (
    <View style={appStyle.container}>
      {
        <View style={appStyle.cardContainer}>
          <View>
            <TouchableOpacity
              style={{ alignSelf: "flex-start" }}
              onPress={() => {
                props.navigation.pop();
              }}
            >
              <Icon name="arrow-back" size={35} style={{ marginBottom: 10 }} />
            </TouchableOpacity>
          </View>
          <ScrollView style={appStyle.scrollView}>
            <View style={propstyle.rowContainer}>
              <View style={propstyle.card}>
                <View style={propstyle.row}>
                  <Image source={require("../../assets/people.png")} />
                  <Text
                    style={{
                      paddingLeft: 10,
                      paddingRight: 10,
                      alignSelf: "center",
                      fontSize: 16,
                    }}
                  >
                    {props.route.params.accountName &&
                      props.route.params.accountName}
                  </Text>
                </View>
              </View>

              <View style={propstyle.devicecard}>
                <View style={appStyle.row}>
                  <Image
                    style={{ marginLeft: 10, alignSelf: "center" }}
                    source={require("../../assets/zap.png")}
                  />
                  <Text
                    style={{
                      paddingLeft: 10,
                      paddingRight: 10,
                      alignSelf: "center",
                      fontSize: 13,
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {props.route.params.deviceName}
                  </Text>
                </View>
              </View>
            </View>

            <View style={propstyle.column}>
              <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                Set Schedule
              </Text>

              <SetScheduleCard
                deviceProperties={deviceProperties[0]}
                navigation={props.route.params.navigation}
              />

              <Text style={{ marginTop: 20, fontSize: 26, fontWeight: "bold" }}>
                Set Actions
              </Text>
              <View style={[propstyle.lineContainer, { marginTop: 8 }]} />
              <View
                style={{
                  marginTop: 10,
                  paddingBottom: 0,
                  flexDirection: "row",
                  alignSelf: "stretch",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 20 }}>On/Off</Text>
                <Switch
                  style={{
                    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                  }}
                  trackColor={{ true: "#2DC62A", false: "#FF5D53" }}
                  onValueChange={(x) => {}}
                />
              </View>
              <View
                style={{
                  marginTop: 20,
                  paddingBottom: 0,
                  flexDirection: "row",
                  alignSelf: "stretch",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 20 }}>Brightness</Text>
                {/* Easy solution would be to set deviceProps readOnly to true if switched */}
                <Switch
                  style={{
                    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                  }}
                  trackColor={{ true: "#2DC62A", false: "#FF5D53" }}
                  onValueChange={(x) => {}}
                />
              </View>
              <View
                style={{
                  marginTop: 20,
                  paddingBottom: 0,
                  flexDirection: "row",
                  alignSelf: "stretch",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 20 }}>Color</Text>
                <Switch
                  style={{
                    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                  }}
                  trackColor={{ true: "#2DC62A", false: "#FF5D53" }}
                  onValueChange={(x) => {}}
                />
              </View>
              <Text style={{ marginTop: 20, fontSize: 26, fontWeight: "bold" }}>
                Set Geofencing
              </Text>
              <View style={[propstyle.lineContainer, { marginTop: 8 }]} />
              <View
                style={{
                  marginTop: 20,
                  paddingBottom: 0,
                  flexDirection: "row",
                  alignSelf: "stretch",
                  justifyContent: "space-between",
                }}
              >
                <Switch
                  style={{
                    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                  }}
                  trackColor={{ true: "#2DC62A", false: "#FF5D53" }}
                  // Kolbe api call to set gps location and set deviceProps gps_location
                  onValueChange={(x) => {}}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      }
    </View>
  );
}

const propstyle = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",

    borderRadius: 35,
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

    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 15,
    paddingBottom: 5,
    marginBottom: 5,
  },
  devicecard: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#44ABFF",

    borderRadius: 35,
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

    paddingTop: 5,
    paddingLeft: 2,
    paddingRight: 4,
    paddingBottom: 5,
    marginBottom: 5,
    marginRight: 0,
  },
  row: {
    margin: 2,
    paddingBottom: 0,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  rowContainer: {
    margin: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  column: {
    margin: 2,
    marginTop: 20,
    paddingBottom: 0,
    flexDirection: "column",
    alignSelf: "stretch",
  },
  lineContainer: {
    flex: 1,
    backgroundColor: "#333333",
    height: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
});

const mapStateToProps = (state) => {
  const { devicesData, sessionData, sharedDevicesData, sharedAccountsData } =
    state;
  return { devicesData, sessionData, sharedDevicesData, sharedAccountsData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dosomething: () => {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceProps);
