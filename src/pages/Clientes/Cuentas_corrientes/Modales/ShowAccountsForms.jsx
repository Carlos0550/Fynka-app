import { Modal } from 'antd'
import React from 'react'
import AddDebt from '../Formularios/AddDebt'

function ShowAccountsForms({closeModal, actionType}) {
  const titleKeys = {
    1: "Agregar una deuda"
  }

  const handleSwitchForm = () =>{
    switch (parseInt(actionType)) {
      case 1:
        return(<AddDebt closeModal={closeModal}/>)  
      default:
        break;
    }
  }
  return (
    <Modal 
        open={true}
        onCancel={() => closeModal()}
        footer={[]}
        title={titleKeys[parseInt(actionType)]}
    >

    {handleSwitchForm()}
    </Modal>
  )
}

export default ShowAccountsForms