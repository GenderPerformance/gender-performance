import React from 'react'
import {AppBar} from '@material-ui/core'
import MenuBar from './MenuBar'

const Navbar = () => (
  <div>
    <nav>
        <AppBar position="fixed">
          <div className="Menu">
            <div className="title">
              <img src={`/waves/wave4.png`} id="titleicon"/>
              <h1 id="navtitle">  VisiVox</h1>
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
