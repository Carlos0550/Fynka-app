import React from 'react'
import Debts from './Tables/Debts'
import Delivers from './Tables/Delivers'
import { Empty } from 'antd'
function RenderTable({tableId}) {
    function RenderTable() {
        switch (parseInt(tableId)) {
            case 1:
                
                return(
                    <Debts />
                )
            case 2: 
                return(
                    <Delivers />
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