export const defaultRules = {
  required: {required: true, message: "Dieses Feld wird benötigt"},
  requiredNoWhitespace: {required: true, whitespace: true, message: "Dieses Feld wird benötigt"}
};

export function getGeoLocation(options) {
  return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
  });
}