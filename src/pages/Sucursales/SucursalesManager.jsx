import React from 'react'
import Layout from '../../components/Layout/Layout'

import Plus from '../../assets/Plus'
import "./SucursalesManager.css"
import { Table } from 'antd'

function SucursalesManager() {

    function RenderSucursalesManager() {
        return (
            <React.Fragment>
                <h1 >Sucursales</h1>
                <p className='sucursales-p'>Gestioná aqui tus sucursales</p>

                <div id="sucursales__wrapper">
                    <div id="sucursales-mix">
                        <h3>Lista de sucursales</h3>
                        <button id='btn-add-sucursal'><Plus/> Agregar Sucursal</button>
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
    return (
        <Layout children={RenderSucursalesManager()} />
    )
}

export default SucursalesManager