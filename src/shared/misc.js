import React from "react";

export function createWrapperFunction(Component) {
  return (children) => (<Component>{children}</Component>);
}