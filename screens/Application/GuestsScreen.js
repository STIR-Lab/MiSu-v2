import React, { useState, useEffect } from 'react';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import SearchBar from '../../components/SearchBar';
import { getHubInfoAction } from '../../redux/Action/getHubInfoAction';
import { registerHubAction } from '../../redux/Action/registerHubAction';
import appStyle from '../../styles/AppStyle';
import DeviceInfoCard from '../../components/cards/DeviceInfoCard';
import Modal from 'react-native-modal';

// AWS Config
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

function GuestsScreen(props) {
  const [searchParam, setSearchParam] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  openModal = () => {
    setIsVisible(!isVisible);
  };
  // console.log(props);

  // =========================================================================
  // REFRESH LOGIC: TO DO LATER
  // =========================================================================

  // Retrieves all the information on pull down/refresh of the app
  // onRefresh = async () => {
  // 	// await this.setState({ loading: true });
  // 	// await this.setState({ refreshingUsers: true });
  // 	const { idToken } = props.sessionData;
  // 	props.getHub(idToken);
  // 	props.getDevices(idToken);
  // 	await props.getAccounts(idToken);
  // 	props.getSharedDevices(idToken);
  // 	getUsageLogs();
  // 	getAccessLogs();
  // 	// await this.setState({ loading: false });
  // 	// await this.setState({ refreshingUsers: false });
  // };

  // Called when when the screen is about to load, grabs all the info to display
  // THE LACK OF THE [] IN THE SECOND PARAMETER CAUSES INFINITE CONSOLE LOGGING OR RERENDERING IN ACCOUNT SCREEN
  // REQUIRES FURTHER INVESTIGATION
  useEffect(() => {
    // if (props.sessionData != null)
    // 	props.navigation.setParams({
    // 		name: props.sessionData.name
    // 	});
    const { idToken } = props.sessionData;
    props.getHub(idToken);
    props.getDevices(idToken);
    // await props.getAccounts(idToken);
    props.getSharedDevices(idToken);
    //getUsageLogs();
    //getAccessLogs();
    // onRefresh();
  }, []);

  let modal = (
    <Modal
      visible={isVisible}
      transparent={true}
      onBackdropPress={() => setIsVisible(false)}
    >
      <View style={styles.modal}>
        <Text>Test</Text>
      </View>
    </Modal>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={appStyle.container}>
        <View style={styles.header}>
          <SearchBar setSearchParam={setSearchParam} screen={"Guests"}/>
          <View style={styles.button}>
            <TouchableOpacity onPress={() => openModal()}>
              <Text>Add Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <Text>{searchParam}</Text> */}
        <ScrollView style={styles.cardContainer}>
          <DeviceInfoCard title={'Sam Smith'} type={'GuestCard'} />
        </ScrollView>
        {modal}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 50,
    margin: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    backgroundColor: 'blue',
    height: 70,
    right: 0,
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  modal: {
    backgroundColor: 'green',
    width: 300,
    height: 500,
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default GuestsScreen;
