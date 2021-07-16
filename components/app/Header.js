import React, { setState, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Modal from "react-native-modal";
import NotificationsModal from "../modals/NotificationsModal";
import NotificationsList from "../cards/ListEntries/NotificationsList";
import { Avatar, Badge, withBadge } from "react-native-elements";
import { connect } from "react-redux";
import { getHubInfoAction } from "../../redux/Action/getHubInfoAction";
import { registerHubAction } from "../../redux/Action/registerHubAction";
import { shareAction } from "../../redux/Action/shareAction";

const Header = (props) => {
  const [toggled, setToggled] = useState(false);
  const [data, setData] = useState(["nada"]);

  async function toggleBell() {
    setToggled(!toggled);
    console.log("===== LOOK HERE  ===", props.sessionData.idToken);

    //console.log(obj);
    const state = await fetch(
      "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getshareddevices",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + props.sessionData.idToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data2) => {
        // console.log("====Before filter: ", data2);
        setData(data2.message.filter((tmp) => tmp.accepted == 0));
        // console.log("====After filter: ", data);
        //console.log("ATTEMPT 2: ", data.statusCode);
      })
      .catch((error) => {
        console.error("ERROR: ", error);
      });
  }

  let notificationsModal = (
    <Modal
      isVisible={toggled}
      onBackdropPress={toggleBell}
      backdropColor={"#00000090"}
      hasBackdrop={true}
      backdropOpacity={10}
      style={styles.modal}
    >
      <NotificationsList data={data} bearer={props.sessionData.idToken} />
    </Modal>
  );
  // console.log("Mis Props: ", props.sessionData);
  return (
    <View style={styles.header}>
      <View style={styles.image}>
        <Image
          style={styles.tinyLogo}
          source={require("../../assets/MISUv2.png")}
        />
      </View>
      <View style={styles.title}>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
      <TouchableOpacity onPress={toggleBell} style={styles.bell}>
        <Icon name="bell" size={38} color="#1a1a1a" />
      </TouchableOpacity>
      {notificationsModal}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",

    flexGrow: 1,
    height: "100%",
  },
  header: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "normal",

    backgroundColor: "transparent",
  },
  tinyLogo: {
    width: 70,
    height: 70,
  },

  image: {
    backgroundColor: "transparent",
    position: "absolute",
    zIndex: 1000,
    left: 0,
    bottom: -15,
  },
  bell: {
    position: "absolute",
    right: 10,
    top: 0,
  },
  modal: {},
});

const mapStateToProps = (state) => {
  const {
    devicesData,
    sharedAccountsData,
    sessionData,
    shareState,
    AccessState,
  } = state;
  return {
    devicesData,
    sharedAccountsData,
    sessionData,
    shareState,
    AccessState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ModifyAccess: (title, value) => {
      dispatch(ModifyAccessStateAction(title, value));
    },
    Share: (idToken, email, device, accounts, properties, options) => {
      dispatch(
        shareAction(idToken, email, device, accounts, properties, options)
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
