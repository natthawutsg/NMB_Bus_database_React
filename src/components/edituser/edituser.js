import Axios from "axios";
import React, { Component } from "react";
// import { connect } from "react-redux";
import { key, server } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";

class Edituser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: localStorage.getItem("user_edit"),
      levelUser: "-",
      list_vender: [],

      vender: "",
    };
  }

  ChangeLevel = async () => {
    if (this.state.levelUser == "-") {
      Swal.fire({
        icon: "error",
        title: "Please Select Group User",
      });

      return;
    } else {
      let level_put = await httpClient.put(server.URL_EDITUSER, this.state);
      this.props.history.push("/listuser");
    }
  };

  DeleteUser = async () => {
    let delete_user = await httpClient.patch(server.URL_DELETEUSER, this.state);
    this.props.history.push("/listuser");
  };

  async componentDidMount() {
    if (localStorage.getItem(key.USER_LV) === "Admin") {
      let all_data = await httpClient.get(server.VENDER_ALL);
      // console.log(all_data.data.result);
      this.setState({ list_vender: all_data.data.result });
    } else {
      this.props.history.push("/home");
    }
  }

  renderTableRow = () => {
    try {
      if (this.state.list_vender !== null) {
        const myResult = this.state.list_vender;
        return myResult.map((item) => <option value={item.vender_name}>{item.vender_name}</option>);
      }
    } catch (error) {}
  };
  render() {
    return (
      <div className="content-wrapper">
        {/* ////////////////////////////// */}

        <div className="login-page" style={{ maxHeight: 608 }}>
          <div className="login-box">
            <div className="login-logo"></div>
            <div className="card">
              <div className="card-body login-card-body">
                <p className="login-box-msg">Edit or Delete User</p>

                <div className="input-group mb-3">
                  <input type="text" className="form-control" placeholder={this.state.username} readOnly="true" />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user" />
                    </div>
                  </div>
                  <div className="col-4">
                    <button
                      type="submit"
                      className="btn btn-danger btn-block"
                      onClick={(e) => {
                        e.preventDefault();
                        this.DeleteUser();
                      }}
                    >
                      Delete
                    </button>
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
                    <option value="-" selected>
                      Select Level
                    </option>
                    <option value="Admin">Admin</option>
                    <option value="Super">Super</option>
                    <option value="User">User</option>
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
                    <option value="-" selected>
                      Select Vender
                    </option>
                    <option   value="NMB" selected >NMB</option>
                    {this.renderTableRow()}
                  </select>
                </div>

                <div className="row">
                  <div className="col-5">
                    <button
                      type="submit"
                      className="btn btn-info btn-block"
                      onClick={(e) => {
                        e.preventDefault();
                        this.ChangeLevel();
                      }}
                    >
                      Change
                    </button>
                  </div>
                  <div className="col-2"></div>
                  <div className="col-5">
                    <button
                      type="submit"
                      className="btn btn-block btn-secondary"
                      onClick={(e) => {
                        e.preventDefault();

                        this.props.history.push("/listuser");
                      }}
                    >
                      Return&nbsp;&nbsp;
                      <span className="fas fa-redo-alt" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//Reducer
// const mapStateToProps = (state) => ({
//   edituserReducer: state.edituserReducer,
// });

// //Action
// const mapDispatchToProps = {
//   ...actions,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(Edituser);
export default Edituser;
