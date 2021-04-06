import React from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {makeStyles} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MicIcon from '@material-ui/icons/Mic'
import MenuIcon from '@material-ui/icons/Menu'
import HistoryIcon from '@material-ui/icons/History'
import InfoIcon from '@material-ui/icons/Info'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import {connect} from 'react-redux'
import {logout} from '../store'
import PropTypes from 'prop-types'

const useStyles = makeStyles({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
})

function TemporaryDrawer({handleLogout, isLoggedIn}) {
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

  const icon = [<MicIcon />, <HistoryIcon />, <InfoIcon />]

  const links = isLoggedIn
    ? ['/home', '/userhistory', '/about']
    : ['/login', '/signup', '/about']

  const list = anchor => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom'
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Button id="closeMenu" onClick={toggleDrawer(anchor, false)}>
        Close Menu
      </Button>
      <br />
      {isLoggedIn ? (
        <List>
          {['Record', 'History', 'About'].map((text, index) => (
            <Link to={links[index]} key={text}>
            <ListItem button component="a" >
              <ListItemIcon>{icon[index]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
            </Link>
          ))}
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      ) : (
        <List>
          {['Login', 'Signup', 'About'].map((text, index) => (
            <Link to={links[index]} key={text}>
            <ListItem button component="a">
              <ListItemText primary={text} />
            </ListItem>
            </Link>
          ))}
        </List>
      )}
    </div>
  )

  //Where the drawer pulls from: right, left, top bottom
  const anchor = 'right'
  return (
    <div >
      {
        <React.Fragment>
          <Button id='menu' onClick={toggleDrawer(anchor, true)}><MenuIcon/></Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      }
    </div>
  )
}

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleLogout() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(TemporaryDrawer)

TemporaryDrawer.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
