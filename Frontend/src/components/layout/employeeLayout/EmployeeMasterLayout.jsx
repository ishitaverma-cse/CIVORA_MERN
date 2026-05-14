import EmployeeFooter from "./EmployeeFooter"
import EmployeeHeader from "./EmployeeHeader"
import { Outlet } from "react-router-dom"

export default function EmployeeMasterLayout() {
    return (
        <>
            <EmployeeHeader></EmployeeHeader>

            <Outlet></Outlet>

            <EmployeeFooter></EmployeeFooter>
        </>
    )
}