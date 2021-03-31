import React from 'react'
import clsx from 'clsx'
import {makeStyles} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import MicIcon from '@material-ui/icons/Mic'
import HistoryIcon from '@material-ui/icons/History'
import InfoIcon from '@material-ui/icons/Info'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import {Link} from 'react-router-dom'

const useStyles = makeStyles({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
})

export default function TemporaryDrawer() {
  const classes = useStyles()
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  })

  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({...state, [anchor]: open})
  }

  const icon = [<MicIcon />, <HistoryIcon />, <InfoIcon />, <ExitToAppIcon />]
  const links = ['recorder', 'userhistory', 'about', '#']
  const list = anchor => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom'
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Record', 'History', 'About', 'Logout'].map((text, index) => (
          <ListItem button component="a" href={`/${links[index]}`} key={text}>
            <ListItemIcon>{icon[index]}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  const anchor = 'right'
  return (
    <div>
      {
        <React.Fragment>
          <Button onClick={toggleDrawer(anchor, true)}>Menu</Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      }
      {/* {['left', 'right', 'top', 'bottom'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))} */}
    </div>
  )
}
