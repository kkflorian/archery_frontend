import React from 'react';
import './App.less';
import {BrowserRouter, Redirect, Switch} from "react-router-dom";
import TitledRoute from "./shared/TitledRoute";
import LoginPage from "./views/LoginLayout/LoginPage/LoginPage";
import RegisterPage from "./views/LoginLayout/RegisterPage/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <TitledRoute title="Anmeldung" path="/login" component={LoginPage}/>
        <TitledRoute title="Registrierung" path="/register" component={RegisterPage}/>

        <Redirect to="/a" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;