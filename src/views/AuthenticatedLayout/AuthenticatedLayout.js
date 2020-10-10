import React from 'react';
import cls from './AuthenticatedLayout.module.less';
import {Typography, Avatar, Menu, Row, Col, Layout, Dropdown, Button } from "antd";
import {useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

export default ({children, back, title, contentClass}) => {
  return (
    <Layout className={cls.layout}>
      <Layout.Header className={cls.layoutHeader}>
        <HeaderRow back={back} title={title} />
      </Layout.Header>
      <Layout.Content className={contentClass}>
        {children}
      </Layout.Content>
    </Layout>
  )
}

function HeaderRow({title, back}) {
  const history = useHistory();
  const menu = (
    <Menu >
      <Menu.Item key="0">Meine Statistik</Menu.Item>
      <Menu.Item key="1" danger>Abmelden</Menu.Item>
    </Menu>
  );

  //TODO add username in avatar
  return (
    <Row>
      <Col span={6}>
        {back != null && (
          <Button shape="circle" type="text" size="large" onClick={() => history.push(back)}>
            <FontAwesomeIcon icon={faArrowLeft}/>
          </Button>
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