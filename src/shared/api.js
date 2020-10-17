import {ApiClient} from "react-api-client";

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
  fetchOptions: {
    credentials: (process.env.NODE_ENV === "development" ? 'include' : undefined)
  }
})

