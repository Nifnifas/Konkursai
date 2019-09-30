import React, { Component } from "react";

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { connect } from "react-redux";
//import Fake from './Features/Fake/Fake';
import Navbar from './menu/Navbar';
import Contests from './contests';
import { AppBar, Toolbar, Button, Grid, IconButton, Link } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
require('dotenv').config();

class App extends Component {
  render() {
    return (
    <div>
        <Navbar />
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  //periodicOrder: state.menu.periodicOrder
});

export default connect(mapStateToProps)(App);
