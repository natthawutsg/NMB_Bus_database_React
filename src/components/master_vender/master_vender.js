import React, { Component } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";

class Master_vender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_vender: [],
      vender_name: "",
    };
  }
  componentDidMount = async () => {
    this.call_master_data();
  };
  call_master_data = async () => {
    let all_data = await httpClient.get(server.VENDER_ALL);
    // console.log(all_data.data.result);
    this.setState({ list_vender: all_data.data.result });
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
        await httpClient.patch(server.VENDER_DEL, { vender_name: mydata });
        this.call_master_data();
      }
    });
  };
  click_add = async () => {
    Swal.fire({
      title: "Add Vender",
      text: this.state.vender_name,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Add,",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await httpClient.post(server.VENDER_IN, {
          vender_name: this.state.vender_name,
        });
        this.call_master_data();
        this.setState({ vender_name: "" });
      }
    });
  };

  renderTableRow = () => {
    try {
      if (this.state.list_vender !== null) {
        const myResult = this.state.list_vender;
        return myResult.map((item) => (
          <tr>
            <td>{item.vender_name}</td>

            <td>
              <button
                type="button"
                class="btn btn-outline-danger btn-block"
                onClick={async (e) => {
                  e.preventDefault();
                  // await this.setState({ model: item.model });
                  this.click_delete(item.vender_name);
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
        <h1 style={{ textAlign: "center" }}>Master Vender</h1>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card card-warning col-md-4">
            <div className="card-header" style={{ backgroundColor: "#6666ff" }}>
              <div className="row"></div>
            </div>
            <div className="card-body table-responsive p-0" style={{ height: 400 }}>
              <table id="DivTable" className="table table-head-fixed table-hover text-nowrap" role="grid" aria-describedby="example2_info">
                <thead>
                  <tr>
                    <th>Vender Name</th>

                    <th></th>
                  </tr>
                </thead>
                <tbody>{this.renderTableRow()}</tbody>
              </table>
            </div>
          </div>
          <div class="col-sm-12 col-md-1"></div>
          <div className="card card-warning col-md-4">
            <div className="card-header" style={{ backgroundColor: "#6666ff" }}>
              <div className="row"></div>
            </div>

            <div className="card-body">
              <div className="row">
                <div class="col-sm-12 col-md-12">
                  <h5>Vender Name</h5>
                  <input
                    autoFocus
                    value={this.state.vender_name}
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      this.setState({ vender_name: e.target.value });
                    }}
                  />
                </div>
              </div>

              <br />
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

export default Master_vender;
