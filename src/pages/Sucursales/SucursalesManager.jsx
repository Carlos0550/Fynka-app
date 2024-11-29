import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'

import Plus from '../../assets/Plus'
import "./SucursalesManager.css"
import { Button, Space, Table } from 'antd'
import ShowBranchesForm from './Modales/ShowBranchesForm'
import { useAppContext } from '../../AppContext'
import { Navigate } from 'react-router-dom'

import { EditOutlined,DeleteOutlined, ReloadOutlined } from "@ant-design/icons"
function SucursalesManager() {
    const [openModal, setOpenModal] = useState(false)
    const [formSelect, setFormSelect] = useState("")
    const [branchId, setBranchId] = useState(null)

    const { verifyAuthUser, notLogged, getAllBranches, sucursales,loginUserData, deleteBranch } = useAppContext() 
    
    useEffect(()=>{
        (async()=>{
            if(notLogged){
                return <Navigate to={"/"} replace={true}/>
            }
            else await verifyAuthUser()
            await getAllBranches()
        })()
    },[])


    const tableColumns = [
        {
            title: "Nombre",
            dataIndex: "nombre"
        },
        {
            title: "Dirección",
            dataIndex: "direccion"
        },
        {
            title: "Detalles Adicionales",
            dataIndex: "descripcion"
        },
        {
            render:(_,record)=>(
                <Space direction='vertical'>
                    <button className='btn-branches edit'
                        onClick={()=>{
                            setFormSelect(2)
                            setBranchId(record.id)
                            setOpenModal(true)
                        }}
                    ><EditOutlined id='edit-icon' style={{fontSize: "24px"}}/></button>
                    <button onClick={()=> deleteBranch(record.id)} className='btn-branches delete'><DeleteOutlined id="delete-icon" style={{fontSize: "24px"}} /></button>
                </Space>
            )
        }
    ]

     function RenderSucursalesManager() {
        return (
            <React.Fragment>
                <h1 >Sucursales</h1>
                <p className='sucursales-p'>Gestioná aqui tus sucursales</p>
                <Button onClick={()=> getAllBranches()} icon={<ReloadOutlined />}>Recargar</Button>
                <div id="sucursales__wrapper">
                    <div id="sucursales-mix">
                        <h3>Lista de sucursales</h3>
                        <button id='btn-add-sucursal' onClick={()=> {
                            setFormSelect(1)
                            setOpenModal(true)
                        }}>
                            <Plus /> Agregar Sucursal</button>
                    </div>
                    <Table
                        style={{
                            marginTop: "1rem"
                        }}
                        columns={tableColumns}
                        dataSource={sucursales}
                    />
                </div>
            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            <Layout children={RenderSucursalesManager()} />
            {openModal && <ShowBranchesForm actionType={formSelect} closeModal={()=> setOpenModal(false)} branchId={branchId}/>}
        </React.Fragment>
    )
}

export default SucursalesManager