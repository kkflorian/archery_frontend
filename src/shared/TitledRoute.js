import React, {useEffect} from 'react';
import {Route} from "react-router-dom";
import {setWindowTitle} from "./misc";

export default props => {
  const { title, ...rest } = props;
  useEffect(() => {
    setWindowTitle(title);
  },[title]);
  return <Route {...rest} />;
};
