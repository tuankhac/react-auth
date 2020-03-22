import React, { Component } from 'react';

class ListItem extends Component {
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
            <div className="panel panel-success">
                <div className="panel-heading">List Item</div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }} className="text-center">#</th>
                            <th>Name</th>
                            <th style={{ width: '15%' }} className="text-center">Level</th>
                            <th style={{ width: '15%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {/* {this.renderItem()} */}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default ListItem;