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

export function possessive(name) {
  return `${name}${name.endsWith("s") ? "'" : "'s"}`;
}

export function countCharTypes(str) {
  const counts = [0, 0, 0, 0];

  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);

    if (char >= "0" && char <= "9") counts[0]++;
    else if (char >= "A" && char <= "Z") counts[1]++;
    else if (char >= "a" && char <= "z") counts[2]++;
    else counts[3]++;
  }

  return counts.filter(elem => elem > 0).length;
}