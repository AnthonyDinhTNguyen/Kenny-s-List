import React from 'react';
import {Auth, Storage } from 'aws-amplify';
import { listItemTables } from '../../../graphql/queries';
import API, { graphqlOperation } from '@aws-amplify/api';
import { Redirect } from 'react-router';

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {redirect: false, productClicked: 0, selling: []};
    }

    async componentDidMount(){
        let currentUser = "";
        try {
            let response = await Auth.currentAuthenticatedUser();
            currentUser = response.username;
          } catch(err) {
              console.log("ERROR: Failed to retrieve username.");
        }

        await API.graphql(graphqlOperation(listItemTables, {filter:{itemOwner:{eq:currentUser}}})).then((evt) => {
            this.setState({selling: evt.data.listItemTables.items});
        })
    }

    render() {

        let redirect = <div></div>;
        if (this.state.redirect) {
            redirect = <Redirect to={{pathname: "/products/" + this.state.productClicked}}/>;
        }

        return (
            <div className="container" style={{paddingTop: '6rem', width: '100%'}}>
                
                <div style={{display: 'inline-block', width: '30%', backgroundColor: '#f2f2f2', marginRight: 10}}>
                    <div style={{}}>Orders</div>
                    <div style={{}}>Selling</div>
                </div>

                <div style={{display: 'inline-block', width: '65%'}}>
                    <div style={{borderBottom: '2px solid black'}}>
                        <h5>Selling</h5>
                    </div>
                    {this.state.selling.map(item => <div style={{height: 100, padding: 15, borderBottom: '1px solid black'}}>
                        <h5 style={{cursor: 'pointer'}} onClick={() => this.setState({redirect: true, productClicked: item.itemId})}>{item.name}</h5>
                    </div>)}
                </div>

                {redirect}
                
            </div>
        )
    }
  }
