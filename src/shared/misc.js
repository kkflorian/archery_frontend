export const defaultRules = {
  required: {required: true, message: "Dieses Feld wird benötigt"},
  requiredNoWhitespace: {required: true, whitespace: true, message: "Dieses Feld wird benötigt"}
};

export function getGeoLocation(options) {
  return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
  });
}

export function getSelectTextSearch() {
  return {
    showSearch: true,
    filterOption: (input, option) => option.label.toLowerCase().includes(input.toLowerCase()),
    optionFilterProp: "children"
  }
}

export function mapKeysToArray(object, prefix) {
  const result = [];

  for (let i = 0; true; i++) {
    const key = `${prefix}-${i}`;
    if (!object.hasOwnProperty(key)) break;

    const value = object[key];
    delete object[key];

    result.push(value);
  }

  object[prefix] = result;
}

export function lastFromArray(array, fallback = null) {
  return array.length === 0 ? fallback : array[array.length - 1];
}

export function setWindowTitle(title) {
  document.title = `${title} | Archery`;
}