import React from "react";
import {Typography} from "antd";
import cls from "./FormError.module.less"

export const FormError = ({message}) => (
  <div className={cls.wrapper}>
    {(message != null) && (
      <Typography.Text type="danger">{message}</Typography.Text>
    )}
  </div>
);