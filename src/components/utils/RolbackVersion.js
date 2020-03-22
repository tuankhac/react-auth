import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal'

class RolbackVersion extends Component {
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
            RowsPerPage: 20,
            currVersion: 0,
            lstversions: [],
            showModal: false,
            tests: [
            ]
        }
    }
    onBackversion = () => {
        if (this.refs.currProject.value.length === 0) {
            alert("Bạn chưa chọn Bot!");
            return;
        }
        if (this.refs.currVersion.value.length === 0) {
            alert("Bạn chưa chọn phiên bản!");
            return;
        }
        if (!(parseFloat(this.refs.currVersion.value) < parseFloat(this.state.project.Version))) {
            alert("Phiên bản quay về phải nhỏ hơn phiên bản hiện tại " + this.state.project.Version);
            return;
        }
        var isExecuting = this.state.isExecuting;
        if (isExecuting) {
            alert("Tiến trình đang thực hiện, vui lòng chờ trong giây lát");
        } else {
            if (window.confirm("Bạn chắc chắn muốn thực hiện?")) {
                this.setState({
                    isExecuting: true
                })
                window.$('.loading').show();
                var status = 1;
                var version = this.refs.currVersion.value;
                var currversion = this.state.project.Version;
                var pid = this.refs.currProject.value;
                var note = this.refs.currVersion.value;
                var token = localStorage.getItem('tokenChatbot');
                var obj = {
                    ProjectId: pid,
                    Status: status,
                    User: "",
                    Version: version,
                    CurrVersion: currversion,
                    Token: token,
                    Note: note
                };
                axios.post(window.url_config + 'update_training', obj)
                    .then(res => {
                        if (res.data.Code !== undefined && res.data.Code === 0) {
                            alert("Quay về phiên bản thành công!");
                            this.getData();
                            this.getProject();
                        } else {
                            alert("Quay về phiên bản không thành công, vui lòng thử lại!");
                        }
                        this.setState({
                            isExecuting: false,
                            currProject: '',
                            currVersion: '',
                            lstversions: [],
                            showModal: false,
                            filter: { project_id: '', version: '' }
                        })
                        this.refs.currProject.value = '';
                        // this.refs.currVersion.value='';
                        window.$('.loading').hide();
                    });
            }
        }
    }
    onOpenBackversion = () => {
        if (this.refs.currProject.value.length === 0) {
            alert("Bạn chưa chọn Bot!");
            return;
        }
        this.setState({ showModal: true });
    }
    closeModal = () => {
        this.setState({ showModal: false });
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
                    histories: res.data.Data !== undefined ? res.data.Data : []
                });
                window.$('.loading').hide();
            })

    }
    onSelectProject = (label, value1) => {
        // var target = event.target;
        var value = {};
        var version = 0;
        var lstversion = [];


        // if (target.name === 'currProject') {
        var project = this.state.lstprojects.filter((p) => {
            return p.Id === parseInt(value1)
        });
        value = project[0];
        if (!value) value = {};
        if (project[0]) {
            version = parseFloat(project[0].Version);
        }

        if (!value) value = {};
        var ft = this.state.filter;
        ft.project_id = parseInt(value1);
        this.setState({
            projects: value,
            currProject: parseInt(value1),
            filter: ft
        })
        this.onFilter(this.state.filter.name, parseInt(value1));
        const obj = {
            ProjectId: value1
        };
        axios.post(window.url_config + 'get_versions', obj)
            .then(res => {
                lstversion = res.data.Data !== undefined ? res.data.Data : [];
                this.setState({
                    project: value,
                    filter: { project_id: parseInt(value1) },
                    lstversions: lstversion,
                    currVersion: version
                })
                window.$('.loading').hide();
            });
        // }
    }
    onSelectVersion = (event) => {
        var target = event.target;
        var value = {};
        window.$('.loading').show();
        project = this.state.lstprojects.filter((p) => {
            return p.Id === parseInt(this.refs.currProject.value);
        });
        value = project[0];
        if (!value) value = {};
        this.setState({
            project: value,
            filter: { project_id: parseInt(this.refs.currProject.value), version: parseFloat(target.value) },
            currVersion: target.value
        })
        window.$('.loading').hide();

    }
    // onSelectProject = (event) => {
    //     var target = event.target;
    //     var value = {};
    //     var version = 0;
    //     var lstversion = [];

    //     if (target.name === 'currProject'){
    //         window.$('.loading').show();
    //         var project = this.state.lstprojects.filter((p) => {
    //             return p.Id === parseInt(target.value)
    //         });
    //         value = project[0];
    //         if(!value) value={};
    //         if(project[0]){
    //             version=parseFloat(project[0].Version);
    //         }

    //         const obj = {
    //             ProjectId : target.value      
    //               };
    //         axios.post(window.url_config +'get_versions', obj)
    //             .then(res =>  {
    //                 lstversion = res.data.Data !== undefined ? res.data.Data : [];
    //                 this.setState({
    //                     project : value,
    //                     filter : { project_id: parseInt(target.value)},
    //                     lstversions : lstversion,
    //                     currVersion : version
    //                 })
    //                 window.$('.loading').hide();
    //             });

    //         sessionStorage.setItem('myProject', JSON.stringify(value));
    //     }
    // }

    render() {
        var { histories, filter } = this.state;
        // console.log(filter.project_id);
        if (filter) {
            if (filter.project_id && parseInt(filter.project_id) > 0) {
                histories = histories.filter((h) => {
                    return h.ProjectId === filter.project_id
                });
            }
            // console.log(histories);
            // console.log(parseFloat(filter.version) > 0);
            if (filter.version && parseFloat(filter.version) > 0) {
                histories = histories.filter((h) => {
                    // console.log(h);
                    return parseFloat(h.Version) === parseFloat(filter.version)
                });
            }
        }
        var listData = histories.map((h, index) => {
            return <tr key={index}>
                <td>{index + 1}</td>
                <td>{h.ProjectName}</td>
                <td>{h.Rolbackver}</td>
                <td>{h.Prever}</td>
                <td>{h.StatusName}</td>
                {/* <td>{h.TrainingBy}</td> */}
                <td>{h.TrainingTime}</td>
            </tr>
        });
        var optProjects = [];
        console.log(this.state.lstprojects)
        for (var i = 0; i < this.state.lstprojects.length; i++) {
            optProjects.push({ label: this.state.lstprojects[i].Name, value: this.state.lstprojects[i].Id });
        }
        var optvertion = this.state.lstversions.map((version, index) => {
            return <option key={index} value={version.Version}>{version.Version}</option>
        });
        var VersionModal = <Modal show={this.state.showModal} onHide={this.closeModal} size="sm"
            aria-labelledby="modal-dialog-centered"
            centered>
            <Modal.Header>
                <Modal.Title>Quay về phiên bản</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group ">
                    <label>Chọn phiên bản:</label>
                    <select name="currVersion" ref="currVersion" className="form-control" defaultValue={this.state.currVersion} onChange={this.onSelectVersion}>
                        <option value=''>-- Chọn phiên bản --</option>
                        window.$('.loading').show();
                    {optvertion}
                    </select>
                </div>
                <div className="form-group alignLeft mt-5">
                    <label>Lý do thay đổi:</label>
                    <textarea name="Note" ref="Note" className="form-control" placeholder="Nhập lý do" defaultValue="" />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-sm btn-success" onClick={this.onBackversion} disabled={this.state.isExecuting}>
                    <span className="fas fa-undo"></span> Đồng ý
            </button> &nbsp; &nbsp;
                <button className="btn btn-sm" onClick={this.closeModal}>Đóng</button>
            </Modal.Footer>
        </Modal>;
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

                                        <Select options={optProjects} ref="currProject" name="currProject" onChange={opt => this.onSelectProject(opt.label, opt.value)} />
                                    </div>


                                </div>
                                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4" style={{ textAlign: 'right' }}>
                                    {/* <button type="button" className="btn btn-success" onClick={ this.reloadData } disabled={this.state.isDeleting}><span className="fas fa-download mr-5"></span> Lấy dữ liệu</button>&nbsp; */}
                                    <button type="button" className="btn btn-success" onClick={this.onOpenBackversion} disabled={this.state.isExecuting}>
                                        <span className="fas fa-undo"></span> Quay về phiên bản
                        </button>&nbsp;
                        </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'center' }}>
                                <h4 className={this.state.isExecuting ? "" : "display-none"}><span className="fas fa-spinner fa-spin"></span> Đang thực hiện</h4>
                            </div>

                        </div>
                        {VersionModal}
                        <p>&nbsp;</p>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'center' }}>
                            <h4 className={this.state.project.length === 0 ? "" : "display-none"}><span className="fas fa-spinner fa-spin"></span> Đang tải dữ liệu</h4>
                        </div>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="center">STT</th>
                                    <th className="center">Bot</th>
                                    <th className="center">Phiên bản hiện tại</th>
                                    <th className="center">Phiên bản trước</th>
                                    <th className="center">Trạng thái</th>
                                    {/* <th className="center">Người thực hiện</th> */}
                                    <th className="center">Thời gian thực hiện</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listData}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}

export default RolbackVersion;
