import React, { Component } from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";
class Api extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplayAddForm: false,
            apis: [],
            filter: {
                Name: '', Type: '', System: '', Method: ''
            },
            currParams: [{ Name: '', Type: '', Value: '', Selected: '' }],
            currFields: [{ Name: '', ShowName: '', Type: '', Value: '' }],
            isEdit: false,
            currI: {},
            PageId: 1,
            RowsPerPage: 15,
            RowsTotalPage: 15,
            NoteString: '',
            isDeleting: false,
            fromapi: false,
            fromuser: false,
            frdefault: true,
            currAllApis: [],
            currApiInput: [],
            currIntentInput: [],
            allIntents: []
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
                currParams: [],
                currFields: [],
                isDisplayAddForm: value
            });
        } else {
            let ca = {};
            let a = this.state.apis;
            for (var i = 0; i < a.length; i++) {
                if (a[i].Id === index) {
                    ca = a[i];
                    //console.log(ca);
                    break;
                }
            }
            let caParam = [];
            if (ca.Params !== undefined) {
                for (i = 0; i < ca.Params.length; i++) {
                    if (ca.Params[i].Value !== undefined) {
                        var arrParam = ca.Params[i].Value.split(".");
                        console.log(arrParam);
                        console.log(arrParam.length);
                        if (arrParam.length > 1) {
                            caParam.push({ Name: ca.Params[i].Name, Type: ca.Params[i].Type, Value: arrParam[1], Selected: arrParam[0] });
                        } else {
                            caParam.push({ Name: ca.Params[i].Name, Type: ca.Params[i].Type, Value: ca.Params[i].Value, Selected: '' });
                        }
                    }
                }
            }
            //console.log(caParam);
            this.setState({
                isEdit: true,
                currI: ca,
                currParams: ca.Params === undefined ? [] : caParam,
                currFields: ca.Fields === undefined ? [] : ca.Fields,
                isDisplayAddForm: value
            })
        }
    }

    getAllIntent = (e) => {
        if (e) e.preventDefault();
        const obj = {
            ProjectId: 0,
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
                        if (it.Type === 'command') {
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
        this.getAllIntent();
        this.getData();
        this.changecolumn(-1);
    }
    reloadData = () => {
        this.setState({
            apis: []
        })
        this.getData();
    }
    getData = (e) => {
        if (e) e.preventDefault();
        const obj = {
            PageId: this.state.PageId,
            RowsPerPage: this.state.RowsPerPage
        };
        axios.post('/api/news', obj)
            .then(res => {
                this.setState({
                    apis: res.data.Data,
                    currAllApis: res.data.Data,
                    PageId: 1,
                    RowsTotalPage: res.data.Data.length
                });
                window.$('.loading').hide();
            })
        //console.log(this.state.apis);

    }
    handlePageChange = (pageNumber) => {
        this.setState({ PageId: pageNumber });
    }
    Updatedata = (e) => {
        e.preventDefault();

        var valid = false;
        valid = this.ValidateValue();
        if (!valid) {
            return;
        }

        let caParam = [];
        if (this.state.currParams !== undefined) {
            for (var i = 0; i < this.state.currParams.length; i++) {
                if (this.state.currParams[i].Value !== undefined) {
                    var selected = '';
                    if (this.state.currParams[i].Selected) {
                        selected = this.state.currParams[i].Selected + ".";
                    }
                    caParam.push({ Name: this.state.currParams[i].Name, Type: this.state.currParams[i].Type, Value: selected + this.state.currParams[i].Value });
                }
            }
        }
        const obj = {
            Id: this.state.currI.Id,
            Name: this.refs.Name.value,
            Code: this.refs.Code.value,
            Url: this.refs.Url.value,
            Type: this.refs.Type.value,
            Body: this.refs.Body.value,
            Header: this.refs.Header.value,
            Authentication: this.refs.Authentication.value,
            System: this.refs.System.value,
            Method: this.refs.Method.value,
            Description: '',
            MappingType: this.refs.MappingType.value,
            Spliter: this.refs.Spliter.value,
            Params: caParam,
            Fields: this.state.currFields,
        };
        if (window.confirm("Bạn chắc chắn muốn thực hiện?")) {
            window.$('.loading').show();
            this.setState({ NoteString: "Đang thực hiện, vui lòng chờ trong giây lát" });
            axios.post(window.url_config + 'update_api', obj)
                .then(res => {
                    if (res.data.Code === undefined) alert("Cập nhật dữ liệu không thành công. Vui lòng kiểm tra server");
                    else {
                        var code = res.data.Code;
                        if (parseInt(code) === 0) {
                            this.getData();
                            alert("Cập nhật dữ liệu thành công");
                            this.onToggleForm(false, -1);
                        } else {
                            alert("Lỗi: " + res.data.Data.Message);
                        }
                    }
                    this.setState({ NoteString: "" });
                    window.$('.loading').hide();
                })
        }
    }
    Insertdata = (e) => {
        e.preventDefault();
        var valid = false;
        valid = this.ValidateValue();
        if (!valid) {
            return;
        }

        let caParam = [];
        if (this.state.currParams !== undefined) {
            for (var i = 0; i < this.state.currParams.length; i++) {
                if (this.state.currParams[i].Value !== undefined) {
                    var selected = '';
                    if (this.state.currParams[i].Selected) {
                        selected = this.state.currParams[i].Selected + ".";
                    }
                    caParam.push({ Name: this.state.currParams[i].Name, Type: this.state.currParams[i].Type, Value: selected + this.state.currParams[i].Value });
                }
            }
        }

        const obj = {
            Name: this.refs.Name.value,
            Code: this.refs.Code.value,
            Url: this.refs.Url.value,
            Type: this.refs.Type.value,
            Body: this.refs.Body.value,
            Header: this.refs.Header.value,
            Authentication: this.refs.Authentication.value,
            System: this.refs.System.value,
            Method: this.refs.Method.value,
            Description: '',
            MappingType: this.refs.MappingType.value,
            Spliter: this.refs.Spliter.value,
            Params: caParam,
            Fields: this.state.currFields,
        };
        if (window.confirm("Bạn chắc chắn muốn thực hiện?")) {
            window.$('.loading').show();
            this.setState({ NoteString: "Đang thực hiện, vui lòng chờ trong giây lát" });
            window.$('.loading').show();
            axios.post(window.url_config + 'insert_api', obj)
                .then(res => {
                    if (res.data.Code === undefined) alert("Thêm mới dữ liệu không thành công. Vui lòng kiểm tra server");
                    else {
                        var code = res.data.Code;
                        if (parseInt(code) === 0) {
                            this.getData();
                            alert("Thêm mới dữ liệu thành công");
                            this.onToggleForm(false, -1);
                        } else {
                            alert("Lỗi: " + res.data.Message);
                        }
                    }
                    this.setState({ NoteString: "" });
                    window.$('.loading').hide();
                })
        }
    }
    ValidateValue = () => {
        var _name = this.refs.Name.value;
        if (_name.trim().length === 0) {
            alert("Bạn chưa nhập tên API");
            this.refs.Name.focus();
            return false;
        }
        if (_name.trim().length > 45) {
            alert("Tên API quá dài");
            this.refs.Name.focus();
            return false;
        }
        if (this.refs.Code.value.trim().length > 45) {
            alert("Tên Api Code quá dài");
            this.refs.Code.focus();
            return false;
        }
        if (this.refs.MappingType.value.trim().length > 45) {
            alert("Tên MappingType quá dài");
            this.refs.MappingType.focus();
            return false;
        }
        if (this.refs.Url.value.trim().length === 0) {
            alert("Bạn chưa nhập link api");
            this.refs.Url.focus();
            return false;
        }
        if (this.refs.Code.value.trim().length === 0) {
            alert("Bạn chưa nhập nội dung API Code");
            this.refs.Code.focus();
            return false;
        }
        if (this.refs.System.value.trim().length === 0) {
            alert("Bạn chưa nhập tên hệ thống");
            this.refs.System.focus();
            return false;
        }
        if (this.refs.Header.value.trim().length === 0) {
            alert("Bạn chưa nhập header");
            this.refs.Header.focus();
            return false;
        }
        if (this.refs.Body.value.trim().length === 0) {
            alert("Bạn chưa nhập body api");
            this.refs.Body.focus();
            return false;
        }
        if (this.refs.MappingType.value.trim().length === 0) {
            alert("Bạn chưa nhập MappingType");
            this.refs.MappingType.focus();
            return false;
        }
        if (this.refs.Method.value.trim() === "PUSH") {
            if (this.state.currParams.length < 1) {
                alert("Bạn chưa nhập Input");
                return false;
            } else {
                var ischeck = false;
                for (var j = 0; j < this.state.currParams.length; j++) {
                    if (this.state.currParams[j].Name.length < 1) {
                        ischeck = true;
                    }
                    if (this.state.currParams[j].Value.length < 1) {
                        ischeck = true;
                    }
                }
                if (ischeck) {
                    alert("Bạn chưa nhập đủ thông tin cho Input");
                    return false;
                }
            }
        }
        return true;

    }
    Deletedata = (id) => {
        if (id !== null && id !== undefined) {
            if (window.confirm("Bạn chắc chắn muốn xóa Api này?")) {
                this.setState({
                    isDeleting: true
                })
                axios.post(window.url_config + 'delete_api', { Id: id }).then(res => {
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
            name === 'Type' ? value : this.state.filter.Type,
            name === 'System' ? value : this.state.filter.System,
            name === 'Method' ? value : this.state.filter.Method
        );
        this.setState({
            [name]: value
        });
    }

    onFilter = (filterName, filterType, filterSystem, filterMethod) => {
        this.setState({
            filter: {
                Name: filterName, Type: filterType, System: filterSystem, Method: filterMethod
            }
        });
    }
    changeField = (index, event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        //if(name === "fname" + index){
        var fields = this.state.currFields;
        var newFields = [];
        for (var i = 0; i < fields.length; i++) {
            if (i !== index) {
                newFields.push(fields[i]);
            } else {
                var cField = fields[index];
                if (name === "fname" + index) cField.Name = value;
                if (name === "fshowname" + index) cField.ShowName = value;
                if (name === "ftype" + index) cField.Type = value;
                if (name === "fvalue" + index) cField.Value = value;
                newFields.push(cField);
            }
        }
        this.setState({
            currFields: newFields
        });
        //}
    }
    changecolumn = (index) => {
        if (index === -1) return;
        if (this.refs["ptype" + index].value === 'fromapi') {
            this.refs["ptypeapitd" + index].classList.remove('display-none');
            this.refs["ptypeapitd" + index].classList.add('col-md-2');
            this.refs["ptypeusertd" + index].classList.add('display-none');
            this.refs["ptypeusertd" + index].classList.remove('col-md-2');
            this.refs["ptypedefaulttd" + index].classList.add('display-none');
            this.refs["ptypedefaulttd" + index].classList.remove('col-md-7');

            this.refs["pvalueuser" + index].classList.add('display-none');
            this.refs["pvalueuser" + index].classList.remove('col-md-5');
            this.refs["pvalueapi" + index].classList.add('col-md-5');
            this.refs["pvalueapi" + index].classList.remove('display-none');
            //this.refs["ptypedefaulttd" + index].classList.remove('col-md-2');
            this.setState({
                fromapi: true,
                fromuser: false,
                frdefault: false
            })
        } else if (this.refs["ptype" + index].value === 'fromuser') {
            this.refs["ptypeusertd" + index].classList.add('col-md-2');
            this.refs["ptypeusertd" + index].classList.remove('display-none');
            this.refs["ptypeapitd" + index].classList.add('display-none');
            this.refs["ptypeapitd" + index].classList.remove('col-md-2');
            this.refs["ptypedefaulttd" + index].classList.add('display-none');
            this.refs["ptypedefaulttd" + index].classList.remove('col-md-7');
            this.refs["pvalueapi" + index].classList.add('display-none');
            this.refs["pvalueapi" + index].classList.remove('col-md-5');
            this.refs["pvalueuser" + index].classList.add('col-md-5');
            this.refs["pvalueuser" + index].classList.remove('display-none');

            this.setState({
                fromapi: false,
                fromuser: true,
                frdefault: false
            })
        } else if (this.refs["ptype" + index].value === 'fromsystem') {
            this.refs["ptypeusertd" + index].classList.remove('col-md-2');
            this.refs["ptypeusertd" + index].classList.add('display-none');
            this.refs["ptypeapitd" + index].classList.add('display-none');
            this.refs["ptypeapitd" + index].classList.remove('col-md-2');
            this.refs["ptypedefaulttd" + index].classList.remove('col-md-5');
            this.refs["ptypedefaulttd" + index].classList.remove('display-none');
            this.refs["ptypedefaulttd" + index].classList.add('col-md-7');
            this.refs["pvalueapi" + index].classList.add('display-none');
            this.refs["pvalueapi" + index].classList.remove('col-md-5');
            this.refs["pvalueuser" + index].classList.add('display-none');
            this.refs["pvalueuser" + index].classList.remove('col-md-5');
            this.setState({
                fromapi: false,
                fromuser: false,
                frdefault: true
            })
        }
    }
    changeParam = (index, event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        var Params = this.state.currParams;
        var newParams = [];
        var valueselected = "";
        var valueselectdot = "";
        var fromuser = false;
        var fromapi = false;
        this.changecolumn(index);
        if (name === "ptypeapi" + index && this.refs["ptypeapi" + index].value.length > 0) {
            valueselectdot = this.refs["ptypeapi" + index].value + ".";
            valueselected = this.refs["ptypeapi" + index].value;
            var apis = this.state.currAllApis.filter((s) => {
                return s.Name.indexOf(this.refs["ptypeapi" + index].value) !== -1
            });
            var apiid = 0;
            if (apis.length > 0) {
                apiid = apis[0].Id;
            }
            //console.log(apis[0].Id);
            const obj = {
                ApiId: apiid
            };
            //console.log(this.state.currAllApis[index]);
            axios.post(window.url_config + 'get_api_input', obj)
                .then(res => {
                    if (res.data.Data !== undefined) {
                        this.setState({
                            currApiInput: res.data.Data
                        });
                        //console.log(res.data.Data);
                    }
                })
        }
        if (name === "ptypeuser" + index && this.refs["ptypeuser" + index].value.length > 0) {
            //console.log(this.state.allIntents);
            valueselectdot = this.refs["ptypeuser" + index].value + ".";
            valueselected = this.refs["ptypeuser" + index].value;
            var Intents = this.state.allIntents.filter((s) => {
                return s.IntentName.indexOf(this.refs["ptypeuser" + index].value) !== -1
            });
            //console.log(Intents);
            var intentid = 0;
            if (Intents.length > 0) {
                intentid = Intents[0].IntentId;
            }
            const obj = {
                IntentId: intentid
            };
            axios.post(window.url_config + 'get_intent_input', obj)
                .then(res => {
                    if (res.data.Data !== undefined) {
                        this.setState({
                            currIntentInput: res.data.Data
                        });
                        //console.log(res.data.Data);

                    }
                })
        }
        for (var i = 0; i < Params.length; i++) {
            //console.log(Params[index]);
            if (i !== index) {
                newParams.push(Params[i]);
            } else {
                var cParam = Params[index];
                if (name === "pname" + index) cParam.Name = value;
                if (name === "ptype" + index) cParam.Type = value;
                if (name === "pvalue" + index) cParam.Value = valueselectdot + value;
                if (name === "ptypeuser" + index) cParam.Selected = valueselected;
                if (name === "ptypeapi" + index) cParam.Selected = valueselected;
                //console.log(cParam.Selected);
                newParams.push(cParam);
            }
        }
        //console.log(newParams);
        this.setState({
            currParams: newParams,
            fromuser: fromuser,
            fromapi: fromapi
        });
    }

    onAddField = (type, index) => {
        type = parseInt(type);
        var fields = this.state.currFields;
        if (type === 1) {
            fields.push({ Name: '', ShowName: '', Type: '', Value: '' });
        } else if (type === 0) {
            fields.splice(index, 1);
        }
        this.setState({
            currFields: fields
        })
    }
    onAddParam = (type, index) => {
        type = parseInt(type);
        var params = this.state.currParams;
        if (type === 1) {
            params.push({ Name: '', Type: 'fromsystem', Value: '', Selected: '' });
        } else if (type === 0) {
            params.splice(index, 1);
        }
        this.setState({
            currParams: params
        })
    }

    edit = (id) => {
        let apis = this.state.apis.filter((p) => {
            return p.Id === id
        })[0];
        var _params = apis.Params;
        var _fields = apis.Fields;
        if (_params === undefined || _params.length === 0) _params = [{ Name: '', Type: 'fromsystem', Value: '', Selected: '' }];
        if (_fields === undefined || _fields.length === 0) _fields = [{ Name: '', ShowName: '', Type: '', Value: '' }];
        this.setState({
            currI: apis,
            currParams: _params,
            currFields: _fields,
            isEdit: true
        });

        if (this.state.isDisplayAddForm) {
            this.onToggleForm();
        }
        this.onToggleForm();
    }
    add = (event) => {
        this.restartState();
        this.onToggleForm();
    }
    restartState = () => {
        this.setState({
            currParams: [{ Name: '', Type: 'fromsystem', Value: '', Selected: '' }],
            currFields: [{ Name: '', ShowName: '', Type: '', Value: '' }],
            currI: [{ Id: '', Name: '', Type: '', System: '', Method: '' }],
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
        var { apis, isDisplayAddForm, filter, currI, currAllApis, allIntents, currIntentInput, currApiInput } = this.state;
        var myTitle = "API";
        if (filter) {
            if (filter.Name) {
                apis = apis.filter((s) => {
                    return s.Name.toLowerCase().indexOf(filter.Name.toLowerCase()) !== -1
                });
            }
            if (filter.Type) {
                apis = apis.filter((s) => {
                    return s.Type === filter.Type
                })
            }
            if (filter.System) {
                apis = apis.filter((s) => {
                    return s.System.toLowerCase().indexOf(filter.System.toLowerCase()) !== -1
                })
            }
            if (filter.Method) {
                apis = apis.filter((s) => {
                    return s.Method === filter.Method
                })
            }
            this.onChangelength(apis.length);
        }
        let elementDatas = apis.map((s, index) => {
            let startitem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - parseInt(this.state.RowsPerPage);
            let enditem = parseInt(this.state.PageId) * parseInt(this.state.RowsPerPage) - 1;
            for (let i = startitem; i <= enditem; i++) {
                if (i === index) {
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="alignLeft">{s.Name}</td>
                        <td className="alignLeft">{s.Type}</td>
                        <td className="alignLeft">{s.System}</td>
                        <td className="alignLeft">{s.Method}</td>
                        <td>
                            <button type="button" className="btn btn-xs btn-primary" onClick={() => this.onToggleForm(true, s.Id)} disabled={this.state.isDeleting}><i className="fas fa-pen"></i> Sửa</button>&nbsp;
                            <button type="button" className="btn btn-xs btn-danger" onClick={() => this.Deletedata(s.Id)} disabled={this.state.isDeleting}><i className="fas fa-trash"></i> Xóa</button>
                        </td>
                    </tr>

                }
            }
        });
        var listParams = {};

        if (this.state.currParams) {
            listParams = this.state.currParams.map((param, index) => {
                let listAllApis = currAllApis.map((d, index) => {
                    return <option key={index} value={d.Name}></option>
                });
                let listAllIntents = allIntents.map((d, index) => {
                    return <option key={index} value={d.IntentName}></option>
                });
                let listIntentInput = currIntentInput.map((item, key) => {
                    //console.log(item.Name);
                    return <option key={key} value={item.Name} />
                });
                let listApiInput = currApiInput.map((item, key) => {
                    //console.log(item.Name);
                    return <option key={key} value={item.Name} />
                });
                return <div key={index}><div className="col-md-12 mt-2 row top-buffer">

                    <div className="col-md-2" style={{ padding: '8px' }}>
                        <select className="form-control" name={`ptype${index}`} ref={`ptype${index}`} defaultValue={param.Type} onChange={this.changeParam.bind(this, index)}>
                            <option value="fromsystem">Cung cấp bởi hệ thống</option>
                            <option value="fromapi">Lấy từ API</option>
                            <option value="fromuser">Lấy dữ liệu người dùng</option>
                        </select>
                    </div>
                    <div className="col-md-2" style={{ padding: '8px' }}><input type="text" className="form-control" placeholder="Tên tham số" name={`pname${index}`} defaultValue={param.Name} onChange={this.changeParam.bind(this, index)}></input></div>
                    <div className={param.Type === "fromapi" ? "col-md-2" : "display-none"} ref={`ptypeapitd${index}`} style={{ padding: '8px' }}>
                        {/* <select  className="form-control" name={`ptypeapi${index}`} ref={`ptypeapi${index}`} onChange={this.changeParam.bind(this, index)}>
                            {listAllApis}
                            </select> */}
                        <input type="text" list={`dataApis${index}`} className="form-control" placeholder="Chọn API" ref={`ptypeapi${index}`} name={`ptypeapi${index}`} defaultValue={param.Selected} onChange={this.changeParam.bind(this, index)}></input>
                        <datalist id={`dataApis${index}`}>
                            {listAllApis}
                        </datalist>
                    </div>
                    <div className={param.Type === "fromuser" ? "col-md-2" : "display-none"} ref={`ptypeusertd${index}`} style={{ padding: '8px' }}>
                        {/* <select className="form-control" name={`ptypeuser${index}`} ref={`ptypeuser${index}`} onChange={this.changeParam.bind(this, index)}>
                            {listAllIntents}
                        </select> */}
                        <input type="text" list={`dataIntents${index}`} className="form-control" placeholder="Chọn Intent" ref={`ptypeuser${index}`} name={`ptypeuser${index}`} defaultValue={param.Selected} onChange={this.changeParam.bind(this, index)}></input>
                        <datalist id={`dataIntents${index}`}>
                            {listAllIntents}
                        </datalist>
                    </div>
                    <div className={param.Type === "fromsystem" ? "col-md-7" : "display-none"} ref={`ptypedefaulttd${index}`} style={{ padding: '8px' }}>
                        <input type="text" list={`data${index}`} className="form-control" placeholder="Giá trị cho tham số" ref={`pvalue${index}`} name={`pvalue${index}`} defaultValue={param.Value} onChange={this.changeParam.bind(this, index)}></input>
                    </div>
                    <div className={param.Type === "fromapi" ? "col-md-5" : "display-none"} ref={`pvalueapi${index}`} style={{ padding: '8px' }}>
                        <input type="text" list={`pvalueapilt${index}`} className="form-control" placeholder="Giá trị cho tham số" ref={`pvalue${index}`} name={`pvalue${index}`} defaultValue={param.Value} onChange={this.changeParam.bind(this, index)}></input>
                        <datalist id={`pvalueapilt${index}`}>
                            {listApiInput}
                        </datalist>
                    </div>
                    <div className={param.Type === "fromuser" ? "col-md-5" : "display-none"} ref={`pvalueuser${index}`} style={{ padding: '8px' }}>
                        <input type="text" list={`pvalueuserlt${index}`} className="form-control" placeholder="Giá trị cho tham số" ref={`pvalue${index}`} name={`pvalue${index}`} defaultValue={param.Value} onChange={this.changeParam.bind(this, index)}></input>
                        <datalist id={`pvalueuserlt${index}`}>
                            {listIntentInput}
                        </datalist>
                    </div>
                    {/* {this.state.fromapi ? <datalist id={`data${index}`}>{listApiInput}</datalist> : ''}
                        {this.state.fromuser ? <datalist id={`data${index}`}>{ listIntentInput}</datalist> : ''} */}

                    <div style={{ verticalAlign: 'middle', width: '50px', float: 'right', padding: '8px' }}>
                        <div style={{ float: 'left' }} onClick={() => this.onAddParam(1, index)}><i className="fas fa-plus-circle"></i></div>
                        <div style={{ float: 'right' }} onClick={() => this.onAddParam(0, index)}><i className="fas fa-times-circle"></i></div>
                    </div>

                </div>
                </div>
            });
        }
        var listFields = {};
        if (this.state.currFields) {
            listFields = this.state.currFields.map((field, index) => {
                return <div key={index} className="col-md-12 mt-2 row top-buffer">
                    <div className="col-md-2" style={{ padding: '8px' }}>
                        <select className="form-control" defaultValue={field.Type} name={`ftype${index}`} ref="ftype" onChange={this.changeField.bind(this, index)}>
                            <option value="default">Kiểu mặc định</option>
                            <option value="fromreturn">Lấy từ giá trị trả về</option>
                            <option value="fromcomplex">Phức hợp (cộng trừ nhân chia)</option>
                        </select>
                    </div>
                    <div className="col-md-2" style={{ padding: '8px' }}><input type="text" className="form-control" placeholder="Tên tham số" name={'fname' + index} ref="fname" defaultValue={field.Name} onChange={this.changeField.bind(this, index)}></input></div>
                    <div className="col-md-2" style={{ padding: '8px' }}><input type="text" className="form-control" placeholder="Tên hiển thị" name={'fshowname' + index} ref="fshowname" defaultValue={field.ShowName} onChange={this.changeField.bind(this, index)}></input></div>
                    <div className="col-md-5" style={{ padding: '8px' }}><input type="text" className="form-control" placeholder="Giá trị cho tham số" name={'fvalue' + index} ref="fvalue" defaultValue={field.Value} onChange={this.changeField.bind(this, index)}></input></div>
                    <div style={{ verticalAlign: 'middle', width: '50px', float: 'right', padding: '8px' }}>
                        <div style={{ float: 'left' }} onClick={() => this.onAddField(1, index)}><i className="fas fa-plus-circle"></i></div>
                        <div style={{ float: 'right' }} onClick={() => this.onAddField(0, index)}><i className="fas fa-times-circle"></i></div>
                    </div>
                </div>
            });
        }
        var Methods = ["POST", "GET", "PUSH"];
        var optMethod = Methods.map((Name, index) => {
            return <option key={index} value={Name}>{Name}</option>
        });
        var types = ["SOAP", "RESTFUL"];
        var optType = types.map((Name, index) => {
            return <option key={index} value={Name}>{Name}</option>
        });

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
                                <label>Tên API:</label>
                                <input type="text" className="form-control" name="Name" ref="Name" placeholder="Nhập tên api" defaultValue={currI.Name} />
                            </div>
                            <div className="form-group alignLeft">
                                <label>URL API:</label>
                                <input type="text" className="form-control" name="url" ref="Url" placeholder="Nhập link api" defaultValue={currI.Url} />
                            </div>
                            <div className="form-group alignLeft">
                                <label>API code:</label>
                                <input name="Code" ref="Code" className="form-control" placeholder="Nhập nội dung API Code" defaultValue={currI.Code} />
                            </div>
                            <div style={{ marginLeft: '-15px' }}>
                                <div className='col-xs-6 col-sm-6 col-md-6 col-lg-6'>
                                    <div className="form-group alignLeft">
                                        <label>Kiểu:</label>
                                        <select className="form-control" ref="Type" defaultValue={currI.Type}>{optType}</select>
                                    </div>
                                </div>
                                <div className='col-xs-6 col-sm-6 col-md-6 col-lg-6'>
                                    <div className="form-group alignLeft">
                                        <label>Phương thức:</label>
                                        <select className="form-control" name="Method" ref="Method" defaultValue={currI.Method}>{optMethod}</select>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group alignLeft">
                                <label>Hệ thống:</label>
                                <input type="text" className="form-control" name="System" ref="System" placeholder="Nhập tên hệ thống" defaultValue={currI.System} />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Header:</label>
                                <input type="text" className="form-control" name="header" ref="Header" placeholder="Nhập header" defaultValue={currI.Header} />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Authentication:</label>
                                <input type="text" className="form-control" name="authentication" ref="Authentication" placeholder="Nhập giá trị authentication" defaultValue={currI.Authentication} />
                            </div>

                            <div className="form-group alignLeft">
                                <label>API Body:</label>
                                <textarea name="body" ref="Body" className="form-control" rows="3" placeholder="Nhập body api" defaultValue={currI.Body}></textarea>
                            </div>
                            <div className="form-group alignLeft">
                                <label>Các tham số đầu vào (input):</label> <button type="button" className="btn btn-default btn-xs" onClick={() => this.onAddParam(1, 0)}><i className="fas fa-plus"></i></button>

                                {listParams}
                            </div>
                            <div className="form-group alignLeft">
                                <label>Các tham số đầu ra (output): </label> <button type="button" className="btn btn-default btn-xs" onClick={() => this.onAddField(1, 0)}><i className="fas fa-plus"></i></button>

                                {listFields}
                            </div>
                            <div className="form-group alignLeft">
                                <label style={{ width: '100%' }}>Mapping:</label>
                                <input name="mapping" ref="MappingType" className="form-control" placeholder="Nhập cấu hình mapping" defaultValue={currI.MappingType} />
                            </div>
                            <div className="form-group alignLeft">
                                <label>Spliter:</label>
                                <input type="text" name="spliter" ref="Spliter" className="form-control" placeholder="Spliter" defaultValue={currI.Spliter}></input>
                            </div>
                            <div className="form-group alignLeft">
                                <label>Định dạng:</label>
                                <select className="form-control" ref="FormatType" defaultValue={0}>
                                    <option value={0}>JSON</option>
                                    <option value={1}>XML</option>
                                </select>
                            </div>
                            <div className="form-group alignLeft" style={{ display: 'flow-root' }}>
                                <div><label>Trích xuất dữ liệu:</label></div>

                                <div className="col-md-2 text-center">
                                    <div className="radio">
                                        <label className="custom-control-label" htmlFor="Default">Mặc định</label><br />
                                        <input type="radio" name="customRadio" className="custom-control-input" id="Default" defaultChecked ref="Default"></input>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center"><div className="radio">
                                    <img src="/image/piechart.png" alt="piechart" width="18" height="18"></img>
                                    <label className="custom-control-label" htmlFor="Piechart">Piechart</label><br />
                                    <input type="radio" name="customRadio" className="custom-control-input" id="Piechart" ref="Piechart"></input>
                                </div></div>
                                <div className="col-md-2 text-center"><div className="radio">
                                    <img src="/image/graphchart.png" alt="graphchart" width="18" height="18"></img>
                                    <label className="custom-control-label" htmlFor="Graphchart">Graphchart</label><br />
                                    <input type="radio" name="customRadio" className="custom-control-input" id="Graphchart" ref="Graphchart"></input>
                                </div></div>
                                <div className="col-md-2 text-center"><div className="radio">
                                    <img src="/image/list.png" alt="list" width="18" height="18"></img>
                                    <label className="custom-control-label" htmlFor="List">List</label><br />
                                    <input type="radio" name="customRadio" className="custom-control-input" id="List" ref="List"></input>
                                </div></div>
                                <div className="col-md-2 text-center"><div className="radio">
                                    <img src="/image/table.png" alt="table" width="18" height="18"></img>
                                    <label className="custom-control-label" htmlFor="Tablechat">Bảng</label><br />
                                    <input type="radio" name="customRadio" className="custom-control-input" id="Tablechat" ref="Tablechat"></input>
                                </div></div>
                                <div className="col-md-2 text-center"> &nbsp;</div>

                            </div>
                            <div className="form-group alignLeft" style={{ display: 'flow-root' }}>
                                <div><label>Tích hợp:</label></div>
                                <div className="col-md-2 text-center">
                                    <div className="custom-control custom-checkbox">
                                        <img src="/image/Zalo.png" alt="Zalo" width="18" height="18"></img>
                                        <label className="custom-control-label" htmlFor="Zalo">Zalo</label><br />
                                        <input type="checkbox" className="custom-control-input" id="Zalo"></input>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center"><div className="custom-control custom-checkbox">
                                    <img src="/image/Whatsapp.png" alt="Whatsapp" width="18" height="18"></img>
                                    <label className="custom-control-label" htmlFor="Whatsapp">Whatsapp</label><br />
                                    <input type="checkbox" className="custom-control-input" id="Whatsapp"></input>
                                </div></div>
                                <div className="col-md-2 text-center"><div className="custom-control custom-checkbox">
                                    <img src="/image/Messenger.png" alt="Messenger" width="18" height="18"></img>
                                    <label className="custom-control-label" htmlFor="Messenger">Messenger</label><br />
                                    <input type="checkbox" className="custom-control-input" id="Messenger"></input>
                                </div></div>
                                <div className="col-md-2 text-center"><div className="custom-control custom-checkbox">
                                    <img src="/image/Mocha.png" alt="Mocha" width="18" height="18"></img>
                                    <label className="custom-control-label" htmlFor="Mocha">Mocha</label><br />
                                    <input type="checkbox" className="custom-control-input" id="Mocha" defaultChecked></input>
                                </div></div>
                                <div className="col-md-2 text-center"><div className="custom-control custom-checkbox">
                                    <img src="/image/VTNet.png" alt="VTNet" width="18" height="18"></img>
                                    <label className="custom-control-label" htmlFor="VTNet">VTNet</label><br />
                                    <input type="checkbox" className="custom-control-input" id="VTNet" defaultChecked></input>
                                </div></div>
                                <div className="col-md-2 text-center"><div className="custom-control custom-checkbox">
                                    <img src="/image/Mattermost.png" alt="Mattermost" width="18" height="18"></img>
                                    <label className="custom-control-label" htmlFor="Mattermost">Mattermost</label><br />
                                    <input type="checkbox" className="custom-control-input" id="Mattermost"></input>
                                </div></div>
                            </div>

                            <button type="button" className="btn btn-primary" onClick={this.state.isEdit ? this.Updatedata : this.Insertdata} disabled={this.state.NoteString !== ''}><i className="fas fa-plus"></i> Lưu lại</button> &nbsp;
                        <button type="button" className="btn btn-danger" onClick={() => this.onToggleForm(false, -1)} disabled={this.state.NoteString !== ''}><i className="fas fa-times"></i> Hủy bỏ</button>
                            <p style={{ textAlign: "center", marginTop: '5px' }}>{this.state.NoteString}</p>
                        </form>
                    </div>
                </div>
            </div>;
        return (
            <div className="center">
                <div className="row">
                    <h1>Quản lý {myTitle}s</h1>
                    <hr />
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'center' }}>
                        <h4 className={this.state.apis.length === 0 ? "" : "display-none"}><span className="fas fa-spinner fa-spin"></span> Đang tải dữ liệu</h4>
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
                                    <th className="center">Tên</th>
                                    <th className="center">Kiểu</th>
                                    <th className="center">Hệ thống</th>
                                    <th className="center">Phương thức</th>
                                    <th className="center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td><input type="text" name="Name" className="form-control" value={filter.name} onChange={this.onChangeFilter} /></td>
                                    <td>
                                        <select name="Type" className="form-control" value={filter.type} onChange={this.onChangeFilter}>
                                            <option value="">Tất cả</option>
                                            {optType}
                                        </select>
                                    </td>
                                    <td><input type="text" name="System" className="form-control" value={filter.System} onChange={this.onChangeFilter} /></td>
                                    <td>
                                        <select name="Method" className="form-control" value={filter.Method} onChange={this.onChangeFilter}>
                                            <option value="">Tất cả</option>
                                            {optMethod}
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

export default Api;
