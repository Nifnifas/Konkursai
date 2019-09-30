import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import LoadingBar from './loadingBar';

const tileData = 
[
    {
        img: 'https://www.w3schools.com/w3css/img_lights.jpg',
        title: 'Image',
        author: 'author',
    },
    {
        img: 'https://www.w3schools.com/w3css/img_lights.jpg',
        title: 'Image',
        author: 'author',
    },
    {
        img: 'https://www.w3schools.com/w3css/img_lights.jpg',
        title: 'Image',
        author: 'author',
    },
    {
        img: 'https://www.w3schools.com/w3css/img_lights.jpg',
        title: 'Image',
        author: 'author',
    },
    {
        img: 'https://www.w3schools.com/w3css/img_lights.jpg',
        title: 'Image',
        author: 'author',
    },
    {
        img: 'https://www.w3schools.com/w3css/img_lights.jpg',
        title: 'Image',
        author: 'author',
    },
]

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    paddingTop: 15,
    width: 1200,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

export default function TitlebarGridList() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cols={3} spacing={10} cellHeight={180} className={classes.gridList}>
        {tileData.map(tile => (
          <GridListTile key={tile.img}>
            <img src={tile.img} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              subtitle={<span>by: {tile.author}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
