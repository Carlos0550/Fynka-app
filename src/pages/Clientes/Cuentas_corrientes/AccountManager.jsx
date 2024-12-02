import React from 'react'
import Layout from '../../../components/Layout/Layout'

function AccountManager() {

    function RenderAccountManager() {
        return(
            <p>Cuentas corrientes</p>
        )
    }
  return (
    <React.Fragment>
        <Layout children={RenderAccountManager()}/>
    </React.Fragment>
  )
}

export default AccountManager