import React, { Component } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";

class Master_opd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_opd: [],
      opd_name: "",
      opd_expire: "",
      opd_warning: "",
      opd_notify: "no",
    };
  }
  componentDidMount = async () => {
    this.call_master_data();
  };
  call_master_data = async () => {
    let all_data = await httpClient.get(server.OPD_ALL);
    // console.log(all_data.data.result);
    this.setState({ list_opd: all_data.data.result });
  };
  click_delete = async (mydata) => {
    Swal.fire({
      title: "Confirm",
      text: "You are going to delete " + mydata,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await httpClient.patch(server.OPD_DEL, { category: mydata });
        this.call_master_data();
      }
    });
  };
  click_add = async () => {
    Swal.fire({
      title: "Add Category",
      text: this.state.opd_name,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Add,",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await httpClient.post(server.OPD_IN, {
          category: this.state.opd_name,
          warning: this.state.opd_warning,
          expire: this.state.opd_expire,
          notify: this.state.opd_notify,
        });
        this.call_master_data();
        this.setState({ opd_name: "", opd_expire: "", opd_warning: "", opd_notify: "no" });
      }
    });
  };
  renderTableRow = () => {
    try {
      if (this.state.list_opd !== null) {
        const myResult = this.state.list_opd;
        return myResult.map((item) => (
          <tr>
            <td>{item.category}</td>
            <td>{item.warning}</td>
            <td>{item.expire}</td>
            <td>{item.notify}</td>
            <td>
              <button
                type="button"
                class="btn btn-outline-danger btn-block"
                onClick={async (e) => {
                  e.preventDefault();
                  // await this.setState({ model: item.model });
                  this.click_delete(item.category);
                }}
              >
                <i class="fa fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        ));
      }
    } catch (error) {}
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>Master OPD Category</h1>

        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card card-warning col-xs-7 col-sm-7 col-md-7 col-lg-7 " style={{ margin: 20 }}>
            <div className="card-header">
              <div className="row"></div>
            </div>
            <div className="card-body table-responsive p-0" style={{ height: 500 }}>
              <table id="DivTable" className="table table-head-fixed table-hover text-nowrap" role="grid" aria-describedby="example2_info">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Warning</th>
                    <th>Expire</th>
                    <th>Notify</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{this.renderTableRow()}</tbody>
              </table>
            </div>
          </div>
          {/* <div class="col-sm-12 col-md-0"></div> */}
          <div className="card card-success  col-xs-3 col-sm-3 col-md-3 col-lg-3" style={{ margin: 20 }}>
            <div className="card-header">
              <div className="row"></div>
            </div>

            <div className="card-body" style={{ height: 500 }}>
              <div className="row">
                <div class="col-sm-12 col-md-12">
                  <label>OPD Category</label>
                  <input
                    autoFocus
                    value={this.state.opd_name}
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      this.setState({ opd_name: e.target.value });
                    }}
                  />
                </div>
              </div>

              <br />
              <div className="row">
                <div class="col-sm-12 col-md-12">
                  <label>Warning Day</label>
                  <input
                    value={this.state.opd_warning}
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      this.setState({ opd_warning: e.target.value });
                    }}
                  />
                </div>
              </div>

              <br />
              <div className="row">
                <div class="col-sm-12 col-md-12">
                  <label>Expire Day</label>
                  <input
                    value={this.state.opd_expire}
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      this.setState({ opd_expire: e.target.value });
                    }}
                  />
                </div>
              </div>

              <br />
              <div className="row">
                <div class="col-sm-12 col-md-12">
                  <label>Notify</label>
             

                  <select
                    className="form-control"
                    data-select2-id={1}
                    tabIndex={-1}
                    aria-hidden="true"
                    onChange={(e) => {
                      this.setState({ opd_notify: e.target.value });
                    }}
                  >
                    <option>no</option>
                    <option>yes</option>
                  </select>
                </div>
              </div>

              <br />
              <div className="row">
                <div class="col-sm-12 col-md-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={(e) => {
                      e.preventDefault();
                      this.click_add();
                    }}
                  >
                    Submit
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

export default Master_opd;
