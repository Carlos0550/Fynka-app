import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import Search from 'antd/es/input/Search'
import Plus from '../../assets/Plus'
import "./ClientsManager.css"
import { Button, message, Space, Table } from 'antd'
import { useAppContext } from '../../AppContext'
import ClientFormModal from './Modales/ClientFormModal'
import { CapitaliceStrings } from '../../utils/CapitaliceStrings'

import { IdcardOutlined, ReloadOutlined } from "@ant-design/icons"
function ClientsManager() {
    const { getClients, clients, verifyAuthUser } = useAppContext()
    const [modalStatus, setModalStatus] = useState(false)
    const [actionType, setActionType] = useState(null)

    const toggleModal = (actionTp) => {
        setActionType(actionTp)
        setModalStatus(!modalStatus)
    }

    const tableColumns = [
        {
            title:"Cliente",
            render: (_,record)=>(
                <strong>{CapitaliceStrings(record.nombre)}</strong>
            )
        },
        {
            title: "Datos del cliente",
            render:(_,record)=>(
                <Space direction='vertical'>
                    <p><strong>DNI: </strong>{record.dni}</p>
                    <p><strong>Correo: </strong>{record.email || "N/A"}</p>
                    <p><strong>Dirección: </strong>{record.direccion || "N/A"}</p>
                </Space>
            )
        },
        {
            render:(_,record)=> (
                <Button icon={<IdcardOutlined />}>Ver cuenta</Button>
            )
        }
    ]

    const RenderClientManager = () => {
        return (
            <React.Fragment>
                <h1>Clientes</h1>
                <p>Gestiona aqui tus clientes</p>
                <Button icon={<ReloadOutlined />} style={{ marginTop: ".5rem", marginBottom: ".5rem"}} onClick={()=> {
                    message.loading("Obteniendo clientes...")
                    getClients()
                }}>Recargar</Button>
                <div id="buttons-box">
                    <Search className='btn-search-client' />
                    <button id='btn-create-client' onClick={() => {
                        toggleModal("1")
                    }}><Plus /> Agregar Cliente</button>
                </div>
                <Table
                    style={{
                        marginTop: ".5rem"
                    }}
                    columns={tableColumns}
                    dataSource={clients}
                />
            </React.Fragment>
        )
    }

    useEffect(() => {
        (async () => {
            await verifyAuthUser()
            await getClients()
        })()
    }, [])
    return (
        <React.Fragment>
            <Layout children={RenderClientManager()} />
            {
                modalStatus && <ClientFormModal closeModal={toggleModal} actionType={actionType} />
            }
        </React.Fragment>
    )
}

export default ClientsManager