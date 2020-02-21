import React from 'react';
import './Product.css';

const Product = (props) => {
    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 product">
                <a className="product__link">
                    <img className="card-img-top product__img" src={props.img}/>
                </a>
                <div className="card-body product__text">
                    <h4 className="card-title product__title">
                        <a>Name</a>
                    </h4>
                    <h5 className="product__price">$69</h5>
                    <p className="card-text product__description">Hello world</p>
                </div>
            </div>
        </div>
    );
};

export default Product;
