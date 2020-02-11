import React from 'react';
import { Storage } from 'aws-amplify';

export default class AddItem extends React.Component {
    onChange(e) {
        const file = e.target.files[0];
        Storage.put('example1.png', file, {
            contentType: 'image/png'
        })
        .then (result => console.log(result))
        .catch(err => console.log(err));
    }
  
    render() {
        return (
            <div className="container" style={{paddingTop: '6rem'}}>
            <form>
                <label>
                    Image:
                    <input
                        type="file" accept='image/png' 
                        onChange={(e) => this.onChange(e)}
                    />
                </label>
            </form>
            </div>
        )
    }
  }
