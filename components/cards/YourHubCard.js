import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
function YourHubCard(props) {
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (props.hub_url == '') {
      setRegistering(false);
    } else {
      setRegistering(true);
    }
  }, [props.hub_url]);

  registerHub = () => {
    props.navigation.navigate('Hub');
    // setRegistering(true);
  };

  return (
    <View style={style.container}>
      <View style={style.headerLine}>
        <Text style={style.header}>Your Hub</Text>
        {registering == true && (
          <View style={style.editBox}>
            <Image
              style={style.gear}
              source={require('../../assets/icons/Setting.png')}
            />
            <Text>Edit</Text>
          </View>
        )}
      </View>
      {registering == true && (
        <View style={style.userHubInfo}>
          <View style={style.hubDisplay}>
            <Image
              style={style.raspPi}
              source={require('../../assets/icons/raspberry.png')}
            />
            <View>
              <Text style={style.hardwareType}>Raspberry Pi</Text>
              <Text style={style.softwareType}>Home Assistant</Text>
            </View>
          </View>
          <View style={style.hubStats}>
            <Text style={style.status}>Connected</Text>
            <Text style={style.numGuests}>X Guests</Text>
          </View>
        </View>
      )}
      {registering == false && (
        <View style={style.noHub}>
          <Text style={{ fontSize: 17 }}>No Hub Connected</Text>
          <TouchableOpacity
            style={style.connectButton}
            onPress={() => registerHub()}
          >
            <Text style={{ color: '#15A3DF' }}>Connect Hub</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 0.25,
    flexDirection: 'column',
    borderBottomColor: '#828282',
    borderBottomWidth: .9,
    marginBottom: 10,
    width: '100%',
  },
  connectButton: {
    borderColor: 'gray',
    borderWidth: 0,
    backgroundColor: 'white',
    elevation: 10,
    margin: 10,
    height: '38%',
    width: '45%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  raspPi: {
    height: 35,
    width: 35,
    marginRight: 5,
  },
  userHubInfo: {
    flexDirection: 'row',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  hubDisplay: {
    backgroundColor: '#61B8FF',
    borderRadius: 15,
    height: '60%',
    width: '45%',
    marginRight: 30,
    marginLeft: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubStats: {
    justifyContent: 'center',
    width: '40%',
    height: '60%',
    paddingLeft: 10,
  },
  editBox: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    right: 15,
    justifyContent: 'flex-end',
    width: 40,
    height: 25,
  },
  gear: {
    height: 16,
    width: 16,
    marginRight: 5,
  },
  header: {
    color: 'gray',
    fontSize: 22,
    paddingLeft: 12,
    fontWeight: "bold"
  },
  headerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  hardwareType: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  softwareType: {
    color: 'white',
    fontSize: 13,
  },
  status: {
    color: '#2DC62A',
    marginBottom: 5,
  },
  noHub: {
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

{
  /* Show RegisterHubPopup when registering */
}
{
  /* {registering == true && (
            <RegisterHubPopup
            idToken={props.idToken}
            edit={props.hub_url != ''}
            setHubInfo={props.setHubInfo}
            registerHub={props.register}
            onCancel={() => {
                setRegistering(false);
            }}
            />
        )} */
}
{
  /********************************************
   *************** Show Your Hub Title ********
   ********************************************/
}
{
  /* Your Hub Title */
}
{
  /* <View style={appStyle.row}>
            <AppTitleText style={appStyle.rowLeft}>Your Hub</AppTitleText>
        </View> */
}
{
  /********************************************
   *************** IF Has Hub Set *************
   ********************************************/
}
{
  /* Hub URL Text */
}
{
  /* {props.hub_url != '' && (
            <View style={appStyle.row}>
            <AppText style={appStyle.rowLeft}>Hub URL:</AppText>
            <View style={appStyle.rowRight}>
                <AppText>{props.hub_url}</AppText>
            </View>
            </View>
        )} */
}
{
  /* Hub Email Text */
}
{
  /* {props.hub_url != '' && (
            <View style={appStyle.row}>
            <AppText style={appStyle.rowLeft}>Hub Email:</AppText>
            <View style={appStyle.rowRight}>
                <AppText>{props.hub_email}</AppText>
            </View>
            </View>
        )} */
}
{
  /********************************************
   ************** IF No Hub Set ***************
   ********************************************/
}
{
  /* No Hub */
}
{
  /* {props.hub_url == '' && (
            <View style={appStyle.row}>
            <AppText style={appStyle.rowLeft}>
                No device is registered...
            </AppText>
            </View>
        )} */
}
{
  /* Register Button */
}
{
  /* {
            <TouchableOpacity
            style={appStyle.regularButton}
            onPress={registerHub}
            >
            {props.hub_url == '' && <AppText>Register my Hub </AppText>}
            {props.hub_url != '' && <AppText>Edit my Hub </AppText>}
            </TouchableOpacity>
        } */
}

const mapStateToProps = (state) => {
  const { registerData } = state;
  return { registerData };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
//this inject the redux state into the class components
export default connect(mapStateToProps, mapDispatchToProps)(YourHubCard);
