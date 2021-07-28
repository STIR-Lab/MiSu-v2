import { createHub } from '../../services/creationService';

const registerHubStart = (payload) => ({
  type: 'REGISTER_HUB',
  payload,
});

const registerHubSucess = (payload) => ({
  type: 'REGISTER_HUB',
  payload,
});

const registerHubFailed = (payload) => ({
  type: 'REGISTER_HUB',
  payload,
});

export const registerHubAction = (
  { hub_url, hub_token},
  idToken
) => {
  return async (dispatch) => {
     console.log('ACTION==========');
     console.log(hub_url, hub_token);
    try {
      
      dispatch(registerHubStart({ loading: true, success: null, error: null }));
      hub_url = hub_url;
      const hubDat = {
        hub_url,
        hub_token,
      };
      const data = await createHub(hubDat, idToken).catch(err => console.log(err));
      dispatch(
        registerHubSucess({ loading: false, success: true, error: null, data: data })
      )
      return data;
    } catch (error) {
      console.log("===================================CATCH BLOCK====================================")
      dispatch(
        registerHubFailed({
          loading: false,
          success: false,
          error: error,
        })
      );
    }
  };
};
