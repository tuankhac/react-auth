import React, { Component } from 'react';
import axios from 'axios';

import TaskForm from './tasks/TaskForm';
import TaskList from './tasks/TaskList';

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

    updateAction = (data) => {
        console.log(data);
        var _Id = 0, _uri = "insert_project";
        if (typeof data.Id !== undefined && data.Id > 0) {
            _Id = data.Id;
            _uri = "update_project";
        }

        if (typeof data.Name === undefined || data.Name.length === 0) {
            alert("Vui lòng nhập tên Project");
            return;
        }

        if (window.confirm("Bạn chắc chắn muốn lưu lại?")) {
            const obj = {
                Id: _Id,
                Name: data.Name,
                Description: data.Description
            };

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
                <TaskForm
                    task={currP}
                    title={myTitle}
                    onCloseForm={() => this.onToggleForm(false, -1)}
                    onSubmit={this.updateAction}
                />
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
                        <TaskList tasks={projects} title={myTitle} filter={filter} />
                    </div>
                    {plusForm}
                </div>
            </div>
        );
    }

}

export default ProjectBot;
