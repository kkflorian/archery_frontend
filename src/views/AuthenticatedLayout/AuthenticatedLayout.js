import React from 'react';
import cls from './AuthenticatedLayout.module.less';
import {Typography, Avatar, Menu, Row, Col, Layout, Dropdown, Button, Divider, } from "antd";
import {useHistory} from "react-router-dom";

export default ({children, back, title}) => {
  return (
    <Layout className={cls.layout}>
      <Layout.Header className={cls.layoutHeader}>
        <HeaderRow back={back} title={title} />
      </Layout.Header>
      <Layout.Content>
        {children}
      </Layout.Content>
    </Layout>
  )
}

function HeaderRow({title, back}) {
  const history = useHistory();
  const menu = (
    <Menu>
      <Menu.Item key="0">Meine Statistik</Menu.Item>
      <Menu.Item key="1" danger>Abmelden</Menu.Item>
    </Menu>
  );

  //TODO add back icon
  //TODO add username in avatar
  return (
    <Row>
      <Col span={6}>
        {back != null && (
          <Button shape="circle" type="text" size="large" onClick={() => history.push(back)}>&=</Button>
        )}
      </Col>

      <Col span={12} className={cls.headerColTitle}>
        {title != null && (
          <Typography.Title level={4}>{title}</Typography.Title>
        )}
      </Col>

      <Col span={6} className={cls.headerColUser}>
        {back == null && (
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" >
            <Avatar size="large">U</Avatar>
          </Dropdown>
        )}
      </Col>
    </Row>
  )
}