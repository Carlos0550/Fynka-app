import { Button, Space, Table } from 'antd'
import React from 'react'
import ShowAccountsForms from '../Modales/ShowAccountsForms'
import { useAppContext } from '../../../../AppContext'
import dayjs from 'dayjs'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

function Delivers({ openModal, setOpenmodal }) {
  const { clientMoneyDelivers, gettingAccount } = useAppContext()

  const tableColumns = [
    {
      title: "Fecha de entrega",
      render:(_,record)=>(
        <p>{dayjs(record.fecha).format("DD/MM/YYYY")}</p>
      )
    },
    {
      title: "Monto de entrega",
      render:(_,record)=>(
        <p>{parseFloat(record.monto).toLocaleString("es-AR",{style:"currency", "currency": "ARS"})}</p>
      )
    },
    {
      render:(_,record) => (
        <Space direction='vertical'>
          <Button type='primary' icon={<EditOutlined />}/>
          <Button type='primary' danger icon={<DeleteOutlined />}/>
        </Space>
      )
    }
  ]
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
        loading={gettingAccount}
        style={{marginTop: ".5rem"}}
        columns={tableColumns}
        dataSource={clientMoneyDelivers}
      />

      {openModal && <ShowAccountsForms closeModal={()=> setOpenmodal(false)} actionType={2}/>}
    </React.Fragment>
  )
}

export default Delivers