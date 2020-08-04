import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ListCustomer from '../pages/ListCustomer';
import RegisterAndUpdateCustomer from '../pages/RegisterAndUpdateCustomer';

const Routes: React.FC = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={ListCustomer} />
      <Route
        path="/register-and-update/"
        exact
        component={RegisterAndUpdateCustomer}
      />
      <Route
        path="/register-and-update/:id"
        component={RegisterAndUpdateCustomer}
      />
    </Switch>
  </Router>
);
export default Routes;
