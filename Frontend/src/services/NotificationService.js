import axios from "axios";
import { BASE_URL, MYNOTIFICATIONS, ADMINNOTIFICATIONS, DELETENOTIFICATIONS, ADMIN_DELETENOTIFICATIONS } from "../../endpoints";


function getToken() {
    let token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: token
        }
    }
}


export function deleteNotifications(data) {
    return axios.post(BASE_URL + DELETENOTIFICATIONS, data, getToken())
}
export function adminDeleteNotifications(data) {
    return axios.post(BASE_URL + ADMIN_DELETENOTIFICATIONS, data, getToken())
}
export function myNotifications(data) {
    return axios.post(BASE_URL + MYNOTIFICATIONS, data, getToken())
}
export function adminNotifications(data) {
    return axios.post(BASE_URL + ADMINNOTIFICATIONS, data, getToken())
}
