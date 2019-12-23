import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/appliedRoute";

import Contests from "./contests";
import Login from "./login";

export default function Routes({ appProps }) {
  return (
    <Switch>
      <AppliedRoute path="/contests" exact component={Contests} appProps={appProps} />
      <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
      {/* Finally, catch all unmatched routes */}
      
    </Switch>
  );
}