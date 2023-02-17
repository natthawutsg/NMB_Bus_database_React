import React, { Component, useState } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES, apiUrl } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import join from "url-join";

class Attn_record extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rfid: "",
      emp_no: "",
      emp_name: "",
      vender_name: "",
      plate_id: "",
      path_image: "",
    };
  }

  async componentDidMount() {}
  rfid_KeyPress = (event) => {
    if (event.key === "Enter") {
      console.log("enter", this.state.rfid);
      this.find_data(this.state.rfid);
    }
  };
  find_data = async (r_rfid) => {
    var my_rfid = r_rfid.replace(/\s/g, "");
    console.log(my_rfid);
    let rfid_data = await httpClient.post(server.RFID_RFID, { rfid: my_rfid });
    if (rfid_data.data.result !== "rfid_not_found") {
      console.log("rfid", rfid_data.data.result);
      this.setState({
        emp_no: rfid_data.data.result.emp_no,
        emp_name: rfid_data.data.result.driver_name,
        vender_name: rfid_data.data.result.vender,
        plate_id: rfid_data.data.result.plate_id,
        rfid: my_rfid,
        image: rfid_data.data.result.pic1.data,
        path_image: `rfid/picture/${rfid_data.data.result.emp_no}`,
      });
      this.find_data2();
    } else {
      let emp_data = await httpClient.post(server.RFID_EMP, { emp_no: my_rfid });
      if (emp_data.data.result !== "emp_no_not_found") {
        console.log("emp_no", emp_data.data.result);
        this.setState({
          emp_no: emp_data.data.result.emp_no,
          emp_name: emp_data.data.result.driver_name,
          vender_name: emp_data.data.result.vender,
          plate_id: emp_data.data.result.plate_id,
          image: emp_data.data.result.pic1.data,
          rfid: emp_data.data.result.rfid,
          path_image: `rfid/picture/${emp_data.data.result.emp_no}`,
        });
        this.find_data2();
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่พบข้อมูล",
          // text: "RFID is duplicated.",
          showConfirmButton: false,
          timer: 2500,
        });
        this.setState({ rfid: "" });
        return;
      }
    }
  };
  find_data2 = async () => {
    console.log(this.state.emp_no);
    let find_data = await httpClient.post(server.RECORD_LAST, { emp_no: this.state.emp_no });
    // console.log(find_data.data.result[0].timestamp);
    if (find_data.data.result[0].timestamp == null) {
      console.log("no last data");
      this.record_data();
    } else {
      const yourDate = new Date();
      var time_now = moment(yourDate).format("YYYY-MM-DD HH:mm:ss.000");
      var time_db = moment.utc(find_data.data.result[0].timestamp).format("YYYY-MM-DD HH:mm:ss.000");
      console.log("time_now", time_now);
      console.log("time_db", time_db);

      var time_dif = moment(time_now, "YYYY-MM-DD HH:mm:ss.000").diff(moment(time_db, "YYYY-MM-DD HH:mm:ss.000"), "minutes");
      console.log(time_dif);
      if (time_dif < 30) {
        Swal.fire({
          icon: "info",
          title: "ไม่บันทึก",
          text: "กรุณาบันทึกอีกครั้ง ในอีก " + (30 - time_dif) + " นาที",
        });
        this.setState({ rfid: "", emp_no: "", emp_name: "", vender_name: "", plate_id: "", path_image: "" });
        return;
      } else {
        this.record_data();
      }
    }
    // this.record_data()
    // console.log(moment(find_data.data.result[0].timestamp).format("YYYY-MM-DD HH:mm:ss.000"));
  };
  record_data = async () => {
    const yourDate = new Date();
    var my_data = {
      timestamp: moment(yourDate).add(7, "hour").format("YYYY-MM-DD HH:mm:ss.000"),
      time: moment(yourDate).format("HH:mm:ss"),
      mfgdate: moment(yourDate).format("YYYY-MM-DD"),
      emp_no: this.state.emp_no,
      driver_name: this.state.emp_name,
      vender: this.state.vender_name,
      plate_id: this.state.plate_id,
      rfid: this.state.rfid,
    };
    // console.log(my_data);

    let input_data = await httpClient.post(server.RECORD_IN, my_data);
    if (input_data.data.api_result == "ok") {
      Swal.fire({
        icon: "success",
        // title: "Welcome to the web-site of",
        // text: { APP_TITLE }.APP_TITLE,
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please see Console.log",
        showConfirmButton: true,
        // timer: 100000,
      });
    }
    this.setState({ rfid: "" });
  };
  render() {
    return (
      <div className="content-wrapper"  >

        <h1 style={{ textAlign: "center" }}>Driver Attendance</h1>

        <div
          className="row"
          style={{
    
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="card card-secondary col-md-8">
            <div className="card-body">
              <div className="row">
                <div style={{ width: "70%" }}>
                  <div className="row">
                    <div style={{ width: "91%" }}>
                      <input
                        autoFocus
                        type="text"
                        placeholder="Scan Here.."
                        value={this.state.rfid}
                        className="form-control"
                        onKeyPress={this.rfid_KeyPress}
                        onChange={async (e) => {
                          e.preventDefault();
                          await this.setState({
                            rfid: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div style={{ width: "91%" }}>
                      <label>ชื่อ-นามสกุล </label>
                      <input style={{ backgroundColor: "white" }} readOnly={true} type="text" value={this.state.emp_name} className="form-control" />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div style={{ width: "30%" }}>
                      <label>รหัสพนักงาน</label>
                      <input style={{ backgroundColor: "white" }} readOnly={true} type="text" value={this.state.emp_no} className="form-control" />
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "25%" }}>
                      <label>ทะเบียนรถ</label>
                      <input style={{ backgroundColor: "white" }} readOnly={true} type="text" value={this.state.plate_id} className="form-control" />
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "30%" }}>
                      <label>ผู้ประกอบการ</label>
                      <input
                        value={this.state.vender_name}
                        className="form-control"
                        style={{ backgroundColor: "white" }}
                        readOnly={true}
                        type="text"
                      ></input>
                    </div>
                  </div>
                  <br />
                </div>
                <div style={{ width: "30%", borderStyle: "groove" }}>
                  <img
                    style={{ flex: 1, width: "100%", height: "100%", resizeMode: "contain" }}
                    id="target"
                    src={join(apiUrl, this.state.path_image)}
                  />
                </div>
              </div>
              {/* <br />
              <div className="row">
                <div style={{ width: "10%", marginLeft: 20 }}>
                  <label>ข้อมูล</label>
                  <button className="btn btn-success">Upload</button>
                </div>
                <div style={{ width: "10%", marginLeft: 20 }}>
                  <label>ข้อมูล</label>
                  <button className="btn btn-success">Upload</button>
                </div>
                <div style={{ width: "10%", marginLeft: 20 }}>
                  <label>ข้อมูล</label>
                  <button className="btn btn-success">Upload</button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Attn_record;
