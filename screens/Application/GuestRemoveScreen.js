import React, { useState, useEffect } from "react";
import {
  Button,
  Switch,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import appStyle from "../../styles/AppStyle";
import { deleteASharedAccount } from "../../services/deleteService";
import { stopSharingAction } from "../../redux/Action/stopSharing";
import LastActionCard from "../../components/cards/LastActionCard";
//Import Header Component
import Header from "../../components/app/Header.js";

const GuestRemoveScreen = (props) => {
  const [deviceList, setDeviceList] = useState(props.route.params.user.devices);
  const [removeModal, toggleRemoveModal] = useState(false);

  useEffect(() => {
    // console.log('==Guest Remove Screen== ', props);
    // console.log('==Guest Remove Screen DeviceList= ', props.route.params.user.devices);
  }, [props]);

  const stopSharing = async () => {
    props.stopSharing(
      props.route.params.user.login_credentials_id,
      props.route.params.idToken
    );
    props.navigation.pop();
  };

  const removeUserHandler = async () => {
    toggleRemoveModal(true);
  };

  let removeUserModal = (
    <Modal
      isVisible={removeModal}
      backdropColor={"#00000090"}
      hasBackdrop={true}
      backdropOpacity={10}
      onBackdropPress={() => toggleRemoveModal(false)}
    >
      <View style={styles.modalContainer}>
        <Icon type="font-awesome" name="exclamation-triangle" size={60} />
        <Text style={{ fontSize: 30, fontWeight: "bold", textAlign: "center" }}>
          Are you sure you wish to remove this user?
        </Text>
        <Text style={{ marginTop: 10, textAlign: "center", fontSize: 15 }}>
          In order for them to access the device, you will have to invite them
          again!
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => toggleRemoveModal(false)}
            style={{
              // backgroundColor: "green",
              borderWidth: 2,
              borderColor: "green",
              width: 100,
              height: 50,
              borderRadius: 10,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "green",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              CANCEL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => stopSharing()}
            style={{
              backgroundColor: "#ea5f5f",
              borderRadius: 10,
              width: 100,
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              REMOVE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={appStyle.container}>
      <View style={styles.rowInformation}>
        <View style={styles.infoLine}>
          <Text style={styles.name}>{props.route.params.user.name}</Text>
        </View>
      </View>
      <View style={{ width: "100%", maxHeight: 500 }}>
        <ScrollView>
          {deviceList.map((entry, i) => (
            <View style={styles.deviceDisplay} key={i}>
              <View style={styles.devIcon2}>
                <Icon name="lock" type="feather" size={45} />
              </View>
              <Text>{entry.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      {/* <LastActionCard screen={'GuestCard'} /> */}
      <TouchableOpacity
        style={styles.redButton}
        onPress={() => removeUserHandler()}
      >
        <Text style={styles.redButtonText}>Revoke Access</Text>
      </TouchableOpacity>
      {removeUserModal}
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalContainer: {
    padding: 12,
    flex: 0.45,
    backgroundColor: "#F1F1F1",
    borderRadius: 15,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    // alignSelf: "center",
    justifyContent: "space-between",
    paddingHorizontal: 50,
    paddingTop: 40,
  },
  rowInformation: {
    flexDirection: "row",
    height: 60,
    width: "100%",
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  infoLine: {
    flexDirection: "column",
  },
  deviceDisplay: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    height: 80,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  devIcon2: {
    height: 46,
    width: 46,
    marginHorizontal: 15,
    borderRadius: 6,
  },
  redButton: {
    backgroundColor: "#ea5f5f",
    marginTop: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: "50%",
    shadowColor: "#000",
    shadowOffset: {
      width: 20,
      height: 5,
    },
    shadowOpacity: 0.9,
    shadowRadius: 2.62,
    borderWidth: 1.4,
    borderColor: "#cc9797",
    elevation: 6,
  },
  redButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

const mapStateToProps = (state) => {
  const {
    devicesData,
    hubInfoData,
    sessionData,
    sharedAccountsData,
    StopShareState,
  } = state;
  return {
    devicesData,
    hubInfoData,
    sessionData,
    sharedAccountsData,
    StopShareState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    stopSharing: (login_id, idToken) => {
      dispatch(stopSharingAction(login_id, idToken));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GuestRemoveScreen);
