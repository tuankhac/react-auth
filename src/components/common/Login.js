import React, { Component } from 'react';
// import  { Redirect } from 'react-router-dom';

// import ReactDOM from 'react-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  componentDidMount(){
    document.querySelector("body").className = "hold-transition login-page";
  }
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/authenticate', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          //this.props.history.push('/');
          window.location.href = "/";
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error logging in please try again');
      });
  }

  render() {
    return (
      <div className="login-box">
        {/* <div className="login-logo">
            <a href="#"><b>Template</b>React</a>
          </div> */}
        <div className="login-box-body">
          <p className="login-box-msg">Sign in to start your session</p>
          <form>
            <div className="form-group has-feedback">
              <input type="text" className="form-control" placeholder="Username" name="username" id="username" onChange={this.handleInputChange} />
              <span className="glyphicon glyphicon-user form-control-feedback"></span>
            </div>
            <div className="form-group has-feedback">
              <input type="password" className="form-control" placeholder="Password" name="password" id="password" onChange={this.handleInputChange} />
              <span className="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <div className="row">
              <div className="col-xs-8"></div>
              <div className="col-xs-4">
                <button type="submit" className="btn btn-primary btn-block btn-flat" onClick={this.onSubmit}>Sign In</button>
              </div>
            </div>
          </form>
          <div className="social-auth-links text-center">
            <p>- OR -</p>
            <a href="#" className="btn btn-block btn-social btn-facebook btn-flat"><i className="fa fa-facebook"></i> Sign in using
        Facebook</a>
            <a href="#" className="btn btn-block btn-social btn-google btn-flat"><i className="fa fa-google-plus"></i> Sign in using
        Google+</a>
          </div>
          <a href="#">I forgot my password</a>
          <br></br>
          <a href="register.html" className="text-center">Register a new membership</a>
        </div>
      </div>
    )
  }
}

export default Login;