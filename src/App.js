import React from 'react';
import './App.less';
import {BrowserRouter, Redirect, Switch} from "react-router-dom";
import TitledRoute from "./shared/TitledRoute";
import LoginPage from "./views/LoginLayout/LoginPage/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <TitledRoute title="Login" path="/login" component={LoginPage}/>

        <Redirect to="/a" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;