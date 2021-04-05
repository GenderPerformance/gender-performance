import React from 'react'
import {AppBar} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import MenuBar from './MenuBar'

const Navbar = () => (
  <div>
    <nav>
      <AppBar position="fixed">
        <div className="Menu">
          <div className="title">
            <Typography variant="h4">VisiVox</Typography>
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
