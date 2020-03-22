import React, { Component } from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";

class ProjectBot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplayAddForm: false,
            projects: [],
            filter: {
                Name: '',
                Description: '',
                Status: ''
            },
            isEdit: false,
            currP: {},
            PageId: 1,
            RowsPerPage: 15,
            RowsTotalPage: 15,
            NoteString: '',
            isDeleting: false
        }
    }

    onToggleForm = (value, index) => {
        this.setState({
            isDisplayAddForm: false
        });
        if (!value) {     //reload data khi bam huy
            this.getData();
        }
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
        window.$('.loading').show();
        //this.getData();
    }
    reloadData = () => {
        this.setState({
            projects: []
        })
        //this.getData();
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
                    projects: res.data.Data !== undefined ? res.data.Data : [],
                    PageId: 1,
                    RowsTotalPage: res.data.Data.length
                });
                window.$('.loading').hide();
            })

    }
    handlePageChange = (pageNumber) => {
        this.setState({ PageId: pageNumber });
    }

    onChangeFilter = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.onFilter(
            name === 'Name' ? value : this.state.filter.Name,
            name === 'Description' ? value : this.state.filter.Description,
            name === 'Status' ? value : this.state.filter.Status
        );
    }

    onFilter = (filterName, filterDesc, filterStatus) => {
        //filterStatus = parseInt(filterStatus, 10);
        this.setState({
            filter: {
                Name: filterName,
                Description: filterDesc,
                Status: filterStatus
            }
        });
    }

    onChangText = (event) => { }

    updateAction = (e) => {
        e.preventDefault();
        var _Id = 0, _uri = "insert_project", _noti = "Thêm mới dữ liệu thành công";
        if (this.state.isEdit) {
            _Id = this.state.currP.Id;
            _uri = "update_project";
            _noti = "Cập nhật dữ liệu thành công";
        }
        var _name = this.refs.Name.value;
        if (_name.trim().length === 0) {
            alert("Bạn chưa nhập tên Bot");
            this.refs.Name.focus();
            return;
        }
        if (_name.trim().length > 45) {
            alert("Tên Bot quá dài");
            this.refs.Name.focus();
            return;
        }
        const obj = {
            Id: _Id,
            Name: _name,
            Description: this.refs.Description.value
        };
        if (window.confirm("Bạn chắc chắn muốn lưu lại?")) {
            window.$('.loading').show();
            this.setState({ NoteString: "Đang thực hiện, vui lòng chờ trong giây lát" });
            axios.post(window.url_config + '' + _uri, obj).then(res => {
                this.setState({ NoteString: "" });
                if (res.data.Code === undefined) alert("Cập nhật dữ liệu không thành công. Vui lòng kiểm tra server");
                else {
                    var code = res.data.Code;
                    if (parseInt(code) === 0) {
                        this.getData();
                        alert(_noti);
                        this.onToggleForm(false, -1);
                    } else {
                        alert("Lỗi: " + res.data.Message);
                    }
                }
                window.$('.loading').hide();
            })
        }
    }
    onChangelength = (nlen) => {
        if (nlen !== this.state.RowsTotalPage) {
            this.setState({
                PageId: 1,
                RowsTotalPage: nlen
            })
        }
    }
    delete = (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa Bot này?")) {
            this.setState({
                isDeleting: true
            })
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
                this.setState({
                    isDeleting: false
                })
            })
        }
    }

    render() {
        var myTitle = "Bot";
        var { projects, isDisplayAddForm, filter, currP } = this.state;

        var plusForm = !isDisplayAddForm ? '' :
            <div className={isDisplayAddForm ? 'col-xs-12 col-sm-12 col-md-12 col-lg-12' : 'display-none'}>
                <div className="panel panel-danger">
                    <div className="panel-heading" style={{ textAlign: 'left' }}>
                        <h3 className="panel-title">{this.state.isEdit ? "Cập nhật" : "Thêm mới"} {myTitle}</h3>
                        <div style={{ float: 'right', marginTop: '-20px', cursor: 'pointer' }} onClick={() => this.onToggleForm(false, -1)}><i className="fas fa-times-circle"></i></div>
                    </div>
                    <div className="panel-body">
                        <form>
                            <div className="form-group alignLeft">
                                <label>Tên {myTitle}:</label>
                                <input type="text" className="form-control" name="Name" ref="Name" defaultValue={this.state.isEdit ? this.state.currP.Name : ""} onChange={this.onChangeText} placeholder="Nhập Tên Bot" />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Mô tả:</label>
                                <textarea className="form-control" rows="3" name="Description" ref="Description" placeholder="Nhập mô tả cho Bot" defaultValue={currP.Description} onChange={this.onChangeText}></textarea>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={this.updateAction} disabled={this.state.NoteString !== ''}><i className="fas fa-plus"></i> Lưu lại</button> &nbsp;
                        <button type="button" className="btn btn-danger" onClick={() => this.onToggleForm(false, -1)} disabled={this.state.NoteString !== ''}><i className="fas fa-times"></i> Hủy bỏ</button>
                            <p style={{ textAlign: "center", marginTop: '5px', color: 'blue' }}>{this.state.NoteString}</p>
                        </form>
                    </div>
                </div>
            </div>;

        if (filter) {
            if (filter.Name) {
                projects = projects.filter((project) => {
                    return project.Name.toLowerCase().indexOf(filter.Name.toLowerCase()) !== -1
                });
            }
            if (filter.Description) {
                projects = projects.filter((project) => {
                    return project.Description.toLowerCase().indexOf(filter.Description.toLowerCase()) !== -1
                });
            }
            if (filter.Status) {
                projects = projects.filter((project) => {
                    return project.Status === filter.Status
                });
            }
            this.onChangelength(projects.length);
        }

        let elementProject = projects.map((project, index) => {
            let startitem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - parseInt(this.state.RowsPerPage);
            let enditem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - 1;
            var pStatus = project.Status === "2" ? "Đã training" : "Chưa training";
            for (let i = startitem; i <= enditem; i++) {
                if (i === index) {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="alignLeft">{project.Name}</td>
                        <td className="alignLeft">{project.Description}</td>
                        <td>{pStatus}</td>
                        <td>{project.Version}</td>
                        <td>
                            <button type="button" className="btn btn-xs btn-primary" onClick={() => this.onToggleForm(true, project.Id)} disabled={this.state.isDeleting}><i className="fas fa-pen"></i> Sửa</button>&nbsp;
                                    <button type="button" className="btn btn-xs btn-danger" onClick={() => this.delete(project.Id)} disabled={this.state.isDeleting}><i className="fas fa-trash"></i> Xóa</button>
                        </td>
                    </tr>

                }
            }
        });
        return (
            <div className="center">
                <div className="row">
                    <h1>Quản lý {myTitle}</h1>
                    <hr />
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'center' }}>
                        <h4 className={this.state.projects.length === 0 ? "" : "display-none"}><span className="fas fa-spinner fa-spin"></span> Đang tải dữ liệu</h4>
                    </div>
                    <div className={isDisplayAddForm ? 'display-none' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                        <div style={{ float: 'right' }}>
                            {/* <button type="button" className="btn btn-success" onClick={ this.reloadData } disabled={this.state.isDeleting}><span className="fas fa-download mr-5"></span> Lấy dữ liệu</button>&nbsp; */}
                            <button type="button" className="btn btn-success" onClick={() => this.onToggleForm(true, -1)} disabled={this.state.isDeleting}><span className="fas fa-plus mr-5"></span> Thêm Bot</button>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'center' }}>
                            <h4 className={this.state.isDeleting ? "" : "display-none"}><span className="fas fa-spinner fa-spin"></span> Đang thực hiện</h4>
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
                                    <th className="center">Phiên bản</th>
                                    <th className="center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td><input type="text" name="Name" className="form-control" value={filter.Name} onChange={this.onChangeFilter} /></td>
                                    <td><input type="text" name="Description" className="form-control" value={filter.Description} onChange={this.onChangeFilter} /></td>
                                    <td>
                                        <select name="Status" className="form-control" value={filter.Status} onChange={this.onChangeFilter}>
                                            <option value="">Tất cả</option>
                                            <option value="1">Chưa training</option>
                                            <option value="2">Đã training</option>
                                        </select>
                                    </td>
                                    <td></td>
                                </tr>
                                {elementProject}
                            </tbody>
                        </table>
                        <Pagination
                            hideDisabled
                            activePage={this.state.PageId}
                            itemsCountPerPage={15}
                            totalItemsCount={this.state.RowsTotalPage}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                        />

                    </div>
                    {plusForm}
                </div>
            </div>
        );
    }

}

export default ProjectBot;
