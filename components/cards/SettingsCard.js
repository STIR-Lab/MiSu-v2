import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import { changeRole } from "../../services/creationService";

function SettingsCard(props) {
  const [isRoleVisible, setIsRoleVisible] = useState(false);
  const [accessLevel, setAccess] = useState(props.user.user_type);
  const [initialRole, setInitialRole] = useState(props.user.user_type);
  // console.log(props)
  async function handleClick() {
    if (initialRole != accessLevel) {
      await changeRole(accessLevel, props.idToken)
      .then(
        setTimeout(() => {
          props.getHub(props.idToken)
        }, 1000)
      )

      setIsRoleVisible(false);
      // console.log("HANDLE CLICK :", props);
      props.navigation.navigate("Loading");
    } else {
      setIsRoleVisible(false);
    }
  }


  let roleModal = (
    <Modal
      isVisible={isRoleVisible}
      transparent={true}
      onBackdropPress={() => setIsRoleVisible(false)}
      backdropColor={"#00000090"}
      hasBackdrop={true}
      backdropOpacity={10}
    >
      <View style={styles.modal}>
        {/* <Text>Select your new role</Text> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => setAccess(0)}>
            <View
              style={[
                styles.roleButton,
                {
                  borderWidth: accessLevel == 0 ? 1 : 0,
                  backgroundColor: accessLevel == 0 ? "#5BD3FF" : "white",
                },
              ]}
            >
              <Icon name="user" size={35} type="feather" color="#3E3E3E" />
              <Text style={{ color: "#3E3E3E" }}>Guest</Text>
            </View>
          </TouchableOpacity>

          <Text
            style={{
              alignSelf: "center",
              color: "#3E3E3E",
              fontWeight: "bold",
            }}
          >
            OR
          </Text>

          <TouchableOpacity onPress={() => setAccess(1)}>
            <View
              style={[
                styles.roleButton,
                {
                  borderWidth: accessLevel == 1 ? 1 : 0,
                  backgroundColor: accessLevel == 1 ? "#5BD3FF" : "white",
                },
              ]}
            >
              <Icon name="home" type="font-awesom" size={35} color="#3E3E3E" />
              <Text style={{ color: "#3E3E3E" }}>Owner</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleClick()}
        >
          <Text style={{ color: "#3E3E3E", fontSize: 25 }}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerLine}>
        <Text style={styles.header}>Settings</Text>
      </View>
      <TouchableOpacity
        style={styles.setting}
        onPress={() => props.navigation.navigate("ChangePassword")}
      >
        <Text style={styles.settingFont}>Change Password</Text>

        <View style={styles.icon}>
          <Icon
            type="material-icons"
            name="chevron-right"
            size={32}
            style={{}}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.setting}>
        <Text style={styles.settingFont}>Modify Geofencing Radius</Text>

        <View style={styles.icon}>
          <Icon
            type="material-icons"
            name="chevron-right"
            size={32}
            style={{}}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.setting}
        onPress={() => setIsRoleVisible(true)}
      >
        <Text style={styles.settingFont}>Modify Role</Text>
        <View style={styles.icon}>
          <Icon
            type="material-icons"
            name="chevron-right"
            size={32}
            style={{}}
          />
        </View>
      </TouchableOpacity>
      {roleModal}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.25,
    flexDirection: "column",
    width: "100%",
    paddingTop: 0,
  },
  setting: {
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 30,
    paddingLeft: 30,
    paddingTop: 5,
  },
  settingFont: {
    fontSize: 16,
  },
  icon: {
    backgroundColor: "transparent",
    flexGrow: 1,
    alignItems: "flex-end",
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
  },
  modal: {
    backgroundColor: "#F1F1F1",

    borderRadius: 10,
    width: 300,
    height: 300,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  roleButton: {
    flexDirection: "column",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20.41,
    marginHorizontal: 15,
    borderColor: "#3E3E3E",
  },
  confirmButton: {
    backgroundColor: "#5BD3FF",
    marginTop: 40,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 10,
  },
});

export default SettingsCard;
