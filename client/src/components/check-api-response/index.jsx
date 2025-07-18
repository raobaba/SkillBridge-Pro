

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Acknowledge } from "../../components";
import { Dialog } from "../../ui-controls";
import store from "../../redux/store/configureStore";

import { setToken } from "../../services/utils";

const checkApiResponse = (Wrapped) => {
  const HandleResponse = ({ props }) => {
    const [isAPIFailed, setAPIFailed] = useState(false);
    const [error, setError] = useState("");
    const [errorIcon, setErrorIcon] = useState("");

    const onLogout = () => {
      setToken("");
      store.dispatch();
      setTimeout(() => {
        location.replace("/sign-in");
      }, 5000);
    };

    useEffect(() => {
      const interceptor = axios.interceptors.response.use(
        (response) => response,
        (err) => {
          const { response } = err;
          let errMessage = "";
          let errorIcon = "";
          let globalErrorHandler = false;

          if (response) {
            globalErrorHandler = true;
            switch (response?.status) {
              case 404:
                errMessage = "Please contact your System Administrator";
                errorIcon = "icon-URL-not-found1";
                break;
              // case 400:
              //   errMessage = "Please contact your System Administrator";
              //   errorIcon = "icon-URL-not-found1";
              //   break;
              case 401:
                // errMessage =
                //   "Your system configuration is not yet ready. Please reach out to Tevha Support Team";
                // errorIcon = "icon-URL-not-found1";
                onLogout();
                break;
              case 503:
                errMessage = "System is unavailable due to planned outage.";
                errorIcon = "icon-planned-outage1";
                break;
              case 500:
                errMessage = "System is unavailable. Please try again shortly.";
                errorIcon = "icon-System-is-unavailable";
                break;
              default:
                globalErrorHandler = false;
                break;
            }
          }

          if (globalErrorHandler) {
            setAPIFailed(true);
            setError(errMessage);
            setErrorIcon(errorIcon);
          }
          return Promise.reject(err); // Properly reject the promise
        },
      );

      // Cleanup interceptor on unmount
      return () => {
        axios.interceptors.response.eject(interceptor);
      };
    }, []); // Add empty dependency array

    const onClose = () => {
      setAPIFailed(false);
    };

    return (
      <>
        {error && (
          <Dialog
            dialogStyle="error-dialog"
            closeModal={onClose}
            visible={isAPIFailed}
          >
            <Acknowledge message={error} errorIcon={errorIcon} />
          </Dialog>
        )}
        <Wrapped {...props} />
      </>
    );
  };
  return HandleResponse;
};

export default checkApiResponse;
