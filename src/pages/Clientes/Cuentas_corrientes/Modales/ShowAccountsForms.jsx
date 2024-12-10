import { Modal } from 'antd'
import React from 'react'
import AddDebt from '../Formularios/AddDebt'
import AddDeliver from '../Formularios/AddDeliver'
import { useAppContext } from '../../../../AppContext'

function ShowAccountsForms({closeModal, actionType}) {
  const { action } = useAppContext()
  const titleKeys = {
    1: "Agregar una deuda",
    2: "Agregar una entrega",
    3: "Editar deuda",
    4: "Editar una entrega"
  }
console.log(actionType, action)
  const handleSwitchForm = () =>{
    switch (parseInt(action || actionType)) {
      case 1:
        return(<AddDebt closeModal={closeModal}/>)
      case 2:
        return (<AddDeliver closeModal={closeModal} />) 
      case 3: return (<AddDebt closeModal={closeModal}  /> )
      default:
        return "Ups... Tenemos problemas para mostrar esta sección, intente nuevamente en unos segundos."
    }
  }
  return (
    <Modal 
        open={true}
        onCancel={() => closeModal()}
        footer={[]}
        title={titleKeys[parseInt( action || actionType )]}
    >

    {handleSwitchForm()}
    </Modal>
  )
}

export default ShowAccountsForms