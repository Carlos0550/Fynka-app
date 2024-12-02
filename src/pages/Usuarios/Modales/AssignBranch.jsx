import { Modal, Select } from 'antd'
import React, { useEffect } from 'react'
import { useAppContext } from '../../../AppContext'

function AssignBranch({closeModal, userId}) {
    const { sucursales, getAllBranches,assignBranch } = useAppContext()
    
    useEffect(()=>{
        (async()=>{
            await getAllBranches()
        })()
    },[])
    
    const handleAssignBranch = (branchId) => {
        const result = assignBranch(branchId, userId)
        if(result) closeModal()
    }
  return (
    <Modal
        open={true}
        onCancel={closeModal}
        footer={[]}
        title="Asignar sucursal"
    >
        <Select
            showSearch
            placeholder="Elija una sucursal"
            optionFilterProp="children"
            onChange={(val)=> handleAssignBranch(val)}
            filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: "100%" }}
        >
            {sucursales.map((sucursal) => (
                <Select.Option key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                </Select.Option>
            ))}
    
        </Select>
    </Modal>
  )
}

export default AssignBranch