import React, { Component } from 'react';

class ItemEdit extends Component {
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
    renderLevel = () => {
        const { arrayLevel } = this.props;
        return arrayLevel.map((level, index) => {
            switch (level) {
                case 0:
                    return <option key={index} value={level}>Lowl</option>
                case 1:
                    return <option key={index} value={level}>Medium</option>
                default:
                    return <option key={index} value={level}>High</option>
            }
        });
    }
    render() {
        return (
            <tr>
                <td className="text-center">
                    {this.props.indexEdit}
                </td>
                <td>
                    <input
                        type="text" className="form-control"
                        value={this.props.nameEdit}
                        onChange={(event) => this.props.handleEditInputChange(event.target.value)}
                    />
                </td>
                <td className="text-center">
                    <select className="form-control" value={this.props.levelEdit} 
                    onChange={(event) => this.props.handleEditSelectChange(event.target.value)} >
                        {this.renderLevel()}
                    </select>
                </td>

                <button type="button" className="btn btn-success btn-sm"
                    onClick={() => this.props.handleEditClickSubmit()}>Save
                </button>
            </tr>
        )
    }
}

export default ItemEdit;