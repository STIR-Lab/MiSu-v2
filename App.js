import Amplify from "@aws-amplify/core";
import React, { useState } from "react";
import { View, Text, StatusBar } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
// import { createStackNavigator } from 'react-navigation-stack';
// ************************************************ */
// Redux ****************************************** */
// ************************************************ */
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import config from "./aws-exports";
import HubCardSharedUsersListEntry from "./components/cards/ListEntries/HubCardSharedUsersListEntry";
import appDataReducer from "./redux/AppDataReducer";
import AccountScreen from "./screens/Application/AccountScreen";
import DeviceScreen from "./screens/Application/DeviceScreen";
import DeviceProps from "./screens/Application/DeviceProps";
import LogScreen from "./screens/Application/LogScreen";
import UserScreen from "./screens/Application/UserScreen";
import HubScreen from "./screens/Application/HubScreen";
import ChangePasswordScreen from "./screens/Application/ChangePasswordScreen";
//************************************************** */
// Auth Stack ************************************** */
//************************************************** */
// Login/Register screens hold the code that mess with the firebase auth(login)
import LoginScreen from "./screens/Authentication/LoginScreen";
import RegisterScreen from "./screens/Authentication/RegisterScreen";
//************************************************** */
// App Stack *************************************** */
//************************************************** */
// Main screen holding all the logic essentially
// import HomeScreen from './screens/index';
//************************************************** */
// Loading Stack *********************************** */
//************************************************** */
// Routing container which swaps screens and adds them to the navigation stack(back button function properly on Android)

import LoadingScreen from "./screens/index";
import DevicesScreen from "./screens/Application/DevicesScreen";
import GuestsScreen from "./screens/Application/GuestsScreen";
import YourHubsScreen from "./screens/Application/YourHubsScreen";
import DeviceControlScreen from "./screens/Application/DeviceControlScreen";

// import HomeScreen from './screens/index';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

//Import custom header component
import Header from "./components/app/Header.js";
import SetScheduleScreen from "./screens/Application/SetScheduleScreen";

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
  return (
    <HomeNav.Navigator>
      <HomeNav.Screen
        name="Home"
        component={GuestsScreen}
        options={{
          headerLeft: () => null,
          headerShown: true,
          headerTitle: () => <Header title="Your Guests" />,
        }}
      />
      {/* <HomeNav.Screen
        name="Device"
        component={DeviceScreen}
        options={{ headerShown: false }}
      /> */}
      <HomeNav.Screen
        name="Properties"
        component={DeviceProps}
        options={{
          headerLeft: () => null,
          headerShown: true,
          headerTitle: () => <Header title="Device Properties" />,
        }}
      />
      <HomeNav.Screen
        name="SetScheduleScreen"
        component={SetScheduleScreen}
        options={{
          headerLeft: () => null,
          headerShown: true,
          headerTitle: () => <Header title="Set Schedule" />,
        }}
      />
    </HomeNav.Navigator>
  );
}

const HomeGuestNav = createStackNavigator();

function HomeGuestStack() {
  return (
    <HomeGuestNav.Navigator>
      <HomeGuestNav.Screen
        name="Home"
        component={YourHubsScreen}
        options={{
          headerLeft: () => null,
          headerShown: true,
          headerTitle: () => <Header title="Your Hubs" />,
        }}
      />
      {/* <HomeNav.Screen
        name="Device"
        component={DeviceScreen}
        options={{ headerShown: false }}
      /> */}
      <HomeGuestNav.Screen
        name="DeviceControl"
        component={DeviceControlScreen}
        options={{
          headerLeft: () => null,
          headerShown: true,
          headerTitle: () => <Header title="Device Control" />,
        }}
      />
    </HomeGuestNav.Navigator>
  );
}

const DevicesNav = createStackNavigator();

function DevicesStack(props) {
  return (
    <DevicesNav.Navigator>
      <DevicesNav.Screen
        name="Device"
        component={DevicesScreen}
        options={{
          headerLeft: () => null,
          headerShown: true,
          headerTitle: () => <Header title="Your Devices" />,
        }}
      />
      <DevicesNav.Screen
        name="Properties"
        component={DeviceProps}
        options={{
          headerLeft: () => null,
          headerShown: true,
          headerTitle: () => <Header title="Device Properties" />,
        }}
      />
    </DevicesNav.Navigator>
  );
}

