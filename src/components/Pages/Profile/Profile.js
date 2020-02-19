import React from 'react';
import {Auth, Storage } from 'aws-amplify';
import { listItemTables } from '../../../graphql/queries';
import API, { graphqlOperation } from '@aws-amplify/api';
import uuid from "uuid";

export default class Profile extends React.Component {
    constructor(props){
        super(props)
        this.state = {value: '', file:'',desc: ''};
    }

    async componentDidMount(){

        let currentUser = "";
        try {
            let response = await Auth.currentAuthenticatedUser();
            currentUser = response.username;
          } catch(err) {
              console.log("ERROR: Failed to retrieve username. Defaulting to 'Kenny'.");
              currentUser = 'Kenny';
          }

        await API.graphql(graphqlOperation(listItemTables, {filter:{username:{eq:currentUser}}})).then((evt) => {
            console.log("REEEEE");
            console.log(evt.data.listUsers.items);
        })
    }

    //images will be validated server side as well
    render() {
        return (
            <div className="container" style={{paddingTop: '6rem', width: '100%'}}>
                
                <div style={{display: 'inline-block', width: 200, backgroundColor: '#f2f2f2'}}>
                    <div style={{}}>Orders</div>
                    <div style={{}}>Selling</div>
                </div>

                <div style={{display: 'inline-block'}}>

                </div>
                
            </div>
        )
    }
  }
