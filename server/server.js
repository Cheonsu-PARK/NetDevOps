const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5000;
const { spawn } = require('child_process');
const { exec } = require('child_process');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.post('/sample',function(req, res){
	        console.log('request received');
	        console.log(req.body);
	        const exec = spawn('python3', ['./module/SampleModule.py']);
	        exec.stdout.on('data', (data)=>{
			                res.json({msg:`${data}`})});
})

app.post('/NetBuilder', async function(req, res){
	        console.log('request received. NetBuilder');
	        console.log(req.body);
	        var DSCnt = req.body.SPC;
			var DSNames = req.body.SNAMES;
			var DSHostNames = "\"";
	        var ASCnt = req.body.LPC;
			var ASNames = req.body.LNAMES;
			var ASHostNames = "\"";
	        var Layer = req.body.IDC + '_' + req.body.ZONE + '_';
	        var DSLayer = "\"" + Layer + 'spine' + "\"";
	        var ASLayer = "\"" + Layer + 'leaf' + "\"";
			var HNPrefix = "";
			if(req.body.ZONE === "Public(금융)"){
			  HNPrefix = "pub.";
			} else if(req.body.ZONE === "Legacy"){
			  HNPrefix = "abl.";
			}
			for(let i = 0; i < DSCnt; i++){
			  DSHostNames += HNPrefix + DSNames[i];
			  if(i < DSCnt - 1) DSHostNames += " ";
			}
			for(let i = 0; i < ASCnt; i++){
			  ASHostNames += HNPrefix + ASNames[i];
			  if(i < ASCnt - 1) ASHostNames += " ";
			}
			DSHostNames += "\"";
			ASHostNames += "\"";
	        var cmd = 'python3 module/NIBN/helper/run-NetBuilder-service.py ' + DSCnt + ' ' + DSHostNames + ' ' + DSLayer + ' ' + ASCnt + ' ' + ASHostNames + ' ' + ASLayer; 
	        const child = await exec(cmd, function(err, stdout, stderr){
			          return res.status(200).json({data: stdout});
			        });
})

app.post('/ConfList', async function(req, res){
	        console.log('request received. ConfList');
	        console.log(req.body);
	        var cmd = 'python3 module/NIBN/helper/run-ConfList-service.py ' + req.body.filter;
	        const child = await exec(cmd, function(err, stdout, stderr){
			          return res.status(200).json({data: stdout});
			        });
})

 app.post('/ConfList/Switch', async function(req, res){
             console.log('request received. ConfList');
             console.log(req.body);
             var cmd = 'python3 module/NIBN/helper/run-ConfList-service-switch.py ' ;
             const child = await exec(cmd, function(err, stdout, stderr){
                       return res.status(200).json({data: stdout});
                     });
 })

app.post('/ConfList/bind/citrix', async function(req, res){
             console.log('request received. ConfList');
             console.log(req.body);
             var cmd = 'python3 module/NIBN/helper/run-ConfList-adc-citrix.py ' + req.body.filter;
             const child = await exec(cmd, function(err, stdout, stderr){
                       return res.status(200).json({data: stdout});
                     });
 })

app.post('/ConfList/bind/a10', async function(req, res){
             console.log('request received. ConfList');
             console.log(req.body);
             var cmd = 'python3 module/NIBN/helper/run-ConfList-adc-a10.py ' + req.body.filter;
             const child = await exec(cmd, function(err, stdout, stderr){
                       return res.status(200).json({data: stdout});
                     });
 })

app.post('/CMSStaticRouteCheck', async function(req, res){
	        console.log('request received. CMSStaticRoutingCheck');
	        console.log(req.body);
	        var cmd = 'python3 module/NIBN/helper/run-CMSStaticRoutingCheck-service.py ' + req.body.target + ' ' + req.body.args; 
	        const child = await exec(cmd, function(err, stdout, stderr){
			          return res.status(200).json({data: stdout});
			        });
})

app.post('/CMSStaticRoute', async function(req, res){
	        console.log('request received. CMSStaticRouting');
	        console.log(req.body);
	        var cmd = 'python3 module/NIBN/helper/run-CMSStaticRouting-service.py ' + req.body.target + ' ' + req.body.args; 
	        const child = await exec(cmd, function(err, stdout, stderr){
			          return res.status(200).json({data: stdout});
			        });
})

app.post('/ConfCompare', async function(req, res){
	        console.log('request received. ConfCompare');
	        console.log(req.body);
	        var cmd = 'python3 module/NIBN/helper/run-ConfCompare-service.py ' + req.body.target + ' ' + req.body.refer;
	        const child = await exec(cmd, function(err, stdout, stderr){
			          return res.status(200).json({data: stdout});
			        });
})

