import { Outlet } from "react-router-dom"
import UserHeader from "./UserHeader"
import UserFooter from "./UserFooter"

export default function AdminMasterLayout() {
    return (
        <>
            <UserHeader></UserHeader>

            <Outlet></Outlet>

            <UserFooter></UserFooter>


        </>
    )
}