import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';

const Header = ({cartLength}) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container">
                <NavLink className="navbar-brand" to="/">KenList</NavLink>
                <div>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/additem"}><i className="fa fa-plus mr-2"
                                                                          aria-hidden="true" />Add Item</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/profile"}><i className="fa fa-user mr-2"
                                                                          aria-hidden="true" />Profile</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/cart"}><i className="fa fa-shopping-cart mr-2"
                                                                          aria-hidden="true" />Wishlist</NavLink>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </nav>
    );
};


const mapStateToProps = (state) => {
};

export default connect(mapStateToProps, null)(Header);