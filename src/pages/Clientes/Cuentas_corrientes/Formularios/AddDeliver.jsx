import { Button, DatePicker, Form, Input } from 'antd'
import React, { useState } from 'react'
import { useAppContext } from '../../../../AppContext'
import dayjs from 'dayjs'

function AddDeliver({ closeModal }) {
  const [deliverDate, setDeliverDate] = useState(null)
  const { state, saveDeliver, getClientAccount } = useAppContext()
  const onFinish = async (values) => {
    const formData = new FormData()
    formData.append("clientID", state.clientID || "")
    formData.append("branchID", state.branchID || "")
    formData.append("adminID", state.adminID || "")
    formData.append("userID", state.userID || "")
    formData.append("deliverDate", dayjs(deliverDate).format("YYYY-MM-DD"))
    formData.append("deliverAmount", values.deliverAmount)
    console.log(formData)
    const result = await saveDeliver(formData)
    if (result) {
      await getClientAccount(state.clientID, state.branchID)
      closeModal()
    }
  }
  return (
    <Form
      name='deliverForm'
      layout='vertical'
      onFinish={onFinish}
    >
      <Form.Item
        name='deliverAmount'
        label='Monto de la entrega'
        rules={
          [
            { required: true, message: 'Por favor ingrese el monto de la entrega' },
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === "") {
                  return Promise.resolve();
                }
                if (!/^\d+$/.test(value)) {
                  return Promise.reject(new Error("El monto de la entrega debe ser un número válido"));
                }
                return Promise.resolve();
              },
            },

          ]}
      >
        <Input placeholder='Monto de la entrega' />
      </Form.Item>

      <Form.Item
        name={'deliverDate'}
        label='Fecha de la entrega'
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la fecha de la entrega',
          },
          {
            validator: () => {
              if (deliverDate !== null && dayjs(deliverDate).isValid()) return Promise.resolve()
              return Promise.reject()
            }
          }
        ]}
      >
        <DatePicker onChange={(date) => setDeliverDate(date)} />
      </Form.Item>

      <Form.Item>
        <Button htmlType='submit'>Guardar entrega</Button>
      </Form.Item>
    </Form>
  )
}

export default AddDeliver