import React, { Component } from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";

class Training extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplayAddForm: false,
            isExecuting: false,
            project: {},
            lstprojects: [],
            currProject: '',
            histories: [],
            filter: { project_id: '', version: '' },
            PageId: 1,
            RowsPerPage: 15,
            RowsTotalPage: 15,
            currVersion: 0,
            lstversions: [],
            showModal: false,
            tests: [
            ]
        }
    }
    onToggleForm = () => {
        // if(!this.state.project.Id){
        //     alert("Bạn chưa chọn Bot!");
        //     return;
        // }
        if (this.refs.currProject.value.length === 0) {
            alert("Bạn chưa chọn Bot!");
            return;
        }
        var isExecuting = this.state.isExecuting;
        if (isExecuting) {
            alert("Tiến trình Huấn luyện đang thực hiện, vui lòng chờ trong giây lát");
        } else {
            if (window.confirm("Bạn chắc chắn muốn thực hiện?")) {
                this.setState({
                    isExecuting: true
                })
                window.$('.loading').show();

                var url_train = "http://10.240.232.141:8082/api/training/";
                var obj = {
                    "project_id": this.state.project.Id,
                    "project_name": this.state.project.Name,
                    "version": "ver" + this.state.project.Version
                };
                axios.post(url_train, obj)
                    .then(res => {
                        var status = 0;
                        var version = this.state.project.Version;
                        var token = localStorage.getItem('tokenChatbot');
                        if (res.data.status && res.data.status === 1) {
                            alert("Huấn luyện thành công!");
                            status = 1;
                            version = (parseFloat(version) + parseFloat(0.1)).toFixed(1);
                        } else {
                            alert("Huấn luyện không thành công, vui lòng thử lại!");
                        }
                        //var pid = this.state.project.Id;
                        //console.log((parseFloat(version)+parseFloat(0.1)).toFixed(1));
                        obj = {
                            ProjectId: this.state.project.Id,
                            Status: status,
                            Version: version,
                            Note: "",
                            User: token
                        };
                        axios.post(window.url_config + 'update_training', obj)
                            .then(res => {
                                if (res.data.Code !== undefined && res.data.Code === 0) {
                                    this.getData();
                                    this.getProject();
                                }
                                this.setState({
                                    isExecuting: false,
                                    currProject: '',
                                    currVersion: '',
                                    lstversions: [],
                                    filter: { project_id: '', version: '' }
                                })
                                this.refs.currProject.value = '';
                                //this.refs.currVersion.value='';
                            });
                        window.$('.loading').hide();
                    });
            }
        }
    }

    onTest = () => {
        // if(!this.state.project.Id){
        //     alert("Bạn chưa chọn Bot!");
        //     return;
        // }
        if (this.refs.currProject.value.length === 0) {
            alert("Bạn chưa chọn Bot!");
            return;
        }
        this.setState({
            isDisplayAddForm: !this.state.isDisplayAddForm
        })
    }

    componentDidMount = () => {
        window.$('.loading').show();
        this.getProject();
        this.getData();
    }
    getProject = () => {
        window.$('.loading').show();
        const obj = {
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage
        };
        axios.post(window.url_config + 'get_projects', obj)
            .then(res => {
                this.setState({
                    lstprojects: res.data.Data !== undefined ? res.data.Data : [],
                    currProject: res.data.Data[0].Id,
                    currVersion: res.data.Data[0].Version
                });
                window.$('.loading').hide();
            })
    }
    componentDidUpdate() {
        if (this.newData) this.newData.scrollIntoView({ behavior: "smooth" })
    }
    reloadData = () => {
        this.setState({
            histories: []
        })
        this.getData();
    }
    getData = (e) => {
        if (e) e.preventDefault();
        const obj = {
            ProjectId: '',
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage
        };
        axios.post(window.url_config + 'get_training_histories', obj)
            .then(res => {
                this.setState({
                    histories: res.data.Data !== undefined ? res.data.Data : [],
                    RowsTotalPage: res.data.Data.length
                });
                window.$('.loading').hide();
            })

    }

    onSelectProject = (event) => {
        var target = event.target;
        var value = {};
        var version = 0;
        var lstversion = [];
        var rowtotal = 0;

        if (target.name === 'currProject') {
            window.$('.loading').show();
            var project = this.state.lstprojects.filter((p) => {
                return p.Id === parseInt(target.value)
            });
            if (!isNaN(parseInt(target.value))) {
                for (let i = 0; i < this.state.histories.length; i++) {
                    var prid = this.state.histories[i].ProjectId;
                    if (parseInt(prid) === parseInt(target.value)) {
                        rowtotal = rowtotal + 1;
                    }
                }
            } else {
                rowtotal = this.state.histories.length;
            }

            value = project[0];
            if (!value) value = {};
            if (project[0]) {
                version = parseFloat(project[0].Version);
            }

            const obj = {
                ProjectId: target.value
            };
            axios.post(window.url_config + 'get_versions', obj)
                .then(res => {
                    lstversion = res.data.Data !== undefined ? res.data.Data : [];
                    this.setState({
                        project: value,
                        filter: { project_id: parseInt(target.value) },
                        lstversions: lstversion,
                        currVersion: version,
                        PageId: 1,
                        RowsTotalPage: rowtotal
                    })
                    window.$('.loading').hide();
                });

            sessionStorage.setItem('myProject', JSON.stringify(value));
        }
        if (target.name === 'currVersion') {
            window.$('.loading').show();
            project = this.state.lstprojects.filter((p) => {
                return p.Id === parseInt(this.refs.currProject.value);
            });
            value = project[0];
            if (!value) value = {};
            this.setState({
                project: value,
                currVersion: target.value,
                PageId: 1
            })
            window.$('.loading').hide();

        }
        //console.log(this.state.histories.length);
    }

    addContent = (event) => {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        keycode = parseInt(keycode);
        if (keycode === 13) {
            this.sendMessage(event);
        }
    }

    sendMessage = (event) => {
        var msg = this.refs.message.value;
        if (msg && msg.length > 0) {
            var arrs = this.state.tests;
            arrs.push({ text: msg, type: 'out', typedata: 'text' });
            this.setState({
                tests: arrs
            });
            this.refs.message.value = "";

            var url_sendMsg = "http://10.240.232.141:8082/api/splitDataAPI/";
            const obj = {
                message: msg
            };
            axios.post(url_sendMsg, obj)
                .then(res => {
                    var data = res.data ? res.data : [];
                    //console.log(data.length);
                    for (var i = 0; i < data.length; i++) {
                        // console.log(data[i].result);
                        arrs.push({ text: data[i].result, type: 'in', typedata: data[i].type });
                    }
                    // console.log(arrs);
                    this.setState({
                        tests: arrs
                    })
                })
        } this.scrolllast();

    }
    scrolllast = () => {
        document.getElementById("lastchat").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
    handlePageChange = (pageNumber) => {
        this.setState({ PageId: pageNumber });
    }
    render() {
        var { histories, filter, tests } = this.state;
        // console.log(filter.project_id);
        if (filter) {
            if (filter.project_id && parseInt(filter.project_id) > 0) {
                histories = histories.filter((h) => {
                    return h.ProjectId === filter.project_id
                });
            }

        }
        var listData = histories.map((h, index) => {
            let startitem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - parseInt(this.state.RowsPerPage);
            let enditem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - 1;
            for (let i = startitem; i <= enditem; i++) {
                if (i === index) {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{h.ProjectName}</td>
                        <td>{h.Version}</td>
                        <td>{h.StatusName}</td>
                        <td>{h.TrainingBy}</td>
                        <td>{h.TrainingTime}</td>
                    </tr>

                }
            }
        });
        var optProjects = this.state.lstprojects.map((project, index) => {
            return <option key={index} value={project.Id}>{project.Name}</option>
        });

        window.$('.loading').hide();
        var listTest = tests.map((t, index) => {

            var ct = "", clname = "";
            if (t.type === "in") {
                if (t.typedata === 'text' || t.typedata === 'image') {
                    ct = t.text;
                    clname = "chat-in";
                } else if (t.typedata === 'button') {
                    ct = t.text.map((b, id) => {
                        return <button key={id} type="button" className="btn btn-default btn-xs" style={{ marginLeft: '1px' }} name="button" value={b.payload} onClick={this.sendMessage}>{b.title}</button>
                    });
                    clname = "btn-in-message";
                }
                //console.log(t);
            } else {
                ct = t.text;
                clname = "chat-out";
            }

            return <div key={index} className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className={clname}>{ct}</div>
            </div>
        });
        var testForm = !this.state.isDisplayAddForm ? '' :
            <div style={{ position: 'fixed', bottom: '0px', right: '0px', width: '28%' }} className={this.state.isDisplayAddForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''}>
                <div className="panel panel-info">
                    <div className="panel-heading" style={{ textAlign: 'left' }}>
                        <h3 className="panel-title">Test</h3>
                        <div style={{ float: 'right', marginTop: '-20px', cursor: 'pointer' }} onClick={this.onTest}><i className="fas fa-times-circle"></i></div>
                    </div>
                    <div className="panel-body" style={{ maxHeight: '350px', overflowY: 'auto', overflowX: 'hidden' }}>
                        <div className="row">
                            {listTest}
                            <br></br>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12"><br></br>&nbsp;</div>
                            <div id='lastchat' ref={(ref) => this.newData = ref} className="col-xs-12 col-sm-12 col-md-12 col-lg-12">&nbsp;</div>

                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 border" style={{ position: 'absolute', bottom: '0px', right: '0px', backgroundColor: 'white' }}>
                            <table className="table" style={{ border: '1px solid #bce8f1' }}>
                                <tbody>
                                    <tr>
                                        <td><input type="text" name="message" ref="message" className="form-control" placeholder="Nhập message" onKeyPress={this.addContent}></input></td>
                                        <td><button type="button" className="btn btn-success" onClick={this.sendMessage}><span className="fas fa-location-arrow"></span> Gửi</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>;
        return (
            <div className="App">

                <div className="row">
                    <div className={this.state.isDisplayAddForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                        <h1>Lịch sử huấn luyện</h1>
                        <hr />
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                {/*<button type="button" className="btn btn-success" onClick={ this.onGetdata }><span className="fas fa-download mr-5"></span> Lấy dữ liệu</button>&nbsp;*/}
                                <div style={{ textAlign: 'left' }} className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2"><h5 >Chọn Bot: </h5></div>
                                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                        <select name="currProject" ref="currProject" className="form-control" defaultValue={this.state.currProject} onChange={this.onSelectProject}>
                                            <option value=''>-- Chọn Bot --</option>
                                            window.$('.loading').show();
                                {optProjects}
                                        </select>
                                    </div>


                                </div>
                                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4" style={{ textAlign: 'right' }}>
                                    {/* <button type="button" className="btn btn-success" onClick={ this.reloadData } disabled={this.state.isDeleting}><span className="fas fa-download mr-5"></span> Lấy dữ liệu</button>&nbsp; */}
                                    {/* <button type="button" className="btn btn-success" onClick={ this.onOpenBackversion } disabled={this.state.isExecuting}>
                            <span className="fas fa-undo"></span> Quay về phiên bản
                        </button>&nbsp; */}
                                    <button type="button" className="btn btn-success" onClick={this.onToggleForm} disabled={this.state.isExecuting}>
                                        <span className="fas fa-sync"></span> Huấn luyện
                        </button>&nbsp;
                            <button type="button" className="btn btn-success" onClick={this.onTest} disabled={this.state.isExecuting}>
                                        <span className="fas fa-play"></span> Test
                            </button>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'center' }}>
                                <h4 className={this.state.isExecuting ? "" : "display-none"}><span className="fas fa-spinner fa-spin"></span> Đang thực hiện</h4>
                            </div>

                        </div>
                        <p>&nbsp;</p>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'center' }}>
                            <h4 className={this.state.project.length === 0 ? "" : "display-none"}><span className="fas fa-spinner fa-spin"></span> Đang tải dữ liệu</h4>
                        </div>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="center">STT</th>
                                    <th className="center">Bot</th>
                                    <th className="center">Phiên bản</th>
                                    <th className="center">Trạng thái</th>
                                    <th className="center">Người thực hiện</th>
                                    <th className="center">Thời gian thực hiện</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listData}

                            </tbody>
                        </table>
                        <Pagination
                            hideDisabled
                            activePage={this.state.PageId}
                            itemsCountPerPage={15}
                            totalItemsCount={this.state.RowsTotalPage}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                        >
                        </Pagination>
                    </div>
                    {testForm}
                </div>
            </div>
        );
    }

}

export default Training;
