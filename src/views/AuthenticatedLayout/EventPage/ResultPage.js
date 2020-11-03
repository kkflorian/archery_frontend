import React, {useContext, useEffect} from "react";
import {UserContext} from "../../../shared/context";
import {Col, Divider, Row, Table, Typography} from "antd";
import cls from "./ResultPage.module.less";
import {showInModal} from "../../../shared/modal";
import TitledValue from "../shared/TitledValue/TitledValue";
import {possessive, setWindowTitle} from "../../../shared/misc";
import roundTo from 'round-to';
import BlankSpace from "../../../shared/BlankSpace";
import {api} from "../../../shared/api";

export default function ({event, setTitle}) {
  useEffect(() => {
    setTitle("Eventübersicht");
    setWindowTitle(`${event["parkour"]["parkourName"]} - Ergebnis`)
  })

  return (
    <api.Loader consumer={true} endpoint={`/events/${event.eventId}/stats`}>
      {({data}) => (<ResultPageContent statsList={data["stats"]} event={event}/>)}
    </api.Loader>
  )
}

function ResultPageContent({statsList, event}) {
  const {result: {data: {username}}} = useContext(UserContext);

  return (
    <>
      <Row className="center">
        <Col span={12}>
          <TitledValue title="Wertung" value={event["gameMode"]["gameMode"]} valueLevel={4}/>
        </Col>
        <Col span={12}>
          <TitledValue title="Parkour" value={event["parkour"]["parkourName"]} valueLevel={4}/>
        </Col>
      </Row>
      <Divider plain/>

      <StatsDisplay title="Deine Stats" stats={statsList.find(stats => stats.username === username)}/>

      <Divider plain/>
      <Row justify={"center"}>
        <Col span={22}>
          <Typography.Title level={4} className={"center"}>Scoreboard</Typography.Title>
          <BlankSpace height={16}/>
          <Scoreboard statsList={statsList} ownUsername={username}/>
        </Col>
      </Row>

      <BlankSpace height={64}/>
    </>
  )
}


function Scoreboard({statsList, ownUsername}) {
  const scoreboardColums = [
    {dataIndex: 'position'},
    {title: "Name", dataIndex: 'fullName'},
    {title: "Punkte", dataIndex: 'points'}
  ];
  const scoreboardData = statsList.sort((a, b) => b["totalPoints"] - a["totalPoints"]).map((stats, index) => ({
    position: "#" + (index + 1),
    fullName: stats.firstName + " " + stats.lastName,
    points: stats["totalPoints"],
    stats
  }));

  // noinspection JSUnusedGlobalSymbols
  return (
    <Table dataSource={scoreboardData} columns={scoreboardColums} pagination={false}
           rowClassName={(record) => record.stats.username === ownUsername && cls.ownUserRow}
           rowKey={record => record.stats.username}
           onRow={record => ({
             onClick: () => {
               const title = record.stats.username === ownUsername ? "Deine Statistik"
                 : `${possessive(record.stats.firstName)} Statistik`;
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
          <TitledValue title="Gesamtpunkte" value={stats["totalPoints"]} valueLevel={1}/>
        </Col>
        <Col span={12}>
          <TitledValue title="Durchschnitt" value={roundTo(stats["averagePoints"], 1)} valueLevel={1}/>
        </Col>
      </Row>
      <Row className="center">
        <Col span={12}>
          <TitledValue title="Genauigkeit" value={`${Math.round(stats["accuracy"] * 100)}%`} valueLevel={1}/>
        </Col>
        <Col span={12}>
          <TitledValue title="Schüsse" value={stats["totalShots"]} valueLevel={1}/>
        </Col>
      </Row>
    </>
  )
}