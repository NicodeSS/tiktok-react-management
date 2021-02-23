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
import {LiveInfo, LiveInfo_Create} from "../types/live";
import {live_create, lives_list} from "../api/live";
import Live from "../components/Live/Live";

import './Lives.css'



interface Props {
}

interface States {
    lives: Array<LiveInfo>,
    page: number,
    limit: number,
    total: number,

    createDialog: boolean,
    createInfo: LiveInfo_Create,

    snackbar: boolean,
    alertSeverity: AlertSeverity,
    alertMessage: string,
}


class Lives extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            lives: [],
            page: 1,
            limit: 8,
            total: 0,
            createDialog: false,
            createInfo: {
                author: "6030cf6eeaad770b47afb528",
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
        this.createLive = this.createLive.bind(this)
        this.fetchLives = this.fetchLives.bind(this)
    }

    async fetchLives(page?: number) {
        try {
            let response = await lives_list({
                offset: page ? (page - 1) * this.state.limit : (this.state.page - 1) * this.state.limit,
                limit: this.state.limit
            })
            let lives: Array<LiveInfo> = response.data.lives
            let total: number = response.data.total

            if (page)
                this.setState({lives, total, page})
            else
                this.setState({lives, total})
        } catch (err) {
            console.error(err);
            this.setAlertSeverity(AlertSeverity.Error)
            this.setAlertMessage("加载出错")
            this.setSnackbar(true)
        }
    }

    async componentDidMount() {
        await this.fetchLives()
    }

    async handlePageChange(event: object, value: number) {
        await this.fetchLives(value)
    }

    handleFormChange(event: any) {
        const target = event.target;
        const value = target.value;
        const name: string = target.name;

        let newInfo: any = Object.assign({}, this.state.createInfo)
        newInfo[name] = value
        this.setState({createInfo: newInfo})
    }

    handleCreateClose() {
        this.setState({
            createDialog: false,
            createInfo: {
                author: "6030cf6eeaad770b47afb528",
            }
        })
    }

    async createLive() {
        try {
            let info: LiveInfo_Create = Object.assign({}, this.state.createInfo)
            console.log(info)
            let response = await live_create(info)
            this.setAlertSeverity(AlertSeverity.Success)
            this.setAlertMessage("新增成功")
            this.handleCreateClose()
            this.fetchLives()
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
                        title="直播管理"
                        action={
                            <IconButton onClick={() => this.setState({createDialog: true})}>
                                <AddIcon/>
                            </IconButton>
                        }
                    />

                    <div className="lives">
                        <Grid container spacing={3}>
                            {
                                this.state.lives.map((live, index) => (
                                    <Grid key={live._id} item xs={6} lg={3}>
                                        <Live
                                            index={index}
                                            info={live}
                                            setSnackbar={this.setSnackbar}
                                            setAlertSeverity={this.setAlertSeverity}
                                            setAlertMessage={this.setAlertMessage}
                                            fetchLives={this.fetchLives}
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

                    <Dialog open={this.state.createDialog} onClose={this.handleCreateClose}>
                        <DialogTitle>新建直播</DialogTitle>
                        <DialogContent>
                            <form noValidate autoComplete="off">
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField name="author" label="ID" variant="filled"
                                                   value={this.state.createInfo.author}
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
                            <Button onClick={this.createLive} color="primary">
                                确定
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Card>
            </Container>
        );
    }
}

export default Lives