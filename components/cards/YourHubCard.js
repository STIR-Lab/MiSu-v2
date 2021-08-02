import React, { useState, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import { CardStyleInterpolators } from "react-navigation-stack";
import { deleteHub } from "../../services/creationService";
import UserAvatar from "react-native-user-avatar";
import Modal from "react-native-modal";
import { ScrollView } from "react-native";
import { deleteASharedAccount } from "../../services/deleteService";
import { updateInvitation } from "../../services/invitationService";


function YourHubCard(props) {
  const [registering, setRegistering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [IsVisibleGuests, setIsVisibleGuests] = useState(false);
  const [IsVisibleGuestsDisconnect, setIsVisibleGuestsDisconnect] =
    useState(false);
  const [hubEntryName, setHubEntryName] = useState("");
  const [selected, setSelected] = useState(null);



  useEffect(() => {
    if (props.hub_url == "") {
      setRegistering(false);
    } else {
      setRegistering(true);
    }
    // console.log(props.sharedData)
  }, [props.hub_url]);

  registerHub = () => {
    props.navigation.navigate("Hub");
    // setRegistering(true);
  };

  const openModal = () => {
    // setSelected(false);

    setIsVisible(!isVisible);
  };

  const openRemoveGuestsModal = () => {
    // setSelected(false);

    setIsVisibleGuests(!isVisible);
  };

  const openGuestDisconnectModal = (name) => {
    // setSelected(false);
    setIsVisibleGuestsDisconnect(!isVisible);
    setHubEntryName(name);
  };

  let disconnectModal = (
    <Modal
      visible={isVisible}
      transparent={true}
      onBackdropPress={() => setIsVisible(false)}
    >
      <View style={style.disconnectModal}>
        <View style={style.disconnectHeader}>
          <Text style={{ marginLeft: 10, fontSize: 20 }}>Disconnect Hub</Text>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            textAlign: "center",
            justifyContent: "center",
            marginLeft: 5,
            marginRight: 5,
          }}
        >
          Are you sure you want to disconnect your hub?
        </Text>

        <TouchableOpacity
          onPress={
            () => {
              deleteHub(props.idToken);
              setRegistering(false);
              setIsVisible(false);
            }
            //Share(idToken, guestEmail, device, shareProperties, shareOptions)
          }
        >
          <View style={style.submitButton}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 22,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Disconnect Hub
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  let guestDisconnectModal = (
    <Modal
      visible={IsVisibleGuestsDisconnect}
      transparent={true}
      onBackdropPress={() => setIsVisibleGuestsDisconnect(false)}
    >
      <View style={style.disconnectModal}>
        <View style={style.disconnectHeader}>
          <Text style={{ marginLeft: 10, fontSize: 20 }}>Disconnect from Hub</Text>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            textAlign: "center",
            justifyContent: "center",
            marginLeft: 5,
            marginRight: 5,
          }}
        >
          Are you sure you want to disconnect from {hubEntryName.sharer_name}'s hub?
        </Text>

        <TouchableOpacity
          onPress={
            () => {
              updateInvitation(
                hubEntryName.login_credentials_id,
                2,
                props.idToken
              );
              props.refreshFunc(props.idToken)
              setIsVisibleGuestsDisconnect(false);
            }
            //Share(idToken, guestEmail, device, shareProperties, shareOptions)
          }
        >
          <View style={style.submitButton}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 22,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Disconnect Hub
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  let removeGuestsModal = (
    <Modal
      visible={IsVisibleGuests}
      transparent={true}
      onBackdropPress={() => setIsVisibleGuests(false)}
    >
      <View style={style.removeGuestsModal}>
        <View style={style.disconnectHeader}>
          <Text style={{ marginLeft: 10, fontSize: 20 }}>Remove Guests</Text>
        </View>

        <View style={style.item}></View>
        <View style={{ minHeight: "25%", maxHeight: "50%", width: "100%" }}>
          <ScrollView>
            {props.sharedData != null && props.sharedData != undefined &&
              props.sharedData.map((entry, i) => (
                <View key={i} style={style.cardCon}>
                  <TouchableOpacity
                    onPress={() => {
                      console.log(entry);
                      setSelected(entry);
                    }}
                  >
                    <View
                      style={{
                        paddingLeft: 10,
                        paddingVertical: 6,
                        flexDirection: "row",
                        borderRadius: 10,
                        elevation: selected == entry ? 2 : 0,
                        backgroundColor:
                          selected == entry ? "white" : "#F1F1F1",
                      }}
                    >
                      <UserAvatar
                        size={40}
                        borderRadius={41}
                        name={entry.name}
                      />
                      <Text style={style.cardText}>{entry.name}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={style.seperator}></View>
                </View>
              ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          onPress={() => {
            let rettyVal = deleteASharedAccount(
              selected.login_credentials_id,
              props.idToken
            );
            if (rettyVal.statusCode === 200) {
              //Refresh app here
            } else if (rettyVal.statusCode === 400) {
              //Print out something went wrong''
            }
          }}
        >
          <View style={style.submitButton}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 22,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Remove Guest
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View style={style.container}>
      <View style={style.headerLine}>
        <Text style={style.header}>Your Hub</Text>

        {false && (
          <View style={style.editBox}>
            <Image
              style={style.gear}
              source={require("../../assets/icons/Setting.png")}
            />
            <Text>Edit</Text>
          </View>
        )}
      </View>

      {registering == true && props.user.user_type == 1 && (
        <View style={style.userHubInfo}>
          <View style={style.verticleColumns}>
            <View style={style.hubDisplay}>
              <Image
                style={style.raspPi}
                source={require("../../assets/icons/raspberry.png")}
              />
              <View>
                <Text style={style.hardwareType}>Raspberry Pi</Text>
                <Text style={style.softwareType}>Home Assistant</Text>
              </View>
            </View>
            <View style={style.redButtonDisconnect}>
              <TouchableOpacity onPress={() => openModal()}>
                <View>
                  <Text style={style.redButtonText}>Disconnect</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={style.verticleMiddleColumns}>
            <View style={style.hubStats}>
              <Text style={style.status}>Connected</Text>
            </View>

            <View style={style.redButton}>
              <TouchableOpacity onPress={() => openRemoveGuestsModal()}>
                <View>
                  <Text style={style.redButtonText}>Remove Guests</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {registering == false && props.user.user_type == 1 && (
        <View style={style.noHub}>
          <Text style={{ fontSize: 17 }}>No Hub Connected</Text>
          <TouchableOpacity
            style={style.connectButton}
            onPress={() => registerHub()}
          >
            <Text style={{ color: "#15A3DF" }}>Connect Hub</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView>
        {props.user.user_type == 0 && 
            props.sharedData != null && props.sharedData != undefined &&
              props.sharedData.map((entry, i) => (
              <View key={i} style={style.verticleCentralColumns}>
                <View style={style.horizonalRows}>
                  <View>
                    <Text style={style.guestHubText}>{entry.sharer_name}'s hub</Text>
                  </View>

                  <View style={style.redButton}>
                    <TouchableOpacity
                      onPress={() => {
                        setHubEntryName(entry);
                        openGuestDisconnectModal(entry);
                      }}
                    >
                      <View>
                        <Text style={style.guestRedButtonText}>
                          Disconnect
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              )        
        )}
      </ScrollView>
      {disconnectModal}
      {removeGuestsModal}
      {guestDisconnectModal}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 0.30,
    flexDirection: "column",
    borderBottomColor: "#828282",
    borderBottomWidth: 0.9,
    marginBottom: 10,
    width: "100%",
  },
  connectButton: {
    borderColor: "gray",
    borderWidth: 0,
    backgroundColor: "white",
    elevation: 10,
    margin: 10,
    height: "38%",
    width: "45%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  guestHubText: {
    marginRight: 40,
    fontSize: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    elevation: 4,
    marginRight: 13,
  },
  guestRedButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  redButtonDisconnect: {
    backgroundColor: "#ea5f5f",
    marginTop: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",

    height: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 20,
      height: 5,
    },
    shadowOpacity: 0.9,
    shadowRadius: 2.62,
    borderWidth: 1.4,
    borderColor: "#cc9797",
    paddingHorizontal: 20,
    elevation: 6,
    marginLeft: 23,
  },

  horizonalRows: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  seperator: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#888888",
  },

  verticleCentralColumns: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  redButton: {
    backgroundColor: "#ea5f5f",
    marginTop: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 20,
      height: 5,
    },
    shadowOpacity: 0.9,
    shadowRadius: 2.62,
    borderWidth: 1.4,
    borderColor: "#cc9797",
    paddingHorizontal: 20,
    elevation: 6,
  },
  raspPi: {
    height: 35,
    width: 35,
    marginRight: 5,
  },
  cardCon: {
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20,
    alignSelf: "stretch",
  },
  modal: {
    backgroundColor: "#F1F1F1",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    width: 300,
    alignSelf: "center",
    alignItems: "center",
  },
  verticleColumns: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  verticleMiddleColumns: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 30,
  },
  newColumn: {
    width: "100%",
    marginTop: 10,
  },
  userHubInfo: {
    flexDirection: "row",
    marginTop: 10,
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  hubDisplay: {
    backgroundColor: "#61B8FF",
    borderRadius: 15,
    height: "60%",
    width: "107%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  hubStats: {
    justifyContent: "center",

    height: "60%",
    marginLeft: 30,
  },
  editBox: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    right: 15,
    justifyContent: "flex-end",
    width: 40,
    height: 25,
  },
  gear: {
    height: 16,
    width: 16,
    marginRight: 5,
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
  hardwareType: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  redButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  softwareType: {
    color: "white",
    fontSize: 13,
  },
  status: {
    color: "#2DC62A",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    alignSelf: "center",
    marginLeft: 20,
  },
  noHub: {
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
  },

  disconnectModal: {
    backgroundColor: "#F1F1F1",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    margin: 5,
    width: 300,
    alignSelf: "center",
    alignItems: "center",
  },

  removeGuestsModal: {
    backgroundColor: "#F1F1F1",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    margin: 5,
    width: 300,
    alignSelf: "center",
    alignItems: "center",
  },

  disconnectHeader: {
    marginTop: 25,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  submitButton: {
    marginTop: 35,
    backgroundColor: "#289EFF",
    borderRadius: 10,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
});

{
  /* Show RegisterHubPopup when registering */
}
{
  /* {registering == true && (
            <RegisterHubPopup
            idToken={props.idToken}
            edit={props.hub_url != ''}
            setHubInfo={props.setHubInfo}
            registerHub={props.register}
            onCancel={() => {
                setRegistering(false);
            }}
            />
        )} */
}
{
  /********************************************
   *************** Show Your Hub Title ********
   ********************************************/
}
{
  /* Your Hub Title */
}
{
  /* <View style={appStyle.row}>
            <AppTitleText style={appStyle.rowLeft}>Your Hub</AppTitleText>
        </View> */
}
{
  /********************************************
   *************** IF Has Hub Set *************
   ********************************************/
}
{
  /* Hub URL Text */
}
{
  /* {props.hub_url != '' && (
            <View style={appStyle.row}>
            <AppText style={appStyle.rowLeft}>Hub URL:</AppText>
            <View style={appStyle.rowRight}>
                <AppText>{props.hub_url}</AppText>
            </View>
            </View>
        )} */
}
{
  /* Hub Email Text */
}
{
  /* {props.hub_url != '' && (
            <View style={appStyle.row}>
            <AppText style={appStyle.rowLeft}>Hub Email:</AppText>
            <View style={appStyle.rowRight}>
                <AppText>{props.hub_email}</AppText>
            </View>
            </View>
        )} */
}
{
  /********************************************
   ************** IF No Hub Set ***************
   ********************************************/
}
{
  /* No Hub */
}
{
  /* {props.hub_url == '' && (
            <View style={appStyle.row}>
            <AppText style={appStyle.rowLeft}>
                No device is registered...
            </AppText>
            </View>
        )} */
}
{
  /* Register Button */
}
{
  /* {
            <TouchableOpacity
            style={appStyle.regularButton}
            onPress={registerHub}
            >
            {props.hub_url == '' && <AppText>Register my Hub </AppText>}
            {props.hub_url != '' && <AppText>Edit my Hub </AppText>}
            </TouchableOpacity>
        } */
}

const mapStateToProps = (state) => {
  const { registerData } = state;
  return { registerData };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
//this inject the redux state into the class components
export default connect(mapStateToProps, mapDispatchToProps)(YourHubCard);
