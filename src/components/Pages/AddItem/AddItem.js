import React from 'react';
import {Auth, Storage } from 'aws-amplify';

export default class AddItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {value: '', file:'',desc: ''};
        this.handleChange = this.handleChange.bind(this);
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
    handleChange(event) {
        this.setState({value: event.target.value});
      }
    handleDesc(event){
        this.setState({desc: event.target.value});
    }
    
    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        const file = this.state.file;
        const name = this.state.value;

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
                        <input type="text" value = {this.state.value} onChange={this.handleChange} />
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
