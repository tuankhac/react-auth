import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Pagination from "react-js-pagination";

class Intents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplayAddForm: false,
            intents: [],
            filter: { Name: '', Type: '' },
            Spliter: '',
            currContents: [],
            currActions: [],
            currApis: [],
            currAllActions: [{ ActionId: '', ActionName: '', Order: 1 }],
            currAllApis: [{ ApiId: '', ApiName: '', Order: 1 }],
            projects: {},
            isShowCustom: true,
            isEdit: false,
            currI: {},
            PageId: 1,
            RowsPerPage: 15,
            RowsTotalPage: 15,
            NoteString: '',
            isDeleting: false
        }
        this.getData();
    }

    onToggleForm = (value, index) => {
        if (!value) {     //reload data khi bam huy
            this.getData();
        }
        if (index === undefined || index === -1) {
            this.setState({
                isEdit: false,
                currI: {},
                currActions: [],
                currContents: [],
                currApis: [],
                isShowCustom: true,
                isDisplayAddForm: value
            });
            this.getAllAction();
            this.getAllApis();
        } else {
            let ca = {};
            let a = this.state.intents;
            for (var i = 0; i < a.length; i++) {
                if (a[i].Id === index) {
                    ca = a[i];
                    break;
                }
            }
            this.setState({
                isEdit: true,
                currI: ca,
                isShowCustom: ca.Type === 'not_command' ? true : false,
                currActions: ca.Actions === undefined ? [] : ca.Actions,
                currContents: ca.Contents === undefined ? [] : ca.Contents,
                currApis: ca.Apis === undefined ? [] : ca.Apis,
                isDisplayAddForm: value
            })
            this.getAllAction();
            this.getAllApis();
        }

    }
    componentDidMount = () => {
        window.$('.loading').show();
        var project = {};
        try {
            project = JSON.parse(sessionStorage.getItem('myProject'));
        } catch (e) { }
        this.setState({
            projects: project
        });
        this.getData();
        this.getAllAction();
        this.getAllApis();

    }
    getAllApis = (e) => {
        if (e) e.preventDefault();
        const obj = {
            ProjectId: (this.state.projects && this.state.projects.Id) ? this.state.projects.Id : 0,
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage,
            StoryId: 0
        };
        axios.post('/api/news', obj)
            .then(res => {
                if (res.data.Data !== undefined) {
                    let aIts = [];
                    for (var i = 0; i < res.data.Data.length; i++) {
                        let it = res.data.Data[i];
                        aIts.push({ ApiId: it.Id, ApiName: it.Name });
                    }
                    this.setState({
                        currAllApis: aIts
                    });
                }

            })

    }
    getAllAction = (e) => {
        if (e) e.preventDefault();
        const obj = {
            ProjectId: (this.state.projects && this.state.projects.Id) ? this.state.projects.Id : 0,
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage,
            StoryId: 0
        };
        axios.post(window.url_config + 'get_actions', obj)
            .then(res => {
                if (res.data.Data !== undefined) {
                    let aIts = [];
                    for (var i = 0; i < res.data.Data.length; i++) {
                        let it = res.data.Data[i];
                        aIts.push({ ActionId: it.Id, ActionName: it.Name });
                    }
                    this.setState({
                        currAllActions: aIts
                    });
                }
            })

    }
    reloadData = () => {
        this.setState({
            intents: []
        })
        this.getData();
    }
    getData = (e) => {
        if (e) e.preventDefault();
        const obj = {
            ProjectId: (this.state.projects && this.state.projects.Id) ? this.state.projects.Id : 0,
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage,
            StoryId: '0'
        };
        axios.post(window.url_config + 'get_intents', obj)
            .then(res => {
                console.log(res.data.Data);
                this.setState({
                    intents: res.data.Data !== undefined ? res.data.Data : [],
                    currActions: res.data.Data.Actions !== undefined ? res.data.Data.Actions : [],
                    currApis: res.data.Data.Apis !== undefined ? res.data.Data.Apis : [],
                    currContents: res.data.Data.Contents !== undefined ? res.data.Data.Contents : [],
                    PageId: 1,
                    RowsTotalPage: res.data.Data.length
                })

                window.$('.loading').hide();
            });
        //console.log(this.state);
    }
    handlePageChange = (pageNumber) => {
        this.setState({ PageId: pageNumber });
    }
    updateIntent = (e) => {
        e.preventDefault();
        var _name = this.refs.Name.value;
        if (_name.trim().length === 0) {
            alert("Bạn chưa nhập tên Intent");
            this.refs.Name.focus();
            return;
        }
        if (_name.trim().length > 45) {
            alert("Tên Intent quá dài");
            this.refs.Name.focus();
            return;
        }

        if (this.refs.addType.value === 'not_command') {
            if (this.state.currContents) {
                if (!this.state.currContents[0]) {
                    alert("Bạn chưa nhập nội dung Intent");
                    this.refs.Content.focus();
                    return;
                }
            }
            if (this.state.currActions) {
                console.log(this.state.currActions);
                if (!this.state.currActions[0]) {
                    alert("Bạn chưa chọn Action");
                    this.refs.Action.focus();
                    return;
                }
            }
        } else {
            if (this.refs.Contentcmd.value.length === 0) {
                alert("Bạn chưa nhập câu lệnh");
                this.refs.Contentcmd.focus();
                return;
            }
            // if(this.state.currContents){
            //     console.log(this.state.currContents);
            //     if(!this.state.currContents[0].params){
            //         alert("Bạn chưa nhập tham số");
            //         this.refs.Content.focus();
            //         return;
            //     }else{

            //     }

            // }else{
            //     alert("Bạn chưa nhập tham số");
            //         this.refs.Content.focus();
            //         return;
            // }

            if (this.refs.Spliter.value.length === 0) {
                alert("Bạn chưa nhập giá trị phân tách các tham số");
                this.refs.Spliter.focus();
                return;
            }
            if (this.state.currApis) {
                if (!this.state.currApis[0]) {
                    alert("Bạn chưa chọn Api");
                    this.refs.Action.focus();
                    return;
                }
            }
        }
        var _Id = 0, _uri = "insert_intent", _noti = "Thêm mới dữ liệu thành công";
        if (this.state.isEdit) {
            _Id = this.state.currI.Id;
            _uri = "update_intent";
            _noti = "Cập nhật dữ liệu thành công";
        }
        var selectedActions = [];
        for (var i = 0; i < this.state.currActions.length; i++) {
            let order = i + 1;
            selectedActions.push({ ActionId: this.state.currActions[i].ActionId, Order: order });
        }
        var selectedApis = [];
        for (i = 0; i < this.state.currApis.length; i++) {
            let order = i + 1;
            selectedApis.push({ ApiId: this.state.currApis[i].ApiId, Order: order });
        }
        /*var selectedContents = [];
         if(this.refs.addType.value === 'command'){
             if(this.state.currContents[0].Params.length>0){
                selectedContents = this.state.currContents;
             }else{
                selectedContents = {Text : this.state.currContents[0].Text};;
             }
         }else{
            if(this.state.currContents[0].Text.length>0){
                selectedContents = this.state.currContents;
             }else{
                selectedContents = [];
             }
         }
         */
        const obj = {
            Id: _Id,
            Name: this.refs.Name.value,
            Spliter: this.refs.Spliter.value,
            Type: this.refs.addType.value,
            Contents: this.state.currContents,//selectedContents,
            Actions: selectedActions,
            Apis: selectedApis
        };
        //console.log(obj);
        if (window.confirm("Bạn chắc chắn muốn lưu lại?")) {
            window.$('.loading').show();
            this.setState({ NoteString: "Đang thực hiện, vui lòng chờ trong giây lát" });
            axios.post(window.url_config + _uri, obj)
                .then((res) => {
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
                });
        }
    }

    deleteIntent = (id) => {
        if (id !== null && id !== undefined) {
            if (window.confirm("Bạn chắc chắn muốn xóa Intent này?")) {
                this.setState({
                    isDeleting: true
                })
                axios.post(window.url_config + 'delete_intent', { Id: id }).then(res => {
                    this.onToggleForm(false, -1);
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
    onChangeFilter = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.onFilter(
            name === 'Name' ? value : this.state.filter.Name,
            name === 'Type' ? value : this.state.filter.Type
        );
        this.setState({
            [name]: value,
            PageId: 1
        });
    }
    onChangeText = (event) => {
        var name = event.target.name;
        var value = event.target.value;
        if (name === 'Contentcmd' && value.length > 0) {
            var Contents = this.state.currContents;
            if (Contents.length === 0) Contents.push({ Text: '', Params: [] });
            Contents[0].Text = value;
            this.setState({
                currContents: Contents
            });
        }
    }
    changeContent = (index, event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        var Contents = this.state.currContents[0].Params;
        var newContents = [];
        for (var i = 0; i < Contents.length; i++) {
            if (i !== index) {
                newContents.push(Contents[i]);
            } else {
                if (name === "cparam" + index) newContents.push(value);
            }
        }

        var cContent = [];
        cContent.push({ 'Text': this.refs.Contentcmd.value, 'Params': newContents });;
        //console.log(cContent);
        this.setState({
            currContents: cContent
        });
    }
    onFilter = (filterName, filterType) => {
        this.setState({
            filter: {
                Name: filterName, Type: filterType
            }
        });
    }

    addContent = (event) => {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        keycode = parseInt(keycode);
        if (keycode === 13) {
            if (event.target.name === 'Content' && event.target.value.length > 0) {
                //console.logog(this.state.currContents);
                var Contents = this.state.currContents;
                if (Contents[0] && Contents[0].Text === '') {
                    Contents.splice(0, 1);
                }
                Contents.push({ Text: event.target.value, Params: [] });
                this.setState({
                    currContents: Contents
                });
                this.refs.Content.value = "";
            }
        }
    }

    removeContent = (index) => {
        var Contents = this.state.currContents;
        Contents.splice(index, 1);
        this.setState({
            currContents: Contents
        });
    }

    onChangeIntentType = (event) => {
        this.showCustomForm(
            event.target.name === 'addType' ? event.target.value : 'command'
        );
    }

    showCustomForm = (filterType1) => {
        var _isShowCustom = false;
        //filterType1 = parseInt(filterType1);
        _isShowCustom = filterType1 !== 'command';
        this.setState({
            isShowCustom: _isShowCustom,
            currActions: [],
            currContents: [],
            currApis: []
        })
    }

    addActions = (label, value) => {
        var _id = value;
        var _name = label;
        let Actions = this.state.currActions;
        if (_id !== 0) {
            Actions.push({ ActionId: _id, ActionName: _name });
            this.setState({
                currActions: Actions
            });
            this.refs.Action.value = 0;
        }
    }
    removeAction = (index) => {
        let Actions = this.state.currActions;
        Actions.splice(index, 1);
        this.setState({
            currActions: Actions
        })
    }

    onAddContent = (Type, index) => {
        Type = parseInt(Type);
        var params = this.state.currContents;
        if (Type === 1) {
            params.push({ Text: '', Params: [] });
        } else if (Type === 0 && index > 0) {
            params.splice(index, 1);
        }
        this.setState({
            currContents: params
        })
    }
    onAddContentcmd = (Type, index) => {
        Type = parseInt(Type);
        var Contents = this.state.currContents ? this.state.currContents : [];
        if (Type === 1) {
            if (Contents.length === 0) Contents.push({ Text: this.refs.Contentcmd.value, Params: [] });
            Contents[0].Params.push("");
            //console.log(Contents);
        } else if (Type === 0) {
            Contents[0].Params.splice(index, 1);
        }
        this.setState({
            currContents: Contents
        })
        //console.log(this.state.currContents);
    }

    addApis = (label, value) => {
        var _id = value;
        var _name = label;
        let Apis = this.state.currApis;
        if (_id !== 0) {
            Apis.push({ ApiId: _id, ApiName: _name });
            this.setState({
                currApis: Apis
            });
            this.refs.Apis.value = 0;
        }
    }
    removeapi = (index) => {
        let apis = this.state.currApis;
        apis.splice(index, 1);
        this.setState({
            currApis: apis
        })
    }

    addButton = (event) => {
        if (event.target.name === 'Content') {
            var Contents = this.state.currContents;
            Contents.push({ Text: '', Params: [] });
            this.setState({
                currContents: Contents
            });
            this.refs.Content.value = "";
        }
    }

    removeButton = (id, index) => {
        var responses = this.state.currContents;
        let newResps = []
        for (var i = 0; i < responses.length; i++) {
            if (responses[i].id !== id) newResps.push(responses[i]);
            else {
                let ir = responses[i];
                ir.button.splice(index, 1);
                newResps.push(ir);
            }
        }
        this.setState({
            currContents: newResps
        })
    }
    restartState = () => {
        this.setState({
            Spliter: '',
            currContents: [],
            currActions: [],
            currApis: [],
            isShowCustom: true,
            currI: {},
            isEdit: false
        });
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
        var myTitle = "Intents";
        var { intents, isDisplayAddForm, filter, currAllActions, currActions, currAllApis, currApis, currI } = this.state;
        var myProject = localStorage.getItem('myProject');
        if (myProject !== 'undefined' && myProject !== null) {
            myProject = JSON.parse(myProject);
        }

        var Types = [{ Id: 'not_command', Name: 'Thông thường' }, { Id: 'command', Name: 'Lệnh thực thi' }];
        var listTypes = Types.map((t, index) => {
            //var selected = false;
            //if(this.state.currI.Type === t.Id) selected = true;
            return <option key={index} value={t.Id}>{t.Name}</option>
        })

        var listContents = '';
        if (this.state.currContents[0] && this.state.currContents[0].Text !== '') {
            listContents = this.state.currContents.map((Content, index) => {
                return <div className="row" key={index} style={{ padding: '3px' }}>
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1"><i className="fas fa-quote-left fa-xs"></i></div>
                    <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
                        <div className="row">
                            <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10" style={{ textAlign: 'left' }}>
                                <span>{Content.Text}</span>
                            </div>
                            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{ textAlign: 'right' }}>
                                <div onClick={() => this.removeContent(index)} style={{ cursor: 'pointer' }}> <i className="fas fa-times-circle"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            });
        }
        //     var ActionForSelect = currAllActions;
        //  for(var i=0; i<currActions.length; i++){
        //      for(var k=0; k<ActionForSelect.length; k++){
        //          if(ActionForSelect[k].ActionId === currActions[i].ActionId){
        //              ActionForSelect.splice(k, 1);
        //              break;
        //          }
        //      }
        //  }
        var listAllActions1 = [];
        for (var i = 0; i < currAllActions.length; i++) {
            listAllActions1.push({ label: currAllActions[i].ActionName, value: currAllActions[i].ActionId });
        }
        // let listAllActions =currAllActions.map((b,i) => {
        //     listAllActions.push({label: b.ActionName,value: b.ActionId});
        //     return listAllActions;
        //     // return <option key={i} value={b.ActionId}>{b.ActionName}</option>
        //  });
        var listActions = this.state.currActions.map((action, index) => {
            return <div className="row" key={index} style={{ marginTop: '3px', padding: '2px' }}>
                <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10" style={{ textAlign: 'left' }}>
                    &nbsp;&nbsp;{index + 1}&nbsp;- {action.ActionName}
                </div>
                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{ textAlign: 'right' }}>
                    <div onClick={() => this.removeAction(index)} style={{ cursor: 'pointer' }}> <i className="fas fa-times-circle"></i></div>
                </div>
            </div>
        });
        //  var apiForSelect = currAllApis;
        //  for(i=0; i<currApis.length; i++){
        //      for(k=0; k<apiForSelect.length; k++){
        //          if(apiForSelect[k].ApiId === currApis[i].ApiId){
        //              apiForSelect.splice(k, 1);
        //              break;
        //          }
        //      }
        //  }
        // let listAllApis = currAllApis.map((d,index) => {
        //     return <option key={index} value={d.ApiId}>{d.ApiName}</option>
        //  });
        var listAllApis = [];
        for (var i = 0; i < currAllApis.length; i++) {
            listAllApis.push({ label: currAllApis[i].ApiName, value: currAllApis[i].ApiId });
        }
        var listApis = this.state.currApis.map((ap, index) => {
            return <div className="row" key={index} style={{ marginTop: '3px', padding: '2px' }}>
                <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10" style={{ textAlign: 'left' }}>
                    &nbsp;&nbsp;{index + 1}&nbsp;- {ap.ApiName}
                </div>
                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{ textAlign: 'right' }}>
                    <div onClick={() => this.removeapi(index)} style={{ cursor: 'pointer' }}> <i className="fas fa-times-circle"></i></div>
                </div>
            </div>
        });

        // Tham so cho cau lenh
        let listContentcmd = '';
        let listContentcmd2 = '';
        if (this.state.currContents[0]) {
            listContentcmd = this.state.currContents.map((b, i) => {
                if (!this.state.isShowCustom) {
                    listContentcmd2 = this.state.currContents[i].Params.map((p, id) => {
                        return <div className="row" style={{ margin: '2px' }} key={id}>
                            <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10" style={{ padding: '2px' }}>
                                <div style={{ width: '100%', float: 'left' }}>
                                    <input type="text" name={`cparam${id}`} className="form-control" placeholder="Nhập tham số" defaultValue={p} onChange={this.changeContent.bind(this, id)}></input>
                                </div>
                            </div>
                            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{ marginTop: '8px' }}>
                                <div style={{ float: 'left' }} onClick={() => this.onAddContentcmd(0, id)}><i className="fas fa-times-circle"></i></div>
                            </div>
                        </div>
                    })
                }
                return listContentcmd2;
            });
        }

        var plusForm = !isDisplayAddForm ? '' :
            <div className={isDisplayAddForm ? 'col-xs-12 col-sm-12 col-md-12 col-lg-12' : 'display-none'}>
                <div className="panel panel-danger">
                    <div className="panel-heading" style={{ textAlign: 'left' }}>
                        <h3 className="panel-title">{this.state.isEdit ? 'Cập nhật' : 'Thêm'} {myTitle}</h3>
                        <div style={{ float: 'right', marginTop: '-20px', cursor: 'pointer' }} onClick={() => this.onToggleForm(false, -1)}><i className="fas fa-times-circle"></i></div>
                    </div>
                    <div className="panel-body">
                        <form>
                            <div className="form-group alignLeft">
                                <label>Kiểu Intents:</label>
                                <select className="form-control" name="addType" ref="addType" onChange={this.onChangeIntentType} defaultValue={currI.Type ? currI.Type : ""}>
                                    {listTypes}
                                </select>
                            </div>
                            <div className="form-group alignLeft">
                                <label>Tên Intent:</label>
                                <input type="text" className="form-control" ref="Name" name="Name" placeholder="Nhập tên Intent"
                                    defaultValue={currI.Name ? currI.Name : ""} onChange={this.onChangeText} />
                            </div>
                            <div className={this.state.isShowCustom ? '' : 'display-none'}>
                                <div className="form-group alignLeft">
                                    <label>Nội dung Intent:</label>
                                    <input type="text" name="Content" ref="Content" className="form-control" placeholder="Nhập nội dung" onKeyPress={this.addContent} />
                                    {listContents}
                                </div>
                            </div>
                            <div style={{ width: '100%' }} className={this.state.isShowCustom ? 'display-none' : ''}>
                                <div className="form-group alignLeft">
                                    <div style={{ width: '100%' }}>
                                        <label >Câu lệnh:</label>
                                    </div>
                                    <div style={{ marginLeft: '-15px' }} className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                                        <input style={{ width: '100%' }}
                                            type="text"
                                            className="form-control" defaultValue={this.state.currContents[0] ? this.state.currContents[0].Text : ""}
                                            name="Contentcmd" ref="Contentcmd"
                                            onChange={this.onChangeText}
                                            placeholder="Nhập cú pháp">
                                        </input>
                                    </div>
                                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                                        <button type="button" className="btn btn-xs btn-primary" onClick={() => this.onAddContentcmd(1)}><i className="fas fa-plus-circle"></i>Thêm tham số</button>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        {listContentcmd}
                                    </div>
                                </div>
                            </div>
                            <div className={this.state.isShowCustom ? 'form-group alignLeft display-none' : 'form-group alignLeft'}>
                                <label>Giá trị phân tách các tham số:</label>
                                <input type="text" className="form-control" ref="Spliter" name="Spliter" placeholder="Nhập giá trị phân cách giữa các phần tử" defaultValue={currI.Spliter} />
                            </div>
                            <div className={this.state.isShowCustom ? '' : 'display-none'}>
                                <div className="form-group alignLeft">
                                    <label>Action:</label>
                                    <Select options={listAllActions1} ref="Action" onChange={opt => this.addActions(opt.label, opt.value)} />
                                    {/* <select className="form-control" ref="Action" defaultValue={0} onChange={this.addActions}>
                                <option value={0}>---Chọn Action---</option>
                                {listAllActions}
                            </select> */}
                                    {listActions}

                                </div>
                            </div>
                            <div className={this.state.isShowCustom ? 'display-none' : ''}>
                                <div className="form-group alignLeft">
                                    <label>API:</label>
                                    <Select options={listAllApis} ref="Apis" onChange={opt => this.addApis(opt.label, opt.value)} />
                                    {/* <select className="form-control" ref="Apis" defaultValue={0} onChange={this.addApis}>
                                <option value={0}>---Chọn Api---</option>
                                {listAllApis}
                            </select> */}
                                    {listApis}
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-primary" onClick={this.updateIntent} disabled={this.state.NoteString !== ''}><i className="fas fa-plus"></i> Lưu lại</button> &nbsp;
                            <button type="button" className="btn btn-danger" onClick={() => this.onToggleForm(false, -1)} disabled={this.state.NoteString !== ''}><i className="fas fa-times"></i> Hủy bỏ</button>
                                <p style={{ textAlign: "center", marginTop: '5px', color: 'blue' }}>{this.state.NoteString}</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>;

        if (filter) {
            if (filter.Name) {
                intents = intents.filter((intent) => {
                    return intent.Name.toLowerCase().indexOf(filter.Name.toLowerCase()) !== -1
                });
            }
            if (filter.Type && filter.Type !== 'all') {
                intents = intents.filter((intent) => {
                    return intent.Type === filter.Type
                });
            }
            this.onChangelength(intents.length);
        }
        let elementDatas = intents.map((intent, index) => {
            let startitem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - parseInt(this.state.RowsPerPage);
            let enditem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - 1;
            for (let i = startitem; i <= enditem; i++) {
                if (i === index) {

                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="alignLeft">{intent.Name}</td>
                        <td className="alignLeft">{intent.Type === 'command' ? 'Lệnh thực thi' : 'Thông thường'}</td>
                        <td>
                            <button type="button" className="btn btn-xs btn-primary" onClick={() => this.onToggleForm(true, intent.Id)} disabled={this.state.isDeleting}><i className="fas fa-pen"></i> Sửa</button>&nbsp;
                            <button type="button" className="btn btn-xs btn-danger" onClick={() => this.deleteIntent(intent.Id)} disabled={this.state.isDeleting}><i className="fas fa-trash"></i> Xóa</button>
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
                        <h4 className={this.state.intents.length === 0 ? "" : "display-none"}><span className="fas fa-spinner fa-spin"></span> Đang tải dữ liệu</h4>
                    </div>
                    <div className={isDisplayAddForm ? 'display-none' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                        <div style={{ float: 'right' }}>
                            {/* <button type="button" className="btn btn-success" onClick={ this.reloadData } disabled={this.state.isDeleting}><span className="fas fa-download mr-5"></span> Lấy dữ liệu</button>&nbsp; */}
                            <button type="button" className="btn btn-success" onClick={() => this.onToggleForm(true, -1)} disabled={this.state.isDeleting}><span className="fas fa-plus mr-5"></span> Thêm {myTitle}</button>
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
                                    <th className="center">Tên Intent</th>
                                    <th className="center">Kiểu Intent</th>
                                    <th className="center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td><input type="text" ref="sName" name="Name" className="form-control" defaultValue={filter.Name} onChange={this.onChangeFilter} /></td>
                                    <td>
                                        <select ref="sType" name="Type" className="form-control" defaultValue={filter.Type} onChange={this.onChangeFilter}>
                                            <option value='all'>Tất cả</option>
                                            {listTypes}
                                        </select>
                                    </td>
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

export default Intents;