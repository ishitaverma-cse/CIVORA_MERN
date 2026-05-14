import axios from "axios";
import { BASE_URL, ADDEMPLOYEE, ALLEMPLOYEE, SINGLEEMPLOYEE, UPDATEEMPLOYEE, DELETEEMPLOYEE, ALLEMPLOYEES, PROFILE, UPDATEPROFILE } from "../../endpoints";

function getToken() {
    let token = localStorage.getItem('token');

    return {
        headers: {
            Authorization: token
        }
    }
}

export function addEmployee(data) {
    return axios.post(BASE_URL + ADDEMPLOYEE, data, getToken())
}
export function allEmployee(data) {
    return axios.post(BASE_URL + ALLEMPLOYEE, data, getToken())
}
export function singleEmployee(data) {
    return axios.post(BASE_URL + SINGLEEMPLOYEE, data, getToken())
}
export function updateEmployee(data) {
    return axios.post(BASE_URL + UPDATEEMPLOYEE, data, getToken())
}
export function deleteEmployee(data) {
    return axios.post(BASE_URL + DELETEEMPLOYEE, data, getToken())
}
export function allEmployees(data) {
    return axios.post(BASE_URL + ALLEMPLOYEES, data, getToken())
}
export function profile(data) {
    return axios.post(BASE_URL + PROFILE, data, getToken())
}
export function updateProfile(data) {
    return axios.post(BASE_URL + UPDATEPROFILE, data, getToken())
}

