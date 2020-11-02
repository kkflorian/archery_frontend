import React from "react";
import cls from './StatsPage.module.less'
import {api} from "../../../shared/api";
import {Col, Divider, Empty, Row, Select, Spin} from "antd";
import AuthenticatedLayout from "../AuthenticatedLayout";
import TitledValue from "../shared/TitledValue/TitledValue";
import { ResponsiveLine } from '@nivo/line'
import roundTo from "round-to";

export default function () {
  const {handle: numbersHandle, result: numbersResult, loading: numbersLoading} = api.useRequestState();
  const {handle: graphHandle, result: graphResult, loading: graphLoading} = api.useRequestState();

  const [gamemodeResult, gamemodeLoading] = api.useGet("/gamemodes");
  const gamemodeOptions = gamemodeResult?.data["gameModes"].map(gameMode => ({
    label: gameMode["gameMode"],
    value: gameMode["id"]
  }))

  function onGamemodeChange(value) {
    api.get(`/stats/${value}/numbers`, numbersHandle).finally();
    api.get(`/stats/${value}/graph`, graphHandle).finally();
  }

  const graphEntries = graphResult?.data.graphEntries;
  return (
    <AuthenticatedLayout back="/a/home" title="Meine Statistik" contentClass={cls.content}>
      <Select size="large" placeholder="Zählweise auswählen" className={cls.gamemodeSelect}
              loading={gamemodeLoading} options={gamemodeOptions} onChange={onGamemodeChange} />

      {(numbersResult != null && graphResult != null) ? (
        graphEntries.length < 2
          ? (<Empty className={cls.noData} description="Es werden min. 2 Events für die Statistik benötigt" />)
          : (<StatsDisplay graphEntries={graphEntries} numbers={numbersResult?.data}/>)
      ) : (<Spin spinning={(numbersLoading || graphLoading)} />)}
    </AuthenticatedLayout>
  );
}

function StatsDisplay({numbers, graphEntries}) {
  return (
    <>
      <NumbersDisplay numbers={numbers} />
      <Divider plain />
      <div className={cls.graphWrapper}>
        <StatsGraph rawData={graphEntries} />
      </div>
    </>
  )
}

// graphData
function StatsGraph({rawData}) {
  const data = [
    {
      id: "data",
      data: rawData.map((value, index) => ({
        x: (index + 1),
        y: value
      }))
    }
  ];

  return (
    <ResponsiveLine
      data={data}

      curve="catmullRom"
      lineWidth={4}
      margin={{ top: 5, right: 15, bottom: 40, left: 40 }}

      xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
      yScale={{ type: 'linear', min: 0, max: 20 }}
      yFormat={value => roundTo(value, 1)}
      sliceTooltip={({slice}) => {
        const {xFormatted,yFormatted} = slice.points[0].data;
        return <GraphTooltip x={xFormatted} y={yFormatted}/>;
      }}

      theme={{
        textColor: 'rgba(255, 255, 255, 0.85)',
        tickColor: 'rgba(255, 255, 255, 0.85)',
        fontSize: '12px',
      }}
      colors={["#ff4d4f"/*@red-5*/]}
      axisBottom={{
        orient: 'bottom',
        tickPadding: 5,
        legend: 'Event',
        legendOffset: 35,
        legendPosition: 'middle'
      }}
      axisLeft={{
        orient: 'left',
        tickPadding: 5,
        legend: 'Durchschnittliche Punkte',
        legendOffset: -35,
        legendPosition: 'middle'
      }}

      enablePoints={false}
      enableCrosshair={false}
      enableSlices="x"
    />
  )
}

function GraphTooltip({x, y}) {
  return (
    <div className={cls.graphTooltip}>
      {x}. Event: {y} Punkte
    </div>
  )
}

function NumbersDisplay({numbers}) {
  return (
    <div className="center">
      <Row>
        <Col span={12}>
          <TitledValue title="Getötete Tiere" value={numbers["totalHits"]} valueLevel={5}/>
        </Col>
        <Col span={12}>
          <TitledValue title="Geschossene Pfeile" value={numbers["totalShots"]} valueLevel={5}/>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <TitledValue title="Gespiele Events" value={numbers["totalEvents"]} valueLevel={5}/>
        </Col>
        <Col span={12}>
          <TitledValue title="Durchschnittspunkte" value={roundTo(numbers["averageOverall"], 1)} valueLevel={5}/>
        </Col>
      </Row>
    </div>
  )
}