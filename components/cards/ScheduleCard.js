import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

function SettingsCard(props) {
  return (
    <View style={{ flexDirection: 'row', marginTop: 10 }}>
      <View style={style.container}>
        <View style={style.cardRow}>
          <Icon name="clock" type="feather" color="black" size={25} />
          <View>
            <Text style={{ marginLeft: 10 }}>Mon, Tues, Wed, Thurs</Text>
            <Text
              style={{
                alignSelf: 'flex-end',
                color: 'grey',
                fontSize: 11,
              }}
            >
              5:00 PM - 8:00 PM
            </Text>
          </View>
        </View>
        <View style={style.cardRow}>
          <Icon name="rotate-ccw" type="feather" color="black" size={25} />
          <Text style={{ marginLeft: 10 }}>Bi-Weekly</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
            alignSelf: 'flex-start',
          }}
        >
          <Icon name="calendar" type="feather" color="black" size={25} />
          <Text style={{ marginLeft: 10 }}>4/23/2021 - 5/31/2021</Text>
        </View>
      </View>

      <View style={style.editContainer}>
        <Text
          style={{
            color: 'white',
            fontSize: 25,
            textAlign: 'center',
          }}
        >
          Edit
        </Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 5,
    height: 150,
    padding: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  editContainer: {
    flex: 1,
    height: 150,
    padding: 10,
    backgroundColor: '#44ABFF',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default SettingsCard;
