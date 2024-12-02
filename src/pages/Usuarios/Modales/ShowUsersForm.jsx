import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../AppContext'
import AddUsers from '../Formularios/AddUsers'

function ShowUsersForm({closeModal, actionType, userId}) {
    const [administratorID, setAdministratorID] = useState(null)

    const { loginUserData } = useAppContext()

    const keyNames = {
        1: "Crear un usuario"
    }

    function switchForm() {
        switch (actionType) {
            case 1:
                return(
                    <AddUsers closeModal={closeModal} adminID={loginUserData.id}/>
                )
            default:
                return(
                    <p>Oops... tenemos problemas para mostrar esta sección</p>
                )
        }
    }

    useEffect(()=>{
        if(loginUserData){
            console.log("loginUserData: ", loginUserData)
            setAdministratorID(loginUserData.id)
        }
    },[loginUserData])


  return (
    <Modal
        onCancel={closeModal}
        footer={[]}
        open={true}
        title={keyNames[actionType]}
    >
        {switchForm()}
    </Modal>
  )
}

export default ShowUsersForm