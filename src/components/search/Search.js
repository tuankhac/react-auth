import React, { Component } from './node_modules/react';

class Search extends Component {
    constructor(props) {
        super(props)
    }

    // componentWillMount() {
    // }
    // componentDidMount() {
    // }
    // componentWillUnmount() {
    // }
    // componentWillReceiveProps(nextProps) {

    // }
    // shouldComponentUpdate(nextProps, nextState) {
    // }

    // componentWillUpdate(nextProps, nextState) {
    // }
    // componentDidUpdate(prevProps, prevState) {
    // }
    render() {
        return (
            <div className="input-group">
                <input type="text" className="form-control" placeholder="Search item name" />
                <span className="input-group-btn">
                    <button className="btn btn-info" type="button">Clear</button>
                </span>
            </div>
        )
    }
}

export default Search;