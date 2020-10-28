import React from "react";

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