import React, { Component } from "react";
import axios from "axios";
import { OK, server } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
//import { register, userErrorAlerted } from "./../../actions/user.action";
//import { register } from "./../../actions/user.action";
import { connect } from "react-redux";

class Register extends Component {
  //create state =>>> rcon+enter
  constructor(props) {
    super(props);

    this.state = {
      username: "",

      password: "",
      confirmpassword: "",
      vender_name: "",
      levelUser:"",
      list_vender: [],
      vender:"",
    };
  }
  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      //this.props.register(this.props.history, this.state);
      this.doRegister();
    }
  };

  clearData() {
    this.setState({
      username: "",
      levelUser:"",
      password: "",
      confirmpassword: "",
    });
  }

  componentDidMount = async () => {
    this.call_master_data();
  };
  call_master_data = async () => {
    let all_data = await httpClient.get(server.VENDER_ALL);
    // console.log(all_data.data.result);
    this.setState({ list_vender: all_data.data.result });
  };
  renderTableRow = () => {
    try {
      if (this.state.list_vender !== null) {
        const myResult = this.state.list_vender;
        return myResult.map((item) => <option value={item.vender_name}>{item.vender_name}</option>);
      }
    } catch (error) {}
  };
  doRegister = async () => {
    if (this.state.password !== this.state.confirmpassword) {
      Swal.fire({
        icon: "warning",
        title: "Password not match",
        text: "Plesase confirm your password",
      });

      return;
    }

    let Register_command = await httpClient.post(server.URL_REGIST, this.state);

    if (Register_command.data.api_result === OK) {
      Swal.fire({
        icon: "success",
        title: "Welcome",
        text: "to the web-site !!!",
        showConfirmButton: false,
        timer: 1000,
      });
      window.location.replace("../login");
    } else {
      Swal.fire({
        icon: "warning",
        title: "Condition are unacceptable",
        text: "Plesase confirm your user condition",
        footer: "<a href=/registrule/html-link.htm target=_blank > Why do I have this issue?</a>",
      });
      return;
    }
  };
  render() {
    return (
      <div className="register-page" style={{ maxHeight: 665 }}>
        <div className="register-box">
          <div className="register-logo"></div>
          {/* /.register-logo */}
          <div className="card">
            <div className="card-body register-card-body">
              <p className="register-box-msg">New User Registration</p>

              {/* xx */}
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

              {/* xx */}
              <div className="input-group mb-3">
                <input
                  value={this.state.password}
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={(e) => {
                    this.setState({ password: e.target.value });
                  }}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              {/* xx */}
              <div className="input-group mb-3">
                <input
                  value={this.state.confirmpassword}
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  onChange={(e) => {
                    this.setState({ confirmpassword: e.target.value });
                  }}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-unlock" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <select
                  value={this.state.levelUser}
                  className="form-control"
                  onChange={async (e) => {
                    e.preventDefault();
                    await this.setState({
                      levelUser: e.target.value,
                    });
                  }}
                >
                  <option value="-" selected>Select Level</option>
                  <option value="Admin">Admin</option>
                  <option value="Super">Super</option>
                  <option value="Super">User</option>
             
                </select>
              </div>
              <div className="input-group mb-3">
                <select
             
                  value={this.state.vender}
                  className="form-control"
                  onChange={async (e) => {
                    e.preventDefault();
                    await this.setState({
                      vender: e.target.value,
                    });
                  }}
                >
                  <option   value="-" selected >Select Vender</option>
                  <option   value="NMB" selected >NMB</option>
                  {this.renderTableRow()}
                </select>
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="row">
                    <a href="/login">I have an account.</a>
                  </div>
          
                </div>
        

                <div className="col-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={(e) => {
                      e.preventDefault();
                      this.doRegister();
                      //this.props.register(this.props.history, this.state);
                    }}
                  >
                    Sign Up
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger btn-block"
                    onClick={(e) => {
                      e.preventDefault();
                      this.clearData();
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
