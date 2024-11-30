import React, { useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { Button, Table } from "antd"
import { PlusCircleOutlined, ReloadOutlined } from "@ant-design/icons"
import { useAppContext } from '../../AppContext'
function UsersManager() {
    const { getUsers, adminUsers } = useAppContext()
    function RenderUsersManager() {
        return (
            <React.Fragment>
                <h1 >Usuarios</h1>
                <p >Gestioná aqui los usuarios bajo tu dominio</p>
                <Button icon={<ReloadOutlined />}>Recargar</Button>
                <div class="box__wrapper">
                    <div className="mix-box">
                        <h3>Lista de Usuarios</h3>
                        <button className='btn-add' onClick={() => {
                            setFormSelect(1)
                            setOpenModal(true)
                        }}>
                            <PlusCircleOutlined /> Agregar Usuarios</button>
                    </div>

                    <Table
                        style={{
                            marginTop: "1rem"
                        }}
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
        </React.Fragment>
    )
}

export default UsersManager