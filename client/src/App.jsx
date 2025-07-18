import React, { createContext, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Routing from "./router";
import { NoInternet } from "./components";
import store from "../src/redux/store/configureStore";

export const AppContext = createContext();

const persistor = persistStore(store);

function App() {
  const [hasInternet, setHasInternet] = useState(navigator.onLine);

  useEffect(() => {
    const setOffline = () => setHasInternet(false);
    const setOnline = () => setHasInternet(true);

    window.addEventListener("offline", setOffline);
    window.addEventListener("online", setOnline);

    return () => {
      window.removeEventListener("offline", setOffline);
      window.removeEventListener("online", setOnline);
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {!hasInternet && <NoInternet />}
        <Routing />
      </PersistGate>
    </Provider>
  );
}

export default App;
