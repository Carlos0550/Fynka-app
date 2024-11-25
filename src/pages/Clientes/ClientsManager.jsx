import React from 'react'
import Layout from '../../components/Layout/Layout'
import Search from 'antd/es/input/Search'
import Plus from '../../assets/Plus'
import "./ClientsManager.css"
import { Table } from 'antd'
function ClientsManager() {

    const RenderClientManager = () => {
        return (
            <React.Fragment>
                <h1>Clientes</h1>
                <div id="buttons-box">
                    <Search className='btn-search-client' />
                    <button id='btn-create-client'><Plus /> Agregar Cliente</button>
                </div>
                <Table 
                    style={{
                        marginTop: ".5rem"
                    }}
                />
            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            <Layout children={RenderClientManager()} />
        </React.Fragment>
    )
}

export default ClientsManager