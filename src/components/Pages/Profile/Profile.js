import React from 'react';
import {Auth, Storage } from 'aws-amplify';
import { listItemTables } from '../../../graphql/queries';
import { deleteItemTables } from '../../../graphql/mutations';
import API, { graphqlOperation } from '@aws-amplify/api';
import { NavLink } from 'react-router-dom';

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {selling: []};
        this.handleOnRemove = this.handleOnRemove.bind(this);
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
        });

        console.log(this.state.selling);
    }

    async handleOnRemove(event) {
        let itemId = event.target.getAttribute('name');
        console.log(itemId);
        if (confirm("Are you sure that you want to remove this item listing?")) {
            await API.graphql(graphqlOperation(deleteItemTables, {input:{itemId}})).then((evt) => {
                location.reload();
            });
        } 
    }

    render() {

        let emptyMessage = <div></div>
        if (this.state.selling.length <= 0) {
            emptyMessage = (<div style={{paddingTop: 15, fontSize: 18, textAlign: 'center'}}>You have no items for sale</div>);
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
                    {this.state.selling.map(item => <div style={{paddingTop: 15, paddingBottom: 15, borderBottom: '1px solid black'}}>
                        <div style={{display: 'inline-block', width: "15%"}}>
                            <img style={{objectFit: 'cover', height: 80, marginRight: 15}} src={item.images[0]}></img>
                        </div>
                        <div style={{display: 'inline-block', width: "60%", verticalAlign: 'top'}}>
                            <NavLink to={{pathname: "/products/" + item.itemId}} style={{verticalAlign: 'top', fontSize: 18}}>{item.name}</NavLink>
                        </div>
                        <div style={{display: 'inline-block', width: "20%", verticalAlign: 'bottom', textAlign: 'right'}}>
                            <span name={item.itemId} onClick={this.handleOnRemove}>Remove </span><span>Edit</span>
                        </div>
                        
                    </div>)}
                    {emptyMessage}
                </div>
                
            </div>
        )
    }
  }
