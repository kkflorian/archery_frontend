import React, {useContext, useEffect} from "react";
import {UserContext} from "../../../shared/context";
import {Col, Divider, Row, Table, Typography} from "antd";
import cls from "./ResultPage.module.less";
import {showInModal} from "../../../shared/modal";
import TitledValue from "../shared/TitledValue/TitledValue";
import {setWindowTitle} from "../../../shared/misc";

export default function ({event, setTitle}) {
  const {result: {data: {username}}} = useContext(UserContext);
  const statsList = [ // todo remove test data
    {
      username: "user1",
      firstName: "Vorname",
      lastName: "Nachname",
      averagePoints: 18.5,
      totalPoints: 320,
      shotsTotal: 25,
      accuracy: 0.90
    },
    {
      username: "user2",
      firstName: "Vorname2",
      lastName: "Nachname2",
      totalPoints: 200,
      averagePoints: 17.5,
      shotsTotal: 30,
      accuracy: 0.80
    }
  ];

  useEffect(() => {
    setTitle("Eventübersicht");
    setWindowTitle("PARKOURNAME - Ergebnis")
  })

  return (
    <>
      <Row className="center">
        <Col span={12}>
          <TitledValue title="Wertung" value={"GAMEMODE"} valueLevel={4}/>
        </Col>
        <Col span={12}>
          <TitledValue title="Parkour" value={"PARKOURNAME"} valueLevel={4}/>
        </Col>
      </Row>
      <Divider plain/>

      <StatsDisplay title="Deine Stats" stats={statsList.find(stats => stats.username === username)}/>

      <Divider plain/>
      <Row justify={"center"}>
        <Col span={18}>
          <Typography.Title level={2} className={"center"}>Scoreboard</Typography.Title>
          <Scoreboard statsList={statsList} ownUsername={username} />
        </Col>
      </Row>
    </>
  )
}


function Scoreboard({statsList, ownUsername}) {
  const scoreboardColums = [
    {dataIndex: 'position'},
    {title: "Name", dataIndex: 'fullName'},
    {title: "Punkte", dataIndex: 'points'}
  ];
  const scoreboardData = statsList.sort((a, b) => b.totalPoints - a.totalPoints).map((stats, index) => ({
    position: "#" + (index + 1),
    fullName: stats.firstName + " " + stats.lastName,
    points: stats.totalPoints,
    stats
  }));

  // noinspection JSUnusedGlobalSymbols
  return (
    <Table dataSource={scoreboardData} columns={scoreboardColums} pagination={false}
           rowClassName={(record) => record.stats.username === ownUsername && cls.ownUserRow}
           rowKey={record => record.stats.username}
           onRow={record => ({
             onClick: () => {
               const title = record.stats.username === ownUsername ? "Deine Stats" : `${record.name}'s Stats`;
               showInModal(<StatsDisplay title={title} stats={record.stats}/>, {
                 footer: null,
                 closable: false
               })
             }
           })}
    />
  )
}

function StatsDisplay({title, stats}) {
  return (
    <>
      <Typography.Title className={"center"} level={4}>{title}</Typography.Title>
      <Row className="center">
        <Col span={12}>
          <TitledValue title="Gesamtpunkte" value={stats.totalPoints} valueLevel={1}/>
        </Col>
        <Col span={12}>
          <TitledValue title="Durchschnitt" value={stats.averagePoints} valueLevel={1}/>
        </Col>
      </Row>
      <Row className="center">
        <Col span={12}>
          <TitledValue title="Genauigkeit" value={`${Math.round(stats.accuracy * 100)}%`} valueLevel={1}/>
        </Col>
        <Col span={12}>
          <TitledValue title="Anzahl von Schüssen" value={stats.shotsTotal} valueLevel={1}/>
        </Col>
      </Row>
    </>
  )
}