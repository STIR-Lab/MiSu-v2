import { Auth } from 'aws-amplify';
import React, { useState } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Keyboard, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import SearchBar from '../../components/SearchBar';
import DeviceInfoCard from '../../components/cards/DeviceInfoCard';
import { getHubInfoAction } from '../../redux/Action/getHubInfoAction';
import { registerHubAction } from '../../redux/Action/registerHubAction';
import appStyle from '../../styles/AppStyle';

function DevicesScreen(props) {
	const [searchParam, setSearchParam] = useState('');
	
    return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View  style={appStyle.container}>
					{/* <Text>This is the Devices page</Text> */}
				<SearchBar setSearchParam={setSearchParam}/>
					{/* <View style={{backgroundColor: 'red'}}>
						<TouchableOpacity
							onPress={() => console.log( searchParam)}
						>
							<Text style={{ color: '#FFF', fontSize: 25 }}>Print</Text>
						</TouchableOpacity>
					</View> */}
				<ScrollView style={styles.cardContainer}>
					<DeviceInfoCard />
					<DeviceInfoCard />
					<DeviceInfoCard />
					<DeviceInfoCard />
					<DeviceInfoCard />
					<DeviceInfoCard />
					<DeviceInfoCard />
					<DeviceInfoCard />
					<DeviceInfoCard />
					<DeviceInfoCard />
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

export default connect(mapStateToProps, mapDispatchToProps)(DevicesScreen);