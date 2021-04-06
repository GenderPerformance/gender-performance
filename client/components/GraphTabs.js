import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Fade } from '@material-ui/core'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SpectrogramChart from './SpectrogramChart'
import Resonance from './Resonance'
import WaveForm from './WaveForm'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root} id='AnalysesBox'>
      <TabPanel value={value} index={0}>
        <Fade in timeout={400} >
          <canvas id='canvas1'></canvas>
        </Fade>
        <SpectrogramChart/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Fade in timeout={400}>
          <Resonance/>
        </Fade>
      </TabPanel>
      <TabPanel value={value} index={2}>
          <WaveForm/>
      </TabPanel>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered="true" variant="fullWidth">
          <Tab label="Spectrogram" {...a11yProps(0)} />
          <Tab label="Resonance" {...a11yProps(1)} />
          <Tab label="Waveform" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
    </div>
  );
}
