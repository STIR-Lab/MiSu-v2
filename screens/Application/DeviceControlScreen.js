import React, {useEffect} from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { getHubInfoAction } from '../../redux/Action/getHubInfoAction';
import { registerHubAction } from '../../redux/Action/registerHubAction';
import appStyle from '../../styles/AppStyle';


function DeviceControlScreen(props) {

    async  function handleClick() {
        // console.log("======= Device Control:", props);
        // await fetch(
        //     "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice",
        //     {
        //       method: "POST",
        //       headers: {
        //         Authorization: "Bearer " + props.route.params.bearerId,
        //         'Content-Type': 'application/json'
        //       },
        //       body: JSON.stringify({
        //         account: props.route.params.device.login_credentials_id,
        //         device_id: props.route.params.device.shared_device_properties_id,
        //         action: "unlock"
        //       }),
        //     }
        //   );

        const state = await fetch(
            "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getvalues",
            {
                method: "POST",
                headers: {
                Authorization: "Bearer " + props.route.params.bearerId,
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                account: props.route.params.device.login_credentials_id,
                device: props.route.params.device.shared_device_properties_id,
                }),
            }
        ).then(response => response.json())
        .then(data => {
          console.log(data);
        })
    }

  return (
    <View style={appStyle.container}>
      <Text>I am the Device Control Screen</Text>
      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text>Lock/Unlock</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    button: {
      borderWidth: 2,
      borderColor: "#60B8FF",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
      width: 200,
      height: 70,
    }
  });

export default DeviceControlScreen;
