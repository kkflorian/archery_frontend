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

        <Route path="/a" component={AuthenticatedArea} />

        <Redirect to="/a" />
      </Switch>
    </BrowserRouter>
  );
}

function AuthenticatedArea() {
  const loggedIn = true; // TODO Use user state
  return (
    <Switch>
      {loggedIn ? (
        <>
          <TitledRoute title="Home" path="/a/home" component={HomePage}/>
          <Redirect to="/a/home"/>
        </>
      ) : (
        <Redirect to="/login"/>
      )}
    </Switch>
  )
}

export default App;