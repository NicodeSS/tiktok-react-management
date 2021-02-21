export interface VideoInfo {
    _id: string,
    videoUrl: string,
    imgUrl: string,
    author_nick: string,
    author_avatar: string,
    author_id: string,
    description: string,
    tagList: Array<string>
    song: string,
    createdAt: string,
    updatedAt: string,
    like: number,
    comment: number,
    share: number
}

export interface VideoInfo_Create {
    author: string,
    description: string,
    tagList: Array<string>
    song: string,
    imgUrl: string,
    videoUrl: string,
}

export interface VideoInfo_Edit {
    _id: string,
    description: string,
    tagList: Array<string>,
    song: string,
    like: number,
    comment: number,
    share: number
}