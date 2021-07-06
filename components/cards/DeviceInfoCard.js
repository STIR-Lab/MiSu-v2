import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Collapsible from "react-native-collapsible";
import SampleDeviceList from "../../components/cards/ListEntries/SampleDeviceList";
import LastActionCard from "../../components/cards/LastActionCard";
import { Icon } from "react-native-elements";

function DeviceInfoCard(props) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    // console.log('==DEVICE INFO CARD== ' + props.sharedAccs.devices[0].name);
  });

  const alter = () => {
    setCollapsed(!collapsed);
  };

  let list;

  if (props.type == "HubCard")
    list =
      <SampleDeviceList
        screen="Hubs"
        devices={props.devices}
        // sharedAccs={props.sharedAccs}
        navigation={props.navigation}
      />;
  else
    list = (
      <SampleDeviceList
        screen="Devices"
        // sharedAccs={props.sharedAccs} attempting to use redux instead
        navigation={props.navigation}
      />
    );

  const panel = (
    <View style={styles.container}>
      <View style={styles.header}>
        {props.type != 'HubCard' ? 
          <View style={styles.devIcon}></View> :
          <View style={styles.devIcon2}><Icon name="home" type="feather" size={45} /></View>}
        <View>
          <Text>{props.title}</Text>
        </View>
        <TouchableOpacity style={styles.dropDownButtom} onPress={alter}>
          {collapsed ? (
            <Icon name="chevron-right" type="feather" size={35} />
          ) : (
            <Icon name="chevron-down" type="feather" size={35} />
          )}
        </TouchableOpacity>
      </View>
      <Collapsible collapsed={collapsed} style={styles.expanded}>
        <View style={styles.activeGuests}>
          <Text style={styles.text}>
            {props.type == "DeviceCard" ? "Active Guests" : "Devices"}
          </Text>
        </View>
        <View style={styles.guestList}>
          {list}
        </View>
        { props.type != "HubCard" && <LastActionCard screen={props.type} />}
      </Collapsible>
    </View>
  );

  return (
    <View>
      <TouchableWithoutFeedback>{panel}</TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  activeGuests: {
    alignContent: "center",
    padding: 15,
  },
  text: {
    fontWeight: "700",
    fontSize: 18,
    color: "#404040",
  },
  container: {
    width: "100%",
    marginBottom: 15,
  },
  header: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: 80,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 6,
  },
  guestList: {
    width: "100%",
    alignItems: "center",
  },
  dropDownButtom: {
    backgroundColor: "#FFFFFF",
    position: "absolute",
    right: 0,
    borderTopRightRadius: 5,
    height: "100%",
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 0.5,
  },
  expanded: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  devIcon: {
    backgroundColor: "#EEEEEE",
    height: 46,
    width: 46,
    marginHorizontal: 15,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#60B8FF",
  },
  devIcon2: {
    height: 46,
    width: 46,
    marginHorizontal: 15,
    borderRadius: 6,
  },
});

export default DeviceInfoCard;
