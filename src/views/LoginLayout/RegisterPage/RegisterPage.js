import LoginLayout from "../LoginLayout";
import {Button, Col, Form, Input, Row, Spin, Typography} from "antd";
import cls from "./RegisterPage.module.less";
import React from "react";
import {countCharTypes, defaultRules} from "../../../shared/misc";
import {useHistory} from "react-router-dom";
import {api} from "../../../shared/api";
import {FormError} from "../../../shared/FormError/FormError";

export default () => {
  return LoginLayout.wrap(
    <Row align="middle" justify="center" className={cls.mainRow}>
      <Col xs={20} md={8}>
        <Typography.Title level={2} className={cls.title}>
          Registrierung
        </Typography.Title>

        <RegisterForm/>
      </Col>
    </Row>
  );
};

const RegisterForm = () => {
  const history = useHistory();
  const {handle, result, loading} = api.useRequestState()

  function onResponse({hasError}) {
    if (!hasError) {
      history.push("/a");
    }
  }

  return (
    <Spin spinning={loading}>
      <Form name="register" layout="vertical" onFinish={formData => api.put("/users", formData, handle).then(onResponse)}>
        <Form.Item
          className={cls.formItem}
          name="username"
          label="Nutzername"
          validateFirst
          rules={[
            defaultRules.requiredNoWhitespace,
            {min: 3, max: 20, message: "Der Nutzername muss zwischen 3 und 20 Zeichen lang sein"},
            {pattern: "^[A-Za-z0-9_]{3,20}$", message: "Der Nutzername darf nur aus Buchstaben, Zahlen und Unterstrichen bestehen"}
          ]}>
          <Input placeholder="Nutzername" size="large" autoComplete="username"/>
        </Form.Item>

        <Form.Item
          className={cls.formItem}
          name="firstName"
          label="Vorname"
          rules={[defaultRules.requiredNoWhitespace]}>
          <Input placeholder="Vorname" size="large" autoComplete="given-name"/>
        </Form.Item>

        <Form.Item
          className={cls.formItem}
          name="lastName"
          label="Nachname"
          rules={[defaultRules.requiredNoWhitespace]}>
          <Input placeholder="Nachname" size="large" autoComplete="family-name"/>
        </Form.Item>

        <Form.Item
          className={`${cls.formItem} ${cls.lastFormItem}`}
          name="password"
          label="Passwort"
          validateFirst
          rules={[
            defaultRules.requiredNoWhitespace,
            {required: true, min: 8, message: "Das Passwort muss min. acht Zeichen lang sein"},
            {
              required: true,
              validator: (rule, value) => {
                if (countCharTypes(value) < 2) {
                  return Promise.reject("Das Passwort muss min. zwei Zeichentypen enthalten");
                }

                return Promise.resolve();
              },
            }
          ]}>
          <Input.Password placeholder="Passwort" size="large" autoComplete="new-password"/>
        </Form.Item>

        <FormError message={result?.errorMessage}/>

        <Form.Item>
          <Button type="primary" size="large" htmlType="submit" className={cls.submitButton}>
            Registrieren
          </Button>
          <Button type="default" size="large" className={cls.loginButton}
                  onClick={() => history.push("./login")}>
            Zurück zum Login
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
};