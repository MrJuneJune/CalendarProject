// Routing components in this file.
import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";

export default prop =>
  <Router>
    <Switch>
      {/* <Route path="/" exact component={Home} /> */}
      <Route path="/login" exact component={Login} />
    </Switch>
  </Router>;