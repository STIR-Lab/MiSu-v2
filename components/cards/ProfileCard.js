import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import UserAvatar from "react-native-user-avatar";

function ProfileCard(props) {
  return (
    <View style={style.container}>
      <View style={style.headerLine}>
        <Text style={style.header}>Account</Text>
      </View>
      <View style={style.rowInformation}>
        <View style={style.profileIcon}>
          <UserAvatar size={70} borderRadius={41} name={props.user.name} />
        </View>
        <View style={style.infoLine}>
          <Text style={style.name}>
            {props.user.name} {props.user.lastName}{" "}
          </Text>
          <Text style={style.info}>{props.user.email}</Text>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 0.35,
    width: "100%",
    flexDirection: "column",
    borderBottomColor: "#828282",
    borderBottomWidth: 0.9,
    marginBottom: 10,
  },
  editBox: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    right: 15,
    justifyContent: "flex-end",
    width: 50,
    height: 25,
  },
  gear: {
    height: 16,
    width: 16,
    marginRight: 5,
  },
  profileIcon: {
    
    marginTop: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 8,
  },
  header: {
    color: "gray",
    fontSize: 22,
    paddingLeft: 12,
    fontWeight: "bold",
  },
  headerLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  subHeader: {
    fontWeight: "bold",
    fontSize: 15,
    width: 100,
    paddingLeft: 15,
  },
  rowInformation: {
    flexDirection: "row",
    marginLeft: 15,
    marginTop: 15,
  },
  info: {
    marginLeft: 10,
    fontSize: 15.5,
  },
  infoLine: {
    width: "75%",
    flexDirection: "column",
    marginLeft: 15,
    marginVertical: 7,
    marginBottom: 5,
  },
});

export default ProfileCard;
