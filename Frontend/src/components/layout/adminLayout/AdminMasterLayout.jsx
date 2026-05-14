import AdminHeader from "./AdminHeader"
import AdminFooter from "./AdminFooter"
import { Outlet } from "react-router-dom"


export default function AdminMasterLayout() {
    return (
        <>
            <AdminHeader></AdminHeader>

            <Outlet></Outlet>

            <AdminFooter></AdminFooter>

        </>
    )
}