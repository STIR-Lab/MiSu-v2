import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import DeviceCard from '../../components/cards/DeviceCard';
import appStyle from '../../styles/AppStyle';

class DeviceScreen extends React.Component {
  static navigationOptions = ({ navigate, navigation }) => ({
    headerTitle: navigation.getParam('device', '').name.slice(0, 22),
    headerLeft: () => (
      <View>
        <TouchableOpacity
          style={{ alignSelf: 'center', marginTop: 16 }}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon
            name="arrow-back"
            size={35}
            style={{ marginLeft: 16, marginBottom: 10 }}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: () => <View></View>,
  });

  constructor(props) {
    super(props);

    this.state = {
      device: {},
    };
  }

  componentWillMount() {
    console.log('DeviceScreen Props', this.props);
    const device = this.props.route.params.device;
    // const device = this.props.navigation.getParam('device', null);
    this.setState({
      device,
    });
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.devicesData) {
      //loop throught & find device and update it
    }
  }

  render() {
    return (
      <View style={appStyle.container}>
        {
          <View style={appStyle.cardContainer}>
            <ScrollView style={appStyle.scrollView}>
              <DeviceCard
                device={this.state.device}
                deviceList={this.props.sharedDevicesData}
                IdToken={this.props.sessionData.idToken}
                owner={this.props.route.params.owner}
                navigation={this.props.navigation}
                // owner={this.props.navigation.getParam('owner', null)}
              />
            </ScrollView>
          </View>
        }
      </View>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(DeviceScreen);
