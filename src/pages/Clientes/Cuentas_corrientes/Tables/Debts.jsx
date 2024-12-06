import { Button, Table } from 'antd'
import React, { useState } from 'react'
import ShowAccountsForms from '../Modales/ShowAccountsForms'
import { useAppContext } from '../../../../AppContext'
import { processData } from './processData'
import dayjs from 'dayjs'
function Debts() {
  const [openModal, setOpenmodal] = useState(false)
  const { gettingAccount, clientDebts } = useAppContext()
  const handleOpenModal = () => {
    setOpenmodal(true)
  }
  console.log(clientDebts)
  const tableColumns =  [
    {
      title: "Fecha de compra",
      render: (_,record) => (
        <React.Fragment>
          <strong>{dayjs(record.created_at).format("DD/MM/YYYY")}</strong>
          <p>Con vencimiento el <strong>{dayjs(record.vencimiento).format("DD/MM/YYYY")}</strong></p>
        </React.Fragment>
      )
    },
    {
      title: "Detalles",
      render: (_,record) => {
        const products = processData(record.detalle_productos)
        return(
          <React.Fragment>
            <ul>
              {products.map(product => (
                <li>{product.quantity} {product.name} {parseFloat(product.price).toLocaleString("es-AR",{style:"currency", "currency": "ARS"})}</li>
              ))}
            </ul>
          </React.Fragment>
        )
      }
    },
    {
      title: "Detalles Adicionales",
    },
    {
      title: "Monto total",
      render: (_,record) => (
        <strong>{parseFloat(record.monto_total).toLocaleString("es-AR",{style:"currency", "currency": "ARS"})}</strong>
      )
    }
  ]
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
      loading={gettingAccount}
      columns={tableColumns}
      dataSource={clientDebts}
    >
    </Table>
    {openModal && 
    <ShowAccountsForms 
      closeModal={() => setOpenmodal(false)} 
      actionType={1}/>
    }

    </React.Fragment>
  )
}

export default Debts