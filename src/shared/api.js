import React from "react";
import {ApiClient} from "react-api-client";
import {Spin} from "antd";

export const api = new ApiClient({
  baseUrl: process.env.API_URL ?? "/api/v1",
  responseHandler: ({status, errorCode, message}) => {
    if (status === "error") {
      return {
        hasError: true,
        errorCode,
        errorMessage: message ?? `Error - ${errorCode}`,
      }
    }

    return {
      hasError: false
    }
  },
  errorHandler: error => {
    return {
      hasError: true,
      errorCode: "REQUEST_FAILED",
      errorMessage: `${error.name}: ${error.message}`
    }
  },
  loaderCreateLoading: () => (<Spin style={{width: "100%", marginTop: 16}} />),
  fetchOptions: {
    credentials: (process.env.NODE_ENV === "development" ? 'include' : undefined)
  }
})

export function withApiLoader(endpoint, callback) {
  return (
    <api.Loader consumer={true} endpoint={endpoint}>
      {callback}
    </api.Loader>
  )
}