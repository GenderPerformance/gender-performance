import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
import Typography from '@material-ui/core/Typography';

import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'RobotoRegular'
  },
  palette:
    {common: { black: 'rgba(0, 0, 0, 1)', white: 'rgba(255, 255, 255, 1)' },
    background: { paper: 'rgba(159, 48, 226, 1)', default: 'rgba(255, 255, 240, 1)' },
    primary: {
      light: 'rgba(26, 147, 111, 1)',
      main: 'rgba(200, 224, 135, 1)',
      dark: 'rgba(200, 85, 61, 1)',
      contrastText: 'rgba(0, 0, 0, 1)'
    },
    secondary: {
      light: 'rgba(221, 252, 173, 1)',
      main: 'rgba(159, 48, 226, 1)',
      dark: 'rgba(106, 1, 54, 1)',
      contrastText: 'rgba(255, 255, 255, 1)'
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff'
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(255,255,255,1)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)'
    }
  }
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('app')
)
