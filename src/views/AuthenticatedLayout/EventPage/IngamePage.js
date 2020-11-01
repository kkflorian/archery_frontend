import cls from './IngamePage.module.less';
import {lastFromArray, mapKeysToArray, setWindowTitle} from "../../../shared/misc";
import React, {useEffect, useState} from "react";
import {api} from "../../../shared/api";
import {Avatar, Button, Col, Divider, Form, Radio, Row, Typography} from "antd";
import {FormError} from "../../../shared/FormError/FormError";
import useArrayState from "use-array-state";

export default function({setTitle, event, reload}) {
  const GamemodeComponent = gamemodeComponents[String(event["gameModeId"])];
  const currentShooter = event.members.reduce((previous, current) => { // Find first user with least shots
    return (previous == null || current["shots"].length < previous["shots"].length) ? current : previous;
  });
  const currentAnimal = lastFromArray(currentShooter["shots"], {animalNumber: 0})["animalNumber"] + 1;

  const [error, setError] = useState();

  // todo add parkourname
  // todo add animal count
  useEffect(() => {
    setTitle(`PARKOURNAME (${currentAnimal}/TOTAL)`);
    setWindowTitle("PARKOURNAME - Ingame")
  }, [currentAnimal])

  async function onContinue(shots, resetShots) {
    setError(null);
    const result = await api.put("/events/" + event["eventId"] + "/shots", {
      animalNumber: currentAnimal,
      username: currentShooter.username,
      shots: shots.map((points, index) => ({points, shotNumber: index + 1}))
    });

    if (result.hasError) {
      setError(result.errorMessage);
      return;
    }

    resetShots();
    reload();
  }

  return (
    <div className={cls.content}>
      <Typography.Title className={cls.usernameHeader} level={5}>Aktueller Schütze</Typography.Title>
      <Typography.Title className={cls.username} level={2}>{currentShooter.username}</Typography.Title>
      <Divider plain type="horizontal"/>

      <GamemodeComponent onContinue={onContinue}/>
      <FormError message={error} />
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
function TwoArrowGamemode({onContinue}) {
  const pointTables = [
    createPointsOptions([40, 30, 20, 10]),
    createPointsOptions([40, 30, 20, 10])
  ];

  const [shotValues, $shotValues] = useArrayState([])
  const [form] = Form.useForm();

  const groups = pointTables
    .map((pointTable, index) => (
      <Form.Item key={index} name={`points-${index}`}>
        <Radio.Group options={pointTable} optionType="button" size="large" buttonStyle="solid"
                     onChange={ev => $shotValues.update(index, ev.target.value)}/>
      </Form.Item>
    ));

  return (
    <Form form={form} onFinish={fields => {
      mapKeysToArray(fields, "points");
      onContinue(fields["points"], () => {
        $shotValues.set([]);
        form.resetFields();
      });
    }}>
      {groups}

      {(shotValues.length === 2) && (<ContinueButtonItem />)}
    </Form>
  )
}

/* Three arrow gamemode */
function ThreeArrowGamemode({onContinue}) {
  const pointTables = [
    createPointsOptions([20, 18, 16]),
    createPointsOptions([14, 12, 10]),
    createPointsOptions([8, 6, 4])
  ];

  const [shotValues, $shotValues] = useArrayState([])
  const [form] = Form.useForm();

  const groups = pointTables
    .filter((v, index) => index === 0 || shotValues[index - 1] === 0)
    .map((pointTable, index) => (
      <Form.Item key={index} name={`points-${index}`} style={{"width": "100%"}}>
        <NumberedRow number={index + 1}>
          <Radio.Group options={pointTable} optionType="button" size="large" buttonStyle="solid"
                       onChange={ev => {
                         $shotValues.update(index, ev.target.value);
                         for (let i = shotValues.length - 1; i >= index + 1; i--) {
                           form.resetFields([`points-${i}`]);
                           $shotValues.remove(i);
                         }
                       }}/>
        </NumberedRow>
      </Form.Item>
    ));
  return (
    <Form form={form} onFinish={fields => {
      mapKeysToArray(fields, "points");
      onContinue(fields["points"], () => {
        $shotValues.set([]);
        form.resetFields();
      });
    }}>
      {groups}

      {(shotValues.some(value => value > 0) || shotValues.length === 3) && (<ContinueButtonItem />)}
    </Form>
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

function ContinueButtonItem() {
  return (
    <Form.Item>
      <Button size="large" type="primary" htmlType="submit" className={cls.continueButton}>
        Nächster Spieler
      </Button>
    </Form.Item>
  )
}