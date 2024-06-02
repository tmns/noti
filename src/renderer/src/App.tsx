import { HashRouter, Route } from "@solidjs/router";
import { lazy } from "solid-js";
import GlobalStoreProvider from "@renderer/context/GlobalStoreProvider";
import Dashboard from "@renderer/layouts/Dashboard";
import { PERSISTED_STORAGE } from "@renderer/libs/persisted-storage";

const Login = lazy(() => import("@renderer/pages/Login"));
const Registration = lazy(() => import("@renderer/pages/Registration"));
const Notifications = lazy(() => import("@renderer/pages/Notifications"));
const Pulls = lazy(() => import("@renderer/pages/Pulls"));
const Settings = lazy(() => import("@renderer/pages/Settings"));

function App() {
  const authKey = PERSISTED_STORAGE.get("noti-user-key");

  return (
    // Hash mode necessary for prod build to correctly route.
    <HashRouter>
      <Route path="/" component={authKey ? Login : Registration} />
      <Route path="/dashboard" component={GlobalStoreProvider}>
        <Route path="/" component={Dashboard}>
          <Route path="/notifications" component={Notifications} />
          <Route path="/pulls" component={Pulls} />
        </Route>
        <Route path="/settings" component={Settings} />
      </Route>
    </HashRouter>
  );
}

export default App;
