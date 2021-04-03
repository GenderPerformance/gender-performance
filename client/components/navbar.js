import React from 'react'
import {AppBar} from '@material-ui/core'
import MenuBar from './MenuBar'

const Navbar = () => (
  <div>
    <nav>
        <AppBar position="fixed">
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

export default Navbar

/**
 * PROP TYPES
 */
