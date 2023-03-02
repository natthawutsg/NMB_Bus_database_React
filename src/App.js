import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import * as moment from "moment";
import Header from "./components/header/header.js";
import Footer from "./components/footer/footer.js";
import SideMenu from "./components/sidemenu/sidemenu.js";
import Home from "./components/home/home.js";
import Login from "./components/login/login.js";
import Register from "./components/register/register.js";
import ChangePassword from "./components/changepassword/changepassword";
import RegisterRules from "./components/registrule/registrule";
import { key, NO, YES } from "./constance/contance.js";
import Edit_User from "./components/edituser/edituser";
import List_User from "./components/listuser/listuser";
import Master_Vender from "./components/master_vender/master_vender";
import Card_List from "./components/card_list/card_list";
import Card_Regist from "./components/card_regist/card_regist";
import Term_Condition from "./components/term/term";
import Report_Raw from "./components/report_raw/report_raw";
import Report_Table from "./components/report_table/report_table";
import Camera_check from "./components/camera_check/camera_check";
import Camera_check_plate from "./components/camera_check_plate/camera_check_plate";
import Swal from "sweetalert2";
import ATTN from "./components/attn_record/attn_record";
import Black_List from "./components/black_list/black_list";
import Driver_license from "./components/driver_license/driver_license";
import MASTER_OPD from "./components/master_opd/master_opd";
import Black_report from "./components/black_report/black_report";
import OPD_INPUT from "./components/opd_input/opd_input";
import OPD_REPORT from "./components/opd_report/opd_report";
import BUS_DB from "./components/bus_db/bus_db";
import ROUTE_DESIGN from "./components/route_design/route_design";

import ACH_BUS from "./components/report_achive_bus/report_achive_bus";
import ACH_DRIVER from "./components/report_achive_driver/report_achive_driver";
import MASTER_ROUTE from "./components/master_route/master_route";
import MASTER_PAYMENT from "./components/master_payment/master_payment";
// const express= require('express');
// const bodyParser= require('body-parser');
// const app= express();
// app.use(bodyParser.json())

const IsLogin = () => {
  //return true if === YES
  return localStorage.getItem(key.LOGIN_PASSED) === YES;
};

const isLoginTimeOut = (value, unit) => {
  const loginTime = moment(localStorage.getItem(key.TIME_LOGIN))
    .add(value, unit)
    .toDate();
  // alert("loginTime = " + loginTime);
  // alert("loginTimomentme = " + moment());
  if (loginTime < moment()) {
      localStorage.removeItem(key.LOGIN_PASSED);
      localStorage.removeItem(key.USER_NAME);
      localStorage.removeItem(key.USER_LV);
      localStorage.removeItem(key.USER_EMP);
      localStorage.removeItem(key.TIME_LOGIN);
      // alert('App say : '+localStorage.getItem(key.LOGIN_PASSED))

    Swal.fire({
      icon: "info",
      title: "Login timeout",
      text: "Please re login again...",
      showCancelButton: false,
    }).then( async () => {
      window.location.replace("../login");
 
    });
    return true;
  } else {
    return false;
  }
};

const SecuredRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      IsLogin() === true && isLoginTimeOut(4, "h") === false ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default class App extends Component {
  redirectToLogin = () => {
    //ถ้า return error ให้ไปที่ login
    return <Redirect to="/login" />;
  };

  render() {
    return (
      <Router>
        <div>
          {IsLogin() && <Header />}
         {/* <Header /> */}
          {/* {IsLogin() && <SideMenu />} */}

          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/camera_check_rfid" component={Camera_check} />
            <Route path="/camera_check_plate" component={Camera_check_plate} />
            <SecuredRoute path="/edituser" component={Edit_User} />
            <SecuredRoute path="/attn_rec" component={ATTN} />
            <SecuredRoute path="/card_regist" component={Card_Regist} />
            <SecuredRoute path="/listuser" component={List_User} />
            <Route path="/login" component={Login} />
            <SecuredRoute path="/card_list" component={Card_List} />
            <Route path="/register" component={Register} />
            <Route path="/term" component={Term_Condition} />
            <Route path="/registrule" component={RegisterRules} />
            <SecuredRoute path="/changepassword" component={ChangePassword} />
            <SecuredRoute path="/master_vender" component={Master_Vender} />
            <SecuredRoute path="/report_attendance" component={Report_Raw} />
            <SecuredRoute path="/report_camera" component={Report_Table} />
            <SecuredRoute path="/driver_license" component={Driver_license} />
            <SecuredRoute path="/black_list" component={Black_List} />
            <SecuredRoute path="/black_report" component={Black_report} />
            <SecuredRoute path="/master_opd" component={MASTER_OPD} />
            <SecuredRoute path="/opd_input" component={OPD_INPUT} />
            <SecuredRoute path="/opd_report" component={OPD_REPORT} />
            <SecuredRoute path="/bus_db" component={BUS_DB} />
        
            <SecuredRoute path="/master_route" component={MASTER_ROUTE} />
            <SecuredRoute path="/master_payment" component={MASTER_PAYMENT} />
            <SecuredRoute path="/route_design" component={ROUTE_DESIGN} />
            <SecuredRoute path="/ach_bus" component={ACH_BUS} />
            <SecuredRoute path="/ach_driver" component={ACH_DRIVER} />
            {/* ถ้า return error ให้ไปที่ login */}
            <Route exact={true} path="/" component={this.redirectToLogin} />
            <Route exact={true} path="*" component={this.redirectToLogin} />
          </Switch>
          {IsLogin() && <Footer />}
        </div>
      </Router>
    );
  }
}
