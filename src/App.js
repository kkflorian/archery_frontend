import React from 'react';
import './App.less';
import {Route, BrowserRouter, Redirect, Switch} from "react-router-dom";
import TitledRoute from "./shared/TitledRoute";
import LoginPage from "./views/LoginLayout/LoginPage/LoginPage";
import RegisterPage from "./views/LoginLayout/RegisterPage/RegisterPage";
import HomePage from "./views/AuthenticatedLayout/HomePage/HomePage";
import CreateEventPage from "./views/AuthenticatedLayout/CreateEventPage/CreateEventPage";
import {api} from "./shared/api";
import {UserContext} from "./shared/context";
import EventPage from "./views/AuthenticatedLayout/EventPage/EventPage";
import StatsPage from "./views/AuthenticatedLayout/StatsPage/StatsPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <TitledRoute title="Anmeldung" path="/login" component={LoginPage}/>
        <TitledRoute title="Registrierung" path="/register" component={RegisterPage}/>

        <Route path="/a" component={AuthenticatedArea}/>

        <Redirect to="/a"/>
      </Switch>
    </BrowserRouter>
  );
}

function AuthenticatedArea() {
  return (
    <api.Loader endpoint="/users/session" consumer={UserContext} createError={() => <Redirect to="/login" />}>
      <Switch>
        <TitledRoute title="Home" path="/a/home" component={HomePage} />
        <TitledRoute title="Event erstellen" path="/a/create-event" component={CreateEventPage} />
        <Route path="/a/event/:eventId" component={EventPage} />
        <TitledRoute title="Statistiken" path="/a/stats" component={StatsPage} />

        <Redirect to="/a/home"/>
      </Switch>
    </api.Loader>
  )
}

export default App;