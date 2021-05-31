import React, { useState } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Keyboard, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import SearchBar from '../../components/SearchBar';
import { getHubInfoAction } from '../../redux/Action/getHubInfoAction';
import { registerHubAction } from '../../redux/Action/registerHubAction';
import appStyle from '../../styles/AppStyle';
import DeviceInfoCard from '../../components/cards/DeviceInfoCard';

function GuestsScreen(props) {
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

const mapStateToProps = (state) => {
	const { hubInfoData, sessionData, sharedAccountsData, registerData } = state;
	return { hubInfoData, sessionData, sharedAccountsData, registerData };
};

const mapDispatchToProps = (dispatch) => {
	return {
		register: (data, idToken) => dispatch(registerHubAction(data, idToken)),
		getHub: (idToken) => dispatch(getHubInfoAction(idToken))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GuestsScreen);