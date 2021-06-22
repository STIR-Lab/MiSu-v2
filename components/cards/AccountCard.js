import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { connect } from 'react-redux';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
import Icon from 'react-native-vector-icons/MaterialIcons';

function AccountCard(props) {
  // Holds all of our global variables
  const [registering, setRegistering] = useState(false);


  registerHub = () => {
    setRegistering(true);
  };
  
  return (
    <View style={style.container}>

      <Icon 
          name="account-circle"
          size={70}
          style={{color: "#FFCB5B", flexBasis: 100, }}/>
     

      <View style= {{}}>
        {/* Show user's name */}
        <Text style={style.name}>
          {props.user.name} {props.user.lastName}
        </Text>

        {/* Weird undefined behavior w/ city, state */}
        <Text style={style.info}>
          {props.user.city ===
          (undefined || null || '' || 'undefined' || 'null') ? (
            <></>
          ) : (
            props.user.city + ', '
          )}

          {props.user.state ===
          (undefined || null || '' || 'undefined' || 'null') ? (
            <></>
          ) : (
            props.user.state
          )}
        </Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 0.20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 0,

  },
  info: {
    fontSize: 17,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  icon: {
    height: 80,
    width: 80,
    marginRight: 20,
  },
});

const mapStateToProps = (state) => {
  const { registerData } = state;
  return { registerData };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountCard);
