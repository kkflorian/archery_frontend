import React from "react";
import cls from './CreateEventPage.module.less';
import AuthenticatedLayout from "../AuthenticatedLayout";
import {Select, Button, Divider, Form, Tooltip, message} from "antd";
import {api} from "../../../shared/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapMarkerAlt, faPlus} from "@fortawesome/free-solid-svg-icons";
import haversine from 'haversine-distance'
import {getGeoLocation} from "../../../shared/misc";
import useArrayState from 'use-array-state'

export default function () {
  const [values, valuesAction] = useArrayState([null])
  const [form] = Form.useForm();

  return (
    <AuthenticatedLayout title="Event erstellen" back={"./home"}>
      <Form form={form}>
        <Divider plain orientation="left">Parkour</Divider>
        <Form.Item className={cls.formItem}>
          <ParkourSelect form={form}/>
        </Form.Item>

        <Divider plain orientation="left">Zählweise</Divider>
        <GamemodeFormItem/>

        <Divider plain orientation="left">Teilnehmer</Divider>
        {values.map((value, index) => <MemberFormItem key={index} value={value}
                                                      index={index} valuesState={[values, valuesAction]}/>)}

        <Button type="primary" size="large" className={cls.createButton}>Event erstellen</Button>
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
    <Form.Item name={`member-${index}`} className={cls.formItem}>
      <Select size="large" placeholder="Teilnehmer hinzufügen" showArrow={false}
              showSearch onSearch={handleSearch} notFoundContent={result == null ? null : "Keine Teilnehmer gefunden"}
              filterOption={false} defaultActiveFirstOption={false}
              onChange={handleChange}
              options={options} loading={loading}
      >
      </Select>
    </Form.Item>
  );
}

function GamemodeFormItem() {
  const [result, loading] = api.useGet("/gamemodes");
  const options = result?.data["gamemodes"].map(gamemode => ({
    label: gamemode["gamemode"],
    value: gamemode["id"]
  }))

  return (
    <Form.Item name="gamemode" className={cls.formItem} >
      <Select size="large" placeholder="Zählweise auswählen"
              loading={loading} options={options}
      />
    </Form.Item>
  )
}

function ParkourSelect({form}) {
  const [result, loading] = api.useGet("/parkours")
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

      form.setFieldsValue({"parkour": distances[0].entry.value});
    }).catch(e => {
      message.error("Position konnte nicht ermittelt werden")
      console.error(e);
    })
  }

  return (
    <>
      <Form.Item name="parkour" noStyle>
        <Select size="large" placeholder="Parkour auswählen" showSearch className={cls.parkourSelect}
                loading={loading} options={options}
                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                optionFilterProp="children"
        />
      </Form.Item>

      <Tooltip title="Automatisch erkennen">
        <Button shape="circle" type="text" size="large" onClick={autoSearchParkour}>
          <FontAwesomeIcon icon={faMapMarkerAlt}/>
        </Button>
      </Tooltip>
      <Tooltip title="Neuen Parkour hinzufügen">
        <Button shape="circle" type="text" size="large">
          <FontAwesomeIcon icon={faPlus}/>
        </Button>
      </Tooltip>
    </>
  );
}
