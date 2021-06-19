import { Route53 } from 'aws-sdk';
import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Switch,
  Button
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import DeviceCard from '../../components/cards/DeviceCard';
import appStyle from '../../styles/AppStyle';

// importing set schedule card from ./cards
import SetScheduleCard from '../../components/cards/SetScheduleCard';

class DeviceProps extends React.Component {
  // static navigationOptions = ({ navigate, navigation }) => ({
  //   // headerTitle: navigation.getParam('device', '').name.slice(0, 22),
  //   headerLeft: () => (
  //     <View>
  //       <TouchableOpacity
  //         style={{ alignSelf: 'center', marginTop: 16 }}
  //         onPress={() => navigation.navigate('Home')}
  //       >
  //         <Icon
  //           name="arrow-back"
  //           size={35}
  //           style={{ marginLeft: 16, marginBottom: 10 }}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   ),
  //   headerRight: () => (
  //     <View>
  //       <TouchableOpacity
  //         style={{ alignSelf: 'center', marginTop: 16 }}
  //         onPress={() => navigation.navigate('Properties')}
  //       >
  //         <Icon
  //           name="arrow-back"
  //           size={35}
  //           style={{ marginLeft: 16, marginBottom: 10 }}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   ),
  // });

  constructor(props) {
    super(props);

    this.state = {
      device: {},
    };
  }

  render() {
    console.log('==DEVICE PROPS==' + this.props);
    return (
      <View style={appStyle.container}>
        {
          <View style={appStyle.cardContainer}>
            <View>
              <TouchableOpacity
                style={{ alignSelf: 'flex-start', marginTop: 16 }}
                onPress={() => {
                  this.props.navigation.pop();
                }}
              >
                <Icon
                  name="arrow-back"
                  size={35}
                  style={{ marginLeft: 16, marginBottom: 10 }}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={appStyle.scrollView}>
              <View style={appStyle.row}>
                <View style={propstyle.card}>
                  <View style={appStyle.row}>
                    <Image source={require('../../assets/people.png')} />
                    <Text
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        alignSelf: 'center',
                        fontSize: 16,
                      }}
                    >
                      //this.props.route.params.account.name}
                    </Text>
                  </View>
                </View>
                <View style={propstyle.devicecard}>
                  <View style={appStyle.row}>
                    <Image
                      style={{ marginLeft: 10, alignSelf: 'center' }}
                      source={require('../../assets/zap.png')}
                    />
                    <Text
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        alignSelf: 'center',
                        fontSize: 13,
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      Sengled{'\n'}Lightbulb
                    </Text>
                  </View>
                </View>
              </View>
              {// Set Schedule Card imported}
  }
              <View style={propstyle.column}>
                <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
                  Set Schedule
                </Text>
                <SetScheduleCard/>

                <Text
                  style={{ marginTop: 20, fontSize: 26, fontWeight: 'bold' }}
                >
                  Set Actions
                </Text>
                <View style={[propstyle.lineContainer, { marginTop: 8 }]} />
                <View
                  style={{
                    marginTop: 10,
                    paddingBottom: 0,
                    flexDirection: 'row',
                    alignSelf: 'stretch',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: 20 }}>On/Off</Text>
                  <Switch
                    style={{
                      transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                    }}
                    trackColor={{ true: '#2DC62A', false: '#FF5D53' }}
                    onValueChange={(x) => {}}
                  />
                </View>
                <View
                  style={{
                    marginTop: 20,
                    paddingBottom: 0,
                    flexDirection: 'row',
                    alignSelf: 'stretch',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: 20 }}>Brightness</Text>
                  <Switch
                    style={{
                      transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                    }}
                    trackColor={{ true: '#2DC62A', false: '#FF5D53' }}
                    onValueChange={(x) => {}}
                  />
                </View>
                <View
                  style={{
                    marginTop: 20,
                    paddingBottom: 0,
                    flexDirection: 'row',
                    alignSelf: 'stretch',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: 20 }}>Color</Text>
                  <Switch
                    style={{
                      transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                    }}
                    trackColor={{ true: '#2DC62A', false: '#FF5D53' }}
                    onValueChange={(x) => {}}
                  />
                </View>
                <Text
                  style={{ marginTop: 20, fontSize: 26, fontWeight: 'bold' }}
                >
                  Set Geofencing
                </Text>
                <View style={[propstyle.lineContainer, { marginTop: 8 }]} />
                <View
                  style={{
                    marginTop: 20,
                    paddingBottom: 0,
                    flexDirection: 'row',
                    alignSelf: 'stretch',
                    justifyContent: 'space-between',
                  }}
                >
                  <Switch
                    style={{
                      transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                    }}
                    trackColor={{ true: '#2DC62A', false: '#FF5D53' }}
                    onValueChange={(x) => {}}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        }
      </View>
    );
  }
}

const propstyle = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',

    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 10,
    shadowRadius: 20.41,
    borderBottomWidth: 3,
    borderBottomColor: '#a8a8a8',
    elevation: 4,

    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 15,
    paddingBottom: 5,
    marginBottom: 5,
    marginRight: 50,
  },
  devicecard: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#44ABFF',

    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 10,
    shadowRadius: 20.41,
    borderBottomWidth: 3,
    borderBottomColor: '#a8a8a8',
    elevation: 4,

    paddingTop: 5,
    paddingLeft: 2,
    paddingRight: 4,
    paddingBottom: 5,
    marginBottom: 5,
    marginRight: 0,
  },
  column: {
    margin: 2,
    marginTop: 40,
    paddingBottom: 0,
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  lineContainer: {
    flex: 1,
    backgroundColor: '#333333',
    height: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
});

const mapStateToProps = (state) => {
  const { devicesData, sessionData, sharedDevicesData, sharedAccountsData } =
    state;
  return { devicesData, sessionData, sharedDevicesData, sharedAccountsData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dosomething: () => {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceProps);
