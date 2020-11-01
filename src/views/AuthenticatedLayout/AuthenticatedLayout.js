import React, {useContext} from 'react';
import cls from './AuthenticatedLayout.module.less';
import {Spin, Typography, Menu, Row, Col, Layout, Dropdown, Button } from "antd";
import {useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {api} from "../../shared/api";
import {UserContext} from "../../shared/context";
import UserAvatar from "./shared/UserAvatar/UserAvatar";

export default ({children, back, title, contentClass}) => {
  return (
    <Layout className={cls.layout}>
      <Layout.Header className={cls.layoutHeader}>
        <HeaderRow back={back} title={title} />
      </Layout.Header>
      <Layout.Content className={`${cls.content} ${contentClass}`}>
        {children}
      </Layout.Content>
    </Layout>
  )
}

function HeaderRow({title, back}) {
  const {result} = useContext(UserContext);
  const history = useHistory();
  const {handle, loading} = api.useRequestState()

  const menu = (
    <Spin spinning={loading}>
      <Menu>
        <Menu.Item key="0" onClick={() => history.push("/a/stats")}>Meine Statistik</Menu.Item>
        <Menu.Item key="1" danger onClick={() => {
          api.delete("/users/session", {}, handle).then(() => history.push("../login"))
        }}>Abmelden</Menu.Item>
      </Menu>
    </Spin>
  );

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
            <UserAvatar size="large" username={result.data.username}/>
          </Dropdown>
        )}
      </Col>
    </Row>
  )
}