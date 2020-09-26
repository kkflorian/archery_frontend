import React from "react";
import {Layout} from "antd";
import classes from "./LoginLayout.module.less";

const LoginLayout = ({children}) => {
  return (
    <Layout className={classes.layout}>
      <Layout.Content className={classes.content}>
        {children}
      </Layout.Content>
    </Layout>
  );
};

export default Object.assign(LoginLayout, {
  wrap: (children) => (<LoginLayout>{children}</LoginLayout>)
});