import React from "react";
import {ApiClient} from "react-api-client";
import {Spin} from "antd";

export const api = new ApiClient({
  baseUrl: process.env.API_URL ?? "https://archery.abolish.property",
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
  loaderCreateLoading: () => (<Spin />),
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