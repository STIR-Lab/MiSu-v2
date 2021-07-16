import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { shareAction } from '../../../redux/Action/shareAction';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  maxHeight,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import DeviceElement from '../../DeviceElement';
import GuestElement from '../../GuestElement';

import { createADevice, createProperty } from '../../../services/creationService';

function SampleDeviceList(props) {
  // Will indicate whether this component is rendered in the devices or the guests screen
  const [screen, setScreen] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisibleDevices, setIsVisibleDevices] = useState(false);
  const [selected, setSelected] = useState(null);
  const [sharedAccs, setSharedAccs] = useState(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [deviceList, setDeviceList] = useState(props.devices);
  const [tempDevices, setTempDevices] = useState(props.myDevices);
  const [choice, setChoice] = useState(null);
  // var tempDevices = [
  //   {
  //     id: 1,
  //     name: "Schlage Smart Lock",
  //   },
  // ];

  useEffect(() => {
    // console.log("==SAMPLE DEVICE LIST USER:", props.user);
    // console.log("===DEVICES: ", props.devices);
    // console.log("===MY DEVICES: ", props.myDevices);
    // console.log("===Bearer ID:", props.sessionData.idToken);

    if (props.screen == 'Guests') {
      setScreen('Guests');
      setChoice(props.myDevices[0]);
      if (props.user.guest_email != null) {
        setGuestEmail(props.user.guest_email);
      }
    } else if (props.screen == 'Devices') setScreen('Devices');
    else if (props.screen == 'Hubs') {
      setScreen('Hubs');
      // console.log("====== HUB SAMPLE DEVICE LIST", props);
    } else console.log('Invalid screen prop passed.');
  });

  const openModal = () => {
    // setSelected(false);
    setIsVisible(!isVisible);
  };

  const openModalDevices = () => {
    setIsVisibleDevices(!isVisibleDevices);
  };

  const handleClick = () => {
    setIsVisible(false);
    setIsVisible2(true);
  };

  function getType(stringToParse) {
    const tmp = stringToParse.split('.');
    return tmp[0];
  }

  const propsClick = () => {
    if (selected == null) {
      console.log('Selected cannot be null');
      return;
    }
    props.navigation.navigate('Properties', {
      account: selected,
    });
  };

  const shareDevice = () => {
    console.log('tes');
  };

  function addButton() {
    return (
      <View style={styles.iconAndName}>
        <TouchableOpacity
          onPress={() =>
            screen == 'Devices' ? openModal() : openModalDevices()
          }
          style={screen == 'Devices' ? styles.addGuest : styles.addDevice}
        >
          <Icon name="plus" type="font-awesome" color="#FFFFFF" size={38} />
        </TouchableOpacity>
        <Text>{screen == 'Devices' ? 'Add Guest' : 'Add Device'}</Text>
      </View>
    );
  }

  

  let modal = (
    <Modal
      visible={isVisible}
      transparent={true}
      onBackdropPress={() => setIsVisible(false)}
    >
      <View style={styles.modal}>
        <View style={styles.topGuestModal}>
          <Icon name="users" type="feather" color="black" />
          <Text style={{ marginLeft: 10, fontSize: 20 }}>Add Guest</Text>
        </View>

        {props.sharedAccountsData.sharedAccounts &&
          props.sharedAccountsData.sharedAccounts.map((entry, i) => (
            <View key={i} style={styles.cardCon}>
              <TouchableOpacity onPress={() => setSelected(entry)}>
                <View
                  style={{
                    paddingLeft: 10,
                    paddingVertical: 6,
                    flexDirection: 'row',
                    borderRadius: 10,
                    elevation: selected == entry ? 2 : 0,
                    backgroundColor: selected == entry ? 'white' : '#F1F1F1',
                  }}
                >
                  <Image source={require('../../../assets/people.png')} />
                  <Text style={styles.cardText}>{entry.name}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.seperator}></View>
            </View>
          ))}

        <View style={styles.cardCon}>
          <TouchableOpacity onPress={() => handleClick()}>
            <View style={styles.iconCon}>
              <Icon
                reverse
                name="plus"
                type="font-awesome"
                color="#57E455"
                size={18}
              />
              <Text
                style={{ fontSize: 16, alignSelf: 'center', marginLeft: 20 }}
              >
                Add New Guest
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginBottom: 30, justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={() => propsClick()}>
            <View
              style={{
                marginTop: 35,
                backgroundColor: '#289EFF',
                borderRadius: 10,
                width: 150,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                Add Guest
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // let modalDevices = (
  //   <Modal
  //     visible={isVisibleDevices}
  //     transparent={true}
  //     onBackdropPress={() => setIsVisibleDevices(false)}
  //   >
  //     <View style={styles.modal}>
  //       <View style={styles.topGuestModal}>
  //         <Icon name="codesandbox" type="feather" color="black" />
  //         <Text style={{ marginLeft: 10, fontSize: 20 }}>Add Device</Text>
  //       </View>
  //       <View style={{ minHeight: "25%", maxHeight: "50%", width: "100%" }}>
  //         <ScrollView>
  //           {props.sharedAccountsData.sharedAccounts &&
  //             props.sharedAccountsData.sharedAccounts.map((entry, i) => (
  //               <View key={i} style={styles.cardCon}>
  //                 <TouchableOpacity onPress={() => setSelected(entry)}>
  //                   <View
  //                     style={{
  //                       paddingLeft: 10,
  //                       paddingVertical: 6,
  //                       flexDirection: "row",
  //                       borderRadius: 10,
  //                       elevation: selected == entry ? 2 : 0,
  //                       backgroundColor:
  //                         selected == entry ? "white" : "#F1F1F1",
  //                     }}
  //                   >
  //                     <Image source={require("../../../assets/people.png")} />
  //                     <Text style={styles.cardText}>{entry.name}</Text>
  //                   </View>
  //                 </TouchableOpacity>
  //                 <View style={styles.seperator}></View>
  //               </View>
  //             ))}
  //         </ScrollView>
  //       </View>
  //       <View style={{ flex: 1, marginBottom: 30, justifyContent: "flex-end" }}>
  //         <TouchableOpacity onPress={() => propsClick()}>
  //           <View
  //             style={{
  //               marginTop: 20,
  //               backgroundColor: "#289EFF",
  //               borderRadius: 10,
  //               width: 150,
  //               height: 40,
  //               alignItems: "center",
  //               justifyContent: "center",
  //             }}
  //           >
  //             <Text
  //               style={{
  //                 textAlign: "center",
  //                 fontSize: 22,
  //                 fontWeight: "bold",
  //                 color: "white",
  //               }}
  //             >
  //               Add Device
  //             </Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </Modal>
  // );

  let modal2 = (
    <Modal
      visible={isVisible2}
      transparent={true}
      onBackdropPress={() => setIsVisible2(false)}
    >
      <View style={styles.addGuestmodal}>
        <View style={styles.addGuestHeader}>
          <Icon name="users" type="feather" color="black" />
          <Text style={{ marginLeft: 10, fontSize: 20 }}>Add New Guest</Text>
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
          Send a request to your guest to have them share your home!
        </Text>
        <TextInput
          style={styles.input}
          placeholder={'Guest Email'}
          onChangeText={(text) => setGuestEmail(text)}
        />
        <TouchableOpacity
          onPress={
            () => {
              props.Share(
                props.sessionData.idToken,
                guestEmail,
                {
                  title: 'Push Button Deadbolt',
                  entity_id: 'lock.key_free_push_button_deadbolt',
                  type: 'lock',
                },
                [{ access: 1 }],
                null
              ),
                setIsVisible2(false);
            }
            //Share(idToken, guestEmail, device, shareProperties, shareOptions)
          }
        >
          <View style={styles.submitButton}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              Send Request
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  let selectDevice = (
    <Modal
      isVisible={isVisibleDevices}
      transparent={true}
      onBackdropPress={() => setIsVisibleDevices(false)}
      backdropColor={"#00000080"}
      backdropOpacity={1}
      hasBackdrop={true}
    >
      <View style={styles.modal}>
        <View style={styles.topGuestModal}>
          <Icon name="codesandbox" type="feather" color="black" />
          <Icon name="plus" type="feather" color="black" size={13} />
          <Text style={{ marginLeft: 10, fontSize: 24 }}>Add Device</Text>
        </View>
        <View style={{ minHeight: '25%', maxHeight: '50%', width: '100%' }}>
          <ScrollView>
            {tempDevices &&
              tempDevices.map((entry, i) => (
                <View key={i} style={styles.cardCon}>
                  <TouchableOpacity onPress={() => setSelected(i)}>
                    <View
                      style={{
                        paddingLeft: 10,
                        paddingVertical: 6,
                        flexDirection: 'row',
                        borderRadius: 10,
                        elevation: selected == i ? 2 : 0,
                        backgroundColor: selected == i ? 'white' : '#F1F1F1',
                      }}
                    >
                      <Icon
                        name="lock"
                        type="feather"
                        containerStyle={{
                          padding: 4,
                          borderColor: '#60b8ff',
                          borderWidth: 2,
                          borderRadius: 4,
                        }}
                      />
                      <Text style={styles.cardText}>
                        {entry.attributes.friendly_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.seperator}></View>
                </View>
              ))}
          </ScrollView>
        </View>
        <View style={{ marginBottom: 30, justifyContent: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              const apiRet = createADevice(
                props.user.login_credentials_id,
                props.sessionData.idToken,
                {
                  title: choice.attributes.friendly_name,
                  entity_id: choice.entity_id,
                  type: getType(choice.entity_id),
                }
              );


              // console.log(apiRet);
              setIsVisibleDevices(false);
            }}
          >
            <View
              style={{
                backgroundColor: '#289EFF',
                borderRadius: 10,
                width: 150,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                Add Device
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container} transparent={true}>
      {deviceList.map((d) => (
        <View style={styles.iconAndName} key={d.shared_device_properties_id}>
          {screen === 'Devices' ? (
            <GuestElement
              deviceName={d.name}
              currDevice={d}
              title={d.title}
              navigation={props.navigation}
            />
          ) : screen === 'Hubs' ? (
            <DeviceElement
              screen={props.screen}
              // Most of the account data is in the user object
              user={props.user}
              key={d.shared_device_properties_id}
              // The mapped device information is in currDevice
              currDevice={d}
              name={d.name}
              id={d.entity_id}
              type={d.type}
              login={d.login_credentials_id}
              navigation={props.navigation}
              idToken={props.sessionData.idToken}
            />
          ) : (
            <DeviceElement
              screen={props.screen}
              user={props.user}
              key={d.shared_device_properties_id}
              currDevice={d}
              // title={d.title}
              name={d.name}
              id={d.entity_id}
              type={d.type}
              login={d.login_credentials_id}
              navigation={props.navigation}
              idToken={props.sessionData.idToken}
            />
          )}
        </View>
      ))}
      {screen != 'Hubs' && addButton()}

      {/* {props.device &&
        props.device.map((entry, i) => (
          <View style={styles.iconAndName} key={i}>
            <GuestElement
              deviceName={entry.name}
              currDevice={entry}
              title={props.title}
              navigation={props.navigation}
            />
          </View>
        ))} */}
      {/* {addButton} */}

      {modal}
      {modal2}
      {selectDevice}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '94%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  iconHolder: {
    backgroundColor: 'green',
    width: 70,
    height: 70,
  },
  iconAndName: {
    backgroundColor: 'transparent',
    marginVertical: 8,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 10,
    width: 70,
    textAlign: 'center',
  },
  addGuest: {
    backgroundColor: '#57E455',
    justifyContent: 'center',
    borderRadius: 41,
    width: 70,
    height: 70,
  },
  addDevice: {
    backgroundColor: '#57E455',
    justifyContent: 'center',
    borderRadius: 5,
    width: 70,
    height: 70,
  },
  modal: {

    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    width: 300,
    alignSelf: "center",
    alignItems: "center",
    elevation: 10,
  },
  addGuestmodal: {
    backgroundColor: "#F1F1F1",

    borderRadius: 10,

    width: 300,
    alignSelf: 'center',
    alignItems: 'center',
  },
  addGuestmodal: {
    backgroundColor: '#F1F1F1',
    borderWidth: 1,

    borderColor: "black",
    borderRadius: 20,
    margin: 5, 

    width: 300,
    height: 300,
    alignSelf: 'center',
    alignItems: 'center',
  },
  seperator: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#888888',
  },
  input: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 0.5,
    backgroundColor: '#F4F4F4',
    alignSelf: 'stretch',
    paddingLeft: 20,
    height: 48,
    fontSize: 16,
    marginTop: 21,
    marginHorizontal: 20,
  },
  topGuestModal: {
    marginTop: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cardText: {
    fontSize: 16,
    alignSelf: 'center',
    marginLeft: 20,
  },
  cardCon: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginRight: 20,
    alignSelf: 'stretch',
  },
  iconCon: {
    paddingLeft: 4,
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
  },
  addGuestHeader: {
    marginTop: 25,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  submitButton: {
    marginTop: 35,
    backgroundColor: '#289EFF',
    borderRadius: 10,
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
export default connect(mapStateToProps, mapDispatchToProps)(SampleDeviceList);
