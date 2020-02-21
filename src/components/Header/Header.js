import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import Amplify, { Auth, Hub,Storage } from 'aws-amplify';

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container">
                <NavLink className="navbar-brand" to="/">KennysList</NavLink>
                <div>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/additem"}><i className="fa fa-plus mr-2"
                                                                          aria-hidden="true" />Add Item</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/profile"}><i className="fa fa-user mr-2"
                                                                          aria-hidden="true" />Selling</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/cart"}><i className="fa fa-shopping-cart mr-2"
                                                                          aria-hidden="true" />BidCart</NavLink>
                        </li>
                        <li className="nav-item" onClick={() => Auth.signOut().then(data => console.log(data)).catch(err => console.log(err))}>
                            <NavLink className="nav-link" to={"/logout"}><i className="fa fa-shopping-cart mr-2"
                                                                          aria-hidden="true" />Logout</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default connect(null)(Header);