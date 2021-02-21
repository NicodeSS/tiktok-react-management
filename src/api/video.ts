import axios from "../utils/axios"
import {VideoInfo_Create, VideoInfo_Edit} from "../types/video"


export const videos_list = (params={}) => {
    return axios.get('/video/list',params)
}

export const video_create = (info:VideoInfo_Create) => {
    return axios.post('/video/add',info)
}

export const video_retrieve = (id:string) => {
    return axios.get('/video/get', {"_id":id})
}

export const video_update = (info:VideoInfo_Edit) => {
    return axios.post('/video/update',info)
}

export const video_delete = (id:string) => {
    return axios.post('/video/delete',{"_id":id})
}