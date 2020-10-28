import React, {useEffect} from 'react';
import {Route} from "react-router-dom";

export default props => {
  const { title, ...rest } = props;
  useEffect(() => {
    document.title = `${title} | Archery`;
  },[title]);
  return <Route {...rest} />;
};
