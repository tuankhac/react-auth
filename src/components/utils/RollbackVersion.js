import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Pagination from "react-js-pagination";

class RollbackVersion extends Component {
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
                var note = this.refs.Note.value;
                var token = localStorage.getItem('tokenChatbot');
                var obj = {
                    ProjectId: pid,
                    Status: status,
                    User: token,
                    Version: version,
                    CurrVersion: currversion,
                    Note: note
                };
                axios.post(window.url_config + 'rollback_version', obj)
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
    componentDidUpdate() {
        if (this.newData) this.newData.scrollIntoView({ behavior: "smooth" })
    }
    getData = (e) => {
        if (e) e.preventDefault();
        const obj = {
            ProjectId: '',
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage
        };
        axios.post(window.url_config + 'get_rollback_histories', obj)
            .then(res => {
                this.setState({
                    histories: res.data.Data !== undefined ? res.data.Data : [],
                    RowsTotalPage: res.data.Data.length
                });
                window.$('.loading').hide();
            })

    }
    handlePageChange = (pageNumber) => {
        this.setState({ PageId: pageNumber });
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
            value = project[0];
            if (!value) value = {};
            if (project[0]) {
                version = parseFloat(project[0].Version);
            }
            for (let i = 0; i < this.state.histories.length; i++) {
                var prid = this.state.histories[i].ProjectId;
                if (parseInt(prid) === parseInt(target.value)) {
                    rowtotal = rowtotal + 1;
                }
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
                currVersion: target.value
            })
            window.$('.loading').hide();

        }
    }

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
            let startitem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - parseInt(this.state.RowsPerPage);
            let enditem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - 1;
            for (let i = startitem; i <= enditem; i++) {
                if (i === index) {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{h.ProjectName}</td>
                        <td>{h.Rollbackver}</td>
                        <td>{h.Prever}</td>
                        <td>{h.StatusName}</td>
                        <td>{h.RollbackBy}</td>
                        <td>{h.Note}</td>
                        <td>{h.RollbackTime}</td>
                    </tr>
                }
            }
        });
        var optProjects = this.state.lstprojects.map((project, index) => {
            return <option key={index} value={project.Id}>{project.Name}</option>
        });

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
                    <select name="currVersion" ref="currVersion" className="form-control" defaultValue={this.state.currVersion} onChange={this.onSelectProject}>
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
                        <h1>Lịch sử quay về phiên bản</h1>
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
                                    <th className="center">Người thực hiện</th>
                                    <th className="center">Lý do thay đổi</th>
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
                </div>
            </div>
        );
    }

}

export default RollbackVersion;
