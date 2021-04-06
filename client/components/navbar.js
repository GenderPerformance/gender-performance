import React from 'react'
import {AppBar} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import MenuBar from './MenuBar'
import {Link} from 'react-router-dom'

const Navbar = () => (
  <div>
    <nav>
      <AppBar position="fixed">
        <div className="Menu">
          <div className="title">
            <Link to="/home" ><Typography variant="h4">VisiVox</Typography> </Link>
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

export default Navbar

/**
 * PROP TYPES
 */
