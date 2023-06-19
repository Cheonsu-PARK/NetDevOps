import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import 'bootstrap/dist/css/bootstrap.min.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MUIButton from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import ConfList from './ConfList';
import axios from 'axios';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const slideSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

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

class ValidConfigTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      target : '',
      configFileNames: '',
      configCompared: null,
      configConfirmed: null,
    }
  }

  componentDidMount = async() => {
    var self = this;
    await axios.post('http://10.162.0.197:5000/ConfConfirmed', {
	  args : '', 
    })
    .then(function(res){
	  var ret = res.data.data.split('||');
	  console.log(ret)
	  if(ret.length > 2){
 	    self.setState({ configFileNames : ret[0].split(','), configConfirmed : ret[1].split(',') });
	  }
    });
  }

  modalPopup = async() => {
    this.setState({ modalShow : true });
  }

  modalClose = () => {
    this.setState({ modalShow : false});
  }

  setTarget = (idx) => {
	this.setState({ target : idx });
  }

  applyConfig = async() => {
    var self = this;
	for(let i = 1; i < this.state.configFileNames.length; i++){
	  await axios.post('http://10.162.0.197:5000/ValidConfApplyDevice', {
        target : this.state.configFileNames[i]
	  }).then(function(res){
		console.log(res.data.data);
		this.setState({ modalShow : false });
	  });
	}
  }

  render() {
    return (
      <div>
	{this.state.configConfirmed !== null ?
	 // <Slider {...slideSettings}>
	  <Box sx={{ width: '100%' }} >
          {this.state.configConfirmed.map((data, index) => (
            <div key={index}>
              <Item>
                {data.split('\n').map((item, index) => (
                  <p align="left" key={index}>
                    {item}
                  </p>
                  ))
                }
              </Item>
            </div>
            ))
         }
      </Box> : null
	}
	<MUIButton variant="Apply device" onClick={this.modalPopup}>Apply device</MUIButton>{' '}
	<br />
	<div>
          <Modal
            open={this.state.modalShow}
            onClose={this.modalClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
               Confirmed config apply 
              </Typography>
              <Typography id="modal-std-description" sx={{ mt: 2}}>
			   Confirmed by ConDiff module,
			   Select a config to apply.
              </Typography>
			  {this.state.configFileNames !== '' ?
			  <div>
			  <br />
			  <br />
			  <ConfList list={this.state.configFileNames} setTarget={this.setTarget} />
			  <br />
			  <br />
			  </div> : null }
	          <MUIButton variant="Static route confing apply" onClick={this.modalClose}>Apply device</MUIButton>{' '}
            </Box>
          </Modal>
	</div>
      </div>
    );
  }
}

export default ValidConfigTab;
