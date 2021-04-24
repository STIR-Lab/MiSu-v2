import Amplify from '@aws-amplify/core';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
// import { createStackNavigator } from 'react-navigation-stack';
// ************************************************ */
// Redux ****************************************** */
// ************************************************ */
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import config from './aws-exports';
import HubCardSharedUsersListEntry from './components/cards/ListEntries/HubCardSharedUsersListEntry';
import appDataReducer from './redux/AppDataReducer';
import AccountScreen from './screens/Application/AccountScreen';
import DeviceScreen from './screens/Application/DeviceScreen';
import LogScreen from './screens/Application/LogScreen';
import UserScreen from './screens/Application/UserScreen';
import HubScreen from './screens/Application/HubScreen';
//************************************************** */
// Auth Stack ************************************** */
//************************************************** */
// Login/Register screens hold the code that mess with the firebase auth(login)
import LoginScreen from './screens/Authentication/LoginScreen';
import RegisterScreen from './screens/Authentication/RegisterScreen';
//************************************************** */
// App Stack *************************************** */
//************************************************** */
// Main screen holding all the logic essentially
import HomeScreen from './screens/index';
//************************************************** */
// Loading Stack *********************************** */
//************************************************** */
// Routing container which swaps screens and adds them to the navigation stack(back button function properly on Android)
import LoadingScreen from './screens/LoadingScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

Amplify.configure(config);

const store = createStore(appDataReducer, applyMiddleware(thunk));

// const AppStack = createStackNavigator(
//   {
//     Home: HomeScreen,
//     Account: AccountScreen,
//     Device: DeviceScreen,
//     User: UserScreen,
//     Log: LogScreen,
//     Hub: HubScreen,
//   },
//   {
//     mode: 'card',
//     navigationOptions: (params) => (
//       {
//         gesturesEnabled: true,
//         gesturesDirection: 'inverted',
//         headerMode: 'float',
//       },
//       {
//         transitionConfig: customAnimationFunc,
//       }
//     ),
//   }
//  );
const HomeNav = createStackNavigator();

function HomeStack() {
  return(
    <HomeNav.Navigator>
      <HomeNav.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      <HomeNav.Screen name="Device" component={DeviceScreen} />
    </HomeNav.Navigator>
  )
}
const ProfileNav = createStackNavigator();

function ProfileStack() {
  return(
    <ProfileNav.Navigator>
      <ProfileNav.Screen name="Account" component={AccountScreen} options={{headerShown: false}}/>
      <ProfileNav.Screen name="Hub" component={HubScreen}/>
    </ProfileNav.Navigator>
  )
}

const NavBar = createBottomTabNavigator();

function AppNavBar() {
  return(
    <NavBar.Navigator>
      <NavBar.Screen name="HomeStack" component={HomeStack} />
      <NavBar.Screen name="Devices" component={DeviceScreen} />
      <NavBar.Screen name="Logs" component={LogScreen} />
      <NavBar.Screen name="Profile" component={ProfileStack} />
    </NavBar.Navigator>
  )
}

const customAnimationFunc = () => ({
  screenInterpolator: (sceneProps) => {
    return CardStackStyleInterpolator.forHorizontal(sceneProps);
  },
});

// const AuthStack = createStackNavigator(
//   {
//     Login: LoginScreen,
//     Register: RegisterScreen,
//   },
//   {
//     mode: 'card',
//     navigationOptions: (params) => (
//       {
//         gesturesEnabled: true,
//         gesturesDirection: 'inverted',
//         headerMode: 'none',
//         headerShown: false,
//       },
//       {
//         transitionConfig: customAnimationFunc,
//       }
//     ),
//   }
// );

const Auth = createStackNavigator();
 const AuthStack = (props) => (
    <Auth.Navigator 
        initialRouteName="Login"
        screenOptions={{
          animationEnabled: false
        }}
        headerMode='none'
    >
        {/* {console.log("AuthStack props ", props)} */}
        <Auth.Screen name="Login" component={LoginScreen} 
            initialParams={{
                setLoadingTrue: props.setLoadingTrue,
                setLoadingFalse: props.setLoadingFalse,
                setGoToAuthFalse: props.setGoToAuthFalse,
                setGoToAppTrue: props.setGoToAppTrue}}/>
        <Auth.Screen name="Register" component={RegisterScreen} />
        <Auth.Screen name="App" component={AppNavBar} 
          initialParams={{
            setLoadingTrue: props.setLoadingTrue,
            setLoadingFalse: props.setLoadingFalse}}/>
    </Auth.Navigator>
 )

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      goToAuth: false,
      goToApp: false
    };
  }

  setLoadingTrue = () => {
    this.setState({ loading: true });
  }

  setLoadingFalse = () => {
    this.setState({ loading: false });
  }

  setGoToAuthTrue = () => {
    this.setState({ goToAuth: true });
  }

  setGoToAuthFalse = () => {
    this.setState({ goToAuth: false });
  }

  setGoToAppTrue = () => {
    this.setState({ goToApp: true });
  }

  setGoToAppFalse = () => {
    this.setState({ goToApp: false });
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
            textStyle={{
              color: '#FFF',
            }}
          />
          <NavigationContainer>
            { this.state.goToApp == false && this.state.goToAuth == false && 
                <LoadingScreen setGoToAuthTrue={this.setGoToAuthTrue} setGoToAppTrue={this.setGoToAppTrue}/>}
            { this.state.goToAuth == true && 
                <AuthStack setLoadingTrue = {this.setLoadingTrue} 
                    setGoToAppTrue={this.setGoToAppTrue} 
                    setLoadingFalse={this.setLoadingFalse}
                    setGoToAuthFalse={this.setGoToAuthFalse}/>}
            {/* { this.state.goToApp == true &&
                <AppNavBar/>
            } */}
          </NavigationContainer>
          {/* <AppContainer
            screenProps={{
              setLoadingFalse: this.setLoadingFalse.bind(this),
              setLoadingTrue: this.setLoadingTrue.bind(this),
            }}
          /> */}
        </View>
      </Provider>
    );
  }
}

// Create App Navigator
// const AppContainer = createAppContainer(
//     createSwitchNavigator(
//       {
//         Loading: LoadingScreen,
//         Auth: AuthStack,
//         App: AppStack,
//       },
//       {
//         // Starts the app off on the loading screen?
//         initialRouteName: 'Loading',
//       }
//     )
//   );