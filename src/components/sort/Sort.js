import React, { Component } from './node_modules/react';

class Sort extends Component {
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
            <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    Sort by <span className="caret" />
                </button>
                <ul className="dropdown-menu">
                    <li><a role="button">Name ASC</a></li>
                    <li><a role="button">Name DESC</a></li>
                    <li role="separator" className="divider" />
                    <li><a role="button">Level ASC</a></li>
                    <li><a role="button">Level DESC</a></li>
                </ul>
                <span className="label label-success label-medium">NAME - DESC</span>
            </div>
        )
    }
}

export default Sort;