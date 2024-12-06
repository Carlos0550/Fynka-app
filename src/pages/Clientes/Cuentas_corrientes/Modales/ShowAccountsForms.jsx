import { Modal } from 'antd'
import React from 'react'
import AddDebt from '../Formularios/AddDebt'
import AddDeliver from '../Formularios/AddDeliver'

function ShowAccountsForms({closeModal, actionType}) {
  const titleKeys = {
    1: "Agregar una deuda",
    2: "Agregar una entrega"
  }

  const handleSwitchForm = () =>{
    switch (parseInt(actionType)) {
      case 1:
        return(<AddDebt closeModal={closeModal}/>)
      case 2:
        return (<AddDeliver closeModal={closeModal} />)  
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