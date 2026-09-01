import Footer from "./Footer/Footer";
import "./Layout.css"
import {Outlet} from 'react-router-dom'
import React from 'react'

export default function Layout(){
    return(
        <div className="layout">
            <main>
                <Outlet/>

            </main>
            <Footer/>
        </div>
    )
}