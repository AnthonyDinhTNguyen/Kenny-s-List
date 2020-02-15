import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {formatMoney} from "../Pipes/priceFormatter";
import {addProductToCart} from "../../actions";
import axios from 'axios';
import {Auth} from 'aws-amplify';

const ProductDetail = (props) => {
    const {
        title,
        condition,
        price,
        description,
        id
    } = props.product;
    console.log(this.props.res);
    const [value, setValue] = useState('');
    const [BidHistory, setBidHistory] = useState({});
    const [username, serUsername] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            setError(null);

            Auth.currentAuthenticatedUser({
                bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
            }).then(user => {
                serUsername(user.username);
                console.log(`Load additional settings for user: ${user.username}`);
                // TBD
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
        setBidHistory(bidhistory);
        clearState();
        console.log(username);
        await axios.post('https://emui48mq2j.execute-api.us-east-1.amazonaws.com/default/serverlessApp',
            {Username:`${username}`, ProductID:id, BidAmt:value, Status : `Bidding`}
        );
        await axios.post('https://l4px6d2via.execute-api.us-east-1.amazonaws.com/default/postLatestUserBid',
            {BidAmt:`${value}`,ProductID:`${id}`}
        );
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
    };

    return (
        <aside className="col-sm-7">
            <article className="card-body p-5">
                <h3 className="title mb-3">{title}</h3>

                <p className="price-detail-wrap">
                <span className="price h3 text-warning">
                    <span className="currency">$</span><span className="num">{formatMoney(price)} (Market Value)</span>
                </span>
                </p>
                <dl className="param param-feature">
                    <dt>Product ID: {id}</dt>
                </dl>
                <h6 ><strong>Condition:</strong> {condition}</h6>

                <strong>Base Bid: $</strong>
                        {BidHistory.BidAmt != null ?( <span>{BidHistory.BidAmt}</span>):(<span>0</span>)}
                <dl className="param param-feature">
                    <dt>Time Left: <span>6d</span></dt>
                </dl>

                <form onSubmit={handleSubmit}>
                      {/*{ > 0 &&*/}
                        <div>
                          <h6><strong>Your bid:</strong></h6>
                            <input id={id} className="form-control ml-3" type="number" value={value}
                                        min={BidHistory.BidAmt}
                                        placeholder="Your Price"  onChange={handleChange} />
                          </div>

                        <input onClick={onCart} type="submit" className="ml-3" value="Place Bid" />
                      {/* } */}
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
