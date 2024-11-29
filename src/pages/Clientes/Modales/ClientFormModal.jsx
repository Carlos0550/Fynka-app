import { Modal } from 'antd'
import React from 'react'
import CreateClient from '../Formularios/CreateClient';

function ClientFormModal({ closeModal, actionType }) {

    function renderFormByOption() {
        switch (actionType) {
            case "1":
                
                return(
                    <CreateClient closeModal={closeModal}/>
                )
        
            default:
                return "Oops... Tenemos problemas para mostrar esta sección."
        }
    }
    return (
        <Modal
            open={true}
            onCancel={closeModal}
            footer={[]}
        >
            {renderFormByOption()}
        </Modal>
    )
}

export default ClientFormModal