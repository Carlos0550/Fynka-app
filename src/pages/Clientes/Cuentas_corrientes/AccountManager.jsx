import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { useAppContext } from '../../../AppContext';
import { useParams } from 'react-router-dom';
import { CapitaliceStrings } from '../../../utils/CapitaliceStrings';
import { Space, Switch } from 'antd';
import RenderTable from './RenderTable';

function AccountManager() {
  const { verifyAuthUser, loginUserData, getClientAccount, clientDebts, clientMoneyDelivers, clients, sucursales, getAllBranches } = useAppContext();
  const { clientId } = useParams();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const alreadyVerified = useRef(false);
  const [tableShow, setTableShow] = useState(1);

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
    const sucursalName = sucursales.find(sucursal => sucursal.id === selectedBranch || loginUserData.sucursal_id)?.nombre
    return (
      <React.Fragment>
        <h3>Cuenta de {CapitaliceStrings(clientName)} en {CapitaliceStrings(sucursalName)}</h3>
        
      <Space>
      <p>¿Que deseas visualizar? </p>
          <Switch 
            defaultChecked={2}
            unCheckedChildren="Entregas" 
            checkedChildren="Deudas" 
            onChange={(checked) => setTableShow(checked ? 1 : 2)} 
          />

        </Space>
        <button className='btn-add' style={{margin: "1rem"}}>Recargar vista</button>
        <RenderTable tableId={tableShow} state={{clientId, selectedBranch, clientDebts, clientMoneyDelivers}}/>
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
