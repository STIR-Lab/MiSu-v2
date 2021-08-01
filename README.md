# MiSu Home

<img src="https://i.imgur.com/GiWqsR0.png" width="50%">

MiSu Home

Built with React Native frontend and AWS Backend

Version: MiSu-v2

Sponsored by: [STIR-Lab](https://stirlab.org/)

- Use Home Assistant to control personal devices at your own home
- Easy access to add Home Assistant scripts or more devices
- Clean, modern, user-friendly UI

<img src="https://i.imgur.com/ZGt9eN0.png" width="80%">

## BUILD & RUN IT

Please refer to the engines field in package.json file for the minimum required versions of Node and npm. It is preferred that you use an even-numbered version of Node as these are LTS versions.

To view the version of Node and npm in your environment, run the following in your console:

```
node --version && npm --version
```

- In your console:

```
git clone https://github.com/STIR-Lab/MiSu-v2.git
cd MiSu-v2
npm install
npm start
```

## MODIFYING REDUX STATE

> Create a file In the redux /Action directory
> in your action file dispatch your Action to modify state accordingly
> i.e : calling a server request

1. first dispatch the loading to true
2. call request then dispatch loading to false with either the error or result

```js
export const yourAction = () =>
    return async (dispatch) =>{
        try {
            //your async network requesr
        const data =   await yournetworkrequest ()

        //dispatch your action to add the result and
        dispatch(setCurrentSession('SET_SESSION',data,true))

        } catch (error) {
            //dispatch your action to add the error in the state incase the network request failed
        dispatch( setCurrentSession('UNSET_SESSION', null,false))
        }
    }
}
```

> Create a file In the redux /Redux : to create the corresponding reducer

```js
export const yourReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_SESSION":
      //receive the new update and add it to store : result or error
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
```

> Combine the the reducer in redux: AppDataReducer.js

```js
export default combineReducers({
// yourreducerstate:yourReducer,
devicesData:listDevicesReducer,
....

});
```

> you can now access this in two ways
> 1.for class based components you can use mapdispatchtoprops to dispatch functions & mapStateToProps

```js
const mapStateToProps = (state) => {
  const { yourreducerstate } = state;
  return { yourreducerstate };
};
//can now access the reduxstate inn props i.e this.props.yourreducerstate.result || this.props.yourreducerstate.error || this.props.yourreducerstate.loading

const mapDispatchToProps = (dispatch) => {
  return {
    yourfunction: (params) => dispatch(yourAction(params)),
  };
};

//you can now call it this.props.yourfunction()
```

> 2.  for functional components you can use useSelector hook

```js
const yourstate = useSelector(state => state.yourreducerstate)

& call your action useDispatchhook

const dispatch = useDispatch()

dispatch( yourAction())
```

## SETUP ANDROID EMULATOR

https://reactnative.dev/docs/environment-setup

1. Install Android Studio

![alt text](https://reactnative.dev/docs/assets/GettingStartedAndroidStudioWelcomeWindows.png "Android Splash")

2. Configure->SDK Manager->Show Package Details
3. Select Android SDK Platform 28 and Android SDK Platform 28
4. Under SDK Platforms->Show Package Details-> Android SDK Build-Tools 28.0.3
5. Configure the ANDROID_HOME environment variable

![alt text](https://reactnative.dev/docs/assets/GettingStartedAndroidEnvironmentVariableANDROID_HOME.png "Android HOME")

6. On Android Studio, navigate to the upper right for an icon like so

![alt text](https://reactnative.dev/docs/assets/GettingStartedAndroidStudioAVD.png "Android SVD")

7. Create a new AVD, any phone(I chose pixel 3) and select Pie/API Level 28, hit next until finish
