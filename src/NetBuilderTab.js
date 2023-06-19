import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Placeholder } from 'react-bootstrap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Slider from 'react-slick';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import axios from 'axios';
import './App.css';

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  maxHeight: 500,
  overflow: 'auto',
}));

const slideSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

class NetBuilderTab extends Component {
  state = { 
	  IDC : '판교',
	  ZONE : 'Public(금융)',
	  SPC : 0,
	  SHOSTNAMES : [],
	  LPC : 0,
	  LHOSTNAMES : [],
	  configs : '',
	  logs : '',
	  buildLogs : '',
  }

  onIDCRadioChanged = (ev) => {
	  this.setState({ IDC : ev.target.value });
  };

  onZoneRadioChanged = (ev) => {
	  this.setState({ ZONE : ev.target.value });
  };

  onSHOSTNAMETextFieldChanged = (ev, idx) => {
      this.state.SHOSTNAMES[idx] = ev.target.value;
  };

  onSPCTextFieldChanged = (ev) => {
	  this.state.SHOSTNAMES = []
	  for(let i = 0; i < ev.target.value; i++){
	    this.state.SHOSTNAMES[i] = ''
	  }
  	  this.setState({ SPC : ev.target.value });
  };

  onLHOSTNAMETextFieldChanged = (ev, idx) => {
      this.state.LHOSTNAMES[idx] = ev.target.value;
  };

  onLPCTextFieldChanged = (ev) => {
	  this.state.LHOSTNAMES = []
	  for(let i = 0; i < ev.target.value; i++){
	    this.state.LHOSTNAMES[i] = ''
	  }
  	  this.setState({ LPC : ev.target.value });
  };

  generateConfig = async() => {
    var self = this;
    await axios.post('http://10.162.0.197:5000/NetBuilder', {
	  IDC : this.state.IDC,
	  ZONE : this.state.ZONE,
	  SPC : this.state.SPC,
	  SNAMES : this.state.SHOSTNAMES,
	  LPC : this.state.LPC,
	  LNAMES : this.state.LHOSTNAMES,
    })
    .then(function(res){
	  let resChunk = res.data.data.split('||');
	  self.setState({ logs : resChunk[0], configs : resChunk[1] });
    });
  }

  render(){
	  console.log(this.state.SHOSTNAMES)
	  return (
		  <div>
		    <div >
		      <FormControl>
		        <FormLabel id="demo-radio-buttons-group-label">데이터 센터</FormLabel>
		          <RadioGroup
		  	    row
		            aria-labelledby="demo-radio-buttons-group-label"
		  	    defaultValue="판교"
		  	    name="radio-buttons-group"
		  	    onChange={this.onIDCRadioChanged}
		  	  >
		  	    <FormControlLabel value="판교" control={<Radio />} label="판교" />
		  	    <FormControlLabel value="평촌" control={<Radio />} label="평촌" disabled />
		  	    <FormControlLabel value="광주" control={<Radio />} label="광주" disabled />
		  	  </RadioGroup>
		      </FormControl>
		    </div><br />
		    <p style={{position:'absolute', right:1070, top:130}}>
		      <h3> Build Logs </h3>
		    </p>
	            {this.state.logs !== '' ?
                        <Box sx={{width:1000, height:300}} style={{position:'absolute', right:50, top:130}} >
                          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                              <Grid item xs={12}>
                                <Item sx={{height:300}}>
                                  {this.state.logs.split('\n').map((item, index) => (
                                    <p align="left" key={index}>
                                      {item}
                                    </p>
                                  ))}
                                </Item>
                              </Grid>
                          </Grid>
                        </Box>
                    : null}
		    <div>
		      <FormControl>
		        <FormLabel id="demo-radio-buttons-group-label">데이터 센터</FormLabel>
		          <RadioGroup
		  	    row
		            aria-labelledby="demo-radio-buttons-group-label"
		  	    defaultValue="Public(금융)"
		  	    name="radio-buttons-group"
		  	    onChange={this.onZoneRadioChanged}
		  	  >
		  	    <FormControlLabel value="Public(금융)" control={<Radio />} label="Public(금융)" />
		  	    <FormControlLabel value="공공" control={<Radio />} label="공공" disabled />
		  	    <FormControlLabel value="전금법" control={<Radio />} label="전금법" disabled />
		  	    <FormControlLabel value="Legacy" control={<Radio />} label="Legacy" />
		  	  </RadioGroup>
		      </FormControl>
		    </div><br />
		    <div>
		      <TextField id="outlined-basic" label="Spine 개수" variant="outlined" onChange={this.onSPCTextFieldChanged} />
			  <br /><br />
			  <div style={{display: 'flex'}}>
			    {this.state.SHOSTNAMES.map((data, index) => (
				<div>
		          <TextField key={index} id="outlined-basic" label={"Spine 호스트명" + (index + 1)}  variant="outlined" onChange={(ev) => this.onSHOSTNAMETextFieldChanged(ev, index)} />
				  &nbsp;&nbsp;
				</div>
			    ))}
			  </div>
		    </div><br />
		    <div> 
		      <TextField id="outlined-basic" label="leaf 개수" variant="outlined" onChange={this.onLPCTextFieldChanged} />
			  <br /><br />
			  <div style={{display: 'flex'}}>
			    {this.state.LHOSTNAMES.map((data, index) => (
				<div>
		          <TextField key={index} id="outlined-basic" label={"leaf 호스트명" + (index + 1)}  variant="outlined" onChange={(ev) => this.onLHOSTNAMETextFieldChanged(ev, index)} />
				  &nbsp;&nbsp;
				</div>
			    ))}
			  </div>

		    </div><br />
		    <div>
		      <Button variant="Confing generate" onClick={this.generateConfig}>Generate</Button>{' '}
		    </div><br />
		    <Placeholder xs={12} bg="warning" />
		    {this.state.configs !== '' ?
		    <div>
		      <Slider {...slideSettings}>
		        {this.state.configs.split(',').map((data, index) => (
			  <div key={index}>
		            <Item>
		              {data.split('\n').map((item, index) => (
			        <p key={index}>
				  {item}
				</p>
			        ))
			      }
		            </Item>
			  </div>
			  ))
			}
		      </Slider>
		    </div> : null }
		  </div>
	  );
  }
}

export default NetBuilderTab;
