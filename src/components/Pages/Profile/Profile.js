import React from 'react';
import {Auth, Storage } from 'aws-amplify';
import { listItemTables } from '../../../graphql/queries';
import { deleteItemTable } from '../../../graphql/mutations';
import API, { graphqlOperation } from '@aws-amplify/api';
import { NavLink,Redirect } from 'react-router-dom';
import axios from "axios";
export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {reload: false, selling: [{name: "Macbook Pro 2019 Core i5 8GB RAM 256GB SSD", itemID: "d54bcb48-19b2-46a8-a3c5-14ec0ac117d4", images: ["https://kennyslist0a68ad13e69142fb89779b2dba58e9dd145823-kennyslist.s3.amazonaws.com/protected/us-east-1%3Ab50e563f-bfe8-4d47-a48e-da014df6a343/d54bcb48-19b2-46a8-a3c5-14ec0ac117d4"]}], stripeLink:''};
        this.handleOnRemove = this.handleOnRemove.bind(this);
        this.stripeAccount = this.stripeAccount.bind(this);
    }

    async stripeAccount(){
        const user = (await Auth.currentAuthenticatedUser()).username;
        const linker = await axios.get
            (`https://in8hc6wee5.execute-api.us-east-1.amazonaws.com/stripe/create-stripe-account?username=${user}`);
        console.log(linker);
        const link = "https://google.com";
        this.setState({stripeLink:link});
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
        if(this.state.stripeLink !=""){
            return(
                <Redirect to = {this.state.stripeLink}></Redirect>
            )
        }
        if (this.state.redirect === true) {
            this.setState({redirect: false});
            console.log("Redirecting!");
            return (<Redirect to="/"></Redirect>);
        }

        return (
            <div className="container" style={{paddingTop: '6rem', width: '70%'}}>
                <button onClick={this.stripeAccount}>Create Stripe Account</button>
                <div>
                    <div style={{borderBottom: '2px solid black'}}>
                        <h5>Selling</h5>
                    </div>
                    {this.state.selling.map(item => <div style={{paddingTop: 15, paddingBottom: 15, borderBottom: '1px solid black'}}>
                        <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                            <img style={{marginRight: 15}} height="80" src={item.images[0]}></img>
                        </div>
                        <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                            <div style={{verticalAlign: 'top'}}>
                                <NavLink to={{pathname: "/products/" + item.itemID}} style={{verticalAlign: 'top', fontSize: 18}}>{item.name}</NavLink>
                            </div>
                            <br/>
                            <span name={item.itemID} onClick={this.handleOnRemove} style={{fontSize: 16, color: "#007bff", cursor: "pointer"}}>Remove</span>
                        </div>
                    </div>)}
                    {emptyMessage}
                </div>
                
            </div>
        )
    }
  }
