import React, {useState} from "react";
import cls from './CreateEventPage.module.less';
import AuthenticatedLayout from "../AuthenticatedLayout";
import {Select, Button, Divider, Form, Tooltip, message} from "antd";
import {api} from "../../../shared/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import haversine from 'haversine-distance'
import {getGeoLocation} from "../../../shared/misc";

function ParkourFormItem() {
  const [value, setValue] = useState();

  const [parkoursResult, parkoursLoading] = api.useGet("/parkours")
  const parkourData = parkoursResult?.data["parkours"].map(parkour => ({
    label: `${parkour["name"]} (${parkour["street"]}, ${parkour["zip"]}, ${parkour["city"]})`,
    value: parkour["id"],
    position: {
      lat: parkour["latitude"],
      lon: parkour["longitude"]
    }
  }));

  async function autoSearchParkour() {
    getGeoLocation({maximumAge: 300_000, timeout: 2500}).then(location => {
      const distances = parkourData
        .filter(entry => entry.position.lat !== 0 && entry.position.lon !== 0)
        .map(entry => ({entry, distance: haversine(entry.position, location.coords)}))
        .filter(distanceEntry => distanceEntry.distance < 1000)
        .sort((a, b) => a.distance - b.distance);

      if (distances.length !== 1) {
        message.error("Es konnte kein Parkour ermittelt werden")
        console.warn(distances)
        return;
      }

      setValue(distances[0].entry.value)
    }).catch(e => {
      message.error("Position konnte nicht ermittelt werden")
      console.error(e);
    })
  }

  return (
    <>
      <Select size="large" placeholder="Parkour auswählen" showSearch className={cls.parkourSelect}
              loading={parkoursLoading} options={parkourData}
              value={value} onChange={newValue => {
                console.log("new value", newValue)
                setValue(newValue)
      }}
              filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
              optionFilterProp="children"
      />
      <Tooltip title="Automatisch erkennen">
        <Button shape="circle" type="text" size="large" onClick={autoSearchParkour}>
          <FontAwesomeIcon icon={faMapMarkerAlt}/>
        </Button>
      </Tooltip>
    </>
  );
}

export default function () {
  return (
    <AuthenticatedLayout title="Event erstellen" back={"./home"}>
      <Form>
        <Divider plain orientation="left">Parkour</Divider>
        <Form.Item name="parkour" className={cls.formItem}>
          <ParkourFormItem/>
        </Form.Item>

        <Divider plain orientation="left">Zählweise</Divider>

        <Divider plain orientation="left">Teilnehmer</Divider>

        <Button type="primary" size="large" className={cls.createButton}>Event erstellen</Button>
      </Form>
    </AuthenticatedLayout>
  );
}