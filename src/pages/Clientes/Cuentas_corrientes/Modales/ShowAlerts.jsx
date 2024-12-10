import { Button, message, Modal, Space } from 'antd'
import React from 'react'
import { useAppContext } from '../../../../AppContext'

function ShowAlerts({closeModal}) {
const { deleteDebt, state, getClientAccount, action, debtId } = useAppContext()

const handleDeleteDebt = async() => {
    const hiddenMessage = message.loading("Eliminando deuda...")
    const response = await deleteDebt(debtId)
    if(response) {
        message.success("Deuda eliminada")
        await getClientAccount(state.clientID, state.branchID)
        closeModal()
    } else {
        message.error("Error al eliminar la deuda")
    }
    hiddenMessage()
}
    const handleShowMessage = () => {
        switch (action) {
            case 1:
                return(<>
                    <h3>Estas a punto de eliminar una deuda</h3>
                    <p>¿Estas seguro de eliminar esta deuda?, recuerda que si este cliente tiene entregas de dinero en esta sucursal y no hay más deudas, no se podran visualizar las entregas. <strong style={{color: "red"}}>Esta accion no se puede deshacer</strong></p>
                    <Space>
                        <Button type='primary' danger onClick={() => handleDeleteDebt()}>Eliminar</Button>
                        <Button type='primary' onClick={() => closeModal()}>Cancelar</Button>
                    </Space>
                </>)
            case 2:
                return (<p>Estas a punto de agregar una entrega</p>)  
            default:
                break;
        }
    }
  return (
    <Modal
        open={true}
        onCancel={() => closeModal()}
        footer={[]}
    >

    {handleShowMessage()}
    </Modal>
  )
}

export default ShowAlerts