import React from 'react';
import cls from './HomePage.module.less';
import AuthenticatedLayout from "../AuthenticatedLayout";
import {Avatar, Button, List, Tooltip} from 'antd';
import {api} from "../../../shared/api";
import UserAvatar from "../shared/UserAvatar/UserAvatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";

export default () => {
  const history = useHistory();
  const [result, loading] = api.useGet("/events")

  return (
    <AuthenticatedLayout title="Archery" contentClass={cls.content}>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={result?.data?.["eventInfos"]}
        renderItem={(item, index) => (<EventListItem key={index} item={item}/>)}
      />

      <div className={cls.eventButtonWrapper}>
        <Tooltip title="Event erstellen" placement="left" >
          <Button type="primary" size="large" shape="circle"
                  icon={<FontAwesomeIcon icon={faPlus}/>} className={cls.eventButton}
                  onClick={() => history.push("./create-event")} />
        </Tooltip>
      </div>
    </AuthenticatedLayout>
  )
}

function EventListItem({item}) {
  /* TODO Change display after list changes
    const data = [
    {
      title: " seit 01.01.2020 13:10 ",
      description: "3 Pfeil Wertung - Runde 2 von 3"
    },
    {
      title: " von 01.01.2020 13:10 bis 14:30 ",
      description: "3 Pfeil Wertung"
    },
  ];
  */

  const title = (
    <>
      <span className={cls.itemTitleParkour}>{item["parkour"]}</span>
      {/*seit {item["timestamp"]}*/}
    </>
  )
  const description = (
    <>{item["gamemode"]} - Tier {item["animalCount"]} von {item["totalAnimals"]}</>
  )

  const getUserAvatar = (info, index) => (<UserAvatar key={index} username={info[0]} fullName={`${info[1]} ${info[2]}`} />);

  return (
    <List.Item className={cls.item}>
      <List.Item.Meta title={title} description={description}/>
      <Avatar.Group maxCount={2} maxPopoverPlacement="bottom">
        {getUserAvatar(item["creator"], 0)}
        {item["member"].map((memberInfo, index) => getUserAvatar(memberInfo, index + 1))}
      </Avatar.Group>
    </List.Item>
  )
}