import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Placeholder } from 'react-bootstrap';
import MAINTabs from './MAINTabs';
import './App.css';

class App extends Component {
	render() {
		console.log("React start")
		return (
			<div>
			  <div>
			    <h1>
        		      NHN Network Automation System <Badge bg="secondary">Beta</Badge>
      			    </h1>
			  </div>
			  <div>
			    <Placeholder xs={12} bg="primary" />
			  </div>
			  <MAINTabs />
			</div>
		);
	}
}

export default App;
