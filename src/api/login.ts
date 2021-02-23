import axios from "../utils/axios"
import { Login_Params } from "../types/login"


export const admin_login = (params: Login_Params) => {
    return axios.post('/admin/login',params)
}

export const is_login = () => {
    return axios.get('/admin/isLogin')
}