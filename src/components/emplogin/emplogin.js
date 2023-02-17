import React, { Component } from "react";
import axios from "axios";
import { APP_TITLE, key, OK, server, YES } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";

import * as moment from "moment";
import { connect } from "react-redux";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emp_no: "",
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
      this.Emp_Search();
    }
  };

  Emp_Search = async () => {
    if (this.state.emp_no !== "") {
      let Login_result = await httpClient.get(
        server.LOGIN_EMP + "/" + this.state.emp_no
      );

      if (Login_result.data.result[1] == 0) {
        Swal.fire({
          icon: "error",
          title: "Log in Fail",
          text: "EMP No not found",
        });
        return;
      }
      //console.log(Login_result.data.result[0].[0].EMP_NAME);

      //Set Local Storage
      localStorage.setItem(key.USER_EMP, Login_result.data.result[0][0].EMP_NO);
      localStorage.setItem(key.LOGIN_PASSED, YES);
      localStorage.setItem(
        key.USER_NAME,
        Login_result.data.result[0][0].EMP_NAME
      );
      localStorage.setItem(key.TIME_LOGIN, moment());
      localStorage.setItem(key.USER_LV, "User");
      window.location.replace("../home");
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
                  style={{ textTransform: "uppercase" }}
                  type="text"
                  className="form-control"
                  placeholder="EMP No"
                  onChange={(e) => {
                    this.setState({ emp_no: e.target.value });
                  }}
                  onKeyPress={this.handleKeyPress}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user" />
                  </div>
                </div>
              </div>

              <div className="row">
                {/* /.col */}
                <div className="col-4"></div> 
                <div className="col-4"></div>
                <div className="col-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={(e) => {
                      e.preventDefault();
                      this.Emp_Search();
                      // this.props.login(this.props.history, this.state);
                    }}
                    //onLostPointerCaptureCapture
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

export default Login;
