import React from "react";
import { createContext, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Routing from "./router";
import { CircularLoader, NoInternet } from "./components";
import checkApiResponse from "./components/check-api-response";
import store from "../src/redux/store/configureStore";

export const AppContext = createContext();

function App() {
  const [hasInternet, setHasInternet] = useState(navigator.onLine);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    window.addEventListener("offline", setOffline);
    window.addEventListener("online", setOnline);
    return () => {
      window.removeEventListener("offline", setOffline);
      window.addEventListener("online", setOnline);
    };
  });

  const setOffline = () => {
    setHasInternet(false);
  };

  const setOnline = () => {
    setHasInternet(true);
  };

  const persistor = persistStore(store);
  const appProps = {
    isLoading,
    setLoading,
  };
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {!hasInternet && <NoInternet />}
           {/* {isLoading ? <CircularLoader /> : null}
          <AppContext.Provider value={appProps}> */}
            <Routing />
          {/* </AppContext.Provider> */}
        </PersistGate>
      </Provider>
    </>
  );
}

export default checkApiResponse(App);
