import React, { useEffect, useState } from "react";
import "./Layout.css";
import ClientsIcon from "../../assets/ClientsIcon"
import Home from "../../assets/Home"
import UsersIcon from "../../assets/UsersIcon"
import SettingsIcon from "../../assets/SettingsIcon"
import SucursalesIcon from "../../assets/SucursalesIcon"
import { Link, useLocation } from "react-router-dom";
function Layout({ children }) {
    const location = useLocation()
    const route = location.pathname

    const routePaths = [
        { path: "/dashboard", label: "Dashboard", icon: <Home /> },
        { path: "/sucursales", label: "Sucursales", icon: <SucursalesIcon/> },
        { path: "/clientes", label: "Clientes", icon: <ClientsIcon/> },
        { path: "/usuarios", label: "Usuarios", icon: <UsersIcon/>},
        { path: "/configuracion", label: "Ajustes", icon: <SettingsIcon/> },
    ];
    const [sidebarActive, setSidebarActive] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    },[])
    useEffect(()=>{
        if(width >= 768){
            setSidebarActive(true)
        }else{
            setSidebarActive(false)
        }
    },[width])
    return (
        <React.Fragment>
            <div id="layout__wrapper">
                <input type="checkbox" id="sidebar-toggle-checkbox" checked={sidebarActive} onClick={()=>setSidebarActive(!sidebarActive)}/>
                <div class="sidebar">
                    <label for="sidebar-toggle-checkbox" class="sidebar-toggle">☰</label>
                    {routePaths.map((routeObj) => (
                        <Link
                            key={routeObj.path}
                            to={routeObj.path}
                            className={route === routeObj.path ? "active" : ""}
                        >
                            {routeObj.icon}{routeObj.label}
                        </Link>
                    ))}
                </div>
                <div class="content">{children}</div>
            </div>
        </React.Fragment>
    );
}

export default Layout;
