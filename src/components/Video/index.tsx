import React, {useState} from "react";
import {
    Avatar,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    CardMedia,
    Dialog,
    DialogActions, DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Snackbar, TextField,
    Typography,
} from "@material-ui/core/"
import {VideoInfo, VideoInfo_Edit} from "../../types/video"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import {makeStyles} from "@material-ui/core/styles";
import {video_delete, video_retrieve, video_update} from "../../api/video";
import {AlertSeverity} from "../../types/enums";
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles({
    root: {},
    media: {
        height: "140px"
    }
})

interface Props {
    index: number
    info: VideoInfo,
    setSnackbar(status:boolean): void,
    setAlertSeverity(status:AlertSeverity):void,
    setAlertMessage(message:string):void
}

export default function Video({
                                  index,
                                  info,
                                  setSnackbar,
                                  setAlertSeverity,
                                  setAlertMessage
                              }: Props) {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
    const [editDialog, setEditDialog] = useState<boolean>(false)
    // const [snackbar, setSnackbar] = useState<boolean>(false)
    // const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>(AlertSeverity.Success)
    // const [alertMessage, setAlertMessage] = useState<string>("空信息")
    const [editInfo, setEditInfo] = useState<VideoInfo_Edit>({
        _id: "",
        description: "",
        tagList: [],
        song: "",
        like: 0,
        comment: 0,
        share: 0
    })

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = async () => {
        try {
            let response = await video_retrieve(info._id)
            setEditInfo({
                _id: response.data._id,
                description: response.data.description,
                tagList: response.data.tagList,
                song: response.data.song,
                like: response.data.like,
                comment: response.data.comment,
                share: response.data.share
            })
            setEditDialog(true)
        } catch (e) {
            console.error(e);
            setAlertSeverity(AlertSeverity.Error)
            setAlertMessage("查询视频信息失败")
        }
    }

    const handleEditClose = () => {
        setEditDialog(false)
        setEditInfo({
            _id: "",
            description: "",
            tagList: [],
            song: "",
            like: 0,
            comment: 0,
            share: 0
        })
    }

    const handleDeleteClick = () => {
        setDeleteDialog(true)
    }

    const handleDeleteClose = () => {
        setDeleteDialog(false)
    }

    const handleFormChange = (event: any) => {
        const target = event.target;
        const value = target.value;
        const name: string = target.name;

        let newInfo: any = Object.assign({}, editInfo)
        if (name === "tags")
            newInfo.tagList = value.split(',')
        else
            newInfo[name] = value
        setEditInfo(newInfo)
    }

    const handleSnackbarClose = () => {
        setSnackbar(false)
    }

    const updateVideo = async () => {
        try {
            let info: VideoInfo_Edit = Object.assign({}, editInfo);
            let newTags: Array<string> = []
            for (let i in info.tagList)
                if (info.tagList[i] && info.tagList[i].length > 0)
                    newTags.push(info.tagList[i])
            info.tagList = newTags

            let response = await video_update(info)
            setAlertSeverity(AlertSeverity.Success)
            setAlertMessage("修改成功")
            handleEditClose()

        } catch (err) {
            console.error(err)
            setAlertSeverity(AlertSeverity.Error)
            setAlertMessage("修改失败")
        } finally {
            setSnackbar(true)
        }
    }

    const deleteVideo = async (id: string) => {
        try {
            let response = await video_delete(id)
            setAlertSeverity(AlertSeverity.Success)
            setAlertMessage("删除成功")
        } catch (err) {
            console.error(err)
            setAlertSeverity(AlertSeverity.Error)
            setAlertMessage("删除失败")
        } finally {
            setSnackbar(true)
            handleDeleteClose()
        }
    }


    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={info.imgUrl}
                />
            </CardActionArea>


            <CardHeader
                avatar={
                    <Avatar aria-label="user" alt={info.author_nick} src={info.author_avatar}/>
                }
                action={
                    <IconButton aria-label="settings" aria-controls={("video-menu-" + index)} onClick={handleMenuClick}>
                        <MoreVertIcon/>
                    </IconButton>

                }
                title={info.author_nick}
                subheader={info.createdAt.substring(0, 10)}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {info.description.length > 15 ? info.description.substring(0, 15).concat("...") : info.description}
                </Typography>
            </CardContent>



            <Menu
                id={("video-menu-" + index)}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEditClick}>编辑</MenuItem>
                <MenuItem onClick={handleDeleteClick}>删除</MenuItem>
            </Menu>

            <Dialog
                open={deleteDialog}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"确定要删除这个视频吗？"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={() => deleteVideo(info._id)} color="primary" autoFocus>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editDialog} onClose={handleEditClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">编辑视频</DialogTitle>
                <DialogContent>
                    <form noValidate autoComplete="off">
                        <input type="hidden" name="_id" value={editInfo._id}/>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField label="作者" variant="filled" value={info.author_nick}
                                           InputProps={{readOnly: true}}
                                           fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField name="song" label="歌曲" variant="filled" value={editInfo.song}
                                           onChange={handleFormChange}
                                           fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="tags" label="标签" variant="filled" value={editInfo.tagList.join(',')}
                                           onChange={handleFormChange}
                                           helperText="多个以逗号分隔"
                                           fullWidth
                                />

                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="description" label="描述" variant="filled" value={editInfo.description}
                                           onChange={handleFormChange}
                                           fullWidth
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField name="like" label="点赞" type="number" variant="filled" value={editInfo.like}
                                           onChange={handleFormChange}
                                           InputLabelProps={{shrink: true}}
                                           fullWidth
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField name="comment" label="评论" type="number" variant="filled"
                                           value={editInfo.comment} onChange={handleFormChange}
                                           InputLabelProps={{shrink: true}}
                                           fullWidth
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField name="share" label="分享" type="number" variant="filled" value={editInfo.share}
                                           onChange={handleFormChange}
                                           InputLabelProps={{shrink: true}}
                                           fullWidth
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={updateVideo} color="primary">
                        确定
                    </Button>
                </DialogActions>

            </Dialog>
        </Card>
    )
}