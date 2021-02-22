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
    TextField,
    Typography,
} from "@material-ui/core/"

import MoreVertIcon from "@material-ui/icons/MoreVert"
import {makeStyles} from "@material-ui/core/styles";
import {AlertSeverity} from "../../types/enums";
import {LiveInfo, LiveInfo_Update} from "../../types/live";
import {live_delete, live_retrieve, live_update} from "../../api/live";

const useStyles = makeStyles({
    root: {},
    media: {
        height: "140px"
    }
})

interface Props {
    index: number
    info: LiveInfo,
    setSnackbar(status:boolean): void,
    setAlertSeverity(status:AlertSeverity):void,
    setAlertMessage(message:string):void,
    fetchLives(page?:number):Promise<any>,
}

export default function Live({
                                  index,
                                  info,
                                  setSnackbar,
                                  setAlertSeverity,
                                  setAlertMessage,
                                  fetchLives
                              }: Props) {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
    const [editDialog, setEditDialog] = useState<boolean>(false)
    const [editInfo, setEditInfo] = useState<LiveInfo_Update>({
        _id: "",
        description: "",
    })

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = async () => {
        try {
            let response = await live_retrieve(info._id)
            setEditInfo({
                _id: response.data._id,
                description: response.data.description,
            })
            setEditDialog(true)
        } catch (e) {
            console.error(e);
            setAlertSeverity(AlertSeverity.Error)
            setAlertMessage("查询直播信息失败")
        }
    }

    const handleEditClose = () => {
        setEditDialog(false)
        setEditInfo({
            _id: "",
            description: "",
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
        newInfo[name] = value
        setEditInfo(newInfo)
    }

    const handleSnackbarClose = () => {
        setSnackbar(false)
    }

    const updateLive = async () => {
        try {
            let info: LiveInfo_Update = Object.assign({}, editInfo);
            let response = await live_update(info)
            setAlertSeverity(AlertSeverity.Success)
            setAlertMessage("修改成功")
            handleEditClose()
            fetchLives()
        } catch (err) {
            console.error(err)
            setAlertSeverity(AlertSeverity.Error)
            setAlertMessage("修改失败")
        } finally {
            setSnackbar(true)
        }
    }

    const deleteLive = async (id: string) => {
        try {
            let response = await live_delete(id)
            setAlertSeverity(AlertSeverity.Success)
            setAlertMessage("删除成功")
            fetchLives()
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
                    image={'./img/logo192.png'}
                />
            </CardActionArea>

            <CardHeader
                avatar={
                    <Avatar alt={info.author_nick} src={info.author_avatar}/>
                }
                action={
                    <IconButton onClick={handleMenuClick}>
                        <MoreVertIcon/>
                    </IconButton>

                }
                title={info.author_nick}
                subheader={info.updatedAt}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {info.description.length > 15 ? info.description.substring(0, 15).concat("...") : info.description}
                </Typography>
            </CardContent>



            <Menu
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
            >
                <DialogTitle>{"确定要删除这个直播吗？"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary" autoFocus>
                        取消
                    </Button>
                    <Button onClick={() => deleteLive(info._id)} color="primary">
                        确定
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editDialog} onClose={handleEditClose}>
                <DialogTitle>编辑直播</DialogTitle>
                <DialogContent>
                    <form noValidate autoComplete="off">
                        <input type="hidden" name="_id" value={editInfo._id}/>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField name="description" label="描述" variant="filled" value={editInfo.description}
                                           onChange={handleFormChange}
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
                    <Button onClick={updateLive} color="primary">
                        确定
                    </Button>
                </DialogActions>

            </Dialog>
        </Card>
    )
}