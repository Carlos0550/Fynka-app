import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { useAppContext } from '../../../AppContext';
import { useParams } from 'react-router-dom';
import { CapitaliceStrings } from '../../../utils/CapitaliceStrings';
import { Space, Spin, Switch } from 'antd';
import RenderTable from './RenderTable';

import { ReloadOutlined } from "@ant-design/icons"
function AccountManager() {
  const { loginUserData, getClientAccount,clients, sucursales, getAllBranches, setState, state, gettingAccount } = useAppContext();
  const { clientId } = useParams();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [tableShow, setTableShow] = useState(1);
 
  useEffect(()=>{
    setState({
      clientID: clientId,
      branchName: sucursales.find(sucursal => sucursal.id === selectedBranch || loginUserData?.sucursal_id)?.nombre,
      branchID: selectedBranch || loginUserData?.sucursal_id,
      adminID: loginUserData?.id,
      userID: ""
    })
  },[clientId, sucursales, loginUserData])


  useEffect(() => {
    if (sucursales.length === 0 && loginUserData) getAllBranches()
  }, [sucursales, loginUserData])

  useEffect(() => {
    (async () => {
      await getClientAccount(clientId, selectedBranch)
    })()
  }, []);

  
  function RenderAccountManager() {
    const clientName = clients.find(client => client.id === clientId)?.nombre
    return (
      <React.Fragment>
        <h3>Cuenta de {CapitaliceStrings(clientName)} en {CapitaliceStrings(state.branchName)}</h3>
        
      <Space>
      <p>¿Que deseas visualizar? </p>
          <Switch 
            defaultChecked={2}
            unCheckedChildren="Entregas" 
            checkedChildren="Deudas" 
            onChange={(checked) => setTableShow(checked ? 1 : 2)} 
          />

        </Space>
        <button className='btn-add' style={{margin: "1rem"}} disabled={gettingAccount} onClick={()=> getClientAccount(clientId, selectedBranch)}>{gettingAccount ? <Spin/> : <> <ReloadOutlined /> Recargar vista</>}</button>
        <RenderTable tableId={tableShow}/>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Layout children={RenderAccountManager()} />
    </React.Fragment>
  );
}

export default AccountManager;
