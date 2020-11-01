import React, {useState} from "react";
import {Modal, Form, Input, InputNumber, Select} from "antd";
import {defaultRules, getSelectTextSearch} from "../../../shared/misc";
import countries from '../../../shared/countries';
import cls from './CreateParkourModal.module.less'
import {api} from "../../../shared/api";
import {FormError} from "../../../shared/FormError/FormError";

export default function({reloadParkours, state: [visible, setVisible]}) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [form] = Form.useForm();

  function askIgnoreCoords(onNo) {
    Modal.confirm({
      title: 'Es konnten keine Koordinaten zu dieser Addresse gefunden werden. Trotzdem fortfahren?',
      okText: "Fortfahren",
      onOk: () => handleOkay(true),
      cancelText: "Abbrechen",
      onCancel: onNo
    })
  }

  function handleOkay(ignoreCoordinates) {
    setErrorMessage("");
    form.validateFields()
      .then(fields => api.put("/parkours", {ignoreCoordinates, ...fields}))
      .then(result => {
        if (!result.hasError) {
          setVisible(false);
          reloadParkours();
        }

        if (result.errorCode === "ADDRESS_NOT_FOUND") {
          askIgnoreCoords(() => setErrorMessage(result.errorMessage));
        } else {
          setErrorMessage(result.errorMessage);
        }
      }).catch()
  }

  function destroy() {
    form.resetFields();
    setErrorMessage(null);
  }

  return (
    <Modal title="Parkour hinzufügen"
           okText="Parkour erstellen" okButtonProps={{size: "large"}} onOk={() => handleOkay(false)}
           cancelText="Abbrechen" cancelButtonProps={{size: "large"}}
           afterClose={destroy} onCancel={() => setVisible(false)}
           visible={visible} closable={false} destroyOnClose>
      <Form name="createParkour" layout="vertical" form={form} autoComplete="off">
        <Form.Item name="name" label="Name des Parkours" rules={[ defaultRules.requiredNoWhitespace ]}>
          <Input size="large" placeholder="Name des Parkours" maxLength={75} />
        </Form.Item>

        <Form.Item name="countAnimals" label="Anzahl der Tiere" rules={[ defaultRules.required ]}>
          <InputNumber size="large" placeholder="Anzahl der Tiere" min={1} className={cls.animalInput} />
        </Form.Item>

        <Form.Item name="street" label="Straße" rules={[ defaultRules.requiredNoWhitespace ]}>
          <Input size="large" placeholder="Straße" maxLength={75} />
        </Form.Item>

        <Form.Item label="Stadt und Postleitzahl" required>
          <Form.Item name="zip" rules={[ defaultRules.requiredNoWhitespace ]} noStyle >
            <Input size="large" placeholder="PLZ" maxLength={10} className={cls.zipInput}/>
          </Form.Item>

          <Form.Item name="city" rules={[ defaultRules.requiredNoWhitespace ]} noStyle>
            <Input size="large" placeholder="Stadt" maxLength={75} className={cls.cityInput} />
          </Form.Item>
        </Form.Item>

        <Form.Item name="countryCode" label="Land" rules={[defaultRules.required]}>
          <Select size="large" placeholder="Land" options={countries.asOptions} {...getSelectTextSearch()}/>
        </Form.Item>

        <FormError message={errorMessage}/>
      </Form>
    </Modal>
  );
}