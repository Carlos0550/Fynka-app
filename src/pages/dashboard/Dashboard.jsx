import React, { useEffect } from 'react'
import "./Dashboard.css"
import { useAppContext } from '../../AppContext'
import Layout from '../../components/Layout/Layout'
import { Table } from 'antd'
import { recentlyActivity } from '../../utils/recentlyActivity'

function Dashboard() {
  const { loginUserData, verifyAuthUser } = useAppContext()

  useEffect(() => {
    (async () => {
      await verifyAuthUser()
    })()
  }, [])

  const username = loginUserData && loginUserData.nombre_usuario

  function RenderDashboard() {
    const tableColumns =[
      {
        title: "Cliente",
        dataIndex: "client_name"
      },
      {
        title: "Tipo",
        dataIndex: "type"
      },
      {
        title: "Monto/Ítems",
        render:(_,record)=>(
          <React.Fragment>
            {record.type === "Deuda" ? `${record?.productsCount} ítems` : `${parseFloat(record.mount).toLocaleString("es-AR",{style:"currency", "currency": "ARS"})}`}
          </React.Fragment>
        )
      }
    ]
    return (
      <React.Fragment>
        <h1>Dashboard</h1>
        <div id="user-welcome__wrapper">
          <picture id='user-picture'>
            <img src="https://placehold.co/600x400" alt="user_image" />
          </picture>
          <div id="user-info">
            <h2>Bienvenido, {username}</h2>
            <p>Aqui tienes un resumen de tu actividad</p>
          </div>
        </div>
        <div id="miscellaneous-wrapper">
            <div className="miscellaneous-box">
                <p className='miscellaneous-title'>Ingresos Totales</p>
                <p className='miscellaneous-data'>$45,000.59</p>
                <p className='miscellaneous-footer'>+21.1% desde el ultimo mes.</p>
            </div>

            <div className="miscellaneous-box">
                <p className='miscellaneous-title'>Deudas Pendientes</p>
                <p className='miscellaneous-data'>$68,000.59</p>
                <p className='miscellaneous-footer'>+4.1% desde la ultima semana.</p>
            </div>

            <div className="miscellaneous-box">
                <p className='miscellaneous-title'>Deudas por vencer</p>
                <p className='miscellaneous-data'>15</p>
                <p className='miscellaneous-footer'>Menos de 1 semana</p>
            </div>
            <div className="miscellaneous-box">
                <p className='miscellaneous-title'>Deudas Vencidas</p>
                <p className='miscellaneous-data'>4</p>
            </div>
          </div>

          <div id="recently-activity">
            <h2>Actividad Reciente</h2>
            <Table
              columns={tableColumns}
              dataSource={recentlyActivity}
              style={{
                zIndex: "0"
              }}
            />
          </div>
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <Layout children={RenderDashboard()} />
    </React.Fragment>
  )
}

export default Dashboard