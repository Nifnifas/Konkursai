import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Contests from './../contests';
import Winners from './../winners';
import Login from './../login';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  rightOnes: {
    marginLeft: "auto",
    marginRight: 1,
  }
}));

export default function ScrollableTabsButtonForce() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab label="Contests" icon={<PhoneIcon />} {...a11yProps(0)} />
          <Tab label="Winners" icon={<PhoneIcon />} {...a11yProps(1)} />
          <Tab className={classes.rightOnes} label="Login / Sign up" icon={<PersonPinIcon />} {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <Contests />
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Winners />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Login />
      </TabPanel>
    </div>
  );
}
