import React,{Component,useState,useEffect} from 'react';
import {connect} from 'react-redux';
import ProductDetailComponent from '../../ProductDetail/ProductDetail';
import ProductSlider from "../../ProductSlider/ProductSlider";
import API, {graphqlOperation} from "@aws-amplify/api";
import {listItemTables} from "../../../graphql/queries";
// const ProductDetail = (props) => {

//     const [itemImg, setItemImg] = useState({});
//     const [products, setProducts] = useState({});
//     useEffect(() => {
//         const fetchData = async () => {
//             let itemsTuple = [];
//             await (API.graphql(graphqlOperation(listItemTables, {limit: 100})).then(e => {
//                 itemsTuple = e.data.listItemTables.items;
//                 const product1 = itemsTuple.find(prod => prod.itemID === props.match.params.id);
//                 setProducts(itemsTuple);
//                 setItemImg(product1);
//             }));
            
//         };
//         fetchData();
//     }, []);

class ProductDetail extends Component {

    constructor(props){
        super(props);
        this.state = {items: {}};
    }

    async componentDidMount(){
        await API.graphql(graphqlOperation(listItemTables, {limit: 100})).then(e => {
                itemsTuple = e.data.listItemTables.items;
                const product = itemsTuple.find(prod => prod.itemID === props.match.params.id);
                this.setState({items: product})
        });

    }

render(){
    const item = this.props.product;
    return (
        <div className="container" style={{padding: '6rem 0'}}>
           
            <div className="card">
                <div className="row">
                    {console.log("Adsf",this.state.items.images)}
                    {console.log("daf",item.images)}
                    <ProductSlider images={item.images}/>
                    <ProductDetailComponent product={item}/>
                </div>
            </div>
        </div>
    );
}
};

const mapStateToProps = (state, props) =>  {

    const product = state.items.items.find(product => product.itemID === props.match.params.id);
    return {
        product
    }
};

export default connect(mapStateToProps, null)(ProductDetail);
// export default ProductDetail;