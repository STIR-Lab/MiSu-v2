import React, { setState, useState, useEffect } from "react";
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
  const [data, setData] = useState([]);

  useEffect(() => {
    // console.log("===============HEADER STUFF=============", props);
    fetchInvitations();
  }, [props, toggled]);

  async function fetchInvitations() {
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
        if (data2 != null && data2.message != null) {
          setData(data2.message.filter((tmp) => tmp.accepted == 0));
        }
        // console.log("====After filter: ", data);
        //console.log("ATTEMPT 2: ", data.statusCode);
      })
      .catch((error) => {
        console.error("ERROR: ", error);
      });
  }

  function toggleBell() {
    setToggled(!toggled);
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
      <NotificationsList
        data={data}
        bearer={props.sessionData.idToken}
        toggle={toggleBell}
      />
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
        {props.guest ? (
          <View>
            <Icon name="bell" size={38} color="#1a1a1a" />
            <Badge
              status="error"
              containerStyle={styles.badgeStyle}
              value={data.length}
            />
          </View>
        ) : null}
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
  badgeStyle: {
    position: "absolute",
    top: -4,
    right: -4,
  },
  header: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "normal",
    color: "#242424",
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
