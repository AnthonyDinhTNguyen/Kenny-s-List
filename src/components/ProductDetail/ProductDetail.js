import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {formatMoney} from "../Pipes/priceFormatter";
import {getItemTable, getLatestUserBidTable, listUserBidsTables} from '../../graphql/queries';
import {
    createUserBidsTable,
    updateLatestUserBidTable,
    updateUserBidsTable
} from '../../graphql/mutations';
import {addProductToCart,updateUsername} from "../../actions";
import API, { graphqlOperation } from '@aws-amplify/api'
import { Auth } from 'aws-amplify';

const ProductDetail = (props) => {
    const {
        condition,
        itemID, name, description,marketPrice
    } = props.product;

    const [value, setValue] = useState(null);
    const [BidHistory, setBidHistory] = useState(null);
    const [username, setUsername] = useState('');

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

    useEffect(() => {
        try {
            Auth.currentAuthenticatedUser({
                bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
            }).then(user => {
                setUsername(user.username);
                console.log(`Load additional settings for user: ${user.username}`);
                // TBD
            })
        }
        catch (e) {
            console.log("failed to get username");
        }
    }, []);

    useEffect(() => {

        // Fetch the item data from the server and set the expiration time accordingly.
        if (!expTime)
            return;

        console.log("Get item table is " + getItemTable);

        const fetchData = async () => {
            await (API.graphql(graphqlOperation(getItemTable, {itemID: itemID})).then(e => {
                const curTimeInEpoch = Math.round(new Date().getTime() / 1000);
                const postTimeInEpoch = Math.round((Date.parse(e.data.getItemTable.postTime) / 1000));
                // 604800 = seven days in seconds
                const bidTime = 604800 ;
                const time = bidTime - (curTimeInEpoch - postTimeInEpoch);
                setExpTime(time);
            }).catch(e => {console.log("Failed to retrieve data");}));

            await (API.graphql(graphqlOperation(getItemTable, {itemID: `{itemID}`})).then(e => {
                console.log(e.data.getItemTable.start)

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


    const clearState = () => {
        setValue('');
    };
    const handleChange = e => {
        e.preventDefault();
        console.log
        setValue(e.target.value);
      };

    useEffect(() => {
        const fetchData = async () => {
            await (API.graphql(graphqlOperation(getLatestUserBidTable, {lubtProductID: itemID})).then(e => {
                setBidHistory(e.data.getLatestUserBidTable.BidAmt);
            }).catch(e => {console.log("Failed to retrieve data");}));
        };
        fetchData();
    }, []);

    const handleSubmit = async event => {
        event.preventDefault();
        clearState();

        if(value.trim() === ""){
            setErrorValidation('Bid Value cannot be NULL');
            return;
        }
        const count = parseInt(value, 10);
        if(count <= BidHistory){
            setErrorValidation(`Bid Value must be greater than $${BidHistory}`);
            return;
        }

        setBidHistory(value);
        setErrorValidation('');

        console.log("username submitted bid", username);

        await API.graphql(graphqlOperation(updateLatestUserBidTable,
            {input:{
                lubtProductID: itemID,
                    Username: username,
                    BidAmt: value
                }}));
        let bidding_users = [];
        await API.graphql(graphqlOperation(listUserBidsTables, {filter:{ProductID: {eq:itemID}}})).then((evt) => {
            evt.data.listUserBidsTables.items.forEach(tuple => {
                bidding_users.push(tuple.Username);
            });
        });

        let count_usersBidding = 0;
        for(let i = 0; i < bidding_users.length; i++){
            if(username === bidding_users[i]){
                count_usersBidding +=1;
            }
        }
        if(count_usersBidding > 0){
            await API.graphql(graphqlOperation(updateUserBidsTable,
                {input:{
                        ProductID : itemID,
                        Username: username,
                        BidAmt : value,
                    }}));
        }
        else{
            await API.graphql(graphqlOperation(createUserBidsTable,
                {input:{
                        ProductID: itemID,
                        Username: username,
                        BidAmt : value,
                        Status: "Bidding"
                    }}))
        }


    };


    if(expTime === 0){
        const [winner,setWinner] = useState('');
        useEffect(() => {
            const fetchData = async () => {
                await (API.graphql(graphqlOperation(getLatestUserBidTable, {lubtProductID: itemID})).then(e => {
                    setWinner(e.data.getLatestUserBidTable.Username);
                }).catch(e => {console.log("Failed to retrieve data");}));
            };
            fetchData();
        }, []);

        if(username === winner){
            console.log("won");
                API.graphql(graphqlOperation(updateUserBidsTable,
                    {
                        input: {
                            ProductID: itemID,
                            Username: username,
                            Status: "Won"
                        }
                    }))
            }
        else{
            console.log("Lost");
            API.graphql(graphqlOperation(updateUserBidsTable,
                {
                    input: {
                        ProductID: itemID,
                        Username: username,
                        Status: "Lost"
                    }
                }))
        }

    };

    const onCart = async () => {
        props.dispatch(addProductToCart(props.product));
        props.dispatch(updateUsername(username));
    };

    return (
        <aside className="col-sm-7">
            <article className="card-body p-5">
                <h3 className="title mb-3">{name}</h3>

                <p className="price-detail-wrap">
                <span className="price h3 text-warning">
                    <span className="currency">$</span><span className="num">{formatMoney(marketPrice)} (Market Value)</span>
                </span>
                </p>

                <h6 className="mb-3"><strong>Condition:</strong> {condition}</h6>
                <h6 className="mb-3">
                <strong >Base Bid: $</strong>
                        <span>{BidHistory}</span>
                </h6>
                <h6 className="mb-3">
                <strong>Time Left: </strong><span>{expTimeFormatted()}</span>
                </h6>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h6><strong>Your bid:</strong></h6>
                        <input id={itemID} name="input-field" className="form-control" type="number" value={value} min={BidHistory}
                        placeholder="Your Bid"  onChange={handleChange} />
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
