import React from 'react'
import {AppBar} from '@material-ui/core'
import MenuBar from './MenuBar';
import {Link} from 'react-router-dom';

const Navbar = () => (
  <div>
    <nav>
        <AppBar position="fixed">
          <div className="Menu">
            <Link to="/home"><div className="title">
              <img src={`/waves/wave4.png`} id="titleicon"/>
              <h1 id="navtitle">  VisiVox</h1>
            <div className="title">
              <h1>VisiVox</h1>
            </div>
            </Link>
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
