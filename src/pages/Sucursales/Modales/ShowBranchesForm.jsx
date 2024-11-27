import { Modal } from 'antd'
import React from 'react'
import AddBranches from '../Formularios/Añadir_sucursales/AddBranches'
import EditBranches from '../Formularios/Editar_sucursales/EditBranches'

function ShowBranchesForm({closeModal, actionType, branchId}) {

  function switchForms() {
    switch (actionType) {
      case 1:
        
        return <AddBranches closeModal={closeModal}/>
      
    case 2:
        return <EditBranches branchId={branchId} closeModal={closeModal}/>
      default:
        return "Ups... Tenemos problemas para mostrar esta sección, intente nuevamente en unos segundos."
    }
  }
  return (
    <Modal
        open={true}
        onCancel={closeModal}
        footer={[]}
    >
        {switchForms()}
    </Modal>
  )
}

export default ShowBranchesForm