app.post('/ConfConfirm', async function(req, res){
	        console.log('request received. ConfConfirm');
	        console.log(req.body);
	        var cmd = 'python3 module/NIBN/helper/run-ConfConfirm-service.py ' + req.body.args; 
	        const child = await exec(cmd, function(err, stdout, stderr){
			          return res.status(200).json({data: stdout});
			        });
})

app.post('/ConfConfirmed', async function(req, res){
	        console.log('request received. ConfConfirmed');
	        console.log(req.body);
	        var cmd = 'python3 module/NIBN/helper/run-ConfConfirmed-service.py '; 
	        const child = await exec(cmd, function(err, stdout, stderr){
					  console.log(stdout)
			          return res.status(200).json({data: stdout});
			        });
})

app.post('/ConfSearch/All', async function(req, res){
        console.log('request received. ConfSearch');
        console.log(req.body);
        var cmd = 'python3 module/NIBN/helper/run-ConfSearch-service_all.py ' + req.body.keyword + ' ' + req.body.hostname;
        const child = await exec(cmd, function(err, stdout, stderr){
          console.log(stdout);
          return res.status(200).json({data: stdout});
        });
})

app.post('/ConfSearch/Juniper', async function(req, res){
        console.log('request received. ConfSearch');
        console.log(req.body);
        var cmd = 'python3 module/NIBN/helper/run-ConfSearch-service_Juniper.py ' + req.body.keyword + ' ' + req.body.hostname;
        const child = await exec(cmd, function(err, stdout, stderr){
          console.log(stdout);
          return res.status(200).json({data: stdout});
        });
})

app.post('/ConfSearch/Cisco', async function(req, res){
        console.log('request received. ConfSearch');
        console.log(req.body);
        var cmd = 'python3 module/NIBN/helper/run-ConfSearch-service_Cisco.py ' + req.body.keyword + ' ' + req.body.hostname;
        const child = await exec(cmd, function(err, stdout, stderr){
          console.log(stdout);
          return res.status(200).json({data: stdout});
        });
})

app.post('/ConfSearch/bind/a10', async function(req, res){
        console.log('request received. ConfSearch');
        console.log(req.body);
        var cmd = 'python3 module/NIBN/helper/run-ConfSearch-service_bind_adc_a10.py ' + req.body.hostname;
        const child = await exec(cmd, function(err, stdout, stderr){
          console.log(stdout);
          return res.status(200).json({data: stdout});
        });
})

app.post('/ConfSearch/bind/citrix', async function(req, res){
        console.log('request received. ConfSearch');
        console.log(req.body);
        var cmd = 'python3 module/NIBN/helper/run-ConfSearch-service_bind_adc_citrix.py ' + req.body.hostname;
        const child = await exec(cmd, function(err, stdout, stderr){
          console.log(stdout);
          return res.status(200).json({data: stdout});
        });
})

app.post('/InterfaceDescriptionCheck', async function(req, res){
	        console.log('request received. InterfaceDescriptionCheck');
	        console.log(req.body);
	        var cmd = 'python3 module/NIBN/helper/run-CMSInterfaceDescriptionCheck-service.py ' + req.body.target + ' ' + req.body.args; 
	        const child = await exec(cmd, function(err, stdout, stderr){
			          return res.status(200).json({data: stdout});
			        });
})

app.post('/InterfaceDescription', async function(req, res){
	        console.log('request received. InterfaceDescription');
	        console.log(req.body);
	        var cmd = 'python3 module/NIBN/helper/run-CMSInterfaceDescription-service.py ' + req.body.target + ' ' + req.body.args; 
	        const child = await exec(cmd, function(err, stdout, stderr){
			          return res.status(200).json({data: stdout});
			        });
})

app.post('/L3InterfaceCheck', async function(req, res){
	        console.log('request received. L3InterfaceCheck');
	        console.log(req.body);
	        var cmd = 'python3 module/NIBN/helper/run-CMSL3InterfaceCheck-service.py ' + req.body.target + ' ' + req.body.args; 
	        const child = await exec(cmd, function(err, stdout, stderr){
			          return res.status(200).json({data: stdout});
			        });
})

app.post('/L3Interface', async function(req, res){
	        console.log('request received. L3Interface');
	        console.log(req.body);
	        var cmd = 'python3 module/NIBN/helper/run-CMSL3Interface-service.py ' + req.body.target + ' ' + req.body.args; 
	        const child = await exec(cmd, function(err, stdout, stderr){
			          return res.status(200).json({data: stdout});
			        });
})

app.post('/InterfaceIRB', async function(req, res){
            console.log('request received. InterfaceIRB');
            console.log(req.body);

            var cmd = 'python3 module/NIBN/helper/run-CMSInterfaceIRB-service.py ' + req.body.target + ' ' + req.body.args;
            const child = await exec(cmd, function(err, stdout, stderr){
                      return res.status(200).json({data: stdout});
                    });
})

app.post('/InterfaceIRBCheck', async function(req, res){
            console.log('request received. InterfaceIRB');
            console.log(req.body);

            var cmd = 'python3 module/NIBN/helper/run-CMSInterfaceIRBCheck-service.py ' + req.body.target + ' ' + req.body.args;
            const child = await exec(cmd, function(err, stdout, stderr){
                      return res.status(200).json({data: stdout});
                    });
})

app.post('/ValidConfApplyDevice', async function(req, res){
            console.log('request received. ValidConfApplyDevice');
            console.log(req.body);

            var cmd = 'python3 module/NIBN/helper/run-ValidConfApplyDevice-service.py ' + req.body.target;
            const child = await exec(cmd, function(err, stdout, stderr){
                      return res.status(200).json({data: stdout});
                    });
})

app.post('/ConfSpecification', async function(req, res){
            console.log('request received. ConfigSpecification');
            console.log(req.body);
            var cmd = 'python3 module/NIBN/helper/run-ConfSpecification-service.py ' + req.body.target + '  "' + req.body.keys + '"';
            const child = await exec(cmd, function(err, stdout, stderr){
                      return res.status(200).json({data: stdout});
                    });
})

app.post('/AbsDeviceNotice', async function(req, res){
            console.log('request received. AbsDeviceNotice');
            console.log(req.body);
            var cmd = 'python3 module/NIBN/helper/run-AbsDeviceNotice-service.py ' + req.body.target + '  "' + req.body.keys + '"';
            const child = await exec(cmd, function(err, stdout, stderr){
                      return res.status(200).json({data: stdout});
                    });
})

app.post('/AbsDeviceQuery', async function(req, res){
            console.log('request received. AbsDeviceQuery');
            console.log(req.body);
            var cmd = 'python3 module/NIBN/helper/run-AbsDeviceQuery-service.py ' + req.body.target + '  "' + req.body.keys + '"';
            const child = await exec(cmd, function(err, stdout, stderr){
                      return res.status(200).json({data: stdout});
                    });
})

app.post('/OMSIDCNotice', async function(req, res){
            console.log('request received. OMSIDCNotice');
            console.log(req.body);
            var cmd = 'python3 module/NIBN/helper/run-OMSIDCNotice-service.py ' + req.body.target;
            const child = await exec(cmd, function(err, stdout, stderr){
                      return res.status(200).json({data: stdout});
                    });
})

app.post('/OMSServiceNotice', async function(req, res){
            console.log('request received. OMSServiceNotice');
            console.log(req.body);
            var cmd = 'python3 module/NIBN/helper/run-OMSServiceNotice-service.py ' + req.body.target;
            const child = await exec(cmd, function(err, stdout, stderr){
                      return res.status(200).json({data: stdout});
                    });
})

app.post('/OMSVtSwitchNotice', async function(req, res){
            console.log('request received. OMSVtSwitchNotice');
            console.log(req.body);
            var cmd = 'python3 module/NIBN/helper/run-OMSVtSwitchNotice-service.py ' + req.body.target;
            const child = await exec(cmd, function(err, stdout, stderr){
                      return res.status(200).json({data: stdout});
                    });
})

app.post('/OMSVtServerNotice', async function(req, res){
            console.log('request received. OMSVtServerNotice');
            console.log(req.body);
            var cmd = 'python3 module/NIBN/helper/run-OMSVtServerNotice-service.py ' + '"' + req.body.target + '"';
            console.log(cmd)
            const child = await exec(cmd, function(err, stdout, stderr){
                      return res.status(200).json({data: stdout});
                    });
})

app.post('/OMSVniNotice', async function(req, res){
            console.log('request received. OMSVniNotice');
            console.log(req.body);
            var cmd = 'python3 module/NIBN/helper/run-OMSVniNotice-service.py ' + '"' + req.body.target + '"';
            console.log(cmd)
            const child = await exec(cmd, function(err, stdout, stderr){
                      return res.status(200).json({data: stdout});
                    });
})


app.listen(port, ()=>console.log('server start'))
