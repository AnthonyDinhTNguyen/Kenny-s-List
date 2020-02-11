import React from 'react';
import Amplify, {Auth, Storage } from 'aws-amplify';
Amplify.configure({
    Auth: {
        IdentityPoolId: 'us-east-1:452e5811-58e7-4cce-8b39-90db30a8eba3',
        region: 'us-east-1',
        userPoolId: 'us-east-1_buFSrhliB',
        userPoolWebClientId: '1qkrcfqgqv63hk594qi92q5hqi',
        mandatorySignIn: true,
        oauth: {
          domain: 'kennyslist.auth.us-east-1.amazoncognito.com',
          scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: 'https://master.d2nmsllsuquwvm.amplifyapp.com',
          redirectSignOut: 'https://master.d2nmsllsuquwvm.amplifyapp.com',
          responseType: 'token'
        }
      },
    Storage: {
        AWSS3: {
            bucket: 'kennyslist0a68ad13e69142fb89779b2dba58e9dd145823-kennyslist', //REQUIRED -  Amazon S3 bucket
            region: 'us-east-1', //OPTIONAL -  Amazon service region
        }
    }
  });
  Storage.configure({
    bucket:'kennyslist0a68ad13e69142fb89779b2dba58e9dd145823-kennyslist',
    level: 'public',
    region:'us-east-1',
    identityPoolId: 'us-east-1:452e5811-58e7-4cce-8b39-90db30a8eba3'
  });

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
