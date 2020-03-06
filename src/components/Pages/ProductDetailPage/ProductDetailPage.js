import React,{useState,useEffect} from 'react';
import {connect} from 'react-redux';
import ProductDetailComponent from '../../ProductDetail/ProductDetail';
import ProductSlider from "../../ProductSlider/ProductSlider";
import API, {graphqlOperation} from "@aws-amplify/api";
import {listItemTables} from "../../../graphql/queries";
const ProductDetail = (props) => {

    const [itemImg, setItemImg] = useState({});
    const [products, setProducts] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            let itemsTuple = [];
            await (API.graphql(graphqlOperation(listItemTables, {limit: 100})).then(e => {
                itemsTuple = e.data.listItemTables.items;
                console.log("1", itemsTuple);
                console.log("2", props.match.params.id);
                const product1 = itemsTuple.find(prod => prod.itemID === props.match.params.id);
                setProducts(itemsTuple);
                setItemImg(product1);
                console.log("aaaa", product1);
            }));
            
        };
        fetchData();
    }, []);

    console.log("124", itemImg);
    console.log("124", itemImg.images);

    console.log("134", props.product);
    console.log("145", props.product.images);
    return (
        <div className="container" style={{padding: '6rem 0'}}>
            <div className="card">
                <div className="row">
                    <ProductSlider images={itemImg.images}/>
                    <ProductDetailComponent product={itemImg}/>
                </div>
            </div>
        </div>
    );
};

// const mapStateToProps = (state, props) =>  {

//     const product = state.items.items.find(product => product.itemID === props.match.params.id);
//     return {
//         product
//     }
// };



// export default connect(mapStateToProps, null)(ProductDetail);
export default ProductDetail;