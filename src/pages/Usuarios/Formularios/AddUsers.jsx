import { Button, Form, Input, Space } from 'antd'
import React, { useState } from 'react'
import { generatePassword } from '../../../utils/SecurePasswords'
import { useAppContext } from '../../../AppContext'
function AddUsers({ closeModal, adminID }) {
    console.log("AdminID", adminID)
    const { saveUser } = useAppContext()
    const [adding, setAdding] = useState(false)
    const [form] = Form.useForm()
    const onFinish = async (values) => {
        setAdding(true)
        const formData = new FormData()

        for (const key in values) {
            formData.append(key, values[key])
        }

        formData.append("editing", false)
        formData.append("adminId", adminID)
        const result = await saveUser(formData)
        setAdding(false)
        if (result) closeModal()
    }

    function GeneratePassword() {
        const securepsw = generatePassword()
        form.setFieldsValue({
            userPsw: securepsw,
            checkUserPsw: securepsw
        })
    }
    return (
        <Form
            name='usersForm'
            layout='vertical'
            onFinish={onFinish}
            form={form}
        >
            <Form.Item
                rules={[
                    { type: "string", message: "Este campo es obligatorio", required: true }
                ]}
                name={"userName"}
                label="Nombre del usuario"
            >
                <Input placeholder='Ingresa el nombre completo del usuario' />
            </Form.Item>

            <Form.Item
                rules={[
                    {
                        required: true,
                        message: "Este campo es obligatorio",
                    },
                    {
                        validator: (_, value) => {
                            if (!value) return Promise.resolve(); 
            
                            if (!/^\d+$/.test(value)) {
                                return Promise.reject(("El DNI no es válido. Solo se permiten números."));
                            }
            
                            if (String(value).length < 5) {
                                return Promise.reject(("El DNI debe tener al menos 5 dígitos."));
                            }
            
                            return Promise.resolve();
                        },
                    },
                ]}
                name={"userDni"}
                label="DNI del usuario"
            >
                <Input placeholder='Ingresá el DNI del usuario' />
            </Form.Item>

            <Form.Item
                rules={[
                    { type: "email", message: "Correo no válido", required: true }
                ]}
                name={"userEmail"}
                label="Correo"
            >
                <Input placeholder='Ingresá el correo del usuario' />
            </Form.Item>

            <Form.Item
                rules={[
                    { message: "Este campo es obligatorio", required: true }
                ]}
                name={"userPsw"}
                label="Contraseña del usuario"
            >
                <Input.Password placeholder='Ingresá la contraseña' type='password'/>
            </Form.Item>
            <Button type='primary' style={{marginTop: "-.5rem"}} onClick={()=> GeneratePassword()}>Sugerir contraseña</Button>

            <Form.Item
                rules={[
                    { message: "Este campo es obligatorio", required: true }
                ]}
                name={"checkUserPsw"}
                label="Confirme la contraseña"
            >
                <Input.Password type='password'/>
            </Form.Item>
            <Form.Item>
                <Button loading={adding}  htmlType='submit'>Guardar Usuario</Button>
            </Form.Item>
        </Form>
    )
}

export default AddUsers