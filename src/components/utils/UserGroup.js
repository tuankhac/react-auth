import React, { Component, Fragment } from 'react';

let allUser = false;
let allRole = false;

class UserGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            isDisplayAddForm: false,
            isDisplayEditForm: false,
            groups: [],
            filter: {
                groupName: '', system: '', systemGroupId: ''
            },
            groupName: '',
            system: '',
            systemGroupId: '',
            users: [],
            roleInteractive: [],
            roles: [],
            userall: [],
            roleall: [],
            userEdit: [],
            roleEdit: []
        }
    }

    componentDidMount() {
        window.$('.loading').show();
        window.apiClient.get(window.url_VA + 'groups').then(res => {
            this.setState({ groups: res.data })
            window.$('.loading').hide();
        })

        window.apiClient.get(window.url_VA + 'users').then(res => {
            this.setState({ userall: res.data })
            window.$('.loading').hide();
        })

        window.apiClient.get(window.url_VA + 'roles').then(res => {
            this.setState({ roleall: res.data })
            window.$('.loading').hide();
        })

    }

    onToggleForm = () => {
        // allIntent = false
        this.setState({
            id: 0,
            isDisplayAddForm: !this.state.isDisplayAddForm
        })
    }


    onChangeFilter = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.onFilter(

            name === 'groupName' ? value : this.state.filter.groupName,
            name === 'system' ? value : this.state.filter.system,
            name === 'systemGroupId' ? value : this.state.filter.systemGroupId
        );

        this.setState({
            [name]: value
        });
    }

    onDeleteForm = (event) => {
        let id = event.target.getAttribute("idgroup");
        this.setState({
            id: id
        })
    }

    groupInforChange = (event) => {
        if (event.target.name === 'groupName') {
            this.setState({
                groupName: event.target.value
            })
        }
        if (event.target.name === 'system') {
            this.setState({
                system: event.target.value
            })
        }
        if (event.target.systemGroupId === 'systemGroupId') {
            this.setState({
                systemGroupId: event.target.value
            })
        }
        const target = event.target;
        const value = target.name === 'groupName' ? target.value : (target.name === 'system' ? target.value : (target.name === 'systemGroupId' ? target.value : (target.name === 'user' ? target.value : (target.name === 'role' ?
            '' : ''))));
        const name = target.name;

        this.setState({
            [name]: value
        });

    }

    onFilter = (filterName, filterSystem, filterSystemGoupId) => {
        this.setState({
            filter: {
                groupName: filterName,
                system: filterSystem,
                systemGroupId: filterSystemGoupId
            }
        });
    }

    groupInforSubmit = (event) => {
        window.$('.loading').show();
        let user, role;
        if (allUser) {
            user = this.state.users
        } else {

            user = window.$('.user').val()
        }


        if (allRole) {
            role = this.state.roles
        } else {

            role = window.$('.role').val()
        }
        let group = {
            id: this.state.id,
            groupName: this.state.groupName,
            system: this.state.system,
            systemGroupId: this.state.systemGroupId,
            users: user,
            roles: role
        }
        let checkExist = true;
        let groupList = this.state.groups
        for (let i = 0; i < groupList.length; i++) {
            if (groupList[i].groupName === group.groupName) {
                checkExist = false
            }
        }
        if (checkExist) {
            window.apiClient.post(window.url_VA + 'groups/post', group).then(res => {
                window.location.reload();
            })
        } else {
            alert("Nhóm đã tồn tại!")
            window.$('.loading').hide();
        }

    }

    groupInforEdit = (event) => {

        let user, role;
        if (allUser) {
            user = this.state.users
        } else {

            user = window.$('.user').val()
        }


        if (allRole) {
            role = this.state.roles
        } else {

            role = window.$('.role').val()
        }
        let group = {
            id: this.state.id,
            groupName: this.state.groupName,
            system: this.state.system,
            systemGroupId: this.state.systemGroupId,
            users: user,
            roles: role
        }
        window.apiClient.post(window.url_VA + 'groups/post', group).then(res => {
            window.location.reload();
        })

    }

    componentDidUpdate() {
        window.$('.user').select2({
            change: this.userChange
        })

        window.$('.role').select2({
            change: this.roleChange
        })

    }

    onEditForm = (id) => {
        allRole = false
        allUser = false
        this.setState({
            id: null,
            groupName: null,
            system: null,
            systemGroupId: null,
            roleEdit: [],
            userEdit: []
        })

        window.apiClient.get(window.url_VA + `groups/${id}`).then(res => {
            // this.setState({ roleInteractives: res.data })
            this.setState({
                id: id,
                groupName: res.data.groupName,
                system: res.data.system,
                systemGroupId: res.data.systemGroupId,
                roleEdit: res.data.roles,
                userEdit: res.data.users
            })
        })
        this.setState({
            isDisplayEditForm: !this.state.isDisplayEditForm
        })


    }

    changeSelect = (event) => {
        if (event.target.name === 'selectUser') {
            if (event.target.checked) {
                allUser = true;
                document.getElementsByClassName('user')[0].disabled = true;
                let all = [];
                for (let i = 0; i < this.state.userall.length; i++) {
                    all.push(this.state.userall[i].id)
                }
                this.setState({
                    users: all
                })
            } else {
                allUser = false;
                document.getElementsByClassName('user')[0].disabled = false;
            }
        }

        if (event.target.name === 'selectRole') {
            if (event.target.checked) {
                allRole = true;
                document.getElementsByClassName('role')[0].disabled = true;
                let all = [];
                for (let i = 0; i < this.state.roleall.length; i++) {
                    all.push(this.state.roleall[i].id)
                }
                this.setState({
                    roles: all
                })
            } else {
                allRole = false;
                document.getElementsByClassName('role')[0].disabled = false;
            }
        }

        if (event.target.name === 'user') {
            allRole = false;
        }
    }

    onConfirmDelete = (event) => {
        window.$('.loading').show();
        let id = this.state.id
        window.apiClient.delete(window.url_VA + `groups/delete/${id}`).then(res => {
            window.location.reload();
        })
    }

    render() {
        var { groups, isDisplayAddForm, filter, isDisplayEditForm } = this.state;
        var myTitle = "Nhóm người dùng";

        if (filter) {
            if (filter.groupName) {
                groups = groups.filter((s) => {
                    return s.groupName.toLowerCase().indexOf(filter.groupName.toLowerCase()) !== -1
                });
            }

            if (filter.system) {
                groups = groups.filter((s) => {
                    return s.system.toLowerCase().indexOf(filter.system.toLowerCase()) !== -1
                });
            }

            if (filter.systemGroupId) {
                groups = groups.filter((s) => {
                    return s.systemGroupId.toLowerCase().indexOf(filter.systemGroupId.toLowerCase()) !== -1
                });
            }
        }

        let { userall } = this.state
        let optusers = null
        if (userall.length !== 0) {
            optusers = userall.map((user, index) => {
                let userEdit = this.state.userEdit
                for (let i = 0; i < userEdit.length; i++) {
                    if (userEdit[i] === user.id) {
                        return <option key={index} selected="true" value={user.id}>{user.username}</option>
                    }
                }
                return <option key={index} value={user.id}>{user.username}</option>
            });
        }

        let { roleall } = this.state
        let optroles = null
        if (roleall.length !== 0) {
            optroles = roleall.map((role, index) => {
                let roleEdit = this.state.roleEdit
                for (let i = 0; i < roleEdit.length; i++) {
                    if (roleEdit[i] === role.id) {
                        return <option key={index} selected="true" value={role.id}>{role.name}</option>
                    }
                }
                return <option key={index} value={role.id}>{role.name}</option>

            });
        }

        let elementDatas = groups.map((s, index) => {
            return <tr key={index}>
                <td>{index + 1}</td>
                <td>{s.groupName}</td>
                <td>{s.system}</td>
                <td>{s.systemGroupId}</td>
                <td>
                    <button type="button" className="btn btn-xs btn-primary" idgroup={s.id} onClick={() => this.onEditForm(s.id)}><i className="fas fa-pen"></i> Sửa</button>&nbsp;
                    <button type="button" className="btn btn-xs btn-danger" idgroup={s.id} data-toggle="modal" data-target="#deleteRoleModal" onClick={this.onDeleteForm}><i className="fas fa-trash"></i> Xóa</button>
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
                                <label>Tên nhóm :</label>
                                <input type="text" value={this.state.groupName} className="form-control groupName" name="groupName" id="" onChange={this.groupInforChange} placeholder="Nhập tên nhóm" />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Tên hệ thống :</label>
                                <input type="text" value={this.state.system} className="form-control system" name="system" id="" onChange={this.groupInforChange} placeholder="Nhập tên hệ thống" />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Mã hệ thống :</label>
                                <input type="text" value={this.state.systemGroupId} className="form-control" name="systemGroupId" id="" onChange={this.groupInforChange} placeholder="Nhập mã hệ thống" />
                            </div>
                            <div className='form-group alignLeft'>
                                <div className="form-group alignLeft">
                                    <label>Người dùng:</label>
                                    <div className="col-md-12">
                                        <div className="col-md-9">
                                            <select onChange={this.changeSelect} ref="mySelect" className="form-control select2 user" multiple="multiple" data-placeholder="Chọn người dùng trong group">
                                                {optusers}
                                            </select>
                                        </div>
                                        <div className="form-group alignLeft col-md-3">
                                            <label className="container">Chọn tất cả người dùng
                                                <input name='selectUser' type="checkbox" onChange={this.changeSelect} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className='form-group alignLeft'>
                                <div className="form-group alignLeft">
                                    <label>Quyền tương tác:</label>
                                    <div className="col-md-12">
                                        <div className="col-md-9">
                                            <select onChange={this.changeSelect} ref="mySelect" className="form-control select2 role" multiple="multiple" data-placeholder="Chọn quyền tương tác">
                                                {optroles}
                                            </select>
                                        </div>
                                        <div className="form-group alignLeft col-md-3">
                                            <label className="container">Chọn tất cả quyền tương tác
                                                <input name='selectRole' type="checkbox" onChange={this.changeSelect} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <button type="button" onClick={this.groupInforEdit} className="btn btn-primary"><i className="fas fa-plus"></i>Lưu lại</button> &nbsp;
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
                                <label>Tên nhóm :</label>
                                <input type="text" className="form-control" name="groupName" id="" onChange={this.groupInforChange} placeholder="Nhập tên nhóm" />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Tên hệ thống :</label>
                                <input type="text" className="form-control" name="system" id="" onChange={this.groupInforChange} placeholder="Nhập tên hệ thống" />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Mã hệ thống :</label>
                                <input type="text" className="form-control" name="systemGroupId" id="" onChange={this.groupInforChange} placeholder="Nhập mã hệ thống" />
                            </div>
                            <div className='form-group alignLeft'>
                                <div className="form-group alignLeft">
                                    <label>Người dùng:</label>
                                    <div className="col-md-12">
                                        <div className="col-md-9">
                                            <select onChange={this.changeSelect} ref="mySelect" className="form-control select2 user" multiple="multiple" data-placeholder="Chọn người dùng trong group">
                                                {optusers}
                                            </select>
                                        </div>
                                        <div className="form-group alignLeft col-md-3">
                                            <label className="container">Chọn tất cả người dùng
                                                <input name='selectUser' type="checkbox" onChange={this.changeSelect} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className='form-group alignLeft'>
                                <div className="form-group alignLeft">
                                    <label>Quyền tương tác:</label>
                                    <div className="col-md-12">
                                        <div className="col-md-9">
                                            <select onChange={this.changeSelect} ref="mySelect" className="form-control select2 role" multiple="multiple" data-placeholder="Chọn quyền tương tác">
                                                {optroles}
                                            </select>
                                        </div>
                                        <div className="form-group alignLeft col-md-3">
                                            <label className="container">Chọn tất cả quyền tương tác
                                                <input name='selectRole' type="checkbox" onChange={this.changeSelect} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <button type="button" onClick={this.groupInforSubmit} className="btn btn-primary"><i className="fas fa-plus"></i>Lưu lại</button> &nbsp;
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
                                        <th className="center">Tên nhóm</th>
                                        <th className="center">Hệ thống</th>
                                        <th className="center">Mã hệ thống</th>
                                        <th className="center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td><input type="text" name="groupName" className="form-control" value={filter.groupName} onChange={this.onChangeFilter} /></td>
                                        <td><input type="text" name="system" className="form-control" value={filter.system} onChange={this.onChangeFilter} /></td>
                                        <td><input type="text" name="systemGroupId" className="form-control" value={filter.systemGroupId} onChange={this.onChangeFilter} /></td>
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
                                <h5 className="modal-title" id="deleteRoleModalLabel">Xóa nhóm người dùng</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Bạn có xác nhận muốn xóa nhóm này?
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

export default UserGroup;
