import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Placeholder } from 'react-bootstrap';
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
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import axios from 'axios';
import ConfList from './ConfList';
import { DataGrid, GridColDef, GridApi, GridCellValue } from '@mui/x-data-grid';


const btnClickListener = (params) => {
    console.log(params.field)
    console.log(params.headerName)
}

const columns = [
      { field: 'id', headerName: 'ID', width: 90 },
      {
              field: 'Vlan',
              headerName: 'VLAN',
              width: 150,
              editable: true,
            },
      {
              field: 'VNI',
              headerName: 'VNI',
              width: 150,
              editable: true,
            },
      {
              field: 'Usage',
              headerName: 'Usage',
              width: 110,
              editable: true,
            },
      {
              field: 'Etc',
              headerName: 'Etc',
              sortable: false,
              width: 160,
                  },
      {
              field: 'Edit',
              headerName: 'Edit',
              sortable: false,
              width: 160,
              renderCell: (params) => {
                  const onClick = (e) => {
                      const currentRow = params.row;
                      const id = params.id;
                      console.log(id)
                      return alert(JSON.stringify(currentRow, null, 4));
                  };
                  return <Button onClick={onClick}>Click</Button>;
              }
                  },
];

const rows = [
      { id: 1, Vlan: '500', VNI: '20100 ~ 201500', Usage: "Test DB Data", Edit : <Button size="small">수정</Button> },
];

class OMSTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
        idcVal: '판교,평촌,광주,죽전',
        serviceVal: null,
        vtSwitchVal: null,
        vtServerVal: null,
        vniVal: null,
        showDetails: false,
    }
  }

  a11yProps = (index) => {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  onIDCRadioChanged = async(ev) => {
      var self = this;
      await axios.post('http://10.162.0.197:5000/OMSIDCNotice', {
          target : ev.target.value,
      }).then(function(res){
          if(res.data.data != ''){
            self.setState({ serviceVal : res.data.data, vtSwitchVal : null, vtServerVal : null, vniVal : null, showDetails: false });
          } else {
            self.setState({ serviceVal : null, vtSwitchVal : null, vtServerVal : null, vniVal : null, showDetails: false });
          }
      });
  }

  onServiceRadioChanged = async(ev) => {
      var self = this;
      await axios.post('http://10.162.0.197:5000/OMSServiceNotice', {
          target : ev.target.value,
      }).then(function(res){
          if(res.data.data != ''){
            self.setState({ vtSwitchVal : res.data.data, vtServerVal : null, vniVal : null, showDetails : false });
          } else {
            self.setState({ vtSwitchVal : null, vtServerVal : null, vniVal : null, showDetails : false });
          }
      });
  }

  onVtSwitchRadioChanged = async(ev) => {
      var self = this;
      await axios.post('http://10.162.0.197:5000/OMSVtSwitchNotice', {
          target : ev.target.value,
      }).then(function(res){
          if(res.data.data != ''){
            self.setState({ vtServerVal : res.data.data, vniVal : null, showDetails : false });
          } else {
            self.setState({ vtServerVal : null, vniVal : null, showDetails : false });
          }
      });

  }

  onVtServerRadioChanged = async(ev) => {
      var self = this;
      await axios.post('http://10.162.0.197:5000/OMSVtServerNotice', {
          target : ev.target.value,
      }).then(function(res){
          if(res.data.data != ''){
            self.setState({ vniVal : res.data.data, showDetails : false });
          } else {
            self.setState({ vniVal : null, showDetails : false });
          }
      });
  }

  onVniRadioChanged = async(ev) => {
      var self = this;
      await axios.post('http://10.162.0.197:5000/OMSVniNotice', {
          target : ev.target.value,
      }).then(function(res){
          if(res.data.data != null){
            self.setState({ vniData : res.data.data, showDetails : true });
          } else {
            self.setState({ vniData : null, showDetails : true });
          }
      });
  }

  render() {
    return (
        <div>
        <div style={{display: 'flex', justifyContent : 'center'}}>
          <Card sx={{ minWidth: 400 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                IDC
              </Typography>
              <FormControl>
                  <View style={{flexDirection: 'column'}}>
                    {this.state.idcVal.split(',').map((item) => (
		  	          <FormControlLabel value={item} control={<Checkbox onChange={this.onIDCRadioChanged}/>} label={item} />
                    ))}
                  </View>
		      </FormControl>
            </CardContent>
            <CardActions>
              <Button size="small">추가</Button>
            </CardActions>
          </Card>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Card sx={{ minWidth: 400 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Service
              </Typography>
              {this.state.serviceVal != null ?
              <FormControl>
                  <View style={{flexDirection: 'column'}}>
                    {this.state.serviceVal.split(',').map((item) => (
		  	          <FormControlLabel value={item} control={<Checkbox onChange={this.onServiceRadioChanged}/>} label={item} />
                    ))}
                  </View>
		      </FormControl>
              : null }
            </CardContent>
            <CardActions>
              <Button size="small">추가</Button>
            </CardActions>
          </Card>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Card sx={{ minWidth: 400 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                VTEP Switch
              </Typography>
              {this.state.vtSwitchVal != null ?
              <FormControl>
                  <View style={{flexDirection: 'column'}}>
                    {this.state.vtSwitchVal.split(',').map((item) => (
		  	          <FormControlLabel value={item} control={<Checkbox onChange={this.onVtSwitchRadioChanged}/>} label={item} />
                    ))}
                  </View>
		      </FormControl>
              : null }
            </CardContent>
            <CardActions>
              <Button size="small">추가</Button>
            </CardActions>
          </Card>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Card sx={{ minWidth: 400 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                VTEP Server(Server Node)
              </Typography>
              {this.state.vtServerVal != null ?
              <FormControl>
                  <View style={{flexDirection: 'column'}}>
                    {this.state.vtServerVal.split(',').map((item) => (
		  	          <FormControlLabel value={item} control={<Checkbox onChange={this.onVtServerRadioChanged}/>} label={item} />
                    ))}
                  </View>
		      </FormControl>
              : null }
            </CardContent>
            <CardActions>
              <Button size="small">추가</Button>
            </CardActions>
          </Card>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Card sx={{ minWidth: 400 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                VNI Range 
              </Typography>
              {this.state.vniVal != null ?
              <FormControl>
                  <View style={{flexDirection: 'column'}}>
                    {this.state.vniVal.split(',').map((item) => (
		  	          <FormControlLabel value={item} control={<Checkbox onChange={this.onVniRadioChanged}/>} label={item} />
                    ))}
                  </View>
		      </FormControl>
              : null }
            </CardContent>
            <CardActions>
              <Button size="small">추가</Button>
            </CardActions>
          </Card>
        </div>
        <div>
          {this.state.showDetails ?
            <div>
              <br />
              <Placeholder xs={12} bg="warning" />
              <br />
              <br />
              <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </div> : null }
        </div>
      </div>
    );
  }
}

export default OMSTab;
