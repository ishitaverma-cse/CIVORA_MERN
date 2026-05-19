import axios from "axios";
import { BASE_URL, MYNOTIFICATIONS, ADMIN_NOTIFICATIONS } from "../../endpoints";


function getToken() {
    let token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: token
        }
    }
}

export function myNotifications(data) {
    return axios.post(BASE_URL + MYNOTIFICATIONS, data, getToken())
}
export function adminNotifications(data) {
    return axios.post(BASE_URL + ADMIN_NOTIFICATIONS, data, getToken())
}
