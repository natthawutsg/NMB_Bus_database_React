import React, { Component, useState } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
// useState
import readXlsxFile from "read-excel-file";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class Card_regist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rfid: "",
      emp_no: "",
      emp_name: "",
      vender_name: "",
      plate_id: "",
      list_vender: [],
      selectedPic1: null,
      selectedPic_card: null,
      example: [
        {
          rfid: "123A456B789",
          emp_no: "A001",
          driver_name: "ทดสอบ 1",
          plate_id: "10-999",
          vender: "vdr1",
          birth_date: "2023-01-31",
          license_date: "2023-01-31",
          employ_date: "2023-01-31",
        },
        {
          rfid: "A456B789C123",
          emp_no: "A002",
          driver_name: "ทดสอบ 2",
          plate_id: "99-100",
          vender: "vdr2",
          birth_date: "2023-01-31",
          license_date: "2023-01-31",
          employ_date: "2023-01-31",
        },
      ],
      excel_data: [],
      read_only_vender: false,
      birth_date: moment().add(-0, "days").format("YYYY-MM-DD"),
      expire_date: moment().add(-0, "days").format("YYYY-MM-DD"),
      employ_date: moment().add(-0, "days").format("YYYY-MM-DD"),
    };
  }
  componentDidMount = async () => {
    this.call_master_data();

    if (localStorage.getItem(key.USER_LV) == "Admin" || localStorage.getItem(key.USER_LV) == "Super") {
      this.setState({ read_only_vender: false });
    } else {
      this.setState({ vender_name: localStorage.getItem(key.USER_LV), read_only_vender: true });
    }
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

  rfid_KeyPress = (event) => {
    if (event.key === "Enter") {
      this.input_emp_no.focus();
    }
  };
  emp_no_KeyPress = (event) => {
    if (event.key === "Enter") {
      this.input_emp_name.focus();
    }
  };
  emp_name_KeyPress = (event) => {
    if (event.key === "Enter") {
      this.input_plate_id.focus();
    }
  };

  Click_Regist = async (r_rfid, r_emp_no, r_emp_name, r_plate_id, r_vender_name, d_birth, d_license, d_employ) => {
    if (r_rfid === "" || r_emp_no === "" || r_plate_id === "" || r_emp_name === "" || r_vender_name === "") {
      Swal.fire({
        icon: "error",
        title: "Can not Regist.",
        text: "Please input all data.",
      });
      return;
    }

    var my_rfid = r_rfid.toString().replace(/\s/g, "");
    var my_emp = r_emp_no.toString().replace(/\s/g, "");
    var my_plate = r_plate_id.toString().replace(/\s/g, "");

    let rfid_data = await httpClient.post(server.RFID_RFID, { rfid: my_rfid });
    let emp_data = await httpClient.post(server.RFID_EMP, { emp_no: my_emp });
    console.log(rfid_data.data.result);
    console.log(emp_data.data.result);

    if (rfid_data.data.result !== "rfid_not_found") {
      Swal.fire({
        icon: "warning",
        title: "Can not Regist.",
        text: "RFID is duplicated.",
      });
      return;
    } else {
      if (emp_data.data.result !== "emp_no_not_found") {
        Swal.fire({
          icon: "warning",
          title: "Can not Regist.",
          text: "EMP No is duplicated.",
        });
        return;
      } else {
        this.insert_data(my_rfid, my_emp, r_emp_name, my_plate, r_vender_name, d_birth, d_license, d_employ);
      }
    }
  };
  insert_data = async (my_rfid, my_emp, my_name, my_plate, my_vender, d_birth, d_license, d_employ) => {
    const formData = new FormData();
    formData.append("rfid", my_rfid);
    formData.append("emp_no", my_emp);
    formData.append("driver_name", my_name);
    formData.append("plate_id", my_plate);
    formData.append("vender", my_vender);
    formData.append("employ_date", d_employ);
    formData.append("pic1", this.state.selectedPic1);

    if (localStorage.getItem(key.USER_LV) == "Admin" || localStorage.getItem(key.USER_LV) == "Super") {
      formData.append("vender", my_vender);
    } else {
      formData.append("vender", localStorage.getItem(key.USER_LV));
    }

    console.log(formData);
    let input_data = await httpClient.post(server.RFID_IN, formData);
    if (input_data.data.api_result !== "ok") {
      Swal.fire({
        icon: "error",
        title: input_data.data.api_result,
        text: "Please check console.log",
      });
      console.log(input_data.data);
      return;
    } else {
      // window.location.reload(false);
      this.driver_data_add();
    }
  };
  driver_data_add = async () => {
    const formData = new FormData();
    formData.append("emp_no", this.state.emp_no);
    formData.append("license_date", this.state.expire_date);
    formData.append("birth_date", this.state.birth_date);

    formData.append("pic1", this.state.selectedPic_card);
    console.log(formData);
    let input_data = await httpClient.post(server.DRIVER_IN, formData);
    if (input_data.data.api_result !== "ok") {
      Swal.fire({
        icon: "error",
        title: input_data.data.api_result,
        text: "Please check console.log",
      });
      console.log(input_data.data);
      return;
    } else {
      await Swal.fire({
        icon: "success",
        // title: "Welcome to the web-site of",
        // text: { APP_TITLE }.APP_TITLE,
        showConfirmButton: false,
        timer: 500,
      });
      window.location.reload(false);
    }
  };
  onImageChange = (event) => {
    console.log(event.target);
    if (event.target.files && event.target.files[0]) {
      this.setState({
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };
  click_check = async () => {
    const input = document.getElementById("input");
    input.addEventListener("change", async () => {});
    const data1 = await readXlsxFile(input.files[0]);
    this.setState({
      excel_data: data1,
    });
    console.log(this.state.excel_data);
    for (let index = 1; index < this.state.excel_data.length; index++) {
      this.Click_Regist(
        this.state.excel_data[index][0],
        this.state.excel_data[index][1],
        this.state.excel_data[index][2],
        this.state.excel_data[index][3],
        this.state.excel_data[index][4],
        this.state.excel_data[index][5],
        this.state.excel_data[index][6],
        this.state.excel_data[index][7]
      );
    }
    Swal.fire({
      icon: "success",
      title: "Please wait .....",
      showConfirmButton: false,
    });
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>Card Registration</h1>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card card-secondary col-md-11">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
              <div className="row">
                <div class="col-sm-12 col-md-6">
                  <div className="row">
                    <div style={{ width: "58%" }}>
                      <label>RFID</label>
                      <input
                        autoFocus
                        type="text"
                        value={this.state.rfid}
                        className="form-control"
                        onKeyPress={this.rfid_KeyPress}
                        onChange={async (e) => {
                          e.preventDefault();
                          await this.setState({
                            rfid: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "30%" }}>
                      <label>EMP No</label>
                      <input
                        ref={(input) => {
                          this.input_emp_no = input;
                        }}
                        onKeyPress={this.emp_no_KeyPress}
                        type="text"
                        value={this.state.emp_no}
                        className="form-control"
                        onChange={async (e) => {
                          e.preventDefault();
                          await this.setState({
                            emp_no: e.target.value.toLocaleUpperCase(),
                          });
                        }}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div style={{ width: "91%" }}>
                      <label>EMP Name</label>
                      <input
                        ref={(input) => {
                          this.input_emp_name = input;
                        }}
                        onKeyPress={this.emp_name_KeyPress}
                        type="text"
                        value={this.state.emp_name}
                        className="form-control"
                        onChange={async (e) => {
                          e.preventDefault();
                          await this.setState({
                            emp_name: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div style={{ width: "25%" }}>
                      <label>Birth Date</label>

                      <input
                        class="form-control is-valid"
                        type="date"
                        id="id_daydate"
                        name="name_daydate"
                        value={this.state.birth_date}
                        onChange={async (e) => {
                          await this.setState({
                            birth_date: moment(e.target.value).format("YYYY-MM-DD"),
                          });
                          // this.call_data();
                        }}
                      />
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "30%" }}>
                      <label>License Date</label>

                      <input
                        class="form-control is-valid"
                        type="date"
                        id="id_daydate"
                        name="name_daydate"
                        value={this.state.expire_date}
                        onChange={async (e) => {
                          await this.setState({
                            expire_date: moment(e.target.value).format("YYYY-MM-DD"),
                          });
                          // this.call_data();
                        }}
                      />
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "30%" }}>
                      <label>Employ Date</label>
                      <input
                        class="form-control is-valid"
                        type="date"
                        id="id_daydate"
                        name="name_daydate"
                        value={this.state.employ_date}
                        onChange={async (e) => {
                          await this.setState({
                            employ_date: moment(e.target.value).format("YYYY-MM-DD"),
                          });
                          // this.call_data();
                        }}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div style={{ width: "25%" }}>
                      <label>Plate ID</label>
                      <input
                        ref={(input) => {
                          this.input_plate_id = input;
                        }}
                        type="text"
                        value={this.state.plate_id}
                        className="form-control"
                        onChange={async (e) => {
                          e.preventDefault();
                          await this.setState({
                            plate_id: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "30%" }}>
                      <label>Vender</label>
                      <select
                        disabled={this.state.read_only_vender}
                        value={this.state.vender_name}
                        className="form-control"
                        onChange={async (e) => {
                          e.preventDefault();
                          await this.setState({
                            vender_name: e.target.value,
                          });
                          this.input_plate_id.focus();
                        }}
                      >
                        <option value="-" selected>
                          Select One.
                        </option>
                        {this.renderTableRow()}
                      </select>
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "30%" }}>
                      <label> &nbsp;</label>
                      <button
                        style={{ width: "100%" }}
                        type="submit"
                        className="btn btn-success btn-block"
                        onClick={async (e) => {
                          await this.Click_Regist(
                            this.state.rfid,
                            this.state.emp_no,
                            this.state.emp_name,
                            this.state.plate_id,
                            this.state.vender_name,

                            this.state.birth_date,
                            this.state.license_date,
                            this.state.employ_date
                          );
                        }}
                      >
                        Regist
                      </button>
                    </div>
                    <div style={{ width: "3%" }}></div>
                  </div>
                  <br />
                </div>
                <div class="col-sm-12 col-md-3">
                  <div style={{ width: "100%" }}>
                    <label>Driver Picture</label>
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        // onChange={this.onImageChange}
                        onChange={async (e) => {
                          this.setState({ selectedPic1: e.target.files[0] });
                          document.getElementById("choosePic1").innerHTML = e.target.files[0].name;
                          //show current picture
                          if (e.target.files && e.target.files[0]) {
                            this.setState({
                              image: URL.createObjectURL(e.target.files[0]),
                            });
                          }
                        }}
                      />
                      <label className="custom-file-label" id="choosePic1">
                        Choose Pic
                      </label>
                    </div>
                  </div>
                  <img style={{ width: 250 }} id="target" src={this.state.image} />
                </div>

                <div class="col-sm-12 col-md-3">
                  <div style={{ width: "100%" }}>
                    <label>License Card Picture</label>
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        // onChange={this.onImageChange}
                        onChange={async (e) => {
                          this.setState({ selectedPic_card: e.target.files[0] });
                          document.getElementById("choosePic2").innerHTML = e.target.files[0].name;
                          //show current picture
                          if (e.target.files && e.target.files[0]) {
                            this.setState({
                              image_card: URL.createObjectURL(e.target.files[0]),
                            });
                          }
                        }}
                      />
                      <label className="custom-file-label" id="choosePic2">
                        Choose Pic
                      </label>
                    </div>
                  </div>
                  <img style={{ width: 250 }} id="target" src={this.state.image_card} />
                </div>
              </div>
            </div>
          </div>
          <div className="card card-secondary col-md-8">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
            <div className="row">
                <div class="col-sm-12 col-md-4">
                  <ExcelFile
                    element={<button className="btn btn-info btn-block">Format Download</button>}
                    filename="driver_upload_example"
                    // fileExtension="XLSX"
                  >
                    <ExcelSheet data={this.state.example} name="Sheet1">
                      <ExcelColumn label="rfid" value="rfid" />
                      <ExcelColumn label="emp_no" value="emp_no" />
                      <ExcelColumn label="driver_name" value="driver_name" />
                      <ExcelColumn label="plate_id" value="plate_id" />
                      <ExcelColumn label="vender" value="vender" />

                      <ExcelColumn label="birth_date" value="birth_date" />
                      <ExcelColumn label="license_date" value="license_date" />
                      <ExcelColumn label="employ_date" value="employ_date" />
                    </ExcelSheet>
                  </ExcelFile>
                </div>
                <div class="col-sm-12 col-md-4">
                  <input type="file" id="input" />
                </div>

                <div class="col-sm-12 col-md-4">
                  <button
                    className="btn btn-primary float-right"
                    onClick={(e) => {
                      e.preventDefault();
                      this.click_check();
                    }}
                  >
                    Upload
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

export default Card_regist;
