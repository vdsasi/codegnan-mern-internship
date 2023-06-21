import ReactDOM from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Rootpage from "./components/auth/Rootpage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <ChakraProvider>
        <Rootpage />
      </ChakraProvider>
    </BrowserRouter>
  </Provider>
);
