import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";

import MapView, {
  PROVIDER_GOOGLE,
  ProviderPropType,
  Marker,
  Polyline,
  AnimatedRegion,
  Callout,
} from "react-native-maps";
import { withNavigation } from "react-navigation";

import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { styles } from "../styles/styles.js";
import FancyButton from "../components/fancyButton";
import haversine from "haversine";
import { LinearGradient } from "expo-linear-gradient";
import Stop from "../components/stopWatch.js";

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 26.12177;
const LONGITUDE = -80.3832039;

export class RunTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),

      error: null,
    };
  }

  componentDidMount() {
    // this.requestCameraPermission();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
    const { coordinate } = this.state;
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        const { routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude,
        };
        console.log({ newCoordinate });

        this.setState({
          latitude,
          longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          distanceTravelled:
            distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLng: newCoordinate,
        });
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  calcDistance = (newLatLng) => {
    const { prevLatLng } = this.state;
    console.log(haversine(prevLatLng, newLatLng));
    return haversine(prevLatLng, newLatLng) / 1.6 || 0;
  };

  render() {
    if (this.state.distanceTravelled >= 1.5) {
      return (
        <LinearGradient colors={["#20E9A9", "#5762D5"]} style={styles.screen}>
          <View style={{}}>
            <Text
              style={{
                fontSize: 50,
                fontWeight: "bold",
                fontFamily: "monospace",
                paddingLeft: 75,
              }}
            >
              Testing Complete
            </Text>
            <Text
              style={{ fontSize: 20, fontStyle: "italic", paddingLeft: 70 }}
            >
              Your scores have been saved
            </Text>
            <View
              style={{ paddingLeft: 120, paddingTop: 80, paddingBottom: 80 }}
            >
              <Image
                style={{
                  width: 180,
                  height: 200,
                  //paddingHorizontal: 100,
                }}
                source={require("../img/check2.png")}
              />
            </View>

            <FancyButton
              text="Go Back Home"
              onPress={() => {
                this.props.navigation.navigate("Main");
              }}
            />
          </View>
        </LinearGradient>
      );
    }
    return (
      <View style={more_styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          followsUserLocation
          loadingEnabled
          style={more_styles.map}
          region={this.getMapRegion()}
        >
          <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
          <Marker.Animated
            ref={(marker) => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          />
        </MapView>

        <View
          style={{
            height: 150,
            backgroundColor: "#20E9A990",
            width: "100%",
            paddingLeft: 90,

            //flexDirection: "row",
          }}
        >
          <View style={{ flexDirection: "row", paddingBottom: 25 }}>
            <Text style={{ fontWeight: "bold", paddingTop: 13 }}>
              Distance:{" "}
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 35,
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              {parseFloat(this.state.distanceTravelled).toFixed(2)} mi
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold", paddingTop: 13 }}>Time: </Text>
            <Stop />
          </View>
        </View>
        <FancyButton
          text="End Run"
          onPress={() => {
            this.props.navigation.navigate("Fail");
          }}
        />
      </View>
    );
  }
}

const more_styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

//export default withNavigation(RunTracker);
