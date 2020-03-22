import React, { Component } from 'react';

let intenthas = [];
let allIntent = false;
let allIdIntent = [];
class UserRole extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            isDisplayAddForm: false,
            isDisplayEditForm: false,
            roles: [
            ],
            intents: [],

            filter: {
                name: ''
            },
            name: '',
            filterIntent: {
                intentName: '', type: '', content: '', amountParam: 0, spliter: ''
            },

            intentName: '',
            type: '',
            content: '',
            amountParam: 0,
            spliter: '',
            intentHas: [],
        }
    }

    componentDidMount() {
        window.$('.loading').show();
        window.apiClient.get(window.url_VA + 'roles').then(res => {
            this.setState({ roles: res.data })
            window.$('.loading').hide();
        })

        window.apiClient.get(window.url_VA + 'intents').then(res => {
            this.setState({
                intents: res.data,
            })
            for (var i = 0; i < res.data.length; i++) {
                allIdIntent.push(res.data[i].id)
            }
            window.$('.loading').hide();
        })
    }

    onToggleForm = () => {
        allIntent = false
        this.setState({
            id: 0,
            isDisplayAddForm: !this.state.isDisplayAddForm
        })
    }



    onChangeFilterIntent = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;

        const { filterIntent } = this.state;
        filterIntent[name] = value;

        this.setState({ filterIntent });
    }

    onChangeFilter = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.onFilter(

            name === 'name' ? value : this.state.filter.name,
        );

        this.setState({
            [name]: value
        });
    }

    onDeleteForm = (event) => {
        let id = event.target.getAttribute("idrole");
        this.setState({
            id: id
        })
    }

    onFilterIntent = (filerIntentName, filterType, filterContent, filterAmountParam, filterSpilter) => {
        this.setState({
            filterIntent: {
                intentName: filerIntentName,
                type: filterType,
                content: filterContent,
                amountParam: filterAmountParam,
                spliter: filterSpilter
            }
        })
    }

    roleInforChange = (event) => {
        if (event.target.name === 'name') {
            this.setState({
                name: event.target.value
            })
        }
        if (event.target.name === 'intentUsed') {
            if (event.target.checked) {
                intenthas.push(event.target.getAttribute("idintent"))
            }
            if (!event.target.checked) {
                for (var i = 0; i < intenthas.length; i++) {
                    if (intenthas[i] === event.target.getAttribute("idintent")) {
                        intenthas.splice(i, 1);
                    }
                }
                var x = document.getElementsByName("checkAll")[0];
                x.checked = false;
            }
        } if (event.target.name === 'checkAll') {
            if (event.target.checked) {
                allIntent = true
                let inputs = document.getElementsByTagName("input");
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i].getAttribute("type") === "checkbox") {
                        inputs[i].checked = true
                    }
                }
            } if (!event.target.checked) {
                allIntent = false
                let inputs = document.getElementsByTagName("input");
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i].getAttribute("type") === "checkbox") {
                        inputs[i].checked = false
                    }
                }
                intenthas = [];
            }
        }

        this.setState({
            intentHas: intenthas
        })
    }

    onFilter = (filterName) => {
        this.setState({
            filter: {
                name: filterName,

            }
        });
    }

    roleInforSubmit = (event) => {
        window.$('.loading').show();
        let role = null
        if (allIntent) {
            role = {
                id: this.state.id,
                name: this.state.name,
                intentList: allIdIntent
            }
        } else {
            role = {
                id: this.state.id,
                name: this.state.name,
                intentList: intenthas
            }
        }
        let checkExist = true;
        let roleList = this.state.roles
        for (let i = 0; i < roleList.length; i++) {
            if (roleList[i].name === role.name) {
                checkExist = false
            }
        }
        if (checkExist) {
            window.apiClient.post(window.url_VA + 'roles/post', role).then(res => {
                window.location.reload();
            })
        } else {
            alert("Quyền tương tác đã tồn tại!")
            window.$('.loading').hide();
        }

    }

    roleInforEdit = (event) => {
        let role = null
        if (allIntent) {
            role = {
                id: this.state.id,
                name: this.state.name,
                intentList: allIdIntent
            }
        } else {
            role = {
                id: this.state.id,
                name: this.state.name,
                intentList: intenthas
            }
        }
        window.apiClient.post(window.url_VA + 'roles/post', role).then(res => {
            window.location.reload();
        })

    }

    onEditForm = (id) => {
        allIntent = false

        this.setState({
            id: null,
            name: null,
            intentHas: []
        })

        window.apiClient.get(window.url_VA + `roles/${id}`).then(res => {
            // this.setState({ roleInteractives: res.data })
            this.setState({
                id: id,
                name: res.data.name,
                intentHas: res.data.intentList
            })
            intenthas = res.data.intentList
        })
        this.setState({
            isDisplayEditForm: !this.state.isDisplayEditForm
        })


    }

    onConfirmDelete = (event) => {
        window.$('.loading').show();
        let id = this.state.id
        window.apiClient.delete(window.url_VA + `roles/delete/${id}`).then(res => {
            window.location.reload();
        })
    }

    render() {
        var { roles, isDisplayAddForm, filter, isDisplayEditForm, intents, filterIntent } = this.state;
        var myTitle = "Quyền thao tác";

        if (filter) {
            if (filter.name) {
                roles = roles.filter((s) => {
                    return s.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1
                });
            }
        }

        if (filterIntent) {
            if (filterIntent.intentName) {
                intents = intents.filter((a) => {
                    return a.intentName.toLowerCase().indexOf(filterIntent.intentName.toLowerCase()) !== -1
                });
            }
            if (filterIntent.type) {
                intents = intents.filter((a) => {
                    return a.type.toLowerCase().indexOf(filterIntent.type.toLowerCase()) !== -1
                });
            }
            if (filterIntent.content) {
                intents = intents.filter((a) => {
                    return a.content.toLowerCase().indexOf(filterIntent.content.toLowerCase()) !== -1
                });
            }
            if (filterIntent.amountParam) {
                intents = intents.filter((a) => {
                    return a.amountParam === filterIntent.amountParam;
                });
            }
            if (filterIntent.spliter) {
                intents = intents.filter((a) => {
                    return a.spliter.toLowerCase().indexOf(filterIntent.spliter.toLowerCase()) !== -1
                });
            }
        }
        let elementDataIntents;
        if (intents.length !== 0) {
            elementDataIntents = intents.map((intent, index) => {
                let intentEdit = this.state.intentHas
                for (let i = 0; i < intentEdit.length; i++) {
                    if (intentEdit[i] === intent.id) {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{intent.intentName}</td>
                            <td>{intent.type}</td>
                            <td>{intent.content}</td>
                            <td>{intent.amountParam}</td>
                            <td>{intent.spliter}</td>
                            <td> <div className="alignLeft">
                                <label className="container styleCheck">
                                    <input name="intentUsed" type="checkbox" checked="true" idintent={intent.id} onChange={this.roleInforChange} />
                                    <span className="checkmark"></span>
                                </label>
                            </div></td>
                        </tr>
                    }
                }
                return <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{intent.intentName}</td>
                    <td>{intent.type}</td>
                    <td>{intent.content}</td>
                    <td>{intent.amountParam}</td>
                    <td>{intent.spliter}</td>
                    <td> <div className="alignLeft">
                        <label className="container styleCheck">
                            <input name="intentUsed" type="checkbox" idintent={intent.id} onChange={this.roleInforChange} />
                            <span className="checkmark"></span>
                        </label>
                    </div></td>
                </tr>

            })
        }


        let elementDatas = roles.map((s, index) => {
            return <tr key={index}>
                <td>{index + 1}</td>
                <td>{s.name}</td>
                <td>
                    <button type="button" className="btn btn-xs btn-primary" idrole={s.id} onClick={() => this.onEditForm(s.id)}><i className="fas fa-pen"></i> Sửa</button>&nbsp;
                    <button type="button" className="btn btn-xs btn-danger" idrole={s.id} data-toggle="modal" data-target="#deleteRoleModal" onClick={this.onDeleteForm}><i className="fas fa-trash"></i> Xóa</button>
                </td>
            </tr>
        });

        var eidtForm = !isDisplayEditForm ? '' :
            <div className={isDisplayEditForm ? 'col-xs-12 col-sm-12 col-md-12 col-lg-12' : 'display-none'}>
                <div className="panel panel-danger">
                    <div className="panel-heading" style={{ textAlign: 'left' }}>
                        <h3 className="panel-title">Chỉnh sửa thông tin {myTitle}</h3>
                        <div style={{ float: 'right', marginTop: '-20px', cursor: 'pointer' }} onClick={this.onEditForm}><i className="fas fa-times-circle"></i></div>
                    </div>
                    <div className="panel-body">
                        <form>
                            <div className="form-group alignLeft">
                                <label>Tên quyền :</label>
                                <input type="text" defaultValue={this.state.name} className="form-control" name="name" id="" onChange={this.roleInforChange} placeholder="Nhập tên quyền tương tác" />
                            </div>

                            <div className='form-group alignLeft'>
                                <div className="form-group alignLeft">
                                    <label>Intent:</label>
                                    <div className="form-group alignLeft col-md-12">
                                        <label className="container">Chọn tất cả
                                                <input name="checkAll" type="checkbox" onChange={this.roleInforChange} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                    <div className="col-md-12">
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th className="center">STT</th>
                                                    <th className="center">Tên Intent</th>
                                                    <th className="center">Loại</th>
                                                    <th className="center">Nội dung</th>
                                                    <th className="center">Tổng tham số</th>
                                                    <th className="center">Đơn vị</th>
                                                    <th className="center">Chọn</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td></td>
                                                    <td><input type="text" name="intentName" className="form-control" value={filterIntent.intentName} onChange={this.onChangeFilterIntent} /></td>
                                                    <td><input type="text" name="type" className="form-control" value={filterIntent.type} onChange={this.onChangeFilterIntent} /></td>
                                                    <td><input type="text" name="content" className="form-control" value={filterIntent.content} onChange={this.onChangeFilterIntent} /></td>
                                                    <td><input type="number" name="amountParam" className="form-control" value={filterIntent.amountParam} onChange={this.onChangeFilterIntent} /></td>
                                                    <td><input type="text" name="spliter" className="form-control" value={filterIntent.spliter} onChange={this.onChangeFilterIntent} /></td>
                                                    <td></td>
                                                </tr>
                                                {elementDataIntents}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>

                            <button type="button" onClick={this.roleInforEdit} className="btn btn-primary"><i className="fas fa-plus"></i>Lưu lại</button> &nbsp;
                            <button type="button" className="btn btn-danger" onClick={this.onEditForm}><i className="fas fa-times"></i> Hủy bỏ</button>
                        </form>
                    </div>
                </div>
            </div>;


        var addForm = !isDisplayAddForm ? '' :
            <div className={isDisplayAddForm ? 'col-xs-12 col-sm-12 col-md-12 col-lg-12' : 'display-none'}>
                <div className="panel panel-primary">
                    <div className="panel-heading" style={{ textAlign: 'left' }}>
                        <h3 className="panel-title">Thêm mới {myTitle}</h3>
                        <div style={{ float: 'right', marginTop: '-20px', cursor: 'pointer' }} onClick={this.onToggleForm}><i className="fas fa-times-circle"></i></div>
                    </div>
                    <div className="panel-body">
                        <form>
                            <div className="form-group alignLeft">
                                <label>Tên quyền :</label>
                                <input type="text" className="form-control" name="name" id="" onChange={this.roleInforChange} placeholder="Nhập tên quyền tương tác" />
                            </div>
                            <div className='form-group alignLeft'>
                                <div className="form-group alignLeft">
                                    <label>Intent:</label>
                                    <div className="col-md-12">
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th className="center">STT</th>
                                                    <th className="center">Tên Intent</th>
                                                    <th className="center">Loại</th>
                                                    <th className="center">Nội dung</th>
                                                    <th className="center">Tổng tham số</th>
                                                    <th className="center">Đơn vị</th>
                                                    <th className="center">Chọn</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td></td>
                                                    <td><input type="text" name="intentName" className="form-control" value={filterIntent.intentName} onChange={this.onChangeFilterIntent} /></td>
                                                    <td><input type="text" name="type" className="form-control" value={filterIntent.type} onChange={this.onChangeFilterIntent} /></td>
                                                    <td><input type="text" name="content" className="form-control" value={filterIntent.content} onChange={this.onChangeFilterIntent} /></td>
                                                    <td><input type="number" name="amountParam" className="form-control" value={filterIntent.amountParam} onChange={this.onChangeFilterIntent} /></td>
                                                    <td><input type="text" name="spliter" className="form-control" value={filterIntent.spliter} onChange={this.onChangeFilterIntent} /></td>
                                                    <td></td>
                                                </tr>
                                                {elementDataIntents}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                            <div className="form-group alignLeft col-md-12">
                                <label className="container">Chọn tất cả
                                                <input name="checkAll" type="checkbox" onChange={this.roleInforChange} />
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                            <button type="button" onClick={this.roleInforSubmit} className="btn btn-primary"><i className="fas fa-plus"></i>Lưu lại</button> &nbsp;
                            <button type="button" className="btn btn-danger" onClick={this.onToggleForm}><i className="fas fa-times"></i> Hủy bỏ</button>
                        </form>
                    </div>
                </div>
            </div>;
        return (
            <div>
                <div className="center">
                    <div className="row">
                        <h1>Quản lý {myTitle}</h1>
                        <hr />
                        <div className={(isDisplayAddForm || isDisplayEditForm) ? 'display-none' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                            <div style={{ float: 'right' }}>
                                <button type="button" className="btn btn-success" onClick={this.onToggleForm}><span className="fas fa-plus mr-5"></span> Thêm {myTitle}</button>
                            </div>
                            <p>&nbsp;</p>
                            <br></br>
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th className="center">STT</th>
                                        <th className="center">Tên quyền</th>
                                        <th className="center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td><input type="text" name="name" className="form-control" value={filter.name} onChange={this.onChangeFilter} /></td>
                                        <td></td>
                                    </tr>
                                    {elementDatas}
                                </tbody>
                            </table>
                        </div>
                        {addForm}
                        {eidtForm}
                    </div>
                </div>

                <div className="modal fade" id="deleteRoleModal" role="dialog" aria-labelledby="deleteRoleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteRoleModalLabel">Xóa quyền tương tác</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Bạn có xác nhận muốn xóa quyền tương tác này?
                        </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Hủy</button>
                                <button type="button" className="btn btn-primary" onClick={this.onConfirmDelete}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default UserRole;
