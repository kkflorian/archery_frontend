import React, {useState} from "react";
import {api} from "../../../shared/api";
import AuthenticatedLayout from "../AuthenticatedLayout";
import IngamePage from "./IngamePage";
import ResultPage from "./ResultPage";

export default function ({match: {params: {eventId}}}) {
  const [title, setTitle] = useState("");
  // todo show notification if user is not creator
  return (
    <AuthenticatedLayout back="/a/home" title={title}>
      <api.Loader consumer={true} endpoint={`/events/${eventId}`}>
        {({data}, reload) => (
          <>
            {data["eventIsFinished"]
              ? (<ResultPage setTitle={setTitle} event={{eventId, ...data}}/>)
              : (<IngamePage setTitle={setTitle} reload={reload} event={{eventId, ...data}}/>)}
          </>
        )}
      </api.Loader>
    </AuthenticatedLayout>
  )
}
