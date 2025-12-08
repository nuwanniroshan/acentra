import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { TenantDetector } from "./components/TenantDetector";
import { Provider } from "react-redux";
import { store } from "./store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <TenantDetector>
          <App />
        </TenantDetector>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
