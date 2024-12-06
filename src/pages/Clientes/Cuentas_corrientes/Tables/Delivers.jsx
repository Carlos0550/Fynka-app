import { Button, Table } from 'antd'
import React from 'react'
import ShowAccountsForms from '../Modales/ShowAccountsForms'

function Delivers({ openModal, setOpenmodal }) {
  return (
    <React.Fragment>
      <Table
        locale={{
          emptyText: (
            <React.Fragment>
              <p><strong>No hay entregas que mostrar</strong></p>
              <Button type='primary' onClick={()=> setOpenmodal(true)}>Agregar una entrega</Button>
            </React.Fragment>
          )
        }}
      />

      {openModal && <ShowAccountsForms closeModal={()=> setOpenmodal(false)} actionType={2}/>}
    </React.Fragment>
  )
}

export default Delivers