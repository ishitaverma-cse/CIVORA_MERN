import axios from "axios";
import {
    BASE_URL, ADMIN_ALLUPVOTE,
    CITIZEN_ADDUPVOTE, CITIZEN_ALLUPVOTE, CITIZEN_SINGLEUPVOTE, CITIZEN_DELETEUPVOTE
} from "../../endpoints";


function getToken() {
    let token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: token
        }
    }
}

//CITIZEN SERVICE
export function addUpvote(data) {
    return axios.post(BASE_URL + CITIZEN_ADDUPVOTE, data, getToken())
}
export function allUpvote(data) {
    return axios.post(BASE_URL + CITIZEN_ALLUPVOTE, data, getToken())
}
export function singleUpvote(data) {
    return axios.post(BASE_URL + CITIZEN_SINGLEUPVOTE, data, getToken())
}
export function deleteUpvote(data) {
    return axios.post(BASE_URL + CITIZEN_DELETEUPVOTE, data, getToken())
}

//ADMIN SERVICE
export function admin_allUpvote(data) {
    return axios.post(BASE_URL + ADMIN_ALLUPVOTE, data, getToken())
}