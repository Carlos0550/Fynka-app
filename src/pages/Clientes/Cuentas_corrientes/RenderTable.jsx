import React, { useState } from 'react'
import Debts from './Tables/Debts'
import Delivers from './Tables/Delivers'
import { Button, Empty } from 'antd'
function RenderTable({tableId}) {
    const [openDebtModal, setOpenDebtmodal] = useState(false)
    const [openDeliverModal, setOpenDeliverModal] = useState(false)
    function RenderTable() {
        switch (parseInt(tableId)) {
            case 1:
                
                return(
                    <React.Fragment>
                        <Button onClick={()=> setOpenDebtmodal(true)} style={{marginTop: "1rem"}}>
                            Agregar deuda
                        </Button>
                        <Debts openModal={openDebtModal} setOpenmodal={setOpenDebtmodal}/>
                    </React.Fragment>
                )
            case 2: 
                return(
                    <React.Fragment>
                        <Button onClick={()=> setOpenDeliverModal(true)} style={{marginTop: "1rem"}}>
                            Agregar entrega
                        </Button>
                        <Delivers openModal={openDeliverModal} setOpenmodal={setOpenDeliverModal}/>
                    </React.Fragment>
                )
            default:
                <Empty/>
        }
    }
  return (
    <React.Fragment>
        {RenderTable()}
    </React.Fragment>
  )
}

export default RenderTable