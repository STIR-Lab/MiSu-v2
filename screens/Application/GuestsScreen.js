import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Keyboard, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import SearchBar from '../../components/SearchBar';
import { getHubInfoAction } from '../../redux/Action/getHubInfoAction';
import { registerHubAction } from '../../redux/Action/registerHubAction';
import appStyle from '../../styles/AppStyle';
import DeviceInfoCard from '../../components/cards/DeviceInfoCard';

// AWS Config
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });



function GuestsScreen(props) {

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
	})

	const [searchParam, setSearchParam] = useState('');
	
    return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View  style={appStyle.container}>
                <SearchBar setSearchParam={setSearchParam}/>
                <Text>{searchParam}</Text>
                <ScrollView style={styles.cardContainer}>
                    <DeviceInfoCard title = {"Sam Smith"} type={"GuestCard"}/>
                </ScrollView>
			</View>
		</TouchableWithoutFeedback>
    );

}

const styles = StyleSheet.create({
    cardContainer: {
		flex: 1,
		width: "100%",
    },
  });


export default GuestsScreen;