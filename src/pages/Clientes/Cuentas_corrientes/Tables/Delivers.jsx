import { Table } from 'antd'
import React from 'react'

function Delivers({branches, clientId, delivers}) {
  return (
    <Table
    locale={{
      emptyText: (
        <p>No hay entregas que mostrar</p>
      )
    }}
    >

    </Table>
  )
}

export default Delivers