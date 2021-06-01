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

	// Called when when the screen is about to load, grabs all the info to display
	// useEffect(() => {
	// 	if (props.sessionData != null)
	// 		props.navigation.setParams({
	// 			name: props.sessionData.name
	// 		});
	// 	onRefresh();
	// })



	// =========================================================================
	// REFRESH LOGIC: TO DO LATER
	// =========================================================================

			// Retrieves all the information on pull down/refresh of the app
			// onRefresh = async () => {
			// 	await this.setState({ loading: true });
			// 	await this.setState({ refreshingUsers: true });
			// 	const { idToken } = this.props.sessionData;
			// 	this.props.getHub(idToken);
			// 	this.props.getDevices(idToken);
			// 	await this.props.getAccounts(idToken);
			// 	this.props.getSharedDevices(idToken);
			// 	this.getUsageLogs();
			// 	this.getAccessLogs();
			// 	await this.setState({ loading: false });
			// 	await this.setState({ refreshingUsers: false });
			// };

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