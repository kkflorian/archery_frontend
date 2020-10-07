import React from 'react';
import cls from './HomePage.module.less';
import AuthenticatedLayout from "../AuthenticatedLayout";
import {List, Avatar} from 'antd';

export default () => {
  const data = [ // TODO add real data
    {
      title: " seit 01.01.2020 13:10 ",
      description: "3 Pfeil Wertung - Runde 2 von 3"
    },
    {
      title: " von 01.01.2020 13:10 bis 14:30 ",
      description: "3 Pfeil Wertung"
    },
  ];

  return (
    <AuthenticatedLayout title="Archery" contentClass={cls.content}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item className={cls.item}>
            <List.Item.Meta
              title={<><span className={cls.itemTitleParkour}>Parkour</span> {item.title}</>}
              description={item.description}
            />
            <Avatar.Group maxCount={2} maxPopoverPlacement="bottom">
              <Avatar size={"small"}>K</Avatar>
              <Avatar size={"small"}>G</Avatar>
              <Avatar size={"small"}>B</Avatar>
            </Avatar.Group>
          </List.Item>
        )}
      />
    </AuthenticatedLayout>
  )
}