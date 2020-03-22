import React, { Component } from './node_modules/react';

class Title extends Component {
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
            <div className="page-header">
                <h1>Project 01 - ToDo List <small>ReactJS</small></h1>
            </div>
        )
    }
}

Title.propTypes = {
};
Title.defaultProps = {
}

export default Title;