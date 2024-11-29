import { Button, Form, Input, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../AppContext'

function EditClient({ closeModal, clientID }) {
    const [form] = Form.useForm()
    const [sending, setSending] = useState(false)
    const { saveClient, clients } = useAppContext()

    const onFinish = async (params) => {

        setSending(true)
        if (!params.clientName || !params.clientDni) return notification.error({ message: "Algunos campos obligatorios estan vacíos." })
        const formData = new FormData()

        for (const key in params) {
            formData.append(key, params[key])
        }

        formData.append("editing", true)
        formData.append("clientId", clientID)
        const result = await saveClient(formData)
        setSending(false)
        if (result) closeModal()

    }

    useEffect(()=>{
        if (clientID) {
            const selectedClient = clients.find(client => client.id === clientID)
            if(!selectedClient) return notification.warning({message: "No pudimos encontrar este cliente en la lista de clientes, intente actualizar la lista."})
            form.setFieldsValue({
                clientName: selectedClient?.nombre,
                clientDni: selectedClient?.dni,
                clientAddress: selectedClient?.direccion || "",
                clientEmail: selectedClient.email || ""
            })
        }
    },[clientID])
    return (
        <Form
            name='clientForm'
            form={form}
            onFinish={onFinish}
            layout='vertical'

        >
            <Form.Item
                name={"clientName"}
                label="Nombre completo"
                rules={[
                    {
                        required: true, message: "Este campo no puede estar vacío"
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name={"clientDni"}
                label="DNI del cliente"
                rules={[
                    {
                        required: true, message: "Este campo no puede estar vacío"
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name={"clientAddress"}
                label="Dirección"
            >
                <Input />
            </Form.Item>

            <Form.Item
                name={"clientEmail"}
                label="Correo electronico"
                tooltip="Se usará para enviar al cliente el estado de su deuda"
                rules={[
                    {
                        type: "email", message: "Correo no válido"
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <Button htmlType='submit' loading={sending} disabled={sending}>Actualizar datos</Button>
            </Form.Item>
        </Form>
    )
}

export default EditClient