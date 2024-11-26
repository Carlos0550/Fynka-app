import { Modal } from 'antd'
import React from 'react'
import AddBranches from '../Agregar_sucursales/AddBranches'

function ShowBranchesForm({closeModal}) {
  return (
    <Modal
        open={true}
        onCancel={closeModal}
        footer={[]}
    >
        <AddBranches/>
    </Modal>
  )
}

export default ShowBranchesForm