import React, {useState} from "react";
import {api} from "../../../shared/api";
import AuthenticatedLayout from "../AuthenticatedLayout";
import IngamePage from "./IngamePage";
import ResultPage from "./ResultPage";
import {Empty} from "antd";

export default function ({match: {params: {eventId}}}) {
  const [title, setTitle] = useState("");
  return (
    <AuthenticatedLayout back="/a/home" title={title}>
      <api.Loader consumer={true} endpoint={`/events/${eventId}`}>
        {({data}, reload) => {
          if (data["eventIsFinished"]) {
            return (<ResultPage setTitle={setTitle} event={{eventId, ...data}}/>);
          }

          if (data["isCreator"]) {
            return (<IngamePage setTitle={setTitle} reload={reload} event={{eventId, ...data}}/>);
          }

          return (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Dieses Event ist noch nicht abgeschlossen"/>)
        }}
      </api.Loader>
    </AuthenticatedLayout>
  )
}
