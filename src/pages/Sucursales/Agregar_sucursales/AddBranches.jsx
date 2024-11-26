import React, { useEffect } from 'react'
import "./AddBranches.css"
import { Button, Form, Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useAppContext } from '../../../AppContext'

function AddBranches() {
    const [form] = Form.useForm()
    const { loginUserData, saveBranch } = useAppContext()


    async function onFinish (params) {
        const formData = new FormData()
        for (const key in params) {
            formData.append(key, params[key])
        }
        formData.append("editing", false)
        formData.append("userid", loginUserData?.id)
         
        const result = await saveBranch(formData)
        console.log(result)
        if(result){
             form.resetFields()
        }
    }
    return (
        <React.Fragment>
            <h2>Añadir Sucursal</h2>
            <Form
                name='branchesForm'
                onFinish={onFinish}
                form={form}
                layout='vertical'
            >
                <Form.Item
                    name={"branchName"}
                    label="Nombre"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name={"branchAddress"}
                    label="Dirección"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name={"branchInfo"}
                    label="Información adicional"
                >
                    <TextArea />
                </Form.Item>

                <Form.Item>
                    <Button htmlType='submit'>Guardar sucursal</Button>
                </Form.Item>
            </Form>
        </React.Fragment>
    )
}

export default AddBranches