import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import './Comment.css'

import {getCommentList, deleteComment, sendComment, updateComment} from "../api/comment";
import {AlertSeverity} from "../types/enums";

import AddCircleIcon from '@material-ui/icons/AddCircle';
import UpdateIcon from '@material-ui/icons/Update';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from "@material-ui/core/Button";


interface CommentInfo {
    _id:string,
    live:string,
    content:string
}

interface States {
    commentInfo:Array<CommentInfo>,
    addComment:boolean,
    snackbar: boolean,
    alertSeverity: AlertSeverity,
    alertMessage: string,
    updateComment:boolean
}

interface Props {
}

class CommentItemsList extends React.Component<Props, States>{
    constructor(props: Props) {
        super(props);
        this.state = {
            commentInfo:[],
            addComment:false,
            snackbar:false,
            alertSeverity:AlertSeverity.Success,
            alertMessage:"无消息",
            updateComment:false
        }
    }

    updateId = ''//stored id of updating comment
    updateTempComment = ''//stored origin content of updating comment
    tempComment = ''//get TextField text


    async componentDidMount() {
        await this.handleCommentList();
    }

    //retrieve comment list
    handleCommentList = async ()=>{
        try{
            let response = await getCommentList();
            const data = response.data;
            this.setState({commentInfo:data})
        }catch (err){
            console.error(err);
            this.setAlertSeverity(AlertSeverity.Error)
            this.setAlertMessage("加载评论数据出错")
            this.setSnackbar(true)
        }
    }

    //add comment
    handleAddComment = ()=>{
        this.updateTempComment = ''
        this.setState({addComment:true})
    }

    async handleSendComment(){
        try {
            if(this.tempComment !== '')
            {
                let response = await sendComment(this.tempComment)
                this.handleCommentList();
            }

        }catch (err){
            console.error(err);
            this.setAlertSeverity(AlertSeverity.Error)
            this.setAlertMessage("发送评论数据出错")
            this.setSnackbar(true)
        }
        this.tempComment = '';
        this.handleClose();
    }

    //update Comment
    handleUpdate = (_id:string,content:string)=>{
        this.setState({updateComment:true})
        this.updateTempComment = content;
        this.updateId = _id;
    }

    handleUpdateComment = async ()=>{
        try {
            if(this.tempComment !== '')
            {
                let response = await updateComment(this.updateId,this.tempComment)
                console.log(response);
                this.handleCommentList();
            }

        }catch (err){
            console.error(err);
            this.setAlertSeverity(AlertSeverity.Error)
            this.setAlertMessage("更新评论数据出错")
            this.setSnackbar(true)
        }
        this.tempComment = '';
        this.updateTempComment = '';
        this.handleClose();
    }

    //close Dialog
    handleClose = ()=>{
        this.setState({addComment:false,updateComment:false})
    }

    //delete comment
    async handleDelete(_id:string){
        try{
            let response = await deleteComment(_id);
            if(response.status === 200)
                await this.handleCommentList();

        }catch (err){
            console.error(err);
            this.setAlertSeverity(AlertSeverity.Error)
            this.setAlertMessage("删除评论数据出错")
            this.setSnackbar(true)
        }
    }

    //click send button
    sendContent = ()=>{
        if(this.state.addComment){
            this.handleSendComment();
        }

        if(this.state.updateComment)
        {
            this.handleUpdateComment();
        }
    }

    setSnackbar = (status: boolean): void =>{
        this.setState({snackbar: status})
    }

    setAlertSeverity = (status: AlertSeverity): void =>{
        this.setState({alertSeverity: status})
    }

    setAlertMessage = (message: string): void=> {
        this.setState({alertMessage: message})
    }

    render() {
        return (
            <>
                <TableContainer component={Paper} className="table">
                    <Table  aria-label="customized table">
                        <TableHead>
                            <TableRow className="tableHead">
                                <TableCell align="center">用户名</TableCell>
                                <TableCell align="center">直播</TableCell>
                                <TableCell align="center">评论内容</TableCell>
                                <TableCell align="center">操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.commentInfo.map(({_id,content}) => (
                                <TableRow key={_id}>
                                    <TableCell component="th" scope="row" align="center">
                                        匿名用户
                                    </TableCell>
                                    <TableCell align="center">{_id}</TableCell>
                                    <TableCell align="center">{content}</TableCell>
                                    <TableCell align="center">
                                        <IconButton edge="end" aria-label="update" onClick={(ref)=>{this.handleUpdate(_id,content)}}>
                                            <UpdateIcon/>
                                        </IconButton>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <IconButton edge="end" aria-label="delete" onClick={(ref)=>{this.handleDelete(_id)}}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <IconButton edge="end" aria-label="add" onClick={this.handleAddComment}>
                    <AddCircleIcon className="addComment" style={{ fontSize: 40 }} color="secondary" ></AddCircleIcon>
                </IconButton>
                {
                    <Dialog open={this.state.addComment || this.state.updateComment} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth>
                        <DialogTitle id="form-dialog-title">填写评论</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                id="comment"
                                label="评论内容"
                                multiline
                                defaultValue={this.updateTempComment}
                                fullWidth
                                onBlur={(ref)=>{this.tempComment = ref.target.value}}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={(ref)=>{this.sendContent()  }} color="primary">
                                Send
                            </Button>
                        </DialogActions>
                    </Dialog>
                }
            </>

        );
    }


}

export default CommentItemsList;
