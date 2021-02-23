import React, { useState, useEffect } from 'react';
import {
    Snackbar,
    FormControlLabel,
    TextField,
    CssBaseline,
    Button,
    Avatar,
    Checkbox,
    Link,
    Box,
    Typography,
    Container,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { admin_login, is_login } from '../api/login';
import { Alert } from '@material-ui/lab';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href="https://github.com/NicodeSS/techtrainingcamp-frontend-2">
        TechCamp Frontend Group 2
      </Link>{' made with ❤️'}{'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [openSnackbar, setOpenSnakbar] = useState<boolean>(false);

    useEffect(() => {
        if(localStorage.getItem('token')) {
            try {
                (async function checkLogin() {
                    const response = await is_login();
                    if(response.data.isLogin) {
                        window.location.href = "/dashboard";
                        return;
                    }
                  })()
            } catch {
                console.log('error');
            }
        }
    })

    const handleClick = async (e: any) => {
    e.preventDefault();
    try {
        let response = await admin_login({
            name: username,
            password,
        });
    
        window.localStorage.setItem("token",response.data.token);
    
        window.location.href = "/dashboard";
    } catch {
        setOpenSnakbar(true);
    }
  }

  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value);
  }

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  }

  const handleClose = () => {
      setOpenSnakbar(false);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Snackbar open={openSnackbar} onClose={handleClose}>
            <Alert severity="error">登录信息错误</Alert>
        </Snackbar>
        <form className={classes.form} id="loginForm">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={handleUsernameChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleClick}
          >
            Sign In
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}