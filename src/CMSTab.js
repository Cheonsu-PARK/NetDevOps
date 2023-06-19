import React, { Component } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MUIButton from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import axios from 'axios';
import ConfList from './ConfList';

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  maxHeight: 500,
  overflow: 'auto',
}));
		
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

class CMSTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      dummy: '',
	  keyDepth: [],
	  searchModalShow: false,
      confCheckModalShow: false,
	  confCheckModalTitles: ['Appling Configuration', 'Current Configuration', 'Checking Variables'],
      confApplyModalShow: false,
      configs: null,
	  devSearchLayer: [],
	  devSearchData: '',
      absDevSearchData: '',
	  devKeys: [],
	  devSearchFilter: '',
      targets: '',
      configChecked: null,
      //For CMS :: STATIC ROUTING ARGS
      staticArgNW: '',
      staticArgNH: '',
      //For CMS :: Interface Type ARGS
      interfaceType: 'L3',
	  deviceType: 'Juniper',
      //For CMS :: L2 specific ARGS
      l2InterfaceRangeFrom: '',
      l2InterfaceRangeTo: '',
      l2InterfaceVlan: '',
      //For CMS :: L3 specific ARGS
      l3InterfaceRange: '',
      l3InterfaceMTU: '',
	  l3InterfaceUnit: '',
      l3InterfaceIP: '',
	  //For CMS :: Desc sepcific ARGS
	  descInterfaceRange: '',
	  descInterfaceUnit:'',
	  descInterfaceValue:'',
	  //For CMS :: IRB spcific ARGS
      IRBinterfaceVlan : '',
      IRBnetwork : '',
      IRBroutingInstance : '',
    }
  }

  a11yProps = (index) => {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  funcChange = (event, newValue) => {
    this.setState({ value: newValue });
  }

  searchModalPopup = async() => {
    var self = this;
    self.setState({ searchModalShow : true });
  }

  searchModalClose = () => {
    this.setState({ searchModalShow : false});
  }
 
  confCheckModalClose = () => {
    this.setState({ confCheckModalShow : false});
  }

  confApplyModalPopup = async() => {
    var self = this;
    await axios.post('http://10.162.0.197:5000/ConfList', {
	  args : '', 
    })
    .then(function(res){
  	  self.setState({ configs : res.data.data.replace('\n', '').split(','), confApplyModalShow : true });
    });
  }

  confApplyModalClose = () => {
    this.setState({ confApplyModalShow : false});
  }

  setTarget = (idx) => {
    this.setState({ targets : idx });
  }

  onStaticArgNWFieldChanged = (ev) => {
    this.setState({ staticArgNW : ev.target.value });
  }

  onStaticArgNHFieldChanged = (ev) => {
    this.setState({ staticArgNH : ev.target.value });
  }

  onDevSearchFilterFieldChanged = (ev) => {
    this.setState({ devSearchFilter : ev.target.value });
  }

  prepareConfigCheck = async() => {
    var self = this;
    await axios.post('http://10.162.0.197:5000/ConfList', {
	  filter : this.state.devSearchFilter, 
    })
    .then(function(res){
  	  self.setState({ configs : res.data.data.replace('\n', '').split(','), confCheckModalShow : true, searchModalShow : false });
    });
  }

  onGetAbsDeviceData = async() => {
      var self = this;
      for(let i = 1; i < this.state.targets.length; i++){
          await axios.post('http://10.162.0.197:5000/AbsDeviceQuery', {
              target : this.state.targets[i],
              keys : this.state.devKeys,
          }).then(function(res){
              let ret = res.data.data.replace(/&nbsp;/gi, '  ');
              console.log(ret)
              self.setState({ absDevSearchData : ret });
          });
      }
  }

  onGetDevRadioChanged = async(ev, idx) => {
	var self = this;
	this.state.devKeys.splice(idx, this.state.devKeys.length);
	this.state.devKeys.push(ev.target.value);
    for(let i = 1; i < this.state.targets.length; i++){
      await axios.post('http://10.162.0.197:5000/AbsDeviceNotice', {
	    target : this.state.targets[i],
		keys : this.state.devKeys,
      })
      .then(function(res){
		let ret = res.data.data;
        if(ret == ''){
            return
        }
		self.state.keyDepth.splice(idx + 1, self.state.keyDepth.length);
		self.state.devSearchLayer.splice(idx + 1, self.state.devSearchLayer.length);
		self.state.devSearchData = '';
		if (ret.includes(':')){
		  self.setState({ devSearchData : ret.split(':')[1] });
		} else {
		  self.state.keyDepth.push(idx + 1);
		  self.state.devSearchLayer.push(res.data.data.replace('\n', ''));
	      self.setState({ confCheckModalShow : false });
		}
	  });
	}
  }

  getDevInfo = async() => {
    var self = this;
    for(let i = 1; i < this.state.targets.length; i++){
      await axios.post('http://10.162.0.197:5000/AbsDeviceNotice', {
	    target : this.state.targets[i],
		keys : this.state.devKeys,
      })
      .then(function(res){
		self.state.keyDepth.push(0);
		self.state.devSearchLayer.push(res.data.data.replace('\n', ''));;
	    self.setState({ confCheckModalShow : false });
	  });
	}
  }

  configCheck = async() => {
    var self = this;
    for(let i = 1; i < this.state.targets.length; i++){
	  if(this.state.value === 0){
	    if(this.state.interfaceType === 'L3'){
          await axios.post('http://10.162.0.197:5000/L3InterfaceCheck', {
	        target : this.state.targets[i],
  	        args : this.state.l3InterfaceRange + ',' + this.state.l3InterfaceMTU + ',' + this.state.l3InterfaceUnit + ',' + this.state.l3InterfaceIP,
          })
          .then(function(res){
  	        self.setState({ configChecked : res.data.data.split(','), confCheckModalShow : false, confApplyModalShow : true });
          });
		}
	    if(this.state.interfaceType === 'Description'){
          await axios.post('http://10.162.0.197:5000/InterfaceDescriptionCheck', {
	        target : this.state.targets[i],
  	        args : this.state.descInterfaceRange + ',' + this.state.descInterfaceUnit + ',' + this.state.descInterfaceValue,
          })
          .then(function(res){
  	        self.setState({ configChecked : res.data.data.split(','), confCheckModalShow : false, confApplyModalShow : true });
          });
		}
		if(this.state.interfaceType === 'IRB'){
          await axios.post('http://10.162.0.197:5000/InterfaceIRBCheck', {
            target : this.state.targets[i],
            args : this.state.IRBinterfaceVlan + ',' + this.state.IRBnetwork + ',' + this.state.IRBroutingInstance + ',' + i
          })
          .then(function(res){
		    console.log(res);
			self.setState({ configChecked : res.data.data.split(','), confCheckModalShow : false, confApplyModalShow : true });
          });
        }      

	  } else if(this.state.value === 3) {
        await axios.post('http://10.162.0.197:5000/CMSStaticRouteCheck', {
	      target : this.state.targets[i],
  	      args : this.state.staticArgNW + ',' + this.state.staticArgNH,
        })
        .then(function(res){
  	      self.setState({ configChecked : res.data.data.split(','), confCheckModalShow : false, confApplyModalShow : true });
        });
	  }
    }
  }

  configApply = async() => {
    var self = this;
    for(let i = 1; i < this.state.targets.length; i++){
	  if(this.state.value === 0){
	    if(this.state.interfaceType === 'L3'){
          await axios.post('http://10.162.0.197:5000/L3Interface', {
	        target : this.state.targets[i],
  	        args : this.state.l3InterfaceRange + ',' + this.state.l3InterfaceMTU + ',' + this.state.l3InterfaceUnit + ',' + this.state.l3InterfaceIP,
          })
          .then(function(res){
  	        self.setState({ dummy : res.data.data, confApplyModalShow : false });
          });
		}
	    if(this.state.interfaceType === 'Description'){
          await axios.post('http://10.162.0.197:5000/InterfaceDescription', {
	        target : this.state.targets[i],
  	        args : this.state.descInterfaceRange + ',' + this.state.descInterfaceUnit + ',' + this.state.descInterfaceValue,
          })
          .then(function(res){
  	        self.setState({ dummy : res.data.data, confApplyModalShow : false });
          });
		}
       if(this.state.interfaceType === 'IRB'){
         await axios.post('http://10.162.0.197:5000/InterfaceIRB', {
           target : this.state.targets[i],
           args : this.state.IRBinterfaceVlan + ',' + this.state.IRBnetwork + ',' + this.state.IRBroutingInstance + ',' + i
         })
         .then(function(res){
          self.setState({ dummy : res.data.data, confApplyModalShow : false });
         });
       }

	  } else if(this.state.value === 3) {
        await axios.post('http://10.162.0.197:5000/CMSStaticRoute', {
	      target : this.state.targets[i],
  	      args : this.state.staticArgNW + ',' + this.state.staticArgNH,
        })
        .then(function(res){
  	      self.setState({ dummy : res.data.data, confApplyModalShow : false });
        });
	  }
    }
  }

  onInterfaceTypeChanged = (ev) => {
    this.setState({ interfaceType : ev.target.value });
  };

  onDeviceTypeChanged = (ev) => {
    this.setState({ deviceType : ev.target.value });
  };
  onl2InterfaceRangeFromChanged = (ev) => {
    this.setState({ l2InterfaceChangeFrom : ev.target.value });
  };

  onl2InterfaceRangeToChanged = (ev) => {
    this.setState({ l2InterfaceChangeTo : ev.target.value });
  };

  onl2InterfaceVlanChanged = (ev) => {
    this.setState({ l2InterfaceVlan : ev.target.value });
  };

  onl3InterfaceRangeChanged = (ev) => {
    this.setState({ l3InterfaceRange : ev.target.value });
  };

  onl3InterfaceMTUChanged = (ev) => {
    this.setState({ l3InterfaceMTU : ev.target.value });
  };

  onl3InterfaceUnitChanged = (ev) => {
    this.setState({ l3InterfaceUnit : ev.target.value });
  };

  onl3InterfaceIPChanged = (ev) => {
    this.setState({ l3InterfaceIP : ev.target.value });
  };

  onDescInterfaceRangeChanged = (ev) => {
    this.setState({ descInterfaceRange : ev.target.value });
  };

  onDescInterfaceUnitChanged = (ev) => {
    this.setState({ descInterfaceUnit : ev.target.value });
  };

  onDescInterfaceValueChanged = (ev) => {
    this.setState({ descInterfaceValue : ev.target.value });
  };

  onIRBinterfaceVlanChanged = (ev) => {
    this.setState({ IRBinterfaceVlan : ev.target.value });
  };

  onIRBnetworkChanged = (ev) => {
    this.setState({ IRBnetwork : ev.target.value });
  };

  onIRBroutingInstance = (ev) => {
    this.setState({ IRBroutingInstance : ev.target.value });
  };

  render() {
    return (
      <div>
	    Search Device
		<br />
		Enter 'as1' for Test
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	    <TextField id="outlined-basic" label="Keywords" variant="outlined" onChange={this.onDevSearchFilterFieldChanged} /><br />
	    <MUIButton variant="config search" onClick={this.prepareConfigCheck}>Search Device</MUIButton>{' '}
		{this.state.keyDepth.map((depth, index) => (
		  <div>
		    <br />
		      <FormControl>
		        <RadioGroup row aria-labelledby="demo-radio-buttons-group-label"
		  	      name="radio-buttons-group"
		  	      onChange={(ev) => this.onGetDevRadioChanged(ev, index)}
		  	    >
				{this.state.devSearchLayer[depth].split(',').map((item) => (
		  	      <FormControlLabel value={item} control={<Radio />} label={item} />
				))}
		  	    </RadioGroup>
		      </FormControl>
		  </div> : null
		))}
		{this.state.absDevSearchData != '' ?
		  <div>
			<Card sx={{ minWidth: 275, maxHeight: 350, overflow: 'auto'}}>
			  <CardContent>
			    {this.state.absDevSearchData.split('\n').map((item) => (
			      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
				    {item}
				  </Typography>
				))}
			  </CardContent>
			</Card>
		  </div> :null
		}
	    <MUIButton variant="config search" onClick={this.onGetAbsDeviceData}>Search settings</MUIButton>{' '}
		<br />
		<br />
	    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
	    <Tabs 
	    value={this.state.value}
	    variant="fullWidth"
	    onChange={this.funcChange}
	    aria-label="basic tabs"
	    textColor="secondary"
        indicatorColor="secondary"
	    >
	    <Tab label="INTERFACE" {...this.a11yProps(0)}/>
	    <Tab label="BGP" {...this.a11yProps(1)} disabled />
	    <Tab label="OSPF" {...this.a11yProps(2)} disabled />
	    <Tab label="Static Route" {...this.a11yProps(3)} />
	    <Tab label="Route Filter" {...this.a11yProps(4)} disabled />
	    <Tab label="VRRP" {...this.a11yProps(5)} disabled/>
	  </Tabs>
	</Box>
	<TabPanel value={this.state.value} index={0}>
	  <div>
        <FormControl>
          <FormLabel id="interface-radio-buttons-group-label">Interface Type</FormLabel>
            <RadioGroup
	          row
		      aria-labelledby="interface-radio-buttons-group-label"
		      defaultValue="L3"
		      name="radio-buttons-group"
		      onChange={this.onInterfaceTypeChanged}
	        >
	          <FormControlLabel value="L2" control={<Radio />} label="L2" disabled />
              <FormControlLabel value="L3" control={<Radio />} label="L3" />
              <FormControlLabel value="IRB" control={<Radio />} label="IRB" />
	          <FormControlLabel value="Interlink" control={<Radio />} label="Interlink" disabled />
	          <FormControlLabel value="Description" control={<Radio />} label="Description" />
	        </RadioGroup>
	    </FormControl>
	  </div>
	  <div>
        <FormControl>
          <FormLabel id="interface-radio-buttons-group-label">Device Type</FormLabel>
            <RadioGroup
	          row
		      aria-labelledby="interface-radio-buttons-group-label"
		      defaultValue="Juniper"
		      name="radio-buttons-group"
		      onChange={this.onDeviceTypeChanged}
	        >
	          <FormControlLabel value="Juniper" control={<Radio />} label="Juniper" />
              <FormControlLabel value="Cisco" control={<Radio />} label="Cisco" />
              <FormControlLabel value="Dell" control={<Radio />} label="Dell" disabled/>
              <FormControlLabel value="Mellonox" control={<Radio />} label="Mellonox" disabled/>
	        </RadioGroup>
	    </FormControl>
	  </div>
	  {this.state.interfaceType === 'L2' ?
	  <div>
	    L2 Specification(VLAN)
	    <br /><br />
	    <div>
	      <TextField id="outlined-basic" label="Range from(X/Y/Z)" variant="outlined" onChange={this.onl2InterfaceFromChanged} />
	    </div><br /> 
	    <div> 
	      <TextField id="outlined-basic" label="Range to(X/Y/Z)" variant="outlined" onChange={this.onl2InterfaceToChanged} />
	    </div><br />
	    <TextField id="outlined-basic" label="VLAN" variant="outlined" onChange={this.onl2InterfaceVlanChanged} />
	    <br /><br />
	    <MUIButton variant="L2 interface config apply" onClick={this.searchModalPopup}>Next</MUIButton>{' '}
	    <br />
	  </div> : null }
	  {this.state.interfaceType === 'L3' ? 
	  <div>
	    L3 Specification(MTU/IPAddr)
	    <br /><br />
    	    <div>
      	        <TextField id="outlined-basic" label="Interface(X/Y/Z)" variant="outlined" onChange={this.onl3InterfaceRangeChanged} />
    	    </div><br />
            <TextField id="outlined-basic" label="MTU" variant="outlined" onChange={this.onl3InterfaceMTUChanged} />
	    &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField id="outlined-basic" label="Unit" variant="outlined" onChange={this.onl3InterfaceUnitChanged} />
	    &nbsp;&nbsp;&nbsp;&nbsp;
            <TextField id="outlined-basic" label="IP ADDR" variant="outlined" onChange={this.onl3InterfaceIPChanged} />
	    <br /><br />
	    <MUIButton variant="L3 interface confing apply" onClick={this.searchModalPopup}>Next</MUIButton>{' '}
	  </div> : null }
	  {this.state.interfaceType === 'Interlink' ?
	  <div>
	    Interlink
	    <br /><br />
	    <MUIButton variant="Interlink confing apply" onClick={this.searchModalPopup}>Next</MUIButton>{' '}
	  
	 </div> : null }
	  {this.state.interfaceType === 'IRB' ?
	  <div>
        Interface IRB
	    <br /><br />
		  <div>
			    <TextField id="outlined-basic" helperText="Please enter vlan-id | example 10" label="Vlan-ID" variant="outlined" onChange={this.onIRBinterfaceVlanChanged} />
          </div><br />
                <TextField id="outlined-basic" helperText="Please enter Network with Subnet | example 10.10.0.0/24"  label="Network Subnet" variant="outlined" onChange={this.onIRBnetworkChanged} />
	      &nbsp;&nbsp;&nbsp;&nbsp;
                <TextField id="outlined-basic" helperText="Please enter Routing Instance / VRF Name" label="Routing Instance / VRF" variant="outlined" onChange={this.onIRBroutingInstance} />
          &nbsp;&nbsp;&nbsp;&nbsp;
		 <br /><br />
	    <MUIButton variant="IRB confing apply" onClick={this.searchModalPopup}>Next</MUIButton>{' '}
	  </div> : null }
	  {this.state.interfaceType === 'Description' ?
	  <div>
            Interface description
            <br /><br />
	    <TextField id="outlined-basic" label="Interface(X/Y/Z)" variant="outlined" onChange={this.onDescInterfaceRangeChanged} />
	    <br /><br />
	    <TextField id="outlined-basic" label="Unit" variant="outlined" onChange={this.onDescInterfaceUnitChanged} />
		&nbsp;&nbsp;&nbsp;&nbsp;
	    <TextField id="outlined-basic" label="Desciption" variant="outlined" onChange={this.onDescInterfaceValueChanged} />
	    <br /><br />
	    <MUIButton variant="Interface description confing apply" onClick={this.searchModalPopup}>Next</MUIButton>{' '}
	  </div> : null }
	</TabPanel>
	<TabPanel value={this.state.value} index={1}>
	  <div>
	    BGP
	  </div>
	</TabPanel>
	<TabPanel value={this.state.value} index={2}>
	  OSPF
	</TabPanel>
	<TabPanel value={this.state.value} index={3}>
	  <div>
	    <TextField id="outlined-basic" label="rountg network" variant="outlined" onChange={this.onStaticArgNWFieldChanged} />
	  </div><br /> 
	  <div> 
	    <TextField id="outlined-basic" label="next-hop" variant="outlined" onChange={this.onStaticArgNHFieldChanged} />
	  </div><br />
 	  <div>
	    <MUIButton variant="Static route confing apply" onClick={this.searchModalPopup}>Next</MUIButton>{' '}
	  </div><br />
	</TabPanel>
	<TabPanel value={this.state.value} index={4}>
	  Route Filter
	</TabPanel>
	<TabPanel value={this.state.value} index={5}>
	  VRRP
	</TabPanel>
	<div>
          <Modal
            open={this.state.searchModalShow}
            onClose={this.searchModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
               CMS target list 
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Netbuilder, select configuration target.
              </Typography>
	      <br />
	      <br />
		  <div>
  		    Search Device
			&nbsp;&nbsp;
	        <TextField id="outlined-basic" label="Keyword" variant="outlined" onChange={this.onDevSearchFilterFieldChanged}/>
			<br /><br />
			If all device you wants, enter "all".
			<br />
			There 3,000 over backup configs are.
		  </div>
	      <br />
	      <br />
	      <MUIButton variant="Prepare confing check" onClick={this.prepareConfigCheck}>Next</MUIButton>{' '}
            </Box>
          </Modal>
	</div>
	<div>
          <Modal
            open={this.state.confCheckModalShow}
            onClose={this.confCheckModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
               CMS target list 
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Netbuilder, select configuration target.
              </Typography>
	      <br />
	      <br />
	      <ConfList list={this.state.configs} setTarget={this.setTarget} /> 
	      <br />
	      <br />
	      <MUIButton variant="Prepare confing apply" onClick={this.getDevInfo}>Config Check</MUIButton>{' '}
            </Box>
          </Modal>
	</div>
	<div>
          <Modal
            open={this.state.confApplyModalShow}
            onClose={this.confApplyModalClose}
            aria-labelledby="confApply-modal-title"
            aria-describedby="confApply-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
               CMS config apply 
              </Typography>
			  {this.state.configChecked !== null ?
			  <div>
			  {this.state.configChecked.map((data, index1) => (
			    <div key={index1}>
			      <br />
				  {this.state.confCheckModalTitles[index1]}
			      <br />
				  <Item>
				    {data.split('\n').map((item, index2) => 
					  <p key={index2}>
					    {item}
					  </p>
				    )}
				  </Item>
			    </div>
			  ))} </div> : null }
			  <br />
              Are you sure?
			  <div style={{display: 'flex'}}>
	            <MUIButton variant="Static route confing apply" size="medium" onClick={this.configApply}>Apply</MUIButton>{' '}
	            <MUIButton variant="Static route confing apply" size="medium" onClick={this.confApplyModalClose}>Close</MUIButton>{' '}
			  </div>
            </Box>
          </Modal>
	</div>

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

export default CMSTab;
