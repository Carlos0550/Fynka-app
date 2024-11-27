import { Button, Form, Input } from 'antd'
import React, { useEffect } from 'react'
import { useAppContext } from '../../../../AppContext'
import TextArea from 'antd/es/input/TextArea'

function EditBranches({branchId, closeModal}) {
    const [form] = Form.useForm()
    const { loginUserData, saveBranch, sucursales } = useAppContext()
    async function onFinish (params) {
        const formData = new FormData()
        for (const key in params) {
            formData.append(key, params[key])
        }

        formData.append("editing", true)
        formData.append("userid", loginUserData?.id)
        formData.append("branchId", branchId)
         
        const result = await saveBranch(formData)
        console.log(result)
        if(result){
            closeModal()
        }
    }

    useEffect(()=>{
        if(branchId){
            const selectedBranch = sucursales.find(sucursal => sucursal.id === branchId)
            if(!selectedBranch) return
            form.setFieldsValue({
                branchName: selectedBranch.nombre,
                branchAddress: selectedBranch.direccion,
                branchInfo: selectedBranch.descripcion
            })
        }
    },[sucursales, branchId])
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
                    <Button htmlType='submit'>Guardar cambios</Button>
                </Form.Item>
            </Form>
        </React.Fragment>
  )
}

export default EditBranches