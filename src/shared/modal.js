import {render as reactRender, unmountComponentAtNode as reactUnmount} from "react-dom";
import {Modal} from "antd";
import React, {useState} from "react";

export function showInModal(content, props = {}) {
  const container = document.createElement("div");
  container.setAttribute("data-meta", "showInModal-container")
  document.body.appendChild(container);

  function cleanup() {
    reactUnmount(container);
    container.parentElement.removeChild(container);
  }

  reactRender((
    <ModalWrapper cleanup={cleanup} content={content} props={props} />
  ), container)
}

function ModalWrapper({cleanup, content, props}) {
  const [visible, setVisible] = useState(true)

  return (
    <Modal destroyOnClose visible={visible} afterClose={cleanup} {...props}
           onCancel={() => setVisible(false)}
    >
      {content}
    </Modal>
  )
}