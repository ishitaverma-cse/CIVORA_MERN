import axios from "axios";
import { BASE_URL, DASHBOARD } from "../../endpoints";

function getToken() {
    let token = localStorage.getItem('token');

    return {
        headers: {
            Authorization: token
        }
    }
}

export function dashboard(data) {
    return axios.post(BASE_URL + DASHBOARD, data, getToken())
}
