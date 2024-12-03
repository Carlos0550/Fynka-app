import { Button, DatePicker, Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react'

function AddDebt() {

    const onFinish = (values) => {
        console.log('Success:', values);
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
                    { required: true, message: "Este campo es obligatorio"},
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
                <TextArea style={{resize: "none", height: "100px"}}/>
            </Form.Item>
            <Form.Item>
                <DatePicker style={{minWidth: "200px"}}/>
            </Form.Item>
        </Form>
    )
}

export default AddDebt