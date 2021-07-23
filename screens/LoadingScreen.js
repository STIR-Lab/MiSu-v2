import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Auth } from "aws-amplify";

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

export default function LoadingScreen(props) {
  // useEffect(() => {
  // 	async function AuthUserLoading(){
  // 	try {
  // 		const user = await Auth.currentAuthenticatedUser();
  // 		props.navigation.navigate('App', { user: user });
  // 	} catch (err) {
  // 		props.setGoToAuthTrue(true);
  // 		// this.props.navigation.navigate('Auth');
  // 	}
  // };
  // AuthUserLoading();
  // });

  useEffect(() => {
    const { idToken } = props.sessionData;

    fetchData(idToken).then(() => {
      if (props.hubInfoData.user_type == 0) {
        props.navigation.navigate("GuestApp");
      } else if (props.hubInfoData.user_type == 1) {
        props.navigation.navigate("App");
      } else props.getHub(idToken);
    });
  }, [props.hubInfoData.user_type]);

  async function fetchData(idToken) {
    // console.log('Fetching Data..');
    await props.getHub(idToken);
    await props.getDevices(idToken);
    await props.getSharedDevices(idToken);
    await props.getAccounts(idToken);
    console.log("Data Fetched From Loading Screen.");
  }

  // Shows a loading animation
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={{
            width: 180,
            height: 180,
            marginBottom: 90,
          }}
          source={require("../assets/MISU_White.png")}
        />
      </View>
      <Text
        style={{
          fontSize: 24,
          marginBottom: 16,
        }}
      >
        Loading...
      </Text>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
