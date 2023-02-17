import React, { Component } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";

import { connect } from "react-redux";
import * as moment from "moment";


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };
  }

  autoLogin = async (history) => {
    return () => {
      // alert('autoLogin say : '+localStorage.getItem(key.LOGIN_PASSED))
      if (localStorage.getItem(key.LOGIN_PASSED) === YES) {
        setTimeout(() => history.push("/home"), 100);
      }
    };
  };

  componentDidMount() {
    //this.props.autoLogin(this.props.history);
    this.autoLogin();
  }
  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // this.props.login(this.props.history, this.state);
      this.doLogin();
    }
  };
  doLogin = async () => {
    let Login_result = await httpClient.post(server.LOGIN_URL, this.state);

    if (Login_result.data.api_result === OK) {
      Swal.fire({
        icon: "success",
        title: "Welcome to the web-site of",
        text: { APP_TITLE }.APP_TITLE,
        showConfirmButton: false,
        // timer: 100000,
      });

      // console.log(Login_result.data.result);
      localStorage.setItem(key.LOGIN_PASSED, YES);
      localStorage.setItem(key.USER_NAME, Login_result.data.result.username);
      localStorage.setItem(key.USER_EMP, Login_result.data.result.empNumber);
      localStorage.setItem(key.TIME_LOGIN, moment());
      localStorage.setItem(key.USER_LV, Login_result.data.result.levelUser);
      localStorage.setItem(key.USER_VENDER, Login_result.data.result.vender);
      window.location.replace("../attn_rec");
    } else {
      console.log(Login_result.data);
      Swal.fire({
        icon: "error",
        title: "Log in Fail",
        text: Login_result.data.error,
      });

      return;
    }
  };
  render() {
    return (
      <div class="login-page">
        <div className="login-box">
          <div className="login-logo"></div>
          {/* /.login-logo */}
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Please Log-in</p>

              <div className="input-group mb-3">
                <input
                 autoFocus
                 value={this.state.username}
                  type="text"
                  className="form-control"
                  placeholder="User Name"
                  onChange={(e) => {
                    this.setState({ username: e.target.value.toUpperCase() });
                  }}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                value={this.state.password}
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={(e) => {
                    this.setState({ password: e.target.value });
                  }}
                  onKeyPress={this.handleKeyPress}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                 
                </div>
                {/* /.col */}
                <div className="col-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={(e) => {
                      e.preventDefault();
                      this.doLogin();
                      // this.props.login(this.props.history, this.state);
                    }}
                  >
                    Log In
                  </button>
                </div>
                {/* /.col */}
              </div>
     
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// //Reducer
// const mapStateToProps = (state) => ({
//   loginReducer: state.loginReducer,
// });

// //Action
// const mapDispatchToProps = {
//   ...actions,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(Login);

export default Login;