const ProfileNav = createStackNavigator();

function ProfileStack() {
  return (
    <ProfileNav.Navigator>
      <ProfileNav.Screen
        name="Account"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <ProfileNav.Screen name="Hub" component={HubScreen} />
      <ProfileNav.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
    </ProfileNav.Navigator>
  );
}

const LogNav = createStackNavigator();

function LogStack() {
  return (
    <LogNav.Navigator>
      <LogNav.Screen
        name="Properties"
        component={LogScreen}
        options={{
          headerLeft: () => null,
          headerShown: true,
          headerTitle: () => <Header title="Activity Logs" />,
        }}
      ></LogNav.Screen>
    </LogNav.Navigator>
  );
}

const NavBar = createBottomTabNavigator();

function AppNavBar() {
  return (
    <NavBar.Navigator
      tabBarOptions={{
        activeTintColor: "#008CFF",
        inactiveTintColor: "#4B4B4B",
      }}
    >
      <NavBar.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: "Guests",
          tabBarIcon: ({}) => (
            <Icon name="users" type="feather" color="black" />
          ),
        }}
      />
      <NavBar.Screen
        name="Devices"
        component={DevicesStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="grid" type="feather" color={color} size={31} />
          ),
        }}
      />
      <NavBar.Screen
        name="Logs"
        component={LogStack}
        options={{
          headerLeft: () => null,
          headerShown: true,
          headerTitle: () => <Header title="Activity Logs" />,

          tabBarIcon: ({}) => (
            <Icon name="file-text" type="feather" color="black" />
          ),
        }}
      />
      <NavBar.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" type="feather" color={color} size={31} />
          ),
        }}
      />
    </NavBar.Navigator>
  );
}

const GuestNavBar = createBottomTabNavigator();

function GuestAppNavBar() {
  return (
    <GuestNavBar.Navigator>
      <GuestNavBar.Screen
        name="HomeGuestStack"
        component={HomeGuestStack}
        options={{
          tabBarLabel: "Hubs",

          tabBarIcon: ({}) => <Icon name="home" type="feather" color="black" />,
        }}
      />
      <GuestNavBar.Screen
        name="Logs"
        component={LogStack}
        options={{
          headerLeft: () => null,
          headerShown: true,
          headerTitle: () => <Header title="Activity Logs" />,

          tabBarIcon: ({}) => (
            <Icon name="file-text" type="feather" color="black" />
          ),
        }}
      />
      <GuestNavBar.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({}) => <Icon name="user" type="feather" color="black" />,
        }}
      />
    </GuestNavBar.Navigator>
  );
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
      animationEnabled: false,
    }}
    headerMode="none"
  >
    {/* {console.log("AuthStack props ", props)} */}
    <Auth.Screen
      name="Login"
      component={LoginScreen}
      initialParams={{
        setLoadingTrue: props.setLoadingTrue,
        setLoadingFalse: props.setLoadingFalse,
        setGoToAuthFalse: props.setGoToAuthFalse,
        setGoToAppTrue: props.setGoToAppTrue,
      }}
    />
    <Auth.Screen name="Loading" component={LoadingScreen} />
    <Auth.Screen name="Register" component={RegisterScreen} />
    <Auth.Screen
      name="App"
      component={AppNavBar}
      initialParams={{
        setLoadingTrue: props.setLoadingTrue,
        setLoadingFalse: props.setLoadingFalse,
      }}
    />
    <Auth.Screen
      name="GuestApp"
      component={GuestAppNavBar}
      initialParams={{
        setLoadingTrue: props.setLoadingTrue,
        setLoadingFalse: props.setLoadingFalse,
      }}
    />
  </Auth.Navigator>
);

export default function App(props) {
  const [loading, setLoading] = useState(false);

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" />
        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={{
            color: "#FFF",
          }}
        />
        <NavigationContainer>
          <AuthStack
            setLoadingTrue={setLoading}
            // setGoToAppTrue={setGoToApp}
            setLoadingFalse={setLoading}
            // setGoToAuthFalse={setGoToAuth}
          />
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
