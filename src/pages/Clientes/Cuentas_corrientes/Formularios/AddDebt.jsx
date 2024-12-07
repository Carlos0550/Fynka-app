import { Button, DatePicker, Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react'
import { SeparateProducts } from '../../../../utils/SeparateProducts';
import { useAppContext } from '../../../../AppContext';
import dayjs from 'dayjs';

function AddDebt({closeModal}) {
    const { state, saveDebt, getClientAccount } = useAppContext()
    const [debtDate, setDebtDate] = useState(null)
    const [savingValues, setSavingValues] = useState(false)
    const onFinish = async(values) => {
        setSavingValues(true)
        const formData = new FormData()
        const { products, debtAmount } = SeparateProducts(values.debtProducts)
        formData.append("productsArray", products)
        formData.append("debtDate", debtDate)
        formData.append("clientID", state.clientID || "")
        formData.append("branchID", state.branchID || "")
        formData.append("adminID", state.adminID)
        formData.append("userID", state.userID)
        formData.append("debtAmount", debtAmount)
        formData.append("editing", false)
        formData.append("productDetails", values.debtDetails || "Sin descripción")
        console.log(formData)
        await saveDebt(formData)
        setSavingValues(false)
        await getClientAccount(state.clientID, state.branchID)
        closeModal()
        
    };
    return (
        <Form
            name='debtForm'
            layout='vertical'
            onFinish={onFinish}
        >
            <Button style={{ marginBottom: "20px" }}>Seleccion rápida</Button>
            <Form.Item
                name={"debtProducts"}
                rules={[
                    { required: true, message: "Este campo es obligatorio" },
                    {
                        validator: (_, value) => {
                            if (value && value.trim().length > 0) {
                                return Promise.resolve();
                            }
                            return Promise.reject();
                        },
                    },
                ]}
                label={"Productos"}

            >
                <TextArea style={{ resize: "none", height: "100px" }} />
            </Form.Item>

            <Form.Item
                name={"debtDetails"}
                label={"Detalles Adicionales"}

            >
                <TextArea style={{ resize: "none", height: "100px" }} />
            </Form.Item>

            <Form.Item
                name={"debtDate"}
                label={"Fecha de compra"}
                rules={[
                    {
                        required: true,
                        message: "Este campo es obligatorio"
                    },
                    {
                        validator: () => {
                            if (debtDate && dayjs(debtDate).isValid()) return Promise.resolve()
                            return Promise.reject()
                        }
                    }
                ]}
            >
                <DatePicker style={{ minWidth: "200px" }} onChange={(date) => setDebtDate(dayjs(date).format("YYYY-MM-DD"))} />
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType='submit' loading={savingValues} disabled={savingValues}>Guadar Deuda</Button>
            </Form.Item>
        </Form>
    )
}

export default AddDebt