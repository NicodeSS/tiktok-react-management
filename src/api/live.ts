import axios from "../utils/axios"
import {LiveInfo_Create, LiveInfo_Update} from "../types/live"


export const lives_list = (params={}) => {
    return axios.get('/live/list',params)
}

export const live_create = (info:LiveInfo_Create) => {
    return axios.post('/live/add',info)
}

export const live_retrieve = (id:string) => {
    return axios.get('/live/get', {"_id":id})
}

export const live_update = (info:LiveInfo_Update) => {
    return axios.post('/live/update',info)
}

export const live_delete = (id:string) => {
    return axios.post('/live/delete',{"_id":id})
}