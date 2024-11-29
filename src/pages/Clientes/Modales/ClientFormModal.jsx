import { Modal } from 'antd'
import React from 'react'
import CreateClient from '../Formularios/CreateClient';
import EditClient from '../Formularios/EditClient';
import DeleteClientAlert from '../Alertas/DeleteClientAlert';

function ClientFormModal({ closeModal, actionType, clientId }) {

    const titleKeys = {
        1: "Crear un cliente",
        2: "Actualizar un cliente",
        3: "¿Seguro de querer eliminar este cliente?"
    }

    function renderFormByOption() {
        switch (actionType) {
            case 1:
                
                return(
                    <CreateClient closeModal={closeModal}/>
                )
            case 2:
                return (
                    <EditClient closeModal={closeModal} clientID={clientId}/>
                )
            case 3:
                return(
                    <DeleteClientAlert closeModal={closeModal} clientID={clientId}/>
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
            title={titleKeys[actionType] || "Acción desconocida"}
        >
            {renderFormByOption()}
        </Modal>
    )
}

export default ClientFormModal