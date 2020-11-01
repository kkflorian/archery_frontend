import React from "react";
import {Typography} from "antd";
import cls from "./TitledValue.module.less";

export default function({title, titleLevel = 5, titleClass = "", value, valueLevel = 2, valueClass = ""}) {
  return (
    <>
      <Typography.Title className={`${cls.title} ${titleClass}`} level={titleLevel}>{title}</Typography.Title>
      <Typography.Title className={`${cls.value} ${valueClass}`} level={valueLevel}>{value}</Typography.Title>
    </>
  )
}