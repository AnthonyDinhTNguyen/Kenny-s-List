import React,{useState} from 'react';
import {connect} from 'react-redux';
import ProductDetailComponent from '../../ProductDetail/ProductDetail';
import ProductSlider from "../../ProductSlider/ProductSlider";
import API, {graphqlOperation} from "@aws-amplify/api";
import {listItemTables} from "../../../graphql/queries";
const ProductDetail = (props) => {

    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            await (API.graphql(graphqlOperation(listItemTables, {limit: 100})).then(e => {
                setProducts(e.data.listItemTables.items);
            }).catch(e => {console.log("Failed to retrieve data");}));

        };
        fetchData();
    }, []);

    const product1 = products.find(prod => prod.itemID === props.match.params.id);

    return (
        <div className="container" style={{padding: '6rem 0'}}>
            <div className="card">
                <div className="row">
                    <ProductSlider images={product1.images}/>
                    <ProductDetailComponent product={product1}/>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state, props) =>  {

    const product = state.items.items.find(product => product.itemID === props.match.params.id);
    return {
        product
    }
};



export default connect(mapStateToProps, null)(ProductDetail);
