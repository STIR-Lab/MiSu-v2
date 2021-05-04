import React, { Component } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  CheckBox,
} from "react-native";
import authStyle from "../../styles/AuthStyle";

import Icon from "react-native-vector-icons/Feather";

class RegistrationFinal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      totalSteps: "",
      currentStep: "",
    };
  }

  static getDerivedStateFromProps = (props) => {
    const { getTotalSteps, getCurrentStep } = props;
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep(),
    };
  };

  nextStep = () => {
    const { next, saveState } = this.props;
    if (this.state.password != this.state.passwordConfirm) this.goBack();
    // Save state for use in other steps

    // Go to next step
    next();
  };

  goBack() {
    const { back } = this.props;
    // Go to previous step
    back();
  }

  handleCheckBox = () =>
    this.setState({ isSelected: !this.state.termsAccepted });

  render() {
    var isSelected;
    const {
      name,
      username,
      phone,
      city,
      state,
      street,
      currentStep,
      totalSteps,
    } = this.props.getState();

    return (
      <View style={authStyle.container}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 30,
            paddingLeft: 60,
            paddingTop: 10,
            paddingRight: 60,
          }}
        >
          <View style={authStyle.stepTrackerIcon}>
            <TouchableOpacity>
              <Icon name="user" size={30} color={"#008CFF"} />
              <Text style={{ color: "#008CFF" }}>Profile</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => this.props.next()}>
            <View style={authStyle.stepTrackerIcon}>
              <Icon name="file-text" size={30} color={"#008CFF"} />
              <Text style={{ color: "#008CFF" }}>Contact Info</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={authStyle.stepTrackerIcon}>
              <Icon name="thumbs-up" size={30} color={"#008CFF"} />
              <Text style={{ color: "#008CFF" }}>Finish</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={authStyle.finalForm}>
          <Icon name="user" size={30} style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 17 }}>{name}</Text>
        </View>
        <View style={authStyle.finalForm}>
          <Icon name="mail" size={30} style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 17 }}>{username}</Text>
        </View>
        <View style={authStyle.finalForm}>
          <Icon name="phone" size={30} style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 17 }}>{phone}</Text>
        </View>
        <View style={authStyle.finalForm}>
          <Icon name="map-pin" size={30} style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 17 }}>
            {city}, {state}
          </Text>
        </View>
        <View style={authStyle.check}>
          <CheckBox
            value={this.state.isSelected}
            onValueChange={this.handleCheckBox}
          />
          <Text>Do you agree to the Terms and Conditions?</Text>
        </View>

        {/* Render the submit button */}
        <View style={authStyle.authFormButtonHolder}>
          <TouchableOpacity
            style={authStyle.authFormButton}
            onPress={this.nextStep}
          >
            <Text style={{ color: "#FFF", fontSize: 22 }}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default RegistrationFinal;
