import React, { Component, Fragment } from 'react';

let checkAllRole = true;

class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            roleInteractives: [],
            isDisplayAddForm: false,
            isDisplayEditForm: false,
            users: [
                // { id: 1, username: 'anhnhv1', phone: '0966997610', roleApp: 'Admin' },
                // { id: 2, username: 'vunt39', phone: '0982720515', roleApp: 'User' },
                // { id: 3, username: 'anhntv40', phone: '0333388315', roleApp: 'User' }
            ],
            roleInteractiveList: [],
            username: '',
            phone: '',
            roleApp: 'Admin',
            filter: {
                username: '', phone: '', roleApp: ''
            },
            roleInteractiveEdit: []
        }

    }

    userInforChange = (event) => {
        if (event.target.checked) {
            checkAllRole = false;
            document.getElementsByClassName("roleInteractive")[0].disabled = true;
            let allRole = [];
            for (let i = 0; i < this.state.roleInteractives.length; i++) {
                allRole.push(this.state.roleInteractives[i].id)
            }
            this.setState({
                roleInteractiveList: allRole
            })


        } else {
            checkAllRole = true;
            document.getElementsByClassName("roleInteractive")[0].disabled = false;
        }
        const target = event.target;
        const value = target.name === 'username' ? target.value : (target.name === 'phone' ? target.value : (target.name === 'roleApp' ? target.value : (target.name === 'roleInteractiveList' ?
            '' : '')));
        const name = target.name;

        this.setState({
            [name]: value
        });

    }

    userInforSubmit = (event) => {
        window.$('.loading').show();
        let user = null;
        if (!checkAllRole) {
            user = {
                id: this.state.id,
                username: this.state.username,
                phone: this.state.phone,
                roleApp: window.$('.roleApp').val(),
                roleInteractiveList: this.state.roleInteractiveList
            }
        } else {
            user = {
                id: this.state.id,
                username: this.state.username,
                phone: this.state.phone,
                roleApp: window.$('.roleApp').val(),
                roleInteractiveList: window.$('.roleInteractive').val()
            }
        }
        let checkExist = true;
        let userList = this.state.users
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].username === user.username) {
                checkExist = false
            }
        }
        if (checkExist) {
            window.apiClient.post(window.url_VA + 'users/post', user).then(res => {
                window.location.reload();
            })
        } else {

            alert("User đã tồn tại!")
            window.$('.loading').hide();
        }

    }

    userInforEdit = (event) => {
        window.$('.loading').show();
        let user = null;
        if (!checkAllRole) {
            user = {
                id: this.state.id,
                username: this.state.username,
                phone: this.state.phone,
                roleApp: window.$('.roleApp').val(),
                roleInteractiveList: this.state.roleInteractiveList
            }
        } else {
            user = {
                id: this.state.id,
                username: this.state.username,
                phone: this.state.phone,
                roleApp: window.$('.roleApp').val(),
                roleInteractiveList: window.$('.roleInteractive').val()
            }
        }
        window.apiClient.post(window.url_VA + 'users/post', user).then(res => {
            window.location.reload();
        })

    }

    componentDidMount() {
        window.$('.loading').show();
        window.apiClient.get(window.url_VA + 'users').then(res => {
            this.setState({ users: res.data })
            window.$('.loading').hide();
        })

        window.apiClient.get(window.url_VA + 'roles').then(res => {
            this.setState({ roleInteractives: res.data })
            window.$('.loading').hide();
        })


    }

    onToggleForm = () => {

        checkAllRole = true;
        this.setState({
            id: 0,
            roleInteractiveEdit: [],
            isDisplayAddForm: !this.state.isDisplayAddForm
        })
    }

    onDeleteForm = (event) => {
        let id = event.target.getAttribute("iduser");
        this.setState({
            id: id
        })
    }

    onConfirmDelete = (event) => {
        window.$('.loading').show();
        let id = this.state.id
        window.apiClient.delete(window.url_VA + `users/delete/${id}`).then(res => {
            window.location.reload();
        })
    }


    onEditForm = (id) => {

        checkAllRole = true;
        this.setState({
            id: null,
            username: null,
            phone: null,
            roleApp: null,
            roleInteractiveEdit: []
        })
        window.apiClient.get(window.url_VA + `users/${id}`).then(res => {
            // console.log(res.data)
            // this.setState({ roleInteractives: res.data })
            let role = res.data.roleApp
            this.setState({
                id: id,
                username: res.data.username,
                phone: res.data.phone,
                roleApp: res.data.roleApp,
                roleInteractiveEdit: res.data.roleInteractiveList
            })
        })

        this.setState({
            isDisplayEditForm: !this.state.isDisplayEditForm
        })


    }

    componentDidUpdate() {
        window.$('.roleInteractive').select2({
            change: this.userInforChange
        })

    }

    changeRoleUser = (event) => {
        const value = window.$(event.target).val();
    }

    onChangeFilter = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.onFilter(
            name === 'username' ? value : this.state.filter.username,
            name === 'phone' ? value : this.state.filter.phone,
            name === 'roleApp' ? value : this.state.filter.roleApp
        );
        this.setState({
            [name]: value
        });
    }

    onFilter = (filterName, filterPhone, filterroleApp) => {
        this.setState({
            filter: {
                username: filterName, phone: filterPhone, roleApp: filterroleApp
            }
        });
    }



    render() {
        var { users, isDisplayAddForm, filter, isDisplayEditForm } = this.state;
        var myTitle = "Người dùng";

        if (filter) {
            if (filter.username) {
                users = users.filter((s) => {
                    return s.username.toLowerCase().indexOf(filter.username.toLowerCase()) !== -1
                });
            }
            if (filter.phone) {
                users = users.filter((s) => {
                    return s.phone.toLowerCase().indexOf(filter.phone.toLowerCase()) !== -1
                })
            }
            if (filter.roleApp) {
                users = users.filter((s) => {
                    return s.roleApp === filter.roleApp
                })
            }
        }

        let elementDatas = users.map((s, index) => {
            return <tr key={index}>
                <td>{index + 1}</td>
                <td>{s.username}</td>
                <td>{s.phone}</td>
                <td>{s.roleApp}</td>
                <td>
                    <button type="button" className="btn btn-xs btn-primary" iduser={s.id} onClick={() => this.onEditForm(s.id)}><i className="fas fa-pen"></i> Sửa</button>&nbsp;
                    <button type="button" className="btn btn-xs btn-danger" iduser={s.id} data-toggle="modal" data-target="#deleteUserModal" onClick={this.onDeleteForm}><i className="fas fa-trash"></i> Xóa</button>
                </td>
            </tr>
        });

        var roleApps = ["Admin", "User"];
        var optRole = roleApps.map((roleApp, index) => {


            if (roleApp === this.state.roleApp) {
                return <option key={index} selected="true" value={roleApp}>{roleApp}</option>
            } else {
                return <option key={index} value={roleApp}>{roleApp}</option>
            }

        });


        let { roleInteractives } = this.state
        let optroleInteractive = null
        if (roleInteractives.length !== 0) {
            optroleInteractive = roleInteractives.map((roleInteractive, index) => {
                let roleEdit = this.state.roleInteractiveEdit
                for (let i = 0; i < roleEdit.length; i++) {
                    if (roleEdit[i] === roleInteractive.id) {
                        return <option selected="true" key={index} value={roleInteractive.id}>{roleInteractive.name}</option>
                    }
                }
                return <option key={index} value={roleInteractive.id}>{roleInteractive.name}</option>

            });
        }

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
                                <label>Tên đăng nhập:</label>
                                <input type="text" value={this.state.username} className="form-control" name="username" id="" onChange={this.userInforChange} placeholder="Nhập tên đăng nhập người dùng" />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Số điện thoại:</label>
                                <input type="text" value={this.state.phone} className="form-control" name="phone" id="" onChange={this.userInforChange} placeholder="Nhập số điện thoại người dùng" />
                            </div>
                            <div className='form-group alignLeft'>
                                <div className="form-group alignLeft">
                                    <label>Quyền ứng dụng:</label>
                                    <select name="roleApp" className="form-control roleApp" value={this.state.roleApp} onChange={this.userInforChange}>
                                        {optRole}
                                    </select>
                                </div>
                            </div>
                            <div className='form-group alignLeft'>
                                <div className="form-group alignLeft">
                                    <label>Role:</label>
                                    <div className="col-md-12">
                                        <div className="col-md-10">
                                            <select onChange={this.changeRoleUser} ref="mySelect" className="form-control select2 roleInteractive" name="roleInteractiveList" multiple="multiple" data-placeholder="Chọn quyền người dùng được hưởng">
                                                {optroleInteractive}
                                            </select>
                                        </div>
                                        <div className="form-group alignLeft col-md-2">
                                            <label className="container">Chọn tất cả
                                                <input name={this.props.name} type="checkbox" onChange={this.userInforChange} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>


                            <button type="button" onClick={this.userInforEdit} className="btn btn-primary"><i className="fas fa-plus"></i>Lưu lại</button> &nbsp;
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
                                <label>Tên đăng nhập:</label>
                                <input type="text" className="form-control" name="username" id="" onChange={this.userInforChange} placeholder="Nhập tên đăng nhập người dùng" />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Số điện thoại:</label>
                                <input type="text" className="form-control" name="phone" id="" onChange={this.userInforChange} placeholder="Nhập số điện thoại người dùng" />
                            </div>
                            <div className='form-group alignLeft'>
                                <div className="form-group alignLeft">
                                    <label>Quyền ứng dụng:</label>
                                    <select name="roleApp" className="form-control roleApp" onChange={this.userInforChange} value={this.state.roleApp}>
                                        {optRole}
                                    </select>
                                </div>
                            </div>
                            <div className='form-group alignLeft'>
                                <div className="form-group alignLeft">
                                    <label>Role:</label>
                                    <div className="col-md-12">
                                        <div className="col-md-10">
                                            <select onChange={this.changeRoleUser} ref="mySelect" className="form-control select2 roleInteractive" name="roleInteractiveList" multiple="multiple" data-placeholder="Chọn quyền người dùng được hưởng">
                                                {optroleInteractive}
                                            </select>
                                        </div>
                                        <div className="form-group alignLeft col-md-2">
                                            <label className="container">Chọn tất cả
                                                <input name={this.props.name} type="checkbox" onChange={this.userInforChange} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>


                            <button type="button" onClick={this.userInforSubmit} className="btn btn-primary"><i className="fas fa-plus"></i>Lưu lại</button> &nbsp;
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
                                        <th className="center">Tên đăng nhập</th>
                                        <th className="center">Số điện thoại</th>
                                        <th className="center">Quyền ứng dụng</th>
                                        <th className="center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td><input type="text" name="username" className="form-control" value={filter.username} onChange={this.onChangeFilter} /></td>
                                        <td><input type="text" name="phone" className="form-control" value={filter.phone} onChange={this.onChangeFilter} /></td>
                                        <td>
                                            <select name="roleApp" className="form-control" value={filter.roleApp} onChange={this.onChangeFilter}>
                                                <option value="">Tất cả</option>
                                                {optRole}
                                            </select>

                                        </td>

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

                <div className="modal fade" id="deleteUserModal" role="dialog" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteUserModalLabel">Xóa người dùng</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Bạn có xác nhận muốn xóa người dùng này?
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

export default Users;
