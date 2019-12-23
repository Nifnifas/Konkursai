import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Router } from "react-router-dom";
import axios from 'axios';
import PropTypes from 'prop-types';

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const useStyles = makeStyles( theme => ({
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
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      },
      label: {
        backgroundColor: "white"
      }
    }));

    function Copyright() {
      return (
        <Typography variant="body2" color="textSecondary" align="center">
          {'© '}
          <Link color="inherit">
          IFF-6/5 Lukas Krupenkinas, 
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      );
    }    

    function handleLogin(event) {
      event.preventDefault();
      axios.post("http://localhost:4000/api/users/login", {
        email: email,
        password: password
      }).then(res => {
        axios.get("http://localhost:4000/api/users/", { headers: { Authorization: 'Bearer '.concat(res.data.accessToken) } 
        }).then(response => {
        localStorage.setItem('access_token', response.data.accessToken);
        props.userHasAuthenticated(true);
        props.history.push("/contests");
        }).catch((error) => {
        console.log('error ' + error);
        props.history.push("/login");
        });
      }).catch(console.error)
    }

    const classes = useStyles();
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Prisijungimas
          </Typography>
          <form className={classes.form}  onSubmit={handleLogin}>
            <TextField InputLabelProps={{classes: {root: classes.label}}}
              variant="outlined"
              margin="normal"
              key="this.state.flag"
              required
              fullWidth
              id="email"
              label="El. paštas"
              name="email"
              autoComplete="email"
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            <TextField InputLabelProps={{classes: {root: classes.label}}}
              variant="outlined"
              margin="normal"
              key="this.state.flag"
              required
              fullWidth
              name="password"
              label="Slaptažodis"
              type="password"
              id="password"
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Prisijungti
            </Button>
            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Neturite paskyros? Registruokites!"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }