import React, { Component } from "react";
//import { Change_Password } from "./../../actions/changepassword.action";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { key, OK, server } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";

class Changepassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: localStorage.getItem(key.USER_NAME),
      newpassword: "",
      password: "",
      confirmpassword: "",
    };
  }
  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // this.props.Change_Password(this.props.history,this.state);
      this.Change_Password();
    }
  };

  Change_Password = async () => {
    if (this.state.newpassword !== this.state.confirmpassword) {
      Swal.fire({
        icon: "warning",
        title: "Password not match",
        text: "Plesase confirm your password",
      });

      return;
    }
    let Login_result = await httpClient.post(server.LOGIN_URL, this.state);

    //console.log(Login_result.data.api_result);

    if (Login_result.data.api_result === OK) {
      this.setState({ password: this.state.newpassword });
      let password_change = await httpClient.put(server.URL_PASSWORD,this.state);

     // console.log(password_change.result);

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        showConfirmButton: false,
      });
      window.location.replace("../home");
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
              <p className="register-box-msg">Change Password</p>

              {/* xx */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder={this.state.username}
                  readOnly="true"
                  // onChange={(e) => {
                  //   this.setState({ username: e.target.value });
                  // }}
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
                  type="password"
                  className="form-control"
                  placeholder="Old Password"
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
                  type="password"
                  className="form-control"
                  placeholder="New Password"
                  onChange={(e) => {
                    this.setState({ newpassword: e.target.value });
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
                  type="password"
                  className="form-control"
                  placeholder="Confirm New Password"
                  onChange={(e) => {
                    this.setState({ confirmpassword: e.target.value });
                  }}
                  onKeyPress={this.handleKeyPress}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-unlock" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={(e) => {
                      e.preventDefault();
                      // this.props.Change_Password(this.props.history,this.state);
                      this.Change_Password();
                    }}
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* check state ว่ามาถูกต้องมั้ย */}
              {/* <div>
                <p>username: {this.state.username}</p>
                <p>emp: {this.state.empNumber}</p>
                <p>password: {this.state.password}</p>
                <p>confirmpassword: {this.state.confirmpassword}</p>
                <p>divisionCode: {this.state.divisionCode}</p>
                <p>email: {this.state.email}</p>
              </div>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// //Reducer
// const mapStateToProps = (state) => ({
//   ChangepasswordReducer: state.ChangepasswordReducer,
// });

// //Action
// const mapDispatchToProps = {
//   Change_Password,
//   //userErrorAlerted,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(Changepassword); //
export default Changepassword;
