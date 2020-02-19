import React, {useState, useEffect} from 'react';
import {connect, useSelector, useDispatch} from 'react-redux';
import {formatMoney} from "../Pipes/priceFormatter";
import { getItemTable } from '../../graphql/queries';
import {addProductToCart,updateUsername} from "../../actions";
import axios from 'axios';
import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from '../../aws-exports';

API.configure(awsconfig);
PubSub.configure(awsconfig);

Amplify.configure({
    Auth: {
      IdentityPoolId: 'us-east-1:452e5811-58e7-4cce-8b39-90db30a8eba3',
      region: 'us-east-1',
      userPoolId: 'us-east-1_buFSrhliB',
      userPoolWebClientId: '1qkrcfqgqv63hk594qi92q5hqi',
      mandatorySignIn: true,
      oauth: {
        domain: 'kennyslist.auth.us-east-1.amazoncognito.com',
        scope: ['phone','email','profile','openid','aws.cognito.signin.user.admin'],
        redirectSignIn: 'https://master.d2nmsllsuquwvm.amplifyapp.com',
        redirectSignOut: 'https://master.d2nmsllsuquwvm.amplifyapp.com',
        responseType: 'token'
      }
    }
    });

const ProductDetail = (props) => {
    const {
        title,
        condition,
        price,
        description,
        id
    } = props.product;


    const [value, setValue] = useState('');
    const [BidHistory, setBidHistory] = useState({});
    const [username, serUsername] = useState('');
    const [error, setError] = useState(null);
    const [expTime, setExpTime] = useState(0);
    const [errorValidation, setErrorValidation] = useState('');

    const expTimeFormatted = () => {
        var time = expTime
        const days = Math.floor(time / 86400)
        time = time % 86400
        const hours = Math.floor(time / 3600)
        time = time % 3600
        const minutes = Math.floor(time / 60)
        time = time % 60
        const seconds = time

        var formattedTime = ""

        if (days) formattedTime += days + "d ";
        if (hours) formattedTime += hours + "h ";
        if (minutes) formattedTime += minutes + "m ";

        formattedTime += seconds + "s ";

        return formattedTime;
    };

    // Fetch the item data from the server and set the expiration time accordingly.
    useEffect(() => {
        if (!expTime)
            return;

        console.log("Get item table is " + getItemTable);

        const fetchData = async () => {
            await (API.graphql(graphqlOperation(getItemTable, {itemID: "f392jf093j9aijfslijdfkz"})).then(e => {
                const curTimeInEpoch = Math.round(new Date().getTime() / 1000);
                const postTimeInEpoch = Math.round((Date.parse(e.data.getItemTable.postTime) / 1000));
                // 604800 = seven days in seconds
                const bidTime = 604800 ;
                const time = bidTime - (curTimeInEpoch - postTimeInEpoch);
                setExpTime(time);
            }).catch(e => {console.log("Failed to retrieve data");}));

        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!expTime) return;

        const interval = setInterval(() => {
            setExpTime(expTime - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [expTime]);

    useEffect(() => {
        try {
            setError(null);

            Auth.currentAuthenticatedUser({
                bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
            }).then(user => {
                serUsername(user.username);
                console.log(`Load additional settings for user: ${user.username}`);
            }).catch(err => setError(err));
        }
        catch (e) {
            setError(e);
        }
    }, []);


    const clearState = () => {
        setValue('');
    };
    const handleChange = e => {
        setValue(e.target.value);
      };

    const  handleSubmit = async event => {
        event.preventDefault();
        const bidhistory = {'BidAmt': value};

        if(value.length === 0){
            setErrorValidation('Bid Value cannot be NULL');
        }
        else if(value <= BidHistory.BidAmt){
            setErrorValidation(`Bid Value must be greater than $${BidHistory.BidAmt}`);
        }
        else {
            setBidHistory(bidhistory);
            setErrorValidation('');
            clearState();
            await axios.post('https://l4px6d2via.execute-api.us-east-1.amazonaws.com/default/postLatestUserBid',
                {BidAmt: value, ProductID: `${id}`, Username: `${username}`}
            );
            await axios.post('https://emui48mq2j.execute-api.us-east-1.amazonaws.com/default/serverlessApp',
                {Username: `${username}`, ProductID: id, BidAmt: value, Status: `Bidding`}
            );

        }

    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get
            (`https://9mu1bkcave.execute-api.us-east-1.amazonaws.com/default/FetchUserBidFunc?ProductID=${id}`,);
            setBidHistory(result.data);
        };
        fetchData();
    }, [id]);

    const onCart = async () => {
        props.dispatch(addProductToCart(props.product));
        props.dispatch(updateUsername(username));
    };


    if(expTime === 0){
        let status;
        const [winner,setWinner] = useState('');
;        useEffect(() => {
            const fetchData = async () => {
                const result = await axios.get
                (`https://9mu1bkcave.execute-api.us-east-1.amazonaws.com/default/FetchUserBidFunc?ProductID=${id}`,);
                setWinner(result.data.Username);
            };
            fetchData();
        }, [id]);

        if(username === winner){
            console.log("won");
            axios.post('https://emui48mq2j.execute-api.us-east-1.amazonaws.com/default/serverlessApp',
                {Username: `${username}`, ProductID: id, BidAmt: value, Status: `Won`});
        }else{
            console.log("Lost");
            aaxios.post('https://emui48mq2j.execute-api.us-east-1.amazonaws.com/default/serverlessApp',
                {Usernme: `${username}`, ProductID: id, BidAmt: value, Status: `Lost`});
        }

    }

    return (
        <aside className="col-sm-7">
            <article className="card-body p-5">
                <h3 className="title mb-3">{title}</h3>

                <p className="price-detail-wrap">
                <span className="price h3 text-warning">
                    <span className="currency">$</span><span className="num">{formatMoney(price)} (Market Value)</span>
                </span>
                </p>

                <h6 className="mb-3"><strong>Condition:</strong> {condition}</h6>
                <h6 className="mb-3">
                <strong >Base Bid: $</strong>
                        {BidHistory.BidAmt != null ?( <span>{BidHistory.BidAmt}</span>):(<span>0</span>)}
                </h6>
                <h6 className="mb-3">
                <strong>Time Left: </strong><span>{expTimeFormatted()}</span>
                </h6>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h6><strong>Your bid:</strong></h6>
                        <input id={id} name="input-field" className="form-control" type="number" value={value}
                        placeholder="Your Price"  onChange={handleChange} />
                    </div>
                    {errorValidation.length > 0 ? (<div style={{color: 'red'}}>{errorValidation}</div>):(<div></div>)}

                    <input onClick={onCart} type="submit" className="mt-2" value="Place Bid" disabled={expTime===0}/>
                </form>
                <hr/>
                <dl className="item-property">
                    <dt>Description</dt>
                    <dd><p className="text-capitalize">{description}</p></dd>
                </dl>
            </article>
        </aside>
    );
};

export default connect()(ProductDetail);
