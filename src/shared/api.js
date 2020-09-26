const API_URL = "";

export const api = {
  get: (method, endpoint, requestData, setSpinning) => callApi("GET", method, endpoint, requestData, setSpinning),
  post: (method, endpoint, requestData, setSpinning) => callApi("POST", method, endpoint, requestData, setSpinning),
  put: (method, endpoint, requestData, setSpinning) => callApi("PUT", method, endpoint, requestData, setSpinning),
  patch: (method, endpoint, requestData, setSpinning) => callApi("PATCH", method, endpoint, requestData, setSpinning),
  delete: (method, endpoint, requestData, setSpinning) => callApi("DELETE", method, endpoint, requestData, setSpinning),
};

async function callApi(method, endpoint, requestData, setSpinning) {
  if (setSpinning != null) {
    setSpinning(true);
  }

  let result;
  try {
    const isLocalTest = process.env.NODE_ENV === "development";
    const data = await fetch(API_URL + endpoint, {
      method,
      body: JSON.stringify(requestData),
      credentials: (isLocalTest ? 'include' : undefined)
    }).then(response => response.json());

    result = {
      data,
      errorCode: data.errorCode,
      error: extractError(data)
    };
  } catch (e) {
    console.error(e);
    result = {error: "Internal error - " + e.message}
  }

  if (result.error != null && setSpinning != null) {
    setSpinning(false);
  }

  return result;
}

const errorMapping = {}
function extractError({status, errorCode}) {
  if (status !== "error") return;
  return errorMapping[errorCode] ?? `Unknown error: ${errorCode}`;
}