import React from 'react';
import {Auth, Storage } from 'aws-amplify';
import { listItemTables } from '../../../graphql/queries';
import { deleteItemTable } from '../../../graphql/mutations';
import API, { graphqlOperation } from '@aws-amplify/api';
import { NavLink,Redirect } from 'react-router-dom';
import axios from "axios";
import {loadStripe} from '@stripe/stripe-js';
export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {selling: [], stripeLink:''};
        this.handleOnRemove = this.handleOnRemove.bind(this);
        this.stripeAccount = this.stripeAccount.bind(this);
    }

    async stripeAccount(){
        let user = (await Auth.currentAuthenticatedUser()).username;
        if (user == null){
            await Auth.signOut().catch(err=>console.log(err));
        }
        let link = "https://connect.stripe.com/express/oauth/authorize?client_id=ca_Glz8Mb09LGrSthPbSj28gU0WsDX65f6g&state="+user;
        window.open(link);
        //this.setState({stripeLink:link});
        // let url = "https://in8hc6wee5.execute-api.us-east-1.amazonaws.com/stripe/stripe-payment";
        // let amount = "500";
        // let test = (parseFloat(this.props.yourBid)*100).toString();
        // console.log(test);
        // let accountID = "acct_1GEXPGKzFt6viajs";
        // let postThis = url+"?amount="+amount+"&accountID="+accountID;
        // const stripePromise = loadStripe("pk_test_NedNuvs9YOl1WOhanD0xfJtX00q2eAowF8");
        // let dataJSON = await axios.get(postThis);
        // console.log(dataJSON);
        // console.log(dataJSON.data.body.clientSecret+"bidcart");
        // this.setState({clientID:dataJSON.data.body.clientSecret});
        // this.setState({stripeP:stripePromise})
        // this.setState({stripe:true});
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

        return (
            <div className="container" style={{paddingTop: '6rem', width: '60%'}}>
                <div>
                    <div style={{borderBottom: '2px solid black'}}>
                        <h5>Selling</h5>
                    </div>
                    {this.state.selling.map(item => <div key={item} style={{paddingTop: 15, paddingBottom: 15, borderBottom: '1px solid black'}}>
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
