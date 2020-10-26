import React from 'react';
import cls from './HomePage.module.less';
import AuthenticatedLayout from "../AuthenticatedLayout";
import {Avatar, Button, List, Tooltip} from 'antd';
import {api} from "../../../shared/api";
import UserAvatar from "../shared/UserAvatar/UserAvatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";
import dayjs from 'dayjs';

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
  const getUserAvatar = (info, index) => (<UserAvatar key={index} username={info[0]} fullName={`${info[1]} ${info[2]}`} />);
  // TODO Open event on click
  return (
    <List.Item className={cls.item}>
      {item["timestampEnd"] == null ? (<IngameItemMeta item={item} />) : (<FinishedItemMeta item={item}/>)}
      <Avatar.Group maxCount={2} maxPopoverPlacement="bottom">
        {getUserAvatar(item["creator"], 0)}
        {item["member"].map((memberInfo, index) => getUserAvatar(memberInfo, index + 1))}
      </Avatar.Group>
    </List.Item>
  )
}

const FullDateFormat = "DD.MM.YY HH:mm";
const ShortDateFormat = "HH:mm";

function FinishedItemMeta({item}) {
  const startTs = dayjs(item["timestamp"]), endTs = dayjs(item["timestampEnd"]);
  return (
    <List.Item.Meta title={
      <>
        <span className={cls.itemTitleParkour}>{item["parkour"]}</span> {" "}
        von {startTs.format( startTs.isSame(dayjs(), 'day') ? ShortDateFormat : FullDateFormat)} {" "}
        bis {endTs.format(startTs.isSame(endTs, 'day') ? ShortDateFormat : FullDateFormat)}
      </>
    } description={`${item["gameMode"]} | Abgeschlossen`}/>
  )
}

function IngameItemMeta({item}) {
  const startTs = dayjs(item["timestamp"]);
  return (
    <List.Item.Meta title={
      <>
        <span className={cls.itemTitleParkour}>{item["parkour"]}</span> {" "}
        seit {startTs.format(startTs.isSame(dayjs(), 'day') ? ShortDateFormat : FullDateFormat)}
      </>
    } description={`${item["gameMode"]} | Tier ${item["currentAnimal"]} von ${item["totalAnimals"]}`}/>
  )
}