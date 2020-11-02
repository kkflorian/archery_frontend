import cls from './IngamePage.module.less';
import {lastFromArray, setWindowTitle} from "../../../shared/misc";
import React, {useEffect} from "react";
import {api} from "../../../shared/api";
import {Avatar, Button, Col, Divider, Radio, Row} from "antd";
import {FormError} from "../../../shared/FormError/FormError";
import useArrayState from "use-array-state";
import TitledValue from "../shared/TitledValue/TitledValue";

export default function ({setTitle, event, reload}) {
  const GamemodeComponent = gamemodeComponents[String(event["gameModeId"])];
  const currentShooter = event.members.reduce((previous, current) => { // Find first user with least shots
    return (previous == null || current["shots"].length < previous["shots"].length) ? current : previous;
  });
  const currentAnimal = lastFromArray(currentShooter["shots"], {animalNumber: 0})["animalNumber"] + 1;

  const {result: putResult, loading: putLoading, handle: putHandle} = api.useRequestState();

  // todo add parkourname
  // todo add animal count
  useEffect(() => {
    setTitle(`PARKOURNAME (${currentAnimal}/TOTAL)`);
    setWindowTitle("PARKOURNAME - Ingame")
  }, [currentAnimal, setTitle])

  async function onContinue(shots, resetShots) {
    const result = await api.put("/events/" + event["eventId"] + "/shots", {
      animalNumber: currentAnimal,
      username: currentShooter.username,
      shots: shots.map((points, index) => ({points, shotNumber: index + 1}))
    }, putHandle);

    if (result.hasError) return;

    resetShots();
    reload();
  }

  return (
    <div className={cls.content}>
      <TitledValue title="Aktueller Schütze" value={currentShooter.username}/>
      <Divider plain type="horizontal"/>

      <GamemodeComponent onContinue={onContinue} loading={putLoading} />

      <FormError message={putResult?.errorMessage}/>
    </div>
  );
}

const gamemodeComponents = {
  "1": ThreeArrowGamemode,
  "2": TwoArrowGamemode
}
const createPointsOptions = (points) => ([
  ...points.map(p => ({label: String(p), value: p})),
  {label: "MISS", value: 0},
]);

/* Two arrow gamemode */
function TwoArrowGamemode({onContinue, loading}) {
  const pointTables = [
    createPointsOptions([11, 10, 8, 5]),
    createPointsOptions([11, 10, 8, 5])
  ];

  const [shotValues, $shotValues] = useArrayState([])

  const groups = pointTables
    .map((pointTable, index) => (
      <NumberedRow key={index} number={index + 1}>
        <Radio.Group options={pointTable} optionType="button" size="large" buttonStyle="solid"
                     value={shotValues[index]}
                     onChange={ev => $shotValues.update(index, ev.target.value)}/>
      </NumberedRow>
    ));

  return (
    <>
      {groups}

      {(shotValues.length === 2) && (
        <ContinueButton onClick={() => {
          onContinue(shotValues, () => $shotValues.set([]));
        }} loading={loading}/>
      )}
    </>
  )
}

/* Three arrow gamemode */
function ThreeArrowGamemode({onContinue, loading}) {
  const pointTables = [
    createPointsOptions([20, 18, 16]),
    createPointsOptions([14, 12, 10]),
    createPointsOptions([8, 6, 4])
  ];
  const [shotValues, $shotValues] = useArrayState([])

  const groups = pointTables
    .filter((v, index) => index === 0 || shotValues[index - 1] === 0)
    .map((pointTable, index) => (
      <NumberedRow key={index} number={index + 1}>
        <Radio.Group options={pointTable} optionType="button" size="large" buttonStyle="solid"
                     value={shotValues[index]}
                     onChange={ev => {
                       $shotValues.update(index, ev.target.value);
                       $shotValues.splice(index + 1, 3)
                     }}/>
      </NumberedRow>
    ));
  return (
    <>
      {groups}

      {(shotValues.some(value => value > 0) || shotValues.length === 3) && (
        <ContinueButton onClick={() => {
          onContinue(shotValues, () => $shotValues.set([]));
        }} loading={loading}/>
      )}
    </>
  )
}

function NumberedRow({number, children, colClassName}) {
  return (
    <Row align={"middle"}>
      <Col span={8} className={cls.numberCircleCol}>
        <Avatar size={64} className={cls.numberCircle}>{number}</Avatar>
      </Col>
      <Col span={16} className={colClassName}>
        {children}
      </Col>
    </Row>
  )
}

function ContinueButton({...rest}) {
  return (
    <Button size="large" type="primary" htmlType="submit" className={cls.continueButton} {...rest}>
      Nächster Spieler
    </Button>
  )
}