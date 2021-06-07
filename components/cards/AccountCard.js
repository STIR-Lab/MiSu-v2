import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { connect } from 'react-redux';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';

function AccountCard(props) {
  // Holds all of our global variables
  const [registering, setRegistering] = useState(false);


  registerHub = () => {
    setRegistering(true);
  };

  return (
    <View style={style.container}>
      <Image
        style={style.icon}
        source={require('../../assets/icons/user.png')}
      />
      <View>
        {/* Show user's name */}
        <Text style={style.name}>
          {props.user.name} {props.user.lastName}
        </Text>

        {/* Weird undefined behavior w/ city, state */}
        <Text>
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
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  info: {
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
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
