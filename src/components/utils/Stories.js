import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Pagination from "react-js-pagination";

class Stories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplayAddForm: false,
            stories: [],
            projects: {},//JSON.parse(sessionStorage.getItem('myProject') || {}),
            lstprojects: [],
            currProject: 0,
            filter: {
                name: '',
                project_id: 0
            },
            currIntents: [],
            allIntents: [],
            isEdit: false,
            currStory: {},
            PageId: 1,
            RowsPerPage: 15,
            RowsTotalPage: 15,
            NoteString: '',
            isDeleting: false
        }
    }
    reloadData = () => {
        this.setState({
            stories: []
        })
        this.getData();
    }
    getData = (e) => {
        if (e) e.preventDefault();
        // var myProject = sessionStorage.getItem('myProject');
        // if(myProject === 'undefined' || myProject === null) myProject = {};
        // else myProject = JSON.parse(myProject);
        const obj = {
            ProjectID: this.state.currProject,
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage
        };
        axios.post(window.url_config + 'get_stories', obj)
            .then(res => {
                //console.log(res.data.Data);
                this.setState({
                    stories: res.data.Data !== undefined ? res.data.Data : [],
                    PageId: 1,
                    RowsTotalPage: res.data.Data.length
                });

            })

    }
    handlePageChange = (pageNumber) => {
        this.setState({ PageId: pageNumber });
    }

    getAllIntent = (e) => {
        if (e) e.preventDefault();
        const obj = {
            ProjectId: this.state.projects.Id,
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage,
            StoryId: 0
        };
        axios.post(window.url_config + 'get_intents', obj)
            .then(res => {
                if (res.data.Data !== undefined) {
                    let aIts = [];
                    for (var i = 0; i < res.data.Data.length; i++) {
                        let it = res.data.Data[i];
                        //console.log(it);
                        if (it.Type === 'not_command') {
                            aIts.push({ IntentId: it.Id, IntentName: it.Name });
                        }
                    }
                    this.setState({
                        allIntents: aIts
                    });
                }
            })

    }

    componentDidMount = () => {
        window.$('.loading').show();
        this.getData();
        this.getAllIntent();
        const obj = {
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage
        };
        axios.post(window.url_config + 'get_projects', obj)
            .then(res => {
                this.setState({
                    lstprojects: res.data.Data !== undefined ? res.data.Data : []
                });
                window.$('.loading').hide();
                // if(this.state.lstprojects.length > 0){
                //     sessionStorage.setItem('myProject', JSON.stringify(this.state.projects[0]));
                // }
            })
    }

    onSelectProject = (label, value1) => {
        // var target = event.target;
        var value = {};

        // if (target.name === 'currProject') {
        var project = this.state.lstprojects.filter((p) => {
            return p.Id === parseInt(value1)
        });
        value = project[0];
        if (!value) value = {};
        var ft = this.state.filter;
        ft.project_id = parseInt(value1);
        this.setState({
            projects: value,
            currProject: parseInt(value1),
            filter: ft
        })
        this.onFilter(this.state.filter.name, parseInt(value1));
        // }
    }

    onToggleForm = (value, index) => {
        if (value && (index === undefined || index === -1)) {
            if (parseInt(this.state.currProject) === 0) {
                alert("Bạn chưa chọn Bot!");
                return;
            }
        }
        if (!value) {
            this.getData();
        }
        this.setState({
            isDisplayAddForm: value
        });
        // var myProject = sessionStorage.getItem('myProject');
        // if(myProject === 'undefined' || myProject === null) myProject = {};
        // else myProject = JSON.parse(myProject);
        if (index === undefined || index === -1) {
            this.setState({
                isEdit: false,
                currStory: {},
                currIntents: []
            });
        } else {
            // let ca = this.state.stories[index];
            let ca = {};
            let a = this.state.stories;
            for (var i = 0; i < a.length; i++) {
                if (a[i].Id === index) {
                    ca = a[i];
                    break;
                }
            }
            //console.log(ca);
            this.setState({
                isEdit: true,
                currStory: ca,
                currIntents: ca.Intents === undefined ? [] : ca.Intents
            })
        }
        this.getAllIntent();
    }

    onChangeFilter = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        var rowtotal = 0;
        this.onFilter(
            name === 'name' ? value : this.state.filter.name,
            name === 'currProject' ? value : this.state.filter.project_id
        );
        var pName;
        var pType;
        if (name === 'Name' && value) {
            for (let i = 0; i < this.state.intents.length; i++) {
                pName = this.state.intents[i].Name;
                if (pName.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    rowtotal = rowtotal + 1;
                }
            }
        } else if (name === 'Type' && value) {
            if (value === 'all' && value) {
                rowtotal = this.state.intents.length;
            } else {
                for (let i = 0; i < this.state.intents.length; i++) {
                    pType = this.state.intents[i].Type;
                    if (pType.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                        rowtotal = rowtotal + 1;
                    }
                }
            }
        } else {
            rowtotal = this.state.intents.length;
        }
    }

    onFilter = (filterName, filterProject) => {
        this.setState({
            filter: {
                name: filterName,
                project_id: filterProject
            }
        });
        //console.log(this.state.filter);
    }

    addIntent = (label, value) => {
        var _id = value;
        var _name = label;
        let intents = this.state.currIntents;
        if (_id !== 0) {
            intents.push({ IntentId: _id, IntentName: _name });
            this.setState({
                currIntents: intents
            });
            this.refs.intent.value = 0;
        }
    }

    removeIntent = (index) => {
        let intents = this.state.currIntents;
        intents.splice(index, 1);
        this.setState({
            currIntents: intents
        })
    }

    updateStory = (e) => {
        e.preventDefault();
        var _name = this.refs.storyName.value;
        if (_name.trim().length === 0) {
            alert("Bạn chưa nhập tên story");
            this.refs.storyName.focus();
            return;
        }
        if (_name.trim().length > 45) {
            alert("Tên story quá dài");
            this.refs.storyName.focus();
            return;
        }
        var _Id = 0, _uri = "insert_story", _noti = "Thêm mới dữ liệu thành công";
        if (this.state.isEdit) {
            _Id = this.state.currStory.Id;
            _uri = "update_story";
            _noti = "Cập nhật dữ liệu thành công";
        }
        var _name = this.refs.storyName.value;
        if (_name.trim().length === 0) {
            alert("Bạn chưa nhập tên story");
            this.refs.storyName.focus();
            return;
        }
        if (this.state.currIntents) {
            console.log(this.state.currIntents);
            if (!this.state.currIntents[0]) {
                alert("Bạn chưa chọn Intent");
                this.refs.intent.focus();
                return;
            }
        }
        var selectedIntents = [];
        for (var i = 0; i < this.state.currIntents.length; i++) {
            let order = i + 1;
            selectedIntents.push({ Id: this.state.currIntents[i].IntentId, Order: order });
        }
        const obj = {
            Id: _Id,
            Name: _name,
            Intents: selectedIntents,
            ProjectId: this.state.currProject
        };
        // console.log(this.state.projects);
        // console.log(obj);
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

    deleteStory = (id) => {
        if (id !== null && id !== undefined) {
            if (window.confirm("Bạn chắc chắn muốn xóa Story này?")) {
                this.setState({
                    isDeleting: true
                })
                axios.post(window.url_config + 'delete_story', { Id: id }).then(res => {
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
        } else alert("Dữ liệu cần xóa không xác định");
    }
    onChangelength = (nlen) => {
        if (nlen !== this.state.RowsTotalPage) {
            this.setState({
                PageId: 1,
                RowsTotalPage: nlen
            })
        }
    }

    render() {
        var myTitle = "Stories";
        var { stories, isDisplayAddForm, filter, currIntents, allIntents } = this.state;

        var optProjects = [];
        for (var i = 0; i < this.state.lstprojects.length; i++) {
            optProjects.push({ label: this.state.lstprojects[i].Name, value: this.state.lstprojects[i].Id });
        }
        // var optProjects = this.state.lstprojects.map((project, index) => {
        //     return <option key={index} value={project.Id}>{project.Name}</option>
        // });
        if (filter) {
            if (filter.name) {
                stories = stories.filter((story) => {
                    return story.Name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1
                });
            }
            if (filter.project_id && filter.project_id > 0) {
                stories = stories.filter((story) => {
                    return story.ProjectId === filter.project_id
                });
            }
            this.onChangelength(stories.length);
        }

        let elementDatas = stories.map((story, index) => {
            let startitem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - parseInt(this.state.RowsPerPage);
            let enditem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - 1;
            for (let i = startitem; i <= enditem; i++) {
                if (i === index) {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="alignLeft">{story.Name}</td>
                        <td className="alignLeft">{story.ProjectName}</td>
                        <td>
                            <button type="button" className="btn btn-xs btn-primary" onClick={() => this.onToggleForm(true, story.Id)} disabled={this.state.isDeleting}><i className="fas fa-pen"></i> Sửa</button>&nbsp;
                                    <button type="button" className="btn btn-xs btn-danger" onClick={() => this.deleteStory(story.Id)} disabled={this.state.isDeleting}><i className="fas fa-trash"></i> Xóa</button>
                        </td>
                    </tr>

                }
            }
        });
        let listIntents = currIntents.map((intent, index) => {
            return <div className="row" key={index} style={{ marginTop: '3px', padding: '2px' }}>
                <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10" style={{ textAlign: 'left' }}>
                    <i className="fas fa-plus fa-xs"></i>&nbsp; {intent.IntentName}
                </div>
                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{ textAlign: 'right' }}>
                    <div onClick={() => this.removeIntent(index)} style={{ cursor: 'pointer' }}> <i className="fas fa-times-circle"></i></div>
                </div>
            </div>
        });

        // var intentForSelect = allIntents;
        // for (var i = 0; i < currIntents.length; i++) {
        //     for (var k = 0; k < intentForSelect.length; k++) {
        //         if (intentForSelect[k].IntentId === currIntents[i].IntentId) {
        //             intentForSelect.splice(k, 1);
        //             break;
        //         }
        //     }
        // }

        // let optIntents = intentForSelect.map((intent, index) => {
        //     return <option key={index} value={intent.IntentId}>{intent.IntentName}</option>
        // });
        let optIntents = [];

        for (var i = 0; i < allIntents.length; i++) {
            optIntents.push({ label: allIntents[i].IntentName, value: allIntents[i].IntentId });
        }
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
                                <label>Tên Story:</label>
                                <input type="text" className="form-control" ref="storyName" defaultValue={this.state.isEdit ? this.state.currStory.Name : ""} placeholder="Nhập tên Story" />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Intents:</label>
                                {/* <select className="form-control" ref="intent" defaultValue={0} onChange={this.addIntent}>
                                    <option value={0}>---Chọn Intents---</option>
                                    {optIntents}
                                </select> */}
                                <Select options={optIntents} ref="intent" onChange={opt => this.addIntent(opt.label, opt.value)} />
                                {listIntents}
                            </div>
                            <button type="button" className="btn btn-primary" onClick={this.updateStory} onChange={this.onChangeFilter} disabled={this.state.NoteString !== ''}><i className="fas fa-plus"></i> Lưu lại</button> &nbsp;
                        <button type="button" className="btn btn-danger" onClick={() => this.onToggleForm(false, -1)} onChange={this.onChangeFilter} disabled={this.state.NoteString !== ''}><i className="fas fa-times" ></i> Hủy bỏ</button>
                            <p style={{ textAlign: "center", marginTop: '5px', color: 'blue' }}>{this.state.NoteString}</p>
                        </form>
                    </div>
                </div>
            </div>;
        return (
            <div className="center">
                <div className="row">
                    <h1>Quản lý {myTitle}</h1>
                    <hr />
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'center' }}>
                        <h4 className={this.state.stories.length === 0 ? "" : "display-none"}><span className="fas fa-spinner fa-spin"></span> Đang tải dữ liệu</h4>
                    </div>
                    <div className={isDisplayAddForm ? 'display-none' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div style={{ textAlign: 'left' }} className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"><h5 >Chọn Bot: </h5></div>
                                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                    <Select options={optProjects} ref="currProject" name="currProject" onChange={opt => this.onSelectProject(opt.label, opt.value)} />
                                    {/* <select name="currProject" ref="currProject" className="form-control" defaultValue={this.state.currProject} onChange={this.onSelectProject}>
                                        <option value={0}>-- Chọn Bot --</option>
                                        {optProjects}
                                    </select> */}
                                </div>
                            </div>
                            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4" style={{ textAlign: 'right' }}>
                                {/* <button type="button" className="btn btn-success" onClick={ this.reloadData } disabled={this.state.isDeleting}><span className="fas fa-download mr-5"></span> Lấy dữ liệu</button>&nbsp; */}
                                <button type="button" className="btn btn-success" onClick={() => this.onToggleForm(true, -1)} disabled={this.state.isDeleting}><span className="fas fa-plus mr-5"></span> Thêm {myTitle}</button>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'center' }}>
                            <h4 className={this.state.isDeleting ? "" : "display-none"}><span className="fas fa-spinner fa-spin"></span> Đang thực hiện</h4>
                        </div>
                        <p>&nbsp;</p>
                        {/* <br></br> */}
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="center">STT</th>
                                    <th className="center">Tên</th>
                                    <th className="center">Bot</th>
                                    <th className="center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td><input type="text" name="name" className="form-control" value={filter.name} onChange={this.onChangeFilter} /></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                {elementDatas}
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

export default Stories;
