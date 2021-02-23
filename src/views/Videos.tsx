import React from "react";
import {
    Button,
    Card, CardHeader,
    Container,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
    IconButton,
    Snackbar,
    TextField
} from "@material-ui/core";
import {Alert, Pagination} from "@material-ui/lab"
import AddIcon from "@material-ui/icons/Add"

import {AlertSeverity} from "../types/enums";
import {VideoInfo, VideoInfo_Create} from "../types/video";
import {videos_list, video_create} from "../api/video";
import Video from "../components/Video";

import './Videos.css'


interface Props {
}

interface States {
    videos: Array<VideoInfo>,
    page: number,
    limit: number,
    total: number,

    createDialog: boolean,
    createInfo: VideoInfo_Create,

    snackbar: boolean,
    alertSeverity: AlertSeverity,
    alertMessage: string,
}


class Videos extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            videos: [],
            page: 1,
            limit: 8,
            total: 0,
            createDialog: false,
            createInfo: {
                author: "6030cf6eeaad770b47afb528",
                description: "Test Video",
                tagList: ["TestTag1", "TestTag2"],
                song: "Tester - Test Song",
                imgUrl: "http://182.61.20.79:3000/res/video06.jpg",
                videoUrl: "http://182.61.20.79:3000/res/video06.mp4",
            },
            snackbar: false,
            alertSeverity: AlertSeverity.Success,
            alertMessage: "无消息",
        }
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handleCreateClose = this.handleCreateClose.bind(this)
        this.handleFormChange = this.handleFormChange.bind(this)
        this.setSnackbar = this.setSnackbar.bind(this)
        this.setAlertSeverity = this.setAlertSeverity.bind(this)
        this.setAlertMessage = this.setAlertMessage.bind(this)
        this.createVideo = this.createVideo.bind(this)
        this.fetchVideos = this.fetchVideos.bind(this)
    }

    async fetchVideos(page?: number) {
        try {
            let response = await videos_list({
                offset: page ? (page - 1) * this.state.limit : (this.state.page - 1) * this.state.limit,
                limit: this.state.limit
            })
            let videos: Array<VideoInfo> = response.data.videos
            let total: number = response.data.total

            if (page)
                this.setState({videos, total, page})
            else
                this.setState({videos, total})
        } catch (err) {
            console.error(err);
            this.setAlertSeverity(AlertSeverity.Error)
            this.setAlertMessage("加载出错")
            this.setSnackbar(true)
        }
    }

    async componentDidMount() {
        await this.fetchVideos()
    }

    async handlePageChange(event: object, value: number) {
        await this.fetchVideos(value)
    }

    handleFormChange(event: any) {
        const target = event.target;
        const value = target.value;
        const name: string = target.name;

        let newInfo: any = Object.assign({}, this.state.createInfo)
        if (name === "tags")
            newInfo.tagList = value.split(',')
        else
            newInfo[name] = value
        this.setState({createInfo: newInfo})
    }

    handleCreateClose() {
        this.setState({
            createDialog: false,
            createInfo: {
                author: "6030cf6eeaad770b47afb528",
                description: "Test Video",
                tagList: ["TestTag1", "TestTag2"],
                song: "Tester - Test Song",
                imgUrl: "http://182.61.20.79:3000/res/video06.jpg",
                videoUrl: "http://182.61.20.79:3000/res/video06.mp4",
            }
        })
    }

    async createVideo() {
        try {
            let info: VideoInfo_Create = Object.assign({}, this.state.createInfo);
            let newTags: Array<string> = []
            for (let i in info.tagList)
                if (info.tagList[i] && info.tagList[i].length > 0)
                    newTags.push(info.tagList[i])
            info.tagList = newTags

            console.log(info)
            let response = await video_create(info)
            this.setAlertSeverity(AlertSeverity.Success)
            this.setAlertMessage("新增成功")
            this.handleCreateClose()

        } catch (err) {
            console.error(err)
            this.setAlertSeverity(AlertSeverity.Error)
            this.setAlertMessage("新增失败")
        } finally {
            this.setSnackbar(true)
        }
    }

    setSnackbar(status: boolean): void {
        this.setState({snackbar: status})
    }

    setAlertSeverity(status: AlertSeverity): void {
        this.setState({alertSeverity: status})
    }

    setAlertMessage(message: string): void {
        this.setState({alertMessage: message})
    }

    render() {
        return (
            <Container>
                <Card className={"pa-2"}>
                    <CardHeader
                        title="短视频管理"
                        action={
                            <IconButton aria-label="video_create" onClick={() => this.setState({createDialog: true})}>
                                <AddIcon/>
                            </IconButton>
                        }
                    />

                    <div className="videos">
                        <Grid container spacing={3}>
                            {
                                this.state.videos.map((video, index) => (
                                    <Grid key={video._id} item xs={6} lg={3}>
                                        <Video
                                            index={index}
                                            info={video}
                                            setSnackbar={this.setSnackbar}
                                            setAlertSeverity={this.setAlertSeverity}
                                            setAlertMessage={this.setAlertMessage}
                                        />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </div>
                    <div className="paginator">
                        <Pagination
                            count={Math.ceil(this.state.total / this.state.limit)}
                            variant="outlined"
                            color="primary"
                            onChange={this.handlePageChange}
                        />
                    </div>

                    <Snackbar open={this.state.snackbar} autoHideDuration={6000}
                              onClose={() => this.setSnackbar(false)}>
                        <Alert onClose={() => this.setSnackbar(false)} severity={this.state.alertSeverity}>
                            {this.state.alertMessage}
                        </Alert>
                    </Snackbar>

                    <Dialog open={this.state.createDialog} onClose={this.handleCreateClose}
                            aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">编辑视频</DialogTitle>
                        <DialogContent>
                            <form noValidate autoComplete="off">
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField name="author" label="作者" variant="filled"
                                                   value={this.state.createInfo.author}
                                                   onChange={this.handleFormChange}
                                                   fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField name="song" label="歌曲" variant="filled"
                                                   value={this.state.createInfo.song}
                                                   onChange={this.handleFormChange}
                                                   fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField name="tags" label="标签" variant="filled"
                                                   value={this.state.createInfo.tagList.join(',')}
                                                   onChange={this.handleFormChange}
                                                   helperText="多个以逗号分隔"
                                                   fullWidth
                                        />

                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField name="description" label="描述" variant="filled"
                                                   value={this.state.createInfo.description}
                                                   onChange={this.handleFormChange}
                                                   fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField name="videoUrl" label="视频网址" variant="filled"
                                                   value={this.state.createInfo.videoUrl}
                                                   onChange={this.handleFormChange}
                                                   fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField name="imgUrl" label="封面图网址" variant="filled"
                                                   value={this.state.createInfo.imgUrl}
                                                   onChange={this.handleFormChange}
                                                   fullWidth
                                        />
                                    </Grid>

                                </Grid>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCreateClose} color="primary">
                                取消
                            </Button>
                            <Button onClick={this.createVideo} color="primary">
                                确定
                            </Button>
                        </DialogActions>

                    </Dialog>

                </Card>
            </Container>
        );
    }
}

export default Videos