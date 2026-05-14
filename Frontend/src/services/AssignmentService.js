import axios from "axios";
import { BASE_URL, ADDASSIGNMENT, ALLASSIGNMENT, SINGLEASSIGNMENT, UPDATEASSIGNMENT, DELETEASSIGNMENT } from "../../endpoints";

function getToken() {
    let token = localStorage.getItem('token');

    return {
        headers: {
            Authorization: token
        }
    }
}

export function addAssignment(data) {
    return axios.post(BASE_URL + ADDASSIGNMENT, data, getToken())
}
export function allAssignment(data) {
    return axios.post(BASE_URL + ALLASSIGNMENT, data, getToken())
}
export function singleAssignment(data) {
    return axios.post(BASE_URL + SINGLEASSIGNMENT, data, getToken())
}
export function updateAssignment(data) {
    return axios.post(BASE_URL + UPDATEASSIGNMENT, data, getToken())
}
export function deleteAssignment(data) {
    return axios.post(BASE_URL + DELETEASSIGNMENT, data, getToken())
}