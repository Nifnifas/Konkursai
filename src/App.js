import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./routes";
import axios from 'axios';
require('dotenv').config();

function App(props) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  let token = useState("");
  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      token = localStorage.getItem("access_token");
      userHasAuthenticated(true);

      //app callina cj anksciau nei yra loggedin todel iskickina, tau reikia kiekvienam page realizuot auth. Geriausia cj importint auth faila butu arba requirint.

      /*axios.get("http://localhost:4000/api/users/", { headers: { Authorization: 'Bearer '.concat(token) } 
        }).then(response => {
        //localStorage.setItem('access_token', response.data.accessToken);
        userHasAuthenticated(true);
        //props.history.push("/contests");
        }).catch((error) => {
        console.log('error ' + error);
        props.history.push("/signIn");
        });*/
      /*if(token != null){
        userHasAuthenticated(true);
        props.history.push("/contests");
      }*/
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    userHasAuthenticated(false);
    props.history.push("/login");
  }

  return (
    !isAuthenticating && (
      <div className="App container">
        <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/settings">
                    <NavItem>Settings</NavItem>
                  </LinkContainer>
                  <NavItem onClick={handleLogout}>Logout</NavItem>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
      </div>
    )
  );
}

export default withRouter(App);