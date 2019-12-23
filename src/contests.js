import React, { Component } from "react";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    paddingTop: 15,
    width: 1200,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  img: {

  }
});

class Contests extends Component {
  state = { contests: [] }

  componentDidMount(){
    fetch('/contests')
    .then(res => res.json())
    .then(contests => this.setState({contests}))
  }

  render() {
    const { classes } = this.props;
    return (
    <div className={classes.root}>
      <GridList cols={3} spacing={10} cellHeight={180} className={classes.gridList}>
        {this.state.contests.map(contest => (
          <GridListTile key='https://www.w3schools.com/w3css/img_lights.jpg'>
            <img className={classes.img} src='https://www.w3schools.com/w3css/img_lights.jpg' alt={contest.title} />
            <GridListTileBar
                title={contest.title}
                subtitle={<span>Autorius: {contest.author}</span>}
                actionIcon={<IconButton aria-label={`info about ${contest.title}`} className={classes.icon}>
                <InfoIcon /></IconButton>}/>
            </GridListTile>
        ))}
      </GridList>
    </div>
    );
  }
}

Contests.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Contests);
