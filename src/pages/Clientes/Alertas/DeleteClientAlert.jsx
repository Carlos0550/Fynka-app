import { Button, Space } from 'antd'
import React, { useState } from 'react'
import { useAppContext } from '../../../AppContext'

function DeleteClientAlert({ closeModal, clientID }) {
    
    const { deletClient } = useAppContext()

    const [deleting, setDeleting] = useState(false)
    const handleConfirmDeleting = async() => {
        setDeleting(true)
        await deletClient(clientID)
        setDeleting(false)
        closeModal()
    }

    return (
        <div>
            <p>Si el cliente tiene deudas o entregas a su dominio, no será posible eliminar hasta cancelar sus deudas.</p>
            <p style={{color: "red"}}>Esta acción no se puede deshacer!</p>
            <Space>
                <Button type='primary' danger onClick={()=> handleConfirmDeleting()} loading={deleting} disabled={deleting}>Eliminar este cliente!</Button>
                <Button onClick={() => closeModal()} type='primary'>Cancelar</Button>
            </Space>
        </div>
    )
}

export default DeleteClientAlert