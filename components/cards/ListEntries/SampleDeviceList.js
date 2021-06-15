import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  Button,
  TextInput,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import DeviceElement from '../../DeviceElement';
import GuestElement from '../../GuestElement';

function SampleDeviceList(props) {
  // Will indicate whether this component is rendered in the devices or the guests screen
  const [screen, setScreen] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [selected, setSelected] = useState(null);
  const [sharedAccs, setSharedAccs] = useState(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [deviceList, setDeviceList] = useState({
    devices: [
      // Grab Device Name, Device Picture, And device Actions here. Determine what format the database has them in.
      {
        deviceName: 'Google Home',
        deviceActions: ['useAssitant', 'speaker'],
        lastAction: 'Tom used this',
        id: 1,
      },
      { deviceName: 'Ring Doorbell', id: 2 },
      { deviceName: 'Sengled Lightbulb', id: 3 },
      { deviceName: 'Wyze Smart Camera', id: 4 },
      // {deviceName: "Schlate Smart Lock", id:5},
      // {deviceName: "Ring Doorbell", id:2},
      // {deviceName: "Sengled Lightbulb", id:3},
      // {deviceName: "Wyze Smart Camera", id:4},
      // {deviceName: "Schlate Smart Lock", id:5},
      // {deviceName: "Ring Doorbell", id:2},
      // {deviceName: "Sengled Lightbulb", id:3},
      // {deviceName: "Wyze Smart Camera", id:4},
      // {deviceName: "Schlate Smart Lock", id:5},
      // {deviceName: "Ring Doorbell", id:2},
      // {deviceName: "Sengled Lightbulb", id:3},
      // {deviceName: "Wyze Smart Camera", id:4},
      // {deviceName: "Schlate Smart Lock", id:5},
      // {deviceName: "Schlate Smart Lock", id:5},
    ],
  });

  useEffect(() => {
    console.log('==SAMPLE DEVICE LIST==' + JSON.stringify(props.sharedAccs));
    if (props.screen == 'Guests') setScreen('Guests');
    else if (props.screen == 'Devices') setScreen('Devices');
    else console.log('Invalid screen prop passed.');

    if (props.sharedAccs != null) {
      setSharedAccs(props.sharedAccs);
    }
  });

  const openModal = () => {
    // setSelected(false);
    setIsVisible(!isVisible);
  };

  const handleClick = () => {
    setIsVisible(false);
    setIsVisible2(true);
  };

  const propsClick = () => {
    if (selected == null) return;
    props.navigation.navigate('Properties', {
      account: selected,
    });
  };

  let addButton = (
    <View style={styles.iconAndName}>
      <TouchableOpacity onPress={() => openModal()}>
        <View
          style={screen == 'Devices' ? styles.addGuest : styles.addDevice}
        />
      </TouchableOpacity>
      <Text>{screen == 'Devices' ? 'Add Guest' : 'Add Device'}</Text>
    </View>
  );

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

        {props.sharedAccs &&
          props.sharedAccs.map((entry, i) => (
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
            fontWeight: 'bold',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          Send a request to your guest to have them share your home!
        </Text>
        <TextInput
          style={styles.input}
          placeholder={'Guest Email'}
          onChangeText={(text) => setGuestEmail(text)}
        />
        <TouchableOpacity>
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

  return (
    <View style={styles.container} transparent={true}>
      {deviceList.devices.map((d) => (
        <View style={styles.iconAndName} key={d.id}>
          <GuestElement deviceName={d.deviceName} />
        </View>
      ))}
      {addButton}
      {modal}
      {modal2}
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
    borderRadius: 41,
    width: 70,
    height: 70,
  },
  addDevice: {
    backgroundColor: '#57E455',
    borderRadius: 5,
    width: 70,
    height: 70,
  },
  modal: {
    backgroundColor: '#F1F1F1',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: 300,
    height: 500,
    alignSelf: 'center',
    alignItems: 'center',
  },
  addGuestmodal: {
    backgroundColor: '#F1F1F1',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
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
    marginTop: 10,
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

export default SampleDeviceList;
