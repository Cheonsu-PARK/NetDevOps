import React, { Component } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NetBuilderTab from './NetBuilderTab';
import CMSTab from './CMSTab';
import OMSTab from './OMSTab';
import ConDiffTab from './ConDiffTab';
import ValidConfigTab from './ValidConfigTab';

class MAINTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
  }
  a11yProps = (index) => {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }
  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  }
  render() {
    return (
      <div>
	<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
	  <Tabs value={this.state.value} variant="fullWidth" onChange={this.handleChange} aria-label="basic tabs">
	    <Tab label="Net Builder" {...this.a11yProps(0)} />
	    <Tab label="CMS" {...this.a11yProps(1)} style={{minwidth:"50%"}}/>
	    <Tab label="OMS" {...this.a11yProps(2)} style={{minwidth:"50%"}}/>
	    <Tab label="Config Diff" {...this.a11yProps(3)} style={{minwidth:"50%"}} />
	    <Tab label="Valid Configs" {...this.a11yProps(4)} style={{minwidth:"50%"}}/>
	    <Tab label="Admin" {...this.a11yProps(5)} disabled style={{minwidth:"50%"}}/>
	    <Tab label="Settings" {...this.a11yProps(6)} disabled style={{minwidth:"50%"}}/>
	  </Tabs>
	</Box>
	<TabPanel value={this.state.value} index={0}>
	  <div>
	    <NetBuilderTab />
	  </div>
	</TabPanel>
	<TabPanel value={this.state.value} index={1}>
	  <CMSTab />
	</TabPanel>
	<TabPanel value={this.state.value} index={2}>
	  <OMSTab />
	</TabPanel>
	<TabPanel value={this.state.value} index={3}>
	  <ConDiffTab />
	</TabPanel>
	<TabPanel value={this.state.value} index={4}>
	  <ValidConfigTab />
	</TabPanel>
	<TabPanel value={this.state.value} index={5}>
	  Admin 
	</TabPanel>
	<TabPanel value={this.state.value} index={6}>
	  Settings
	</TabPanel>
    </div>
    );
  }
}
class TabPanel extends Component {
  render() {
    return (
      <Typography component="div" hidden={this.props.value !== this.props.index} >
        <Box p={3}>{this.props.children}</Box>
      </Typography>
    );
  }
}
export default MAINTabs;
