import React from "react";
import LoginLayout from "../LoginLayout";
import {Button, Row, Col, Form, Typography, Input, Spin} from "antd";
import cls from './LoginPage.module.less';
import {defaultRules} from "../../../shared/misc";
import {FormError} from "../../../shared/FormError/FormError";
import {useHistory} from "react-router-dom";
import {api} from "../../../shared/api";

export default () => {
  return LoginLayout.wrap(
    <Row align="middle" justify="center" className={cls.mainRow}>
      <Col xs={20} md={8}>
        <Typography.Title level={2} className={cls.title}>
          Anmeldung
        </Typography.Title>

        <LoginForm/>
      </Col>
    </Row>
  );
};

const LoginForm = () => {
  const history = useHistory();
  const {handle, result, loading} = api.useRequestState()

  function onResponse({hasError, errorCode}) {
    if (hasError && errorCode !== "ALREADY_LOGGED_IN") return;
    history.push("/a")
  }

  return (
    <Spin spinning={loading}>
      <Form name="login" layout="vertical" onFinish={formData => api.post("/users/login", formData, handle).then(onResponse)}>
        <Form.Item
          className={cls.formItem}
          name="username"
          label="Nutzername"
          rules={[defaultRules.requiredNoWhitespace]}>
          <Input placeholder="Nutzername" size="large" autoComplete="username"/>
        </Form.Item>

        <Form.Item
          className={cls.formItem}
          name="password"
          label="Passwort"
          rules={[defaultRules.requiredNoWhitespace]}>
          <Input.Password placeholder="Passwort" size="large" autoComplete="current-password"/>
        </Form.Item>

        <FormError message={result?.errorCode !== "ALREADY_LOGGED_IN" && result?.errorMessage} />

        <Form.Item>
          <Button type="primary" size="large" htmlType="submit" className={cls.submitButton}>
            Anmelden
          </Button>
          <Button type="default" size="large" className={cls.registerButton}
                  onClick={() => history.push("./register")}>
            Noch kein Account?
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};
