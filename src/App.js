import React from 'react';
import './App.less';
import {Route, BrowserRouter, Redirect, Switch} from "react-router-dom";
import TitledRoute from "./shared/TitledRoute";
import LoginPage from "./views/LoginLayout/LoginPage/LoginPage";
import RegisterPage from "./views/LoginLayout/RegisterPage/RegisterPage";
import HomePage from "./views/AuthenticatedLayout/HomePage/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <TitledRoute title="Anmeldung" path="/login" component={LoginPage}/>
        <TitledRoute title="Registrierung" path="/register" component={RegisterPage}/>

        <AuthenticatedArea/>

        <Redirect to="/a" />
      </Switch>
    </BrowserRouter>
  );
}

function AuthenticatedArea() {
    return (
        <>
            <TitledRoute title="Home" path="/home" component={HomePage} />
        </>
    )
}

export default App;