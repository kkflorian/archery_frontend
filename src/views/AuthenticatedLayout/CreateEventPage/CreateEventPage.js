import React, {useState} from "react";
import cls from './CreateEventPage.module.less';
import AuthenticatedLayout from "../AuthenticatedLayout";
import {Select, Button, Divider, Form, Tooltip, message} from "antd";
import {api} from "../../../shared/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapMarkerAlt, faPlus} from "@fortawesome/free-solid-svg-icons";
import haversine from 'haversine-distance'
import {defaultRules, getGeoLocation, getSelectTextSearch, mapKeysToArray} from "../../../shared/misc";
import useArrayState from 'use-array-state'
import CreateParkourModal from "./CreateParkourModal";
import {FormError} from "../../../shared/FormError/FormError";
import BlankSpace from "../../../shared/BlankSpace";

export default function ({history}) {
  const {result, handle, loading} = api.useRequestState();
  const [values, valuesAction] = useArrayState([null])
  const [form] = Form.useForm();

  function onSubmit(fields) {
    mapKeysToArray(fields, "eventMember");
    fields["eventMember"] = fields["eventMember"].filter(em => em != null);
    api.put("/events", fields, handle).then(result => {
      if (!result.hasError) {
        history.push(`./event/${result.data.eventId}`)
      }
    })
  }

  return (
    <AuthenticatedLayout title="Event erstellen" back="./home">
      <Form form={form} onFinish={onSubmit}>
        <Divider plain orientation="left">Parkour</Divider>
        <Form.Item className={cls.formItem}>
          <ParkourSelect form={form}/>
        </Form.Item>

        <Divider plain orientation="left">Zählweise</Divider>
        <GamemodeFormItem/>

        <Divider plain orientation="left">Teilnehmer</Divider>
        {values.map((value, index) => <MemberFormItem key={index} value={value}
                                                      index={index} valuesState={[values, valuesAction]}/>)}
        <BlankSpace height={8} />

        <FormError marginStart={8} message={result?.errorMessage}/>
        
        <Form.Item className={cls.formItem}>
          <Button size="large" type="primary" htmlType="submit" className={cls.createButton} loading={loading}>Event erstellen</Button>
        </Form.Item>
      </Form>
    </AuthenticatedLayout>
  );
}

function MemberFormItem({value, index, valuesState: [values, valuesAction]}) {
  const {handle, loading, result, resetHandle} = api.useRequestState(false);

  function handleChange(newValue) {
    valuesAction.update(index, newValue);
    if (value == null && values.length < 10) { // Add new select
      valuesAction.push(null);
    }
  }

  function handleSearch(searchTerm) {
    if (searchTerm.length === 0) {
      resetHandle();
      return;
    }

    api.post("/users", {
      searchTerm, limit: 5
    }, handle).finally();
  }

  const options = result?.data["userList"]
    // Do not show an already selected user in a different select item
    .filter(userInfo => value === userInfo.username || !values.includes(userInfo.username))
    .map(userInfo => ({
      label: `${userInfo.firstName} ${userInfo.lastName} (${userInfo.username})`,
      value: userInfo.username
    }))

  return (
    <Form.Item name={`eventMember-${index}`} className={`${cls.formItem} ${cls.memberFormItem}`}
               rules={index === 0 && [defaultRules.required]}>
      <Select size="large" placeholder="Teilnehmer hinzufügen" showArrow={false}
              showSearch onSearch={handleSearch} notFoundContent={result != null && "Keine Teilnehmer gefunden"}
              filterOption={false} onChange={handleChange}
              options={options} loading={loading}>
      </Select>
    </Form.Item>
  );
}

function GamemodeFormItem() {
  const [result, loading] = api.useGet("/gamemodes");
  const options = result?.data["gameModes"].map(gameMode => ({
    label: gameMode["gameMode"],
    value: gameMode["id"]
  }))

  return (
    <Form.Item name="gameModeId" className={cls.formItem} rules={[defaultRules.required]} >
      <Select size="large" placeholder="Zählweise auswählen"
              loading={loading} options={options} />
    </Form.Item>
  )
}

function ParkourSelect({form}) {
  const [createVisible, setCreateVisible] = useState(false);

  const [result, loading, reload] = api.useGet("/parkours")
  const options = result?.data["parkours"].map(parkour => ({
    label: `${parkour["name"]} (${parkour["street"]}, ${parkour["zip"]}, ${parkour["city"]})`,
    value: parkour["id"],
    position: {
      lat: parkour["latitude"],
      lon: parkour["longitude"]
    }
  }));

  async function autoSearchParkour() {
    getGeoLocation({maximumAge: 300_000, timeout: 2500}).then(location => {
      const distances = options
        .filter(entry => entry.position.lat !== 0 && entry.position.lon !== 0)
        .map(entry => ({entry, distance: haversine(entry.position, location.coords)}))
        .filter(distanceEntry => distanceEntry.distance < 1000)
        .sort((a, b) => a.distance - b.distance);

      if (distances.length !== 1) {
        message.error("Es konnte kein Parkour ermittelt werden")
        console.warn(distances)
        return;
      }

      form.setFieldsValue({"parkourId": distances[0].entry.value});
    }).catch(e => {
      message.error("Position konnte nicht ermittelt werden")
      console.error(e);
    })
  }

  return (
    <>
      <CreateParkourModal reloadParkours={reload} state={[createVisible, setCreateVisible]}/>

      <Form.Item name="parkourId" rules={[defaultRules.required]} noStyle>
        <Select size="large" placeholder="Parkour auswählen" className={cls.parkourSelect}
                loading={loading} options={options}
                {...getSelectTextSearch()}
        />
      </Form.Item>

      <Tooltip title="Automatisch erkennen">
        <Button shape="circle" type="text" size="large" onClick={autoSearchParkour}>
          <FontAwesomeIcon icon={faMapMarkerAlt}/>
        </Button>
      </Tooltip>
      <Tooltip title="Neuen Parkour hinzufügen">
        <Button shape="circle" type="text" size="large" onClick={() => setCreateVisible(true)}>
          <FontAwesomeIcon icon={faPlus}/>
        </Button>
      </Tooltip>
    </>
  );
}