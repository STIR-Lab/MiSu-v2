import { deleteASharedAccount, deleteADevice } from "../../services/deleteService";
import { getSharedAccountsAction } from "../Action/getSharedAccountsAction";
import { getSharedDevicesAction } from "../Action/getSharedDevicesAction";

const stopSharingStart = (payload) => ({
  type: "STOP_SHARING",
  payload,
});

export const stopSharingAction = (login_id, idToken, type, sharedDevicesId) => {
  console.log("TYPE", type)
  console.log("LOG", login_id)
  console.log("idtok", idToken)
  console.log("SHRDDEVID", sharedDevicesId)
  return async (dispatch) => {
    try {
      dispatch(stopSharingStart({ loading: true }));

      if (type == 1) {
        await deleteADevice(login_id, sharedDevicesId, idToken);
      }
      else {
        await deleteASharedAccount(login_id, idToken);
      }

      dispatch(stopSharingStart({ loading: false }));
      dispatch(getSharedAccountsAction(idToken));
      dispatch(getSharedDevicesAction(idToken));
    } catch (error) {
      dispatch(stopSharingStart({ loading: false }));
    }
  };
};
