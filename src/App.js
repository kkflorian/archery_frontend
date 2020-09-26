import React from 'react';
import classes from './App.module.less';
import {BrowserRouter, Redirect, Switch} from "react-router-dom";
import TitledRoute from "./shared/TitledRoute";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <TitledRoute title="Login" path="/login" onrender={() => (<></>)}/>
        <Redirect to="/a" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;