import React from 'react';
import {Auth, Storage } from 'aws-amplify';

export default class AddItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {value: '', file:'',desc: ''};
        this.handleName = this.handleName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleDesc = this.handleDesc.bind(this);
    }
    onChange(e) {
        const file = e.target.files[0];
        Storage.put('example1.png', file, {
            level: 'protected',
            contentType: 'image/png'
        })
        .then (result => console.log(result))
        .catch(err => console.log(err));
    }
    handleFile(event){
        this.setState({file: event.target.files[0]});
    }
    handleName(event) {//enforce alphanumeric input
        const re = /[^0-9a-zA-Z]/;
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
    }
    
    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        const file = this.state.file;
        const name = this.state.value;
        const desc = this.state.desc;
        console.log(file);
        
        Storage.put(name, file, {
            level: 'protected',
            contentType: 'image/png'
        })
        .then (result => console.log(result))
        .catch(err => console.log(err));
        console.log(this.state.value);
        event.preventDefault();
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
                        Name:
                        <input type="text" value = {this.state.value} onChange={this.handleName} />
                    </label>
                    <label>
                        Description of Item:
                        <input type="text" value = {this.state.desc} onChange={this.handleDesc} />
                    </label>
                    <input type="submit" value = "Submit" />
                </form>
                
            </div>
        )
    }
  }
