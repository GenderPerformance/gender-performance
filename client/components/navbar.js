import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {AppBar} from '@material-ui/core'
import MenuBar from './MenuBar'

const Navbar = () => (
  <div>
    <nav>
        <AppBar position="static">
          <div className="Menu">
            <div className="title">
              <h1>PERFORMANCE</h1>
            </div>
            <div>
              <MenuBar />
            </div>
          </div>
        </AppBar>
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
