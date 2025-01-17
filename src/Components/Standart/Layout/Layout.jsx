import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../../Blocks/Header/Header"
import Footer from "../../Blocks/Footer/Footer";
import BottomNav from "../../Blocks/BottomNav";


function Empty({ children, ...props }) {
    return (
        <>
            {/* <Header /> */}
            <Outlet />
            <BottomNav />
        </>
    );
}

export default Empty;