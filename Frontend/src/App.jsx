import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import AdminMasterLayout from "./components/layout/adminLayout/AdminMasterLayout"
import AdminDashboard from "./components/pages/admin/AdminDashboard"
import ManageEmployee from "./components/pages/admin/employee/ManageEmployee"
import ManageCategory from "./components/pages/admin/category/ManageCategory"
import ManageIssue from "./components/pages/admin/issue/ManageIssue"
import ManageAssignments from "./components/pages/admin/assignments/ManageAssignments"
import ManageUsers from "./components/pages/admin/users/ManageUsers"









import EmployeeMasterLayout from "./components/layout/employeeLayout/EmployeeMasterLayout"
import EmpDashboard from './components/pages/employee/EmpDashboard'
import EmpIssues from './components/pages/employee/EmpIssues'
import EmpProfile from './components/pages/employee/EmpProfile'


import UserMasterLayout from "./components/layout/userLayout/UserMasterLayout"
import Home from "./components/pages/user/Home"
import About from './components/pages/user/About'
import IssuesPage from "./components/pages/user/issues/IssuesPage"
import Contact from './components/pages/user/Contact'

import { ToastContainer } from 'react-toastify'


export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminMasterLayout></AdminMasterLayout>}>
            <Route path="/admin/employee" element={<ManageEmployee></ManageEmployee>}></Route>
            <Route path="/admin/category" element={<ManageCategory></ManageCategory>}></Route>
            <Route path="/admin/issues" element={<ManageIssue></ManageIssue>}></Route>
            <Route path="/admin/assignments" element={<ManageAssignments></ManageAssignments>}></Route>
            <Route path="/admin/users" element={<ManageUsers></ManageUsers>}></Route>
            <Route path="/admin/adminDashboard" element={<AdminDashboard></AdminDashboard>}></Route>


          </Route>


          {/* Employee Panel */}
          <Route path="/employee" element={<EmployeeMasterLayout></ EmployeeMasterLayout>}>
            <Route path="/employee/dashboard" element={<EmpDashboard></EmpDashboard>}></Route>
            <Route path="/employee/issue" element={<EmpIssues></EmpIssues>}></Route>
            <Route path="/employee/profile" element={<EmpProfile></EmpProfile>}></Route>

          </Route>


          {/* User Panel */}
          <Route path="/" element={<UserMasterLayout></UserMasterLayout>}>

          <Route index element={<Home></Home>}></Route>
          <Route path="/about" element={<About></About>}></Route>
          <Route path="/issues" element={<IssuesPage></IssuesPage>}></Route>
          <Route path="/contact" element={<Contact></Contact>}></Route>
 

          </Route>

        </Routes>
      </BrowserRouter>

      <ToastContainer/>
    </>
  )
}