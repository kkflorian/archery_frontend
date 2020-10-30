import React from "react";
import {api} from "../../../shared/api";

export default function ({eventId}) {
  return (
    <api.Loader consumer={true} endpoint={`/events/${eventId}`}>
      {result => result.data["timestampEnd"] != null
        ? (<IngamePage eventInfo={result} />)
        : (<OverviewPage eventInfo={result} />)}
    </api.Loader>
  )
}

function IngamePage() {}
function OverviewPage() {}
