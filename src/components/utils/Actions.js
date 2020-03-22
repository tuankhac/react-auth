import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from "react-js-pagination";

class Actions extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        window.$('.loading').show();
    }

    render() {
        return (
            <div className="row">
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="ion ion-ios-gear-outline"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">CPU Traffic</span>
                                <span className="info-box-number">90<small>%</small></span>
                            </div>
                            {/* <!-- /.info-box-content --> */}
                        </div>
                        {/* <!-- /.info-box --> */}
                    </div>
                    {/* <!-- /.col --> */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-google-plus"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Likes</span>
                                <span className="info-box-number">41,410</span>
                            </div>
                            {/* <!-- /.info-box-content --> */}
                        </div>
                        {/* <!-- /.info-box --> */}
                    </div>
                    {/* <!-- /.col --> */}
                    {/* <!-- fix for small devices only --> */}
                    <div className="clearfix visible-sm-block"></div>
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="ion ion-ios-cart-outline"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Sales</span>
                                <span className="info-box-number">760</span>
                            </div>
                            {/* <!-- /.info-box-content --> */}
                        </div>
                        {/* <!-- /.info-box --> */}
                    </div>
                    {/* <!-- /.col --> */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="ion ion-ios-people-outline"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">New Members</span>
                                <span className="info-box-number">2,000</span>
                            </div>
                            {/* <!-- /.info-box-content --> */}
                        </div>
                        {/* <!-- /.info-box --> */}
                    </div>
                    {/* <!-- /.col --> */}
                </div>
        );
    }
}

export default Actions;
