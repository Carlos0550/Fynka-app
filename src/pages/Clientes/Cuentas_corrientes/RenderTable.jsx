import React, { useState } from 'react'
import Debts from './Tables/Debts'
import Delivers from './Tables/Delivers'
import { Button, Empty } from 'antd'

import { useAppContext } from "../../../AppContext.js"
function RenderTable({tableId}) {
    const { handlerDebts } = useAppContext()
    function RenderTable() {
        switch (parseInt(tableId)) {
            case 1:
                
                return(
                    <React.Fragment>
                        <Button onClick={()=> handlerDebts(null, 1, false, true, false)} style={{marginTop: "1rem"}}>
                            Agregar deuda
                        </Button>
                        <Debts />
                    </React.Fragment>
                )
            case 2: 
                return(
                    <React.Fragment>
                        <Button onClick={()=> handlerDebts(null, 2, false, true, false)} style={{marginTop: "1rem"}}>
                            Agregar entrega
                        </Button>
                        <Delivers />
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