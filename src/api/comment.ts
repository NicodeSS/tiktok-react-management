import axios from "../utils/axios"

export const updateComment = (_id:string,content:string)=>{
    return axios.post("/comment/update",{_id,content});
}

export const sendComment = (content:string)=>{
    return axios.post("/comment/add",{live:'603293b06389d61bd01e22b4',content});
}

export const deleteComment = (_id:string)=>{
    return axios.post("/comment/delete",{_id});
}

export const getCommentList = ()=>{
    return axios.get('/comment/list',{});
}
