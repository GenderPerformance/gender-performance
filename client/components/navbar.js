import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {AppBar} from '@material-ui/core'
import MenuBar from './MenuBar'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div>
    <nav>
      {isLoggedIn ? (
        <AppBar position="static">
          <div className="Menu">
            <div className="title">
              <h1>PERFORMANCE</h1>
              <a href="#" onClick={handleClick}>
                Logout
              </a>
            </div>
            <div>
              <MenuBar />
            </div>
          </div>
        </AppBar>
      ) : (
        <AppBar position="static">
          <div>
            {/* The navbar will show these links before you log in */}
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/about">About</Link>
          </div>
        </AppBar>
      )}
    </nav>
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
