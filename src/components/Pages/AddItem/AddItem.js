import React from 'react';
import {Auth, Storage } from 'aws-amplify';
import { getItemTable,listItemTables } from '../../../graphql/queries';
import { updateItemTable,createItemTable, createLatestUserBidTable } from '../../../graphql/mutations';
import API, { graphqlOperation } from '@aws-amplify/api';
import uuid from "uuid";
import './AddItem.css'
import {formatMoney} from "../../Pipes/priceFormatter";

export default class AddItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {value: '', file:'',desc: '',category: 'Other',cond:'New',startingBid:0,marketPrice:0};
        this.handleName = this.handleName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleDesc = this.handleDesc.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.checkSellable = this.checkSellable.bind(this);
        this.handleCondition = this.handleCondition.bind(this);
        this.handleStartingBid = this.handleStartingBid.bind(this);
        this.handleMarketPrice = this.handleMarketPrice.bind(this);
    }
    componentDidMount(){
        API.graphql(graphqlOperation(createLatestUserBidTable, {input:{lubtProductID:"asdf"}})).then((evt) => {
            console.log("itworked");
        }).catch(e=>console.log("shit"));
    }
    handleCategory(event){
        this.setState({category: event.target.value});
        console.log(event.target.value);
    }
    handleFile(event){
        this.setState({file: event.target.files[0]});
    }
    handleName(event) {//enforce alphanumeric input
        const re = /^[a-z\d\s]+$/i;
        if(event.target.value===''||re.test(event.target.value)){
            this.setState({value: event.target.value});
        }
      }
    handleDesc(event){
        const re = /^[a-z\d\s]+$/i;
        if(event.target.value===''||re.test(event.target.value)){
            this.setState({desc: event.target.value});
        }
        console.log(this.state.desc);
    }
    handleCondition(event){
        this.setState({cond: event.target.value});
    }
    handleStartingBid(event){
        if(event.target.value >=0.0){
            this.setState({startingBid:event.target.value});
        }
    }
    handleMarketPrice(event){
        if(event.target.value >=0.0){
            this.setState({marketPrice:event.target.value});
        }
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        const file = this.state.file;
        const title = this.state.value;
        const desc = this.state.desc;
        const cate = this.state.category;
        const condi = this.state.cond;
        const startBid = this.state.startingBid;
        const markPrice = this.state.marketPrice;
        const uID = uuid.v4();
        const user = (await Auth.currentAuthenticatedUser()).username;
        const sellable =await this.checkSellable(user);
        console.log(sellable);
        const time = new Date().toISOString();
        if(sellable ==false){
            alert('You can only sell 5 items at a time. Please Delete Some Items or wait');
            console.log('adding too many items');
        }
        else if(user == null){
            alert("your session has expired please log in again");
        }
        else if(file ==''||title==''||desc==''){
            alert('Missing an input');
            console.log("missing an input");
        }
        else{
            const itemIDStore = uID.toString();
            Storage.put(uID, file, {
                level: 'protected',
                contentType: 'image/png'
            })
            .then (result => {Storage.get(uID, {level: 'protected'}
            ).then(r=>

            {
                // API.graphql(graphqlOperation(createItemTable,
                // {input: {itemID: itemIDStore, description: desc,itemOwner:user,
                //     name: title, postTime: time, category: cate, startingBid: formatMoney(startBid), marketPrice: formatMoney(markPrice), images: [r.substring(0,r.indexOf('?'))], condition: condi}})).then(e=>{alert('Successful Upload');this.setState({value: '',desc: '',category: 'Other'});}).catch(err=>console.log(err));}).catch(e=>console.log(e));}

            API.graphql(graphqlOperation(createItemTable,
                {input: {itemID: uID.toString(), description: desc,itemOwner:user, 
                    name: title, postTime: time, category: cate, startingBid: startBid, marketPrice: markPrice, images: [r.substring(0,r.indexOf('?'))], condition: condi}})).then(e=>{alert('Successful Upload');this.setState({value: '',desc: '',category: 'Other'});}).catch(err=>console.log(err));}).catch(e=>console.log(e));}


                    ).catch(err => console.log(err));

            // {API.graphql(graphqlOperation(createLatestUserBidTable,
            //     {input:{
            //         lubtProductID: itemIDStore,
            //             BidAmt: startBid,
            //             Username: 'Leroy',
            //         }}))}
        }
      }
      async checkSellable(uname){
        let itemList = [];
        let currentUser = uname;

        await (API.graphql(graphqlOperation(listItemTables, {filter:{itemOwner:{eq:currentUser}}})).then((evt) => {
            if(evt.data.listItemTables.items!= null){
                evt.data.listItemTables.items.map((itemDB,i) =>{itemList.push(itemDB);});
            }
        }));
        console.log(itemList);
        if(itemList.length <5){
            console.log("returning True");
            return true;
        }
        else{
            console.log("returning False");
            return false;
        }
      }
  //images will be validated server side as well
    render() {
        return (
            <div className="formContainer">
                
                <form onSubmit = {this.handleSubmit}>
                    <div className = "row">
                        <div className = "col-25">
                            <label for="fileName">Image:</label>
                        </div>
                        <div className = "col-75">
                            <input id = "fileName" type="file" accept='image/png' onChange={this.handleFile}/>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label for="title">Title:</label>
                        </div>
                        <div className = "col-75">
                            <input id ="title" type="text" value = {this.state.value} onChange={this.handleName} />
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label for="startingBid">Starting Bid</label>
                        </div>
                        <div className = "col-75">
                            <input type="number" step = "0.01" min = "0"  id="startingBid" value = {this.state.startingBid} onChange = {this.handleStartingBid}/>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label for="marketPrice">Market Price</label>
                        </div>
                        <div className = "col-75">
                            <input type="number" step = "0.01" min = "0"  id="marketPrice" value = {this.state.marketPrice} onChange = {this.handleMarketPrice}/>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label for="desc">Description of Item:</label>
                        </div>
                        <div className = "col-75">
                            <textarea id="desc" type="text" value = {this.state.desc} onChange={this.handleDesc} />
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label for ="category">Category:</label>
                        </div>
                        <div className = "col-75">
                            <select id="category" value = {this.state.category} onChange={this.handleCategory}>
                                <option value="Other">Other</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Home">Home</option>
                            </select>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label for = "condition">Condition:</label>
                        </div>
                        <div className = "col-75">
                            <select id="condition" onChange={this.handleCondition}>
                                <option value="New">New</option>
                                <option value="Used">Used</option>
                            </select>
                        </div>
                    </div>
                    <div className ="row">
                        <input type="submit" value = "Submit" />
                    </div>
                </form>
                
            </div>
        )
    }
  }
