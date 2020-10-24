import React from "react";
import {Tooltip, Avatar} from "antd";
import cls from './UserAvatar.module.less';

export default function ({username, fullName, ...rest}) {
  const colorClasses = [
    cls.avatarStyle1, cls.avatarStyle2, cls.avatarStyle3, cls.avatarStyle4, cls.avatarStyle5,
    cls.avatarStyle6, cls.avatarStyle7, cls.avatarStyle8, cls.avatarStyle9, cls.avatarStyle10
  ];
  const usernameChar = username.toUpperCase().charAt(0);
  const usernameSum = Math.abs([...username]
    .map(char => char.charCodeAt(0))
    .reduce((total, current) => ((total << 5) - total) + current, 0));

  const avatar = (
    <Avatar {...rest} className={colorClasses[usernameSum % colorClasses.length]}>
      {usernameChar}
    </Avatar>
  );

  return fullName != null ? (
    <Tooltip title={fullName} placement="bottom" trigger="click">
      {avatar}
    </Tooltip>
  ) : avatar;
}