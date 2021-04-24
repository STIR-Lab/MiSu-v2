import React, { Component, useState } from 'react';
import { Image, View, TouchableOpacity, TextInput, Text } from 'react-native';
import authStyle from '../../styles/AuthStyle';

import Icon from 'react-native-vector-icons/Feather';
import { Picker } from 'react-native'; // likely remove on Expo update for vv
//import { Picker } from '@react-native-community/picker';

class RegisterStep2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      address: '',
      apartmentNo: '',
      state: 'FL',
      city: '',
      totalSteps: '',
      currentStep: '',
      country: '',
    };
  }

  nextStep = () => {
    console.log(this.props);
    const { next, saveState } = this.props;
    // Save state for use in other steps
    saveState({
      phone: this.state.phone,
      city: this.state.city,
      state: this.state.state,
      address: this.state.address,
      apartmentNo: this.state.apartmentNo,
    });
    next();
  };

  goBack() {
    const { back } = this.props;
    back();
  }

  render() {
    const { state, country, region } = this.state;
    return (
      <View style={authStyle.container}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 30,
            paddingLeft: 60,
            paddingTop: 10,
            paddingRight: 60,
          }}
        >
          <View style={authStyle.stepTrackerIcon}>
            <TouchableOpacity onPress={() => this.props.back()}>
              <Icon name="user" size={30} color={'#008CFF'} />
              <Text style={{ color: '#008CFF' }}>Profile</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <View style={authStyle.stepTrackerIcon}>
              <Icon name="file-text" size={30} color={'#008CFF'} />
              <Text style={{ color: '#008CFF' }}>Contact Info</Text>
            </View>
          </TouchableOpacity>
          <View style={authStyle.stepTrackerIcon}>
            <Icon name="thumbs-up" size={30} />
            <Text>Finish</Text>
          </View>
        </View>
        <View style={authStyle.authForm}>
          <View>
            <TextInput
              style={authStyle.authFormInput}
              autoCapitalize="none"
              keyboardType="phone-pad"
              onChangeText={(phone) => this.setState({ phone })}
              value={this.state.phone}
              placeholder="Phone Number"
            ></TextInput>
          </View>
          <View>
            <TextInput
              style={authStyle.authFormInput}
              autoCapitalize="words"
              onChangeText={(street) => this.setState({ street })}
              value={this.state.street}
              placeholder="Street Address"
            ></TextInput>
          </View>
          <View>
            <TextInput
              style={authStyle.authFormInput}
              autoCapitalize="words"
              onChangeText={(apartmentNo) => this.setState({ apartmentNo })}
              value={this.state.apartmentNo}
              placeholder="Apartment, Unit # (optional)"
            ></TextInput>
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <View style={authStyle.picker}>
              <Picker
                selectedValue={this.state.state}
                onValueChange={(state) => this.setState({ state: state })}
              >
                <Picker.Item label="AL" value="Alabama" />
                <Picker.item label="AK" value="Alaska" />
                <Picker.Item label="FL" value="Florida" />
                <Picker.item label="GA" value="Georgia" />
              </Picker>
            </View>

            <View style={{ flex: 1, paddingLeft: 20 }}>
              <TextInput
                style={authStyle.authFormInput}
                autoCapitalize="words"
                onChangeText={(city) => this.setState({ city })}
                value={this.state.city}
                placeholder="City"
              ></TextInput>
            </View>
          </View>

          {/* Render the submit button */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}
          >
            <View style={authStyle.authFormButtonHolder}>
              <TouchableOpacity
                style={{
                  marginTop: 30,
                  marginLeft: -10,
                  marginRight: 10,
                  backgroundColor: '#F3F3F3',
                  borderRadius: 8,
                  borderColor: '#008CFF',
                  borderWidth: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 45,
                  width: 160,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,
                  elevation: 4,
                }}
                onPress={this.goBack}
              >
                <Text
                  style={{ color: '#008CFF', fontWeight: '600', fontSize: 24 }}
                >
                  Back
                </Text>
              </TouchableOpacity>
            </View>
            <View style={authStyle.authFormButtonHolder}>
              <TouchableOpacity
                style={{
                  marginTop: 30,
                  marginRight: 10,
                  backgroundColor: '#008CFF',
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 45,
                  width: 160,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,
                  elevation: 4,
                }}
                onPress={this.nextStep}
              >
                <Text
                  style={{ color: '#FFF', fontWeight: '600', fontSize: 24 }}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default RegisterStep2;
