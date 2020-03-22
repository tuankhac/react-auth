import React, { Component } from 'react';
import axios from 'axios';

class Intents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplayAddForm: false,
            intents: [
                { Id: 1, Name: 'affirm', Type: 'command', Contents: [{ Text: "2358", Params: ["333", "444"] }], Apis: [{ ApiId: "1", ApiName: "noi dung act", Order: 1 }] },//Type: command-Lệnh thực thi, not_command: thông thường
                { Id: 2, Name: 'reset', Type: 'command', Contents: [{ Text: "555", Params: ["099", "999", "888"] }] },
                { Id: 3, Name: 'order_lunch', Type: 'not_command', Contents: [{ Text: "noi dung n", Params: "" }], Actions: [{ ActionId: "1", ActionName: "noi dung act", Order: 1 }] }
            ],
            filter: {
                Name: '', Type: ''
            },
            Spliter: '',
            currContents: [{ Text: '', Params: '' }],
            currActions: [{ ActionId: '', Order: 1 }],
            currApis: [{ ApiId: '', Order: 1 }],
            currAllActions: [{ ActionId: '', ActionName: '', Order: 1 }],
            currAllApis: [{ ApiId: '', ApiName: '', Order: 1 }],
            projects: JSON.parse(localStorage.getItem('myProject') || {}),
            isShowCustom: true,
            isEdit: false,
            currI: {},
            PageId: 1,
            RowsPerPage: 20
        }
        this.getData();
    }

    onToggleForm = (value, index) => {
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
        }

    }
    componentDidMount = () => {
        this.getData();
        this.getAllAction();
        this.getAllApis();
    }
    getAllApis = (e) => {
        if (e) e.preventDefault();
        const obj = {
            ProjectId: this.state.projects.id,
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
            ProjectId: this.state.projects.id,
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
    getData = (e) => {
        if (e) e.preventDefault();
        const obj = {
            ProjectId: this.state.projects.id,
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage,
            StoryId: '0'
        };
        axios.post(window.url_config + 'get_intents', obj)
            .then(res => {
                this.setState({
                    intents: res.data.Data !== undefined ? res.data.Data : [],
                    currActions: res.data.Data.Actions !== undefined ? res.data.Data.Actions : [],
                    currApis: res.data.Data.Apis !== undefined ? res.data.Data.Apis : [],
                    currContents: res.data.Data.Contents !== undefined ? res.data.Data.Contents : []
                })
            });
        console.log(this.state);
    }
    updateIntent = (e) => {
        e.preventDefault();
        var _Id = 0, _uri = "insert_intent";
        if (this.state.isEdit) {
            _Id = this.state.currI.Id;
            _uri = "update_intent";
        }
        var selectedActions = [];
        for (var i = 0; i < this.state.currActions.length; i++) {
            let order = i + 1;
            selectedActions.push({ ActionId: this.state.currActions[i].ActionId, Order: order });
        }
        var selectedApis = [];
        for (var i = 0; i < this.state.currApis.length; i++) {
            let order = i + 1;
            selectedApis.push({ ApiId: this.state.currApis[i].ApiId, Order: order });
        }
        var selectedContents = [];
        // var selectedParam = [];
        if (this.refs.addType.value === 'command') {
            if (this.state.currContents[0].Params.length > 0) {
                selectedContents = this.state.currContents;
            } else {
                selectedContents = { Text: this.state.currContents[0].Text };;
            }
            //     for(var i=0; i<this.state.currContents.length; i++){
            //         selectedParam.push(this.state.currContents[i].Params);
            //     }
            //     selectedContents.push({Text: this.refs.Contentcmd.value, Params:selectedParam});
        } else {
            if (this.state.currContents[0].Text.length > 0) {
                selectedContents = this.state.currContents;
            } else {
                selectedContents = [];
            }
        }

        const obj = {
            Id: _Id,
            Name: this.refs.Name.value,
            Spliter: this.refs.Spliter.value,
            Type: this.refs.addType.value,
            Contents: selectedContents,
            Actions: selectedActions,
            Apis: selectedApis
        };
        //console.log(obj);
        if (window.confirm("Bạn chắc chắn muốn lưu lại?")) {
            axios.post(window.url_config + _uri, obj)
                .then((res) => {
                    if (res.data.Code === undefined) alert("Cập nhật dữ liệu không thành công. Vui lòng kiểm tra server");
                    else {
                        var code = res.data.Code;
                        if (parseInt(code) === 0) {
                            this.getData();
                            alert("Cập nhật dữ liệu thành công");
                            this.onToggleForm(true, -1);
                        } else {
                            alert("Lỗi: " + res.data.Message);
                        }
                    }
                });
        }
    }

    deleteIntent = (id) => {
        if (id !== null && id !== undefined) {
            axios.post(window.url_config + 'delete_intent', { Id: id }).then(res => {
                if (window.confirm("Bạn chắc chắn muốn xóa Intent này?")) {
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
                }
            })
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
            [name]: value
        });
    }
    onChangeText = (event) => { }
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
                // var cContent = Contents[index];
                // if(name === "cparam" + index)cContent.Text = this.refs.Contentcmd.value;
                // if(name === "cparam" + index)cContent.Params = value;
                // newContents.push(cContent);
            }
        }

        var cContent = [];
        cContent.push({ 'Text': this.refs.Contentcmd.value, 'Params': newContents });;
        console.log(cContent);
        this.setState({
            currContents: cContent
        });
    }
    onFilter = (filterName, filterType) => {
        //filterType = parseInt(filterType);
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
                if (Contents[0].Text === '') {
                    Contents.splice(0, 1);
                }
                Contents.push({ Text: event.target.value, Params: '' });
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
        //console.logog(this.state);
    }

    addActions = (event) => {
        var _id = parseInt(this.refs.Action.value);
        var _name = event.target.options[event.target.selectedIndex].text;
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
            params.push({ Text: '', Params: '' });
        } else if (Type === 0 && index > 0) {
            params.splice(index, 1);
        }
        this.setState({
            currContents: params
        })
    }
    onAddContentcmd = (Type, index) => {
        Type = parseInt(Type);
        var Contents = [];
        var params = this.state.currContents[0].Params;
        console.log(params);
        console.log(index);
        if (Type === 1) {
            if (params.length === 0) {
                params = [''];
            } else {
                params.push('');
            }
        } else if (Type === 0 && index > 0) {
            params.splice(index, 1);
        }
        console.log(params);
        Contents.push({ Text: this.refs.Contentcmd.value, Params: params });
        this.setState({
            currContents: Contents
        })
        console.log(this.state.currContents);
    }
    addApis = (event) => {
        var _id = parseInt(this.refs.Apis.value);
        var _name = event.target.options[event.target.selectedIndex].text;
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
            Contents.push({ Text: '', Params: '' });
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
            currContents: [{ Text: '', Params: '' }],
            currActions: [{ ActionId: '', Order: 1 }],
            currApis: [{ ApiId: '', ApiName: '', Order: 1 }],
            isShowCustom: true,
            currI: {},
            isEdit: false
        });
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
            var selected = false;
            if (this.state.currI.Type === t.Id) selected = true;
            return <option key={index} value={t.Id} selected={selected}>{t.Name}</option>
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
        var ActionForSelect = currAllActions;
        for (var i = 0; i < currActions.length; i++) {
            for (var k = 0; k < ActionForSelect.length; k++) {
                if (ActionForSelect[k].ActionId === currActions[i].ActionId) {
                    ActionForSelect.splice(k, 1);
                    break;
                }
            }
        }
        let listAllActions = ActionForSelect.map((b, i) => {
            return <option key={i} value={b.ActionId}>{b.ActionName}</option>
        });
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
        var apiForSelect = currAllApis;
        for (var i = 0; i < currApis.length; i++) {
            for (var k = 0; k < apiForSelect.length; k++) {
                if (apiForSelect[k].ApiId === currApis[i].ApiId) {
                    apiForSelect.splice(k, 1);
                    break;
                }
            }
        }
        let listAllApis = apiForSelect.map((d, index) => {
            return <option key={index} value={d.ApiId}>{d.ApiName}</option>
        });
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
                if (this.state.currContents[i].Params.length > 1) {
                    listContentcmd2 = this.state.currContents[i].Params.map((e, ind) => {
                        return <div className="row" style={{ margin: '2px' }} key={ind}>
                            <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10" style={{ padding: '2px' }}>
                                <div style={{ width: '100%', float: 'left' }}>
                                    <input type="text" name={`cparam${ind}`} className="form-control" placeholder="Nhập tham số" defaultValue={e} onChange={this.changeContent.bind(this, ind)}></input>
                                </div>
                            </div>
                            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{ marginTop: '8px' }}>
                                <div style={{ float: 'left' }} onClick={() => this.onAddContentcmd(0, ind)}><i className="fas fa-times-circle"></i></div>
                            </div>
                        </div>
                    });
                } else {
                    listContentcmd2 = this.state.currContents.map((e, ind) => {
                        return <div className="row" style={{ margin: '2px' }} key={ind}>
                            <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10" style={{ padding: '2px' }}>
                                <div style={{ width: '100%', float: 'left' }}>
                                    <input type="text" name={`cparam${ind}`} className="form-control" placeholder="Nhập tham số" defaultValue={e.Params} onChange={this.changeContent.bind(this, ind)}></input>
                                </div>
                            </div>
                            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{ marginTop: '8px' }}>
                                <div style={{ float: 'right' }} onClick={() => this.onAddContentcmd(0, ind)}><i className="fas fa-times-circle"></i></div>
                            </div>
                        </div>
                    });
                };
                return listContentcmd2
                // return <div className="row" style={{margin: '2px'}} key={i}>
                //     <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10" style={{padding: '2px'}}>
                //         <div style={{width: '100%', float: 'left'}}>
                //             <input type="text" name={`cparam${i}`} className="form-control" placeholder="Nhập tham số" defaultValue={b.Params} onChange={this.changeContent.bind(this, i)}></input>
                //         </div>
                //     </div>
                //     <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{marginTop: '8px'}}>
                //         <div style={{float: 'left'}} onClick={() => this.onAddContentcmd(1)}><i className="fas fa-plus-circle"></i></div>
                //         <div style={{float: 'left'}}>&nbsp;&nbsp;</div>
                //         <div style={{float: 'left'}} onClick={() => this.onAddContentcmd(0, i)}><i className="fas fa-times-circle"></i></div>
                //     </div>
                // </div>
            });
        }
        else {
            var params = this.state.currContents;
            params.push({ Text: '', Params: [''] });
            this.setState({
                currContents: params
            })


        }

        //var { intents, isDisplayAddForm, filter, Spliter,currContents,currActions, isShowCustom,currI } = this.state;
        var plusForm = !isDisplayAddForm ? '' :
            <div className={isDisplayAddForm ? 'col-xs-6 col-sm-6 col-md-6 col-lg-6' : ''}>
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
                            <div className={this.state.isShowCustom ? 'display-none' : ''}>
                                <div className="form-group alignLeft">
                                    <div style={{ width: '100%' }}>
                                        <label >Câu lệnh:</label>
                                    </div>
                                    <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                                        <input style={{ width: '100%' }}
                                            type="text"
                                            className="form-control" defaultValue={this.state.currContents[0].Text ? this.state.currContents[0].Text : ""}
                                            name="Contentcmd" ref="Contentcmd"
                                            onChange={this.onChangeText}
                                            placeholder="Nhập nội dung">
                                        </input>
                                    </div>
                                    <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                                        <button type="button" className="btn btn-xs btn-primary" onClick={() => this.onAddContentcmd(1)}><i className="fas fa-plus-circle"></i>Tham số</button>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        {listContentcmd}
                                    </div>
                                </div>
                            </div>
                            <div className={this.state.isShowCustom ? 'form-group alignLeft display-none' : 'form-group alignLeft'}>
                                <label>Giá trị phân tách các phần tử:</label>
                                <input type="text" className="form-control" ref="Spliter" name="Spliter" placeholder="Nhập giá trị phân cách giữa các phần tử" defaultValue={currI.Spliter} />
                            </div>
                            <div className={this.state.isShowCustom ? '' : 'display-none'}>
                                <div className="form-group alignLeft">
                                    <label>Action:</label>
                                    <select className="form-control" ref="Action" defaultValue={0} onChange={this.addActions}>
                                        <option value={0}>---Chọn Actions---</option>
                                        {listAllActions}
                                    </select>
                                    {listActions}

                                </div>
                            </div>
                            <div className={this.state.isShowCustom ? 'display-none' : ''}>
                                <div className="form-group alignLeft">
                                    <label>API:</label>
                                    <select className="form-control" ref="Apis" defaultValue={0} onChange={this.addApis}>
                                        <option value={0}>---Chọn Api---</option>
                                        {listAllApis}
                                    </select>
                                    {listApis}
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-primary" onClick={this.updateIntent}><i className="fas fa-plus"></i> Lưu lại</button> &nbsp;
                            <button type="button" className="btn btn-danger" onClick={() => this.onToggleForm(false, -1)}><i className="fas fa-times"></i> Hủy bỏ</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>;

        /*if(filter){
            if(filter.Name){
                intents = intents.filter((intent) => {
                    return intent.Name.toLowerCase().indexOf(filter.Name.toLowerCase()) !== -1
                });
            }
            if(filter.story !== -1){
                intents = intents.filter((intent) => {
                    return intent.story === filter.story
                });
            }
            if(filter.Type !== 'all'){
                intents = intents.filter((intent) => {
                    return intent.Type === filter.Type
                });
            }
        }*/

        let elementDatas = intents.map((intent, index) => {

            return <tr key={index}>
                <td>{index + 1}</td>
                <td>{intent.Name}</td>
                <td>{intent.Type === 'command' ? 'Lệnh thực thi' : 'Thông thường'}</td>
                <td>
                    <button type="button" className="btn btn-xs btn-primary" onClick={() => this.onToggleForm(true, intent.Id)}><i className="fas fa-pen"></i> Sửa</button>&nbsp;
                            <button type="button" className="btn btn-xs btn-danger" onClick={() => this.deleteIntent(intent.Id)}><i className="fas fa-trash"></i> Xóa</button>
                </td>
            </tr>
        });
        return (
            <div className="center">
                <div className="row">
                    <h1>Quản lý {myTitle}</h1>
                    <hr />
                    <div className={isDisplayAddForm ? 'col-xs-6 col-sm-6 col-md-6 col-lg-6' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                        <div style={{ float: 'right' }}>
                            <button type="button" className="btn btn-success" onClick={this.getData}><span className="fas fa-download mr-5"></span> Lấy dữ liệu</button>&nbsp;
                            <button type="button" className="btn btn-success" onClick={() => this.onToggleForm(true, -1)}><span className="fas fa-plus mr-5"></span> Thêm {myTitle}</button>
                        </div>
                        <p>&nbsp;</p>
                        <br></br>
                        <table className="table table-bOrdered table-hover">
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
                                    <td><input type="text" className="form-control" defaultValue={filter.Name} onChange={this.onChangeFilter} /></td>
                                    <td>
                                        <select name="filterType" className="form-control" defaultValue={filter.Type} onChange={this.onChangeFilter}>
                                            <option value='all'>Tất cả</option>
                                            {listTypes}
                                        </select>
                                    </td>
                                    <td></td>
                                </tr>
                                {elementDatas}
                            </tbody>
                        </table>
                    </div>
                    {plusForm}
                </div>

                {/* <nav aria-label="Page navigation">
                    <ul className="pagination">
                        <li className="page-item">
                        <a className="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </a>
                        </li>
                        <li className="page-item"><a className="page-link" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item">
                        <a className="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                        </a>
                        </li>
                    </ul>
                </nav> */}

            </div>
        );
    }

}

export default Intents;