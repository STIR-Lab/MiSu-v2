import { Auth } from "aws-amplify";
import React, { useEffect } from "react";
import {
  ToastAndroid,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import AppText from "../../components/app/AppText";
import AccountCard from "../../components/cards/AccountCard";
import ProfileCard from "../../components/cards/ProfileCard";
import SettingsCard from "../../components/cards/SettingsCard";
import YourHubCard from "../../components/cards/YourHubCard";
import { getHubInfoAction } from "../../redux/Action/getHubInfoAction";
import { registerHubAction } from "../../redux/Action/registerHubAction";
import appStyle from "../../styles/AppStyle";
import * as SecureStore from "expo-secure-store";

function AccountScreen(props) {
  console.log("--------------------");
  console.log(props);
  // static navigationOptions = ({ navigate, navigation }) => ({
  // 	headerTitle: 'Account',
  // 	headerLeft: () => (
  // 		<View>
  // 			<TouchableOpacity
  // 				style={{ alignSelf: 'center', marginTop: 16 }}
  // 				onPress={() => navigation.navigate('Home')}
  // 			>
  // 				<Icon name="arrow-back" size={35} style={{ marginLeft: 16, marginBottom: 10 }} />
  // 			</TouchableOpacity>
  // 		</View>
  // 	),
  // 	headerRight: () => <View></View>
  // });

  async function deleteStorage() {
    await SecureStore.deleteItemAsync("username");
    await SecureStore.deleteItemAsync("password");
    return;
  }

  // Signs the user out and sends them back to the login screen
  signOut = async () => {
   
    // props.screenProps.setLoadingTrue();
    ToastAndroid.show("Signing out!", ToastAndroid.LONG);
    Auth.signOut()
      .then(() => {
        // props.screenProps.setLoadingFalse();
      })
      .then(() => {
        // console.log("LOGOUT PROPS: ", props)
        deleteStorage();
        props.navigation.navigate("Login", { username: null, password: null });
      });
  };

  viewLogs = () => {
    props.navigation.navigate("Log");
  };

  // UNSAFE_componentWillReceiveProps(props) {
  // 	if (props.registerData) {
  // 		this.props.getHub(this.props.sessionData.idToken);
  // 	}
  // }

  // REFER TO GUEST SCREEN USE EFFECT
  // useEffect(() => {console.log(props)}, []);

  return (
    <View style={appStyle.container}>
      <AccountCard
        idToken={props.sessionData.idToken}
        user={props.hubInfoData}
      />
      <ProfileCard
        idToken={props.sessionData.idToken}
        user={props.hubInfoData}
      />
      <YourHubCard
        sharedData ={props.sharedAccountsData.sharedAccounts}
        register={props.register}
        idToken={props.sessionData.idToken}
        user={props.hubInfoData}
        hub_url={props.hubInfoData.hub_url}
        hub_email={props.hubInfoData.hub_email}
        navigation={props.navigation}
      />
      <SettingsCard
        idToken={props.sessionData.idToken}
        user={props.hubInfoData}
        navigation={props.navigation}
        getHub={props.getHub}
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 25,
          paddingBottom: 0,
          flex: 0.1,
        }}
      >
        <TouchableOpacity
          style={[
            {
              marginBottom: 15,
              flex: 0,
              flexDirection: "row",
              width: 160,
              alignItems: "center",
              justifyContent: "center",
            },
            appStyle.redButton,
          ]}
          onPress={signOut}
        >
          <Icon name="logout" size={32} style={{ color: "white" }} />
          <AppText style={{ color: "white" }}>Log out</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { hubInfoData, sessionData, sharedAccountsData, registerData } = state;
  return { hubInfoData, sessionData, sharedAccountsData, registerData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (data, idToken) => dispatch(registerHubAction(data, idToken)),
    getHub: (idToken) => dispatch(getHubInfoAction(idToken)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
