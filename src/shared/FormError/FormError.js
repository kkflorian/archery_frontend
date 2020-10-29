import React from "react";
import {Typography} from "antd";
import cls from "./FormError.module.less"

export const FormError = ({message, marginStart = 0}) => (
  <div className={cls.wrapper} style={{marginLeft: marginStart}}>
    {(message != null) && (
      <Typography.Text type="danger">{message}</Typography.Text>
    )}
  </div>
);