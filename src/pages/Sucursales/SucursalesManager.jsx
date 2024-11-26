import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'

import Plus from '../../assets/Plus'
import "./SucursalesManager.css"
import { Space, Table } from 'antd'
import ShowBranchesForm from './Modales/ShowBranchesForm'
import { useAppContext } from '../../AppContext'
import { Navigate } from 'react-router-dom'

import { EditOutlined,DeleteOutlined } from "@ant-design/icons"
function SucursalesManager() {
    const [openModal, setOpenModal] = useState(false)

    const { verifyAuthUser, notLogged, getAllBranches, sucursales,loginUserData } = useAppContext() 
    
    useEffect(()=>{
        (async()=>{
            if(notLogged){
                return <Navigate to={"/"} replace={true}/>
            }
            else await verifyAuthUser()
            await getAllBranches()
        })()
    },[loginUserData])


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
                    <button className='btn-branches edit'><EditOutlined id='edit-icon' style={{fontSize: "24px"}}/></button>
                    <button className='btn-branches delete'><DeleteOutlined id="delete-icon" style={{fontSize: "24px"}} /></button>
                </Space>
            )
        }
    ]

    function RenderSucursalesManager() {
        return (
            <React.Fragment>
                <h1 >Sucursales</h1>
                <p className='sucursales-p'>Gestioná aqui tus sucursales</p>

                <div id="sucursales__wrapper">
                    <div id="sucursales-mix">
                        <h3>Lista de sucursales</h3>
                        <button id='btn-add-sucursal' onClick={()=> setOpenModal(true)}><Plus /> Agregar Sucursal</button>
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
            {openModal && <ShowBranchesForm closeModal={()=> setOpenModal(false)}/>}
        </React.Fragment>
    )
}

export default SucursalesManager