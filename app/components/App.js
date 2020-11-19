// Routing components in this file.
import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";


export default prop =>
  <Router>
    <Switch>
      {/* <Route path="/" exact component={Home} /> */}
      <Route path="/login" exact component={Login} />
      <Route path="/home" exact component={Home} />
    </Switch>
  </Router>;