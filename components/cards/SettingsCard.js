import React, { useState, useCallback } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Slider,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import { changeRole, changeRadius } from "../../services/creationService";

function SettingsCard(props) {
  const [isDistanceVisible, setIsDistanceVisible] = useState(false);
  const [isRoleVisible, setIsRoleVisible] = useState(false);
  const [accessLevel, setAccess] = useState(props.user.user_type);
  const [initialRole, setInitialRole] = useState(props.user.user_type);
  const [sliderValue, setSliderValue] = useState(props.user.geofencing_range);
  // ===========================================================================
  async function handleClick() {
    if (initialRole != accessLevel) {
      await changeRole(accessLevel, props.idToken).then(
        setTimeout(() => {
          props.getHub(props.idToken);
        }, 1500)
      );
      setIsRoleVisible(false);
      // console.log("HANDLE CLICK :", props);
      props.navigation.navigate("Loading");
    } else {
      setIsRoleVisible(false);
    }
  }
  // ===========================================================================
  async function handleRadius() {
    var radius = sliderValue;

    if (radius == 0) {
      radius = 1;
    }

    await changeRadius(props.idToken, radius).then((e) => console.log(e));

    setIsDistanceVisible(false);
  }
  // =============================================================================
  let radiusModal = (
    <Modal
      isVisible={isDistanceVisible}
      transparent={true}
      onBackdropPress={() => setIsDistanceVisible(false)}
      backdropColor={"#00000090"}
      hasBackdrop={true}
      backdropOpacity={10}
    >
      <View style={styles.modal}>
        <Text style={styles.radiusTitle}>Set Geofencing Radius</Text>

        <View style={styles.sliderContainer}>
          <Slider
            thumbTintColor={"#44ABFF"}
            minimumTrackTintColor={"#5BD3FF"}
            value={sliderValue}
            style={styles.slider}
            step={5}
            minimumValue={0}
            maximumValue={20}
            onValueChange={(e) => setSliderValue(e)}
          ></Slider>
        </View>

        <View>
          <Text style={styles.miles}>
            {sliderValue == 0 ? "1 miles" : sliderValue + " miles"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleRadius()}
        >
          <Text style={{ color: "#FEFEFE", fontSize: 25 }}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

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
                  backgroundColor: accessLevel == 0 ? "#44ABFF" : "white",
                  elevation: accessLevel == 0 ? 7 : 0,
                },
              ]}
            >
              <Icon
                name="user"
                size={35}
                type="feather"
                color={accessLevel == 0 ? "white" : "#3E3E3E"}
              />
              <Text style={{ color: accessLevel == 0 ? "white" : "#3E3E3E" }}>
                Guest
              </Text>
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
                  backgroundColor: accessLevel == 1 ? "#44ABFF" : "white",
                  elevation: accessLevel == 1 ? 7 : 0,
                },
              ]}
            >
              <Icon
                name="home"
                type="font-awesom"
                size={35}
                color={accessLevel == 1 ? "white" : "#3E3E3E"}
              />
              <Text style={{ color: accessLevel == 1 ? "white" : "#3E3E3E" }}>
                Owner
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleClick()}
        >
          <Text style={{ color: "#FEFEFE", fontSize: 25 }}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerLine}>
        <Text style={styles.header}>Settings</Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => setIsDistanceVisible(true)}
          style={styles.setting}
        >
          <Text style={styles.settingFont}>Modify Geofencing Radius</Text>

          <View style={styles.icon}>
            <Icon
              type="material-icons"
              name="chevron-right"
              size={32}
              style={{}}
            />
          </View>
        </TouchableOpacity>
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
      </View>
      {roleModal}
      {radiusModal}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
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
    height: 50,
  },
  slider: {
    width: 200,
  },
  radiusTitle: {
    fontSize: 25,
    marginBottom: 50,
  },
  miles: {
    fontSize: 20,
    marginTop: 20,
  },
});

export default SettingsCard;
