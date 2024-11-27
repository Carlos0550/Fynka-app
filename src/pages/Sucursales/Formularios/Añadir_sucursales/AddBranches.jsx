import React, { useEffect } from 'react'
import "./AddBranches.css"
import { Button, Form, Input, notification } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useAppContext } from '../../../../AppContext'

function AddOrEditBranches({closeModal}) {
    const [form] = Form.useForm()
    const { loginUserData, saveBranch } = useAppContext()

    function keyNames(key){
        switch (key) {
            case "branchName":
                return "Nombre"
            case "branchAddress":
                return "Dirección"
            default:
                break;
        }
    }
    async function onFinish (params) {
        const formData = new FormData()
        
        for (const key in params) {
            if (key !== "branchInfo" && (params[key] === "" || params[key] === undefined)) {
                return notification.error({
                    message: "Error",
                    description: `El campo '${keyNames(key)}' está vacío o no fue enviado. Por favor, complete todos los campos.`
                });
            }
        }

        for (const key in params) {
            formData.append(key, params[key])
        }
        formData.append("editing", false)
        formData.append("userid", loginUserData?.id)
         
        const result = await saveBranch(formData)
        console.log(result)
        if(result){
            closeModal()
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

export default AddOrEditBranches