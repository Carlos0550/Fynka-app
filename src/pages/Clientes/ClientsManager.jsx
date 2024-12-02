import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import Search from 'antd/es/input/Search'
import Plus from '../../assets/Plus'
import "./ClientsManager.css"
import { Button, message, Space, Table } from 'antd'
import { useAppContext } from '../../AppContext'
import ClientFormModal from './Modales/ClientFormModal'
import { CapitaliceStrings } from '../../utils/CapitaliceStrings'

import { DeleteOutlined, EditOutlined, IdcardOutlined, ReloadOutlined } from "@ant-design/icons"
import { Route, Routes, useNavigate } from 'react-router-dom'
import AccountManager from './Cuentas_corrientes/AccountManager'
function ClientsManager() {
    const { getClients, clients, verifyAuthUser } = useAppContext()
    const [modalStatus, setModalStatus] = useState(false)
    const [actionType, setActionType] = useState(null)
    const [clientId, setClientId] = useState(null)
    const navigate = useNavigate()

    const toggleModal = (actionTp, clientId = null) => {
        setActionType(actionTp)
        if(actionTp !== 1) setClientId(clientId)
        setModalStatus(!modalStatus)
    }

    const tableColumns = [
        {
            title: "Cliente",
            render: (_, record) => (
                <strong>{CapitaliceStrings(record.nombre)}</strong>
            )
        },
        {
            title: "Datos del cliente",
            render: (_, record) => (
                <Space direction='vertical'>
                    <p><strong>DNI: </strong>{record.dni}</p>
                    <p><strong>Correo: </strong>{record.email || "N/A"}</p>
                    <p><strong>Dirección: </strong>{record.direccion || "N/A"}</p>
                </Space>
            )
        },
        {
            render: (_, record) => (
                <Space direction='vertical'>
                    <Button icon={<IdcardOutlined />} onClick={()=> navigate(`/clientes/cuentas-corrientes/${record.id}`)}>Ver cuenta</Button>
                    <Space> <Button icon={<EditOutlined/>} onClick={()=>{
                        toggleModal(2, record.id)
                    }}/>  
                    <Button icon={<DeleteOutlined/>} type='primary' danger onClick={()=>{
                        toggleModal(3, record.id)
                    }}/></Space>
                </Space>
            )
        }
    ]

    const RenderClientManager = () => {
        return (
            <React.Fragment>
                <h1>Clientes</h1>
                <p>Gestiona aqui tus clientes</p>
                <Button icon={<ReloadOutlined />} style={{ marginTop: ".5rem", marginBottom: ".5rem" }} onClick={() => {
                    message.loading("Obteniendo clientes...")
                    getClients()
                }}>Recargar</Button>
                <div id="buttons-box">
                    <Search className='btn-search-client' />
                    <button id='btn-create-client' onClick={() => {
                        toggleModal(1, null)
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
            
            {
                modalStatus && <ClientFormModal closeModal={toggleModal} actionType={actionType} clientId={clientId}/>
            }
            <Routes>
                <Route path='/' element={<Layout children={RenderClientManager()} />}/>
                <Route path="/cuentas-corrientes/:clientId" element={<AccountManager/>}/>
            </Routes>
        </React.Fragment>
    )
}

export default ClientsManager