import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { connect } from "react-redux";
import AppHeaderText from "../app/AppHeaderText";
import AppText from "../app/AppText";
import Icon from "react-native-vector-icons/MaterialIcons";

function AccountCard(props) {
  // Holds all of our global variables
  const [registering, setRegistering] = useState(false);

  registerHub = () => {
    setRegistering(true);
  };

  return (
    <View style={style.container}>
      {/* Show user's name */}
      <Text style={style.name}>Profile</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 0.15,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    paddingTop: 0,
  },
  info: {
    fontSize: 17,
  },
  name: {
    fontSize: 36,
    fontWeight: "bold",
  },
  icon: {
    height: 80,
    width: 80,
    marginRight: 20,
  },
});

const mapStateToProps = (state) => {
  const { registerData } = state;
  return { registerData };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountCard);
