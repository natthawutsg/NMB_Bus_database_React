import React, { Component, useState } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES, apiUrl } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import join from "url-join";
import { FaUser, FaUserTimes } from "react-icons/fa";
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      AdminDisplay: "",
      GuestDisplay: "",
      SuperDisplay: "",
      display_btn_in: "",
      display_btn_out: "",

      user_level: "",
      display_account: "none",
      display_camera: "none",
      display_report: "none",
      display_main: "",
      display_driver: "none",
      display_opd: "none",
      display_bus: "none",
      display_admin_tool: "none",
      display_route_design: "none",
    };
  }
  async componentDidMount() {
    const handler = (e) => this.setState({ matches: e.matches });
    window.matchMedia("(min-width: 768px)").addEventListener("change", handler);
    let myCase = localStorage.getItem(key.USER_LV);
    // console.log(myCase);
    // if (myCase == "Admin") {
    //   this.setState({ AdminDisplay: "", GuestDisplay: "" });
    // } else {
    //   this.setState({ AdminDisplay: "none", GuestDisplay: "" });
    // }

    switch (myCase) {
      case "Admin":
        this.setState({ AdminDisplay: "", SuperDisplay: "", GuestDisplay: "", user_level: "Admin" ,display_route_design:""});
        break;
      case "Super":
        this.setState({ AdminDisplay: "none", SuperDisplay: "", GuestDisplay: "", user_level: "Super" });
        break;
      default:
        this.setState({ AdminDisplay: "none", SuperDisplay: "none", GuestDisplay: "", user_level: "User" });
    }

    let myPass = localStorage.getItem(key.LOGIN_PASSED);
    // console.log(myPass);
    if (myPass === "YES") {
      this.setState({ display_btn_in: "none", display_btn_out: "" });
    } else {
      this.setState({ display_btn_in: "", display_btn_out: "none" });
    }
    console.log("AdminDisplay", this.state.AdminDisplay);
    console.log("display_admin_tool", this.state.display_admin_tool);
  }

  back_to_home = () => {
    this.setState({
      display_account: "none",
      display_camera: "none",
      display_report: "none",
      display_main: "none",
      display_driver: "none",
      display_opd: "none",
      display_bus: "none",
      display_admin_tool: "none",
      display_route_design: "none",
    });
  };


  render() {
    return (
      <div className="content-wrapper">
        {/* <h3 style={{ textAlign: "center" }}>Main Menu</h3> */}

        <div
          className="row"
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <h3 style={{ textAlign: "center" }}>Main Menu</h3>
                </h3>
              </div>
              <div className="card-body">
                <div id="accordion">                  
                  <div className="card card-secondary"   style={{ display: this.state.display_btn_out }}>
                    <div className="card-header">
                      <h4 className="card-title w-100">
                        <a className="d-block w-100 collapsed" data-toggle="collapse" href="#collapse1" aria-expanded="false">
                          Attendance
                        </a>
                      </h4>
                    </div>
                    <div id="collapse1" className="collapse" data-parent="#accordion" style={{}}>
                      <div className="card-body">
                        <a class="dropdown-item" href="/attn_rec">
                          Attendance Record
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="/report_attendance">
                          Attendance Report
                        </a>                       
                      </div>
                    </div>
                  </div>
                  <div className="card card-secondary"   style={{ display: this.state.display_btn_out }}>
                    <div className="card-header">
                      <h4 className="card-title w-100">
                        <a className="d-block w-100 collapsed" data-toggle="collapse" href="#collapseTwo" aria-expanded="false">
                          Camera
                        </a>
                      </h4>
                    </div>
                    <div id="collapseTwo" className="collapse" data-parent="#accordion" style={{}}>
                      <div className="card-body">
                        <a class="dropdown-item" href="/camera_check_plate">
                          Record by Plate
                        </a>
                        <a class="dropdown-item" href="/camera_check_rfid">
                          Record by RFID
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="/report_camera">
                          Report
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card card-secondary"   style={{ display: this.state.display_btn_out }}>
                    <div className="card-header">
                      <h4 className="card-title w-100">
                        <a className="d-block w-100 collapsed" data-toggle="collapse" href="#collapseThree" aria-expanded="false">
                          Account
                        </a>
                      </h4>
                    </div>
                    <div id="collapseThree" className="collapse" data-parent="#accordion" style={{}}>
                      <div className="card-body">
                        <a class="dropdown-item" href="/changepassword">
                          Change Password
                        </a>
                        <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                        <a class="dropdown-item" href="/register" style={{ display: this.state.AdminDisplay }}>
                          Registration
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card card-secondary"  style={{ display: this.state.SuperDisplay }}>
                    <div className="card-header">
                      <h4 className="card-title w-100">
                        <a className="d-block w-100 collapsed" data-toggle="collapse" href="#collapseFour" aria-expanded="false">
                          OPD
                        </a>
                      </h4>
                    </div>
                    <div id="collapseFour" className="collapse" data-parent="#accordion" style={{}}>
                      <div className="card-body">
                        <a class="dropdown-item" href="/opd_input">
                          OPD Input
                        </a>
                        <a class="dropdown-item" href="/opd_report">
                          OPD Report
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card card-secondary"  style={{ display: this.state.SuperDisplay }}>
                    <div className="card-header">
                      <h4 className="card-title w-100">
                        <a className="d-block w-100 collapsed" data-toggle="collapse" href="#collapseFive" aria-expanded="false">
                          Bus Database
                        </a>
                      </h4>
                    </div>
                    <div id="collapseFive" className="collapse" data-parent="#accordion" style={{}}>
                      <div className="card-body">
                        <a class="dropdown-item" href="/bus_db">
                          Bus Input
                        </a>
                        <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                        <a class="dropdown-item" href="/ach_bus" style={{ display: this.state.AdminDisplay }}>
                          Bus History
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card card-secondary"  style={{ display: this.state.SuperDisplay }}>
                    <div className="card-header">
                      <h4 className="card-title w-100">
                        <a className="d-block w-100 collapsed" data-toggle="collapse" href="#collapse6" aria-expanded="false">
                          Driver
                        </a>
                      </h4>
                    </div>
                    <div id="collapse6" className="collapse" data-parent="#accordion" style={{}}>
                      <div className="card-body">
                      <a class="dropdown-item" href="/driver_license">
                    License
                  </a>
                  <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                  <a class="dropdown-item" href="/card_regist">
                    Driver Regist
                  </a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="/card_list">
                    Driver List
                  </a>
                  <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                  <a class="dropdown-item" href="/ach_driver" style={{ display: this.state.AdminDisplay }}>
                    Driver History
                  </a>
                  <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                  <a class="dropdown-item" href="/black_list" style={{ display: this.state.AdminDisplay }}>
                    Black List
                  </a>
                      </div>
                    </div>
                  </div>
                  <div className="card card-secondary"  style={{ display: this.state.display_route_design }}>
                    <div className="card-header">
                      <h4 className="card-title w-100">
                        <a className="d-block w-100 collapsed" data-toggle="collapse" href="#collapse7" aria-expanded="false">
                          Route Design
                        </a>
                      </h4>
                    </div>
                    <div id="collapse7" className="collapse" data-parent="#accordion">
                      <div className="card-body">
                      <a class="dropdown-item" href="/route_design">
                    Input
                  </a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="/route_report_plate">
                  Summary by Plate
                  </a>

                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="/master_opd" >
                    OPD Category
                  </a>
                      </div>
                    </div>
                  </div>
                  <div className="card card-danger"  style={{ display: this.state.AdminDisplay }}>
                    <div className="card-header">
                      <h4 className="card-title w-100">
                        <a className="d-block w-100 collapsed" data-toggle="collapse" href="#collapse7" aria-expanded="false">
                          Administrator Tools
                        </a>
                      </h4>
                    </div>
                    <div id="collapse7" className="collapse" data-parent="#accordion" style={{}}>
                      <div className="card-body">
                      <a class="dropdown-item" href="/master_vender">
                    Vender
                  </a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="/listuser">
                    User
                  </a>

                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="/master_opd" >
                    OPD Category
                  </a>
                      </div>
                    </div>
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

export default Home;
