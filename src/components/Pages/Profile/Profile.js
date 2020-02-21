import React from 'react';
import {Auth, Storage } from 'aws-amplify';
import { listItemTables } from '../../../graphql/queries';
import { deleteItemTable } from '../../../graphql/mutations';
import API, { graphqlOperation } from '@aws-amplify/api';
import { NavLink } from 'react-router-dom';
export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {reload: false, selling: []};
        this.handleOnRemove = this.handleOnRemove.bind(this);
        this.stripeAccount = this.stripeAccount.bind(this);
    }

    stripeAccount(){
        return false;
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
        console.log(event.target.name);
        console.log(event.target);
        console.log(itemId);
        if (confirm("Are you sure that you want to remove this item listing?")) {
            await API.graphql(graphqlOperation(deleteItemTable, {input:{itemID: itemId}})).then((evt) => {
                location.reload();
                this.setState({reload: true});
            });
        }
        Storage.remove(itemId,{level:'protected'})
        .then(result=>console.log(result))
        .catch(err => console.log(err)); 
    }

    render() {

        let emptyMessage = <div></div>
        if (this.state.selling.length <= 0) {
            emptyMessage = (<div style={{paddingTop: 15, fontSize: 18, textAlign: 'center'}}>You have no items for sale</div>);
        }

        return (
            <div className="container" style={{paddingTop: '6rem', width: '70%'}}>
                <button onClick={this.stripeAccount}>Create Stripe Account</button>
                <div>
                    <div style={{borderBottom: '2px solid black'}}>
                        <h5>Selling</h5>
                    </div>
                    {this.state.selling.map(item => <div style={{paddingTop: 15, paddingBottom: 15, borderBottom: '1px solid black'}}>
                        <div style={{display: 'inline-block', width: "15%"}}>
                            <img style={{objectFit: 'cover', height: 80, marginRight: 15}} src={item.images[0]}></img>
                        </div>
                        <div style={{display: 'inline-block', width: "60%", verticalAlign: 'top'}}>
                            <NavLink to={{pathname: "/products/" + item.itemID}} style={{verticalAlign: 'top', fontSize: 18}}>{item.name}</NavLink>
                        </div>
                        <div style={{display: 'inline-block', width: "20%", verticalAlign: 'bottom', textAlign: 'right'}}>
                            <span name={item.itemID} onClick={this.handleOnRemove} style={{color: "#007bff", cursor: "pointer"}}>Remove</span>
                        </div>
                        
                    </div>)}
                    {emptyMessage}
                </div>
                
            </div>
        )
    }
  }
