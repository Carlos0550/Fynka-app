import { Button, Table } from 'antd'
import React, { useState } from 'react'
import ShowAccountsForms from '../Modales/ShowAccountsForms'

function Debts({branches, clientId, debts}) {
  const [openModal, setOpenmodal] = useState(false)
  const handleOpenModal = () => {
    setOpenmodal(true)
  }
    
  return (
    <React.Fragment>
      <Table
      style={{
        marginTop: ".5rem"
      }}
      locale={{
        emptyText: (
          <>
            <p><strong>No hay deudas que mostrar</strong></p>
            <Button type='primary' style={{ marginTop: ".5rem" }} onClick={()=> handleOpenModal()}>Agregar una deuda</Button>
          </>
        )
      }}
    >
    </Table>
    {openModal && 
    <ShowAccountsForms 
      closeModal={() => setOpenmodal(false)} 
      state={{branches, clientId}} 
      actionType={1}/>
    }

    </React.Fragment>
  )
}

export default Debts