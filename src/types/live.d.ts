export interface LiveInfo {
    _id: string,
    publishUrl: string,
    playUrl: string,
    description: string,
    author_id: string,
    author_nick: string,
    author_avatar: string
}

export interface LiveInfo_Create {
    author: string
}

export interface LiveInfo_Update {
    _id: string,
    description: string
}