import React, { Component } from 'react';
import axios from 'axios';

class ProjectBot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplayAddForm: false,
            projects: [],
            filter: {
                name: '',
                description: '',
                status: -1
            },
            isEdit: false,
            currP: {},
            PageId: 1,
            RowsPerPage: 20
        }
    }

    onToggleForm = (value, index) => {
        this.setState({
            isDisplayAddForm: false
        });
        if (index === undefined || index === -1) {
            this.setState({
                isEdit: false,
                currP: {}
            });
        } else {
            let ca = {};
            let a = this.state.projects;
            for (var i = 0; i < a.length; i++) {
                if (a[i].Id === index) {
                    ca = a[i];
                    break;
                }
            }
            this.setState({
                isEdit: true,
                currP: ca
            })
        }
        this.setState({
            isDisplayAddForm: value
        });
    }
    componentDidMount = () => {
        this.getData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("shouldComponentUpdate");
        console.log(nextState);
        var ci = this.state.currP.Id ? this.state.currP.Id : 0;
        var ni = nextState.currP.Id ? nextState.currP.Id : 0;
        return true;
    }

    getData = (e) => {
        if (e) e.preventDefault();
        const obj = {
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage
        };
        axios.post(window.url_config + 'get_projects', obj)
            .then(res => {
                this.setState({
                    projects: res.data.Data !== undefined ? res.data.Data : []
                });
            })

    }

    onChangeFilter = (event) => {
        var target = event.target;
        var name = target.Name;
        var value = target.value;
        this.onFilter(
            name === 'Name' ? value : this.state.filter.Name,
            name === 'Description' ? value : this.state.filter.Description,
            name === 'Status' ? value : this.state.filter.Status
        );
        this.setState({
            [name]: value
        });
    }

    onFilter = (filterName, filterDesc, filterStatus) => {
        filterStatus = parseInt(filterStatus, 10);
        this.setState({
            filter: {
                name: filterName,
                description: filterDesc,
                status: filterStatus
            }
        });
    }

    onChangText = (event) => { }

    updateAction = (e) => {
        e.preventDefault();
        var _Id = 0, _uri = "insert_project";
        if (this.state.isEdit) {
            _Id = this.state.currP.Id;
            _uri = "update_project";
        }
        var _name = this.refs.Name.value;
        if (_name.trim().length === 0) {
            alert("Bạn chưa nhập tên project");
            this.refs.Name.focus();
            return;
        }
        const obj = {
            Id: _Id,
            Name: _name,
            Description: this.refs.Description.value
        };
        if (window.confirm("Bạn chắc chắn muốn lưu lại?")) {
            axios.post(window.url_config + '' + _uri, obj).then(res => {
                console.log(res.data);
                if (res.data.Code === undefined) alert("Cập nhật dữ liệu không thành công. Vui lòng kiểm tra server");
                else {
                    var code = res.data.Code;
                    if (parseInt(code) === 0) {
                        this.getData();
                        alert("Cập nhật dữ liệu thành công");
                        this.onToggleForm(false, -1);
                    } else {
                        alert("Lỗi: " + res.data.Message);
                    }
                }
            })
        }
    }

    delete = (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa Project này?")) {
            axios.post(window.url_config + 'delete_project', { Id: id }).then(res => {
                if (res.data.Code === undefined) alert("Xóa dữ liệu không thành công. Vui lòng kiểm tra server");
                else {
                    var code = res.data.Code;
                    if (parseInt(code) === 0) {
                        this.getData();
                        alert("Xóa dữ liệu thành công");
                    } else {
                        alert("Lỗi: " + res.data.Message);
                    }
                }
            })
        }
    }

    render() {
        var myTitle = "Project";
        var { projects, isDisplayAddForm, filter, currP } = this.state;

        var plusForm = !isDisplayAddForm ? '' :
            <div className={isDisplayAddForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''}>
                <div className="panel panel-danger">
                    <div className="panel-heading" style={{ textAlign: 'left' }}>
                        <h3 className="panel-title">Cập nhật {myTitle}</h3>
                        <div style={{ float: 'right', marginTop: '-20px', cursor: 'pointer' }} onClick={() => this.onToggleForm(false, -1)}><i className="fas fa-times-circle"></i></div>
                    </div>
                    <div className="panel-body">
                        <form>
                            <div className="form-group alignLeft">
                                <label>Tên {myTitle}:</label>
                                <input type="text" className="form-control" name="Name" ref="Name" defaultValue={this.state.isEdit ? this.state.currP.Name : ""} onChange={this.onChangeText} placeholder="Nhập Tên project" />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Mô tả:</label>
                                <textarea className="form-control" rows="3" name="Description" ref="Description" placeholder="Nhập mô tả cho project" defaultValue={currP.Description} onChange={this.onChangeText}></textarea>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={this.updateAction}><i className="fas fa-plus"></i> Lưu lại</button> &nbsp;
                        <button type="button" className="btn btn-danger" onClick={() => this.onToggleForm(false, -1)}><i className="fas fa-times"></i> Hủy bỏ</button>
                        </form>
                    </div>
                </div>
            </div>;
        /*
        if(filter){
            if(filter.Name){
                projects = projects.filter((project) => {
                    return project.Name.toLowerCase().indexOf(filter.Name.toLowerCase()) !== -1
                });
            }
            if(filter.Description){
                projects = projects.filter((project) => {
                    return project.Description.toLowerCase().indexOf(filter.Description.toLowerCase()) !== -1
                });
            }
            if(filter.Status !== -1){
                projects = projects.filter((project) => {
                    return project.Status === filter.Status
                });
            }
        }*/

        let elementProject = projects.map((project, index) => {
            var pStatus = project.Status === 1 ? "Đã khởi tạo" :
                <button type="button" className="btn btn-xs btn-info">Tạo Project</button>
            return <tr key={index}>
                <td>{index + 1}</td>
                <td>{project.Name}</td>
                <td>{project.Description}</td>
                <td>{pStatus}</td>
                <td>
                    <button type="button" className="btn btn-xs btn-primary" onClick={() => this.onToggleForm(true, project.Id)}><i className="fas fa-pen"></i> Sửa</button>&nbsp;
                            <button type="button" className="btn btn-xs btn-danger" onClick={() => this.delete(project.Id)}><i className="fas fa-trash"></i> Xóa</button>
                </td>
            </tr>
        });
        return (
            <div className="center">
                <div className="row">
                    <h1>Quản lý {myTitle}</h1>
                    <hr />
                    <div className={isDisplayAddForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                        <div style={{ float: 'right' }}>
                            <button type="button" className="btn btn-success" onClick={this.getData}><span className="fas fa-download mr-5"></span> Lấy dữ liệu</button>&nbsp;
                            <button type="button" className="btn btn-success" onClick={() => this.onToggleForm(true, -1)}><span className="fas fa-plus mr-5"></span> Thêm Project</button>
                        </div>
                        <p>&nbsp;</p>
                        <br></br>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="center">STT</th>
                                    <th className="center">Tên</th>
                                    <th className="center">Mô tả</th>
                                    <th className="center">Trạng thái</th>
                                    <th className="center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td><input type="text" name="name" className="form-control" value={filter.Name} onChange={this.onChangeFilter} /></td>
                                    <td><input type="text" name="description" className="form-control" value={filter.Description} onChange={this.onChangeFilter} /></td>
                                    <td>
                                        <select name="status" className="form-control" value={filter.Status} onChange={this.onChangeFilter}>
                                            <option value={-1}>Tất cả</option>
                                            <option value={0}>Chưa khởi tạo</option>
                                            <option value={1}>Đã khởi tạo</option>
                                        </select>
                                    </td>
                                    <td></td>
                                </tr>
                                {elementProject}
                            </tbody>
                        </table>
                    </div>
                    {plusForm}
                </div>
            </div>
        );
    }

}

export default ProjectBot;
