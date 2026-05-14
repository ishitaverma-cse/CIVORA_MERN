import axios from "axios";
import { BASE_URL, ADDCATEGORY, ALLCATEGORY, DELETECATEGORY, UPDATECATEGORY, SINGLECATEGORY } from "../../endpoints";

function getToken() {
    let token = localStorage.getItem('token');

    return {
        headers: {
            Authorization: token
        }
    }
}

export function addCategory(data) {
    return axios.post(BASE_URL + ADDCATEGORY, data, getToken())
}

export function allCategory(data) {
    return axios.post(BASE_URL + ALLCATEGORY, data, getToken())
}

export function singleCategory(data) {
    return axios.post(BASE_URL + SINGLECATEGORY, data, getToken())
}

export function updateCategory(data) {
    return axios.post(BASE_URL + UPDATECATEGORY, data, getToken())
}

export function deleteCategory(data) {
    return axios.post(BASE_URL + DELETECATEGORY, data, getToken())
}