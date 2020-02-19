import React from 'react';
import {Auth, Storage } from 'aws-amplify';
import { getItemTable,listItemTables } from '../../../graphql/queries';
import { updateItemTable,createItemTable } from '../../../graphql/mutations';
import API, { graphqlOperation } from '@aws-amplify/api';
import uuid from "uuid";
export default class AddItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {value: '', file:'',desc: '',category: 'Other'};
        this.handleName = this.handleName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleDesc = this.handleDesc.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
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
    
    async handleSubmit(event) {
        event.preventDefault();
        const file = this.state.file;
        const title = this.state.value;
        const desc = this.state.desc;
        const cate = this.state.category;
        const uID = uuid.v4();
        const user = (await Auth.currentAuthenticatedUser()).username;
        const time = new Date().toISOString();
        if(file ==''||title==''||desc==''||user==null){
            alert('Missing an input');
            console.log("missing an input");
        }
        else{
            Storage.put(uID, file, {
                level: 'protected',
                contentType: 'image/png'
            })
            .then (result => {Storage.get(uID, {level: 'protected'}
            ).then(r=>
            {API.graphql(graphqlOperation(createItemTable, 
                {input: {itemID: uID.toString(), description: desc,itemOwner:user, 
                    name: title, postTime: time, category: cate, images: [r.substring(0,r.indexOf('?'))]}})).then(e=>{alert('Successful Upload');this.setState({value: '', file:'',desc: '',category: 'Other'});}).catch(err=>console.log(err));}).catch(e=>console.log(e));}
                    ).catch(err => console.log(err));
        }
      }
      async componentDidMount(){
        let itemList = [];
        let currentUser = "";
        try {
            let response = await Auth.currentAuthenticatedUser();
            currentUser = response.username;
          } catch(err) {
              console.log("ERROR: Failed to retrieve username.");
        }

        await API.graphql(graphqlOperation(listItemTables, {filter:{itemOwner:{eq:currentUser}}})).then((evt) => {
            if(evt.data.listItemTables.items!= null){
                evt.data.listItemTables.map((itemDB,i) =>{itemList.push(itemDB);});
            }
        });
        console.log(itemList);

      }
  //images will be validated server side as well
    render() {
        return (
            <div className="container" style={{paddingTop: '6rem'}}>
                
                <form onSubmit = {this.handleSubmit}>
                    <label>
                        Image:
                        <input type="file" accept='image/png' onChange={this.handleFile}/>
                    </label>
                    <label>
                        Title:
                        <input type="text" value = {this.state.value} onChange={this.handleName} />
                    </label>
                    <label>
                        Description of Item:
                        <input type="text" value = {this.state.desc} onChange={this.handleDesc} />
                    </label>
                    <label>
                        Category:
                        <select id="category" onChange={this.handleCategory}>
                            <option value="Other">Other</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Home">Home</option>
                        </select>
                    </label>
                    <input type="submit" value = "Submit" />
                </form>
                
            </div>
        )
    }
  }
