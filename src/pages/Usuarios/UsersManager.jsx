import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { Button, Select, Space, Table } from "antd"
import { PlusCircleOutlined, ReloadOutlined } from "@ant-design/icons"
import { useAppContext } from '../../AppContext'
import ShowUsersForm from './Modales/ShowUsersForm'
import {CapitaliceStrings} from "../../utils/CapitaliceStrings"
import AssignBranch from './Modales/AssignBranch'
function UsersManager() {
    const { getUsers, adminUsers, sucursales } = useAppContext()
    const [formSelect,setFormSelect] = useState(null)
    const [openModal,setOpenModal] = useState(false)
    const [userId, setUserId] = useState(null)

    const toggleModalForm = (actionType, userID = null) =>{
        setFormSelect(parseInt(actionType))
        setUserId(userID)
        setOpenModal(true)
    }
    const [openModalBranchs, setOpenModalBranchs] = useState(false)
    const toggleModalBranchs = (userID) =>{
        setUserId(userID)
        setOpenModalBranchs(!openModalBranchs)
    }

    const tableColumns = [
        {
            title: "Usuario",
            render:(_,record)=> (
                <strong>{CapitaliceStrings(record.user_name)}</strong>
            )
        },
        {
            title: "Datos del usuario", 
            render: (_, record) => (
                <Space direction='vertical'>
                    <p><strong>DNI: </strong>{record.dni}</p>
                    <p><strong>Correo: </strong>{record.email || "N/A"}</p>
                </Space>
            )
        },
        {
            title: "Sucursal Asignada",
            render:(_,record)=>{
                const nombre_sucursal = sucursales.find(sucursal => sucursal.id === record.sucursal_id)?.nombre
                return(
                    <Space direction='vertical'>
                        <p>{nombre_sucursal || "N/A"}</p>
                        <button className='btn-add' onClick={()=> toggleModalBranchs(record.id)}>Asignar sucursal</button>
                    </Space>
                )
            }
        }
    ]

    console.log(adminUsers)
    function RenderUsersManager() {
        return (
            <React.Fragment>
                <h1 >Usuarios</h1>
                <p >Gestioná aqui los usuarios bajo tu dominio</p>
                <Button icon={<ReloadOutlined />} onClick={()=> getUsers()}>Recargar</Button>
                <div class="box__wrapper">
                    <div className="mix-box">
                        <h3>Lista de Usuarios</h3>
                        <button className='btn-add' onClick={() => {
                            toggleModalForm(1, null)
                        }}>
                            <PlusCircleOutlined /> Agregar Usuarios</button>
                    </div>

                    <Table
                        style={{
                            marginTop: "1rem"
                        }}
                        columns={tableColumns}
                        dataSource={adminUsers}
                    />
                </div>
            </React.Fragment>
        )
    }

    useEffect(()=>{
        (async()=>{
            await getUsers()
        })()
    },[])

    
    return (
        <React.Fragment>
            <Layout children={RenderUsersManager()} />
            {
                openModal && <ShowUsersForm closeModal={()=> setOpenModal(false)}
                    userId={userId}
                    actionType={formSelect}
                />
            }

            {
                openModalBranchs && <AssignBranch closeModal={toggleModalBranchs}
                    userId={userId}
                />
            }
        </React.Fragment>
    )
}

export default UsersManager