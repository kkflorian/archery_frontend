import LoginLayout from "../LoginLayout";
import {Button, Col, Form, Input, Row, Typography} from "antd";
import cls from "./RegisterPage.module.less";
import React from "react";
import {defaultRules} from "../../../shared/misc";

export default () => {
    return LoginLayout.wrap(
        <Row align="middle" justify="center" className={cls.mainRow}>
            <Col xs={20} md={8}>
                <Typography.Title level={2} className={cls.title}>
                    Registrierung
                </Typography.Title>

                <RegisterForm />
            </Col>
        </Row>
    );
};

const RegisterForm = () => {
    return (
        <Form name="register" layout="vertical">
            <Form.Item
                className={cls.formItem}
                name="username"
                label="Nutzername"
                rules={[defaultRules.requiredNoWhitespace]}>
                <Input placeholder="Nutzername" size="large" autoComplete="username"/>
            </Form.Item>

            <Form.Item
                className={cls.formItem}
                name="firstName"
                label="Vorname"
                rules={[defaultRules.requiredNoWhitespace]}>
                <Input placeholder="Vorname" size="large" autoComplete="given-name" />
            </Form.Item>

            <Form.Item
                className={cls.formItem}
                name="familyName"
                label="Nachname"
                rules={[defaultRules.requiredNoWhitespace]}>
                <Input placeholder="Nachname" size="large" autoComplete="family-name" />
            </Form.Item>

            <Form.Item
                className={cls.formItem}
                name="password"
                label="Passwort"
                rules={[defaultRules.requiredNoWhitespace]}>
                <Input.Password placeholder="Passwort" size="large" autoComplete="new-password"/>
            </Form.Item>

            <Form.Item>
                <Button type="primary" size="large" htmlType="submit" className={cls.submitButton}>
                    Registrieren
                </Button>
            </Form.Item>
        </Form>
    )
};