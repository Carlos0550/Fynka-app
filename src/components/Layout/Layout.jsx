import React, { useState } from "react";
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

    return (
        <React.Fragment>
            <div id="layout__wrapper">
                <input type="checkbox" id="sidebar-toggle-checkbox" />
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
