import React, { Component } from "react";
import { key, server } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import { FaUser, FaUserTimes, FaHome } from "react-icons/fa";

import { BrowserView, MobileView } from "react-device-detect";
class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      AdminDisplay: "",
      GuestDisplay: "",
      SuperDisplay: "",
      display_btn_in: "",
      display_btn_out: "",

      user_level: "",

      matches: window.matchMedia("(min-width: 600px)").matches,
      display_account: "none",
      display_camera: "none",
      display_report: "none",
      display_main: "",
      display_driver: "none",
      display_opd: "none",
      display_bus: "none",
      display_admin_tool: "none",
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
        this.setState({ AdminDisplay: "", SuperDisplay: "", GuestDisplay: "", user_level: "Admin" });
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
    });
  };

  render() {
    return (
      <div>
        <BrowserView>
          <nav className="main-header navbar navbar-expand navbar-white navbar-light" style={{ zIndex: 9999 }}>
            <ul className="navbar-nav">
              <li class="nav-item dropdown" style={{ display: this.state.display_btn_out }}>
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Attendance
                </a>

                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="/attn_rec">
                    Attendance Record
                  </a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="/report_attendance">
                    Attendance Report
                  </a>
                </div>
              </li>
              <li class="nav-item dropdown" style={{ display: this.state.display_btn_out }}>
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Camera
                </a>

                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
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
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  style={{ display: this.state.display_btn_out }}
                >
                  Account
                </a>

                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="/changepassword">
                    Change Password
                  </a>
                  <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                  <a class="dropdown-item" href="/register" style={{ display: this.state.AdminDisplay }}>
                    Registration
                  </a>
                </div>
              </li>
              <li class="nav-item dropdown" style={{ display: this.state.SuperDisplay }}>
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  OPD
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="/opd_input">
                    OPD Input
                  </a>
                  <a class="dropdown-item" href="/opd_report">
                    OPD Report
                  </a>
                </div>
              </li>
              <li class="nav-item dropdown" style={{ display: this.state.SuperDisplay }}>
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Bus Database
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="/bus_db">
                    Bus Input
                  </a>
                  {/* <a class="dropdown-item" href="/bus_db">
                  Report
                </a> */}
                  <div class="dropdown-divider" style={{ display: this.state.SuperDisplay }}></div>
                  <a class="dropdown-item" href="/ach_bus" style={{ display: this.state.SuperDisplay }}>
                    Bus History
                  </a>
                </div>
              </li>
              <li class="nav-item dropdown" style={{ display: this.state.SuperDisplay }}>
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Driver
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
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
                  <div class="dropdown-divider" style={{ display: this.state.SuperDisplay }}></div>
                  <a class="dropdown-item" href="/ach_driver" style={{ display: this.state.SuperDisplay }}>
                    Driver History
                  </a>
                  <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                  <a class="dropdown-item" href="/black_list" style={{ display: this.state.AdminDisplay }}>
                    Black List
                  </a>
                </div>
              </li>
              <li class="nav-item dropdown" style={{ display: this.state.AdminDisplay }}>
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Administrator Tools
                </a>

                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="/master_vender" style={{ display: this.state.AdminDisplay }}>
                    Vender
                  </a>
                  <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                  <a class="dropdown-item" href="/listuser" style={{ display: this.state.AdminDisplay }}>
                    User
                  </a>
                  <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                  <a class="dropdown-item" href="/master_opd" style={{ display: this.state.AdminDisplay }}>
                    OPD Category
                  </a>
                  {/* <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                  <a class="dropdown-item" href="/master_shift" style={{ display: this.state.AdminDisplay }}>
                    Shift
                  </a> */}
                  <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                  <a class="dropdown-item" href="/master_route" style={{ display: this.state.AdminDisplay }}>
                    Route
                  </a>
                  <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                  <a class="dropdown-item" href="/master_payment" style={{ display: this.state.AdminDisplay }}>
                  Payment
                  </a>
                </div>
              </li>
              <li class="nav-item dropdown" style={{ display: this.state.AdminDisplay }}>
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Route Design
                </a>

                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="/route_design" style={{ display: this.state.AdminDisplay }}>
                    Input
                  </a>
                  <div class="dropdown-divider" style={{ display: this.state.AdminDisplay }}></div>
                  <a class="dropdown-item" href="/listuser" style={{ display: this.state.AdminDisplay }}>
                  Summary by Plate
                  </a>
                  
                </div>
              </li>

             
            </ul>
            <div className="input-group-append"></div>
            <ul className="navbar-nav ml-auto"></ul>
            {localStorage.getItem(key.USER_NAME)} &nbsp;
            <div className="float-right d-none d-sm-inline-block">
              <button
                style={{ display: this.state.display_btn_out }}
                className="btn btn-block btn-danger"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.removeItem(key.LOGIN_PASSED);
                  localStorage.removeItem(key.USER_LV);
                  localStorage.removeItem(key.USER_NAME);
                  localStorage.removeItem(key.TIME_LOGIN);
                  localStorage.removeItem(key.USER_VENDER);
                  window.location.replace("../login");
                }}
              >
                <FaUserTimes />
              </button>
              <button
                style={{ display: this.state.display_btn_in }}
                className="btn btn-block btn-info"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.replace("../login");
                }}
              >
                <FaUser />
              </button>
            </div>
          </nav>
        </BrowserView>
        <MobileView>
          <nav className="main-header navbar navbar-expand navbar-white navbar-light" style={{ zIndex: 9999 }}>
            <div className="d-sm-inline-block">
              <button
                style={{ display: this.state.display_btn_out }}
                className="btn btn-block btn-secondary"
                type="button"
                onClick={(e) => {
                  window.location.replace("../home");
                }}
              >
                <FaHome />
              </button>
            </div>
            {/* <div className="input-group-append"></div> */}
            <ul className="navbar-nav ml-auto"></ul>
            {localStorage.getItem(key.USER_NAME)} &nbsp;
            <div className="d-sm-inline-block">
              <button
                style={{ display: this.state.display_btn_out }}
                className="btn btn-block btn-danger"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.removeItem(key.LOGIN_PASSED);
                  localStorage.removeItem(key.USER_LV);
                  localStorage.removeItem(key.USER_NAME);
                  localStorage.removeItem(key.TIME_LOGIN);
                  localStorage.removeItem(key.USER_VENDER);
                  window.location.replace("../login");
                }}
              >
                <FaUserTimes />
              </button>
            </div>
            &nbsp;
          </nav>
        </MobileView>
      </div>
    );
  }
}
export default Header;
