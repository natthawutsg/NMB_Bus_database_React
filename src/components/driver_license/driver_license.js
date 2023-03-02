import React, { Component } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES, apiUrl } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import join from "url-join";
import ReactExport from "react-export-excel";
import { FaCalendarCheck, FaCalendarTimes, FaAddressCard } from "react-icons/fa";
import { GoAlert } from "react-icons/go";
import { AiFillFileExcel } from "react-icons/ai";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Driver_license extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table_driver: [],
      all_driver: [],
      incomplete_driver: [],
      expire_driver: [],
      alert_driver: [],
      good_driver: [],
      // birth_date: moment().add(-0, "days").format("YYYY-MM-DD"),
      expire_date: moment().add(-0, "days").format("YYYY-MM-DD"),
      // read_only_birth_date: false,
      read_only_expire_date: false,
      // list_vender: [],
      // rfid: "",
      emp_no: "",
      emp_name: "",
      // vender_name: "",
      // plate_id: "",
      // id: "",
      selectedPic1: null,
      image: null,
      path_image: "",
      // pw: "",
      // display_btn_del: "none",
    };
  }
  componentDidMount = async () => {
    this.call_master_data();
  };
  call_master_data = async () => {
    console.log(localStorage.getItem(key.USER_LV));
    let all_data = await httpClient.post(server.DRIVER_ALL, { lv: localStorage.getItem(key.USER_LV), vender: localStorage.getItem(key.USER_VENDER) });
    let incomplete_data = await httpClient.post(server.DRIVER_INCOMPLETE, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    let alert_data = await httpClient.post(server.DRIVER_ALERT, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    let expire_data = await httpClient.post(server.DRIVER_EXPIRE, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    let good_data = await httpClient.post(server.DRIVER_GOOD, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });

    this.setState({
      all_driver: all_data.data.result,
      incomplete_driver: incomplete_data.data.result,
      expire_driver: expire_data.data.result,
      alert_driver: alert_data.data.result,
      good_driver: good_data.data.result,
      table_driver: incomplete_data.data.result,
    });
console.log("all_driver",all_data.data.result);
console.log("incomplete_driver",incomplete_data.data.result);
console.log("expire_driver",expire_data.data.result);
console.log("alert_driver",alert_data.data.result);
console.log("good_driver",good_data.data);

    // console.log(this.state.list_driver.length);
  };
  renderTableRow = () => {
    try {
      if (this.state.table_driver !== null) {
        const myResult = this.state.table_driver;
        return myResult.map((item) => (
          <tr>
            <td>{item.emp_no}</td>
            <td>{item.driver_name}</td>
            {/* <td>{item.birth_date}</td>
            <td>{item.age}</td> */}
            <td>
              <div className="row">
                {item.license_date}&nbsp;
                <div style={{ fontWeight: "bold", display: item.case_color }}>({item.license_remain})</div>
              </div>
            </td>

            <td>
              <h3 style={{ display: item.display_green, color: "green" }}>
                <FaCalendarCheck />
              </h3>
              <h3 style={{ display: item.display_yellow, color: "orange" }}>
                <GoAlert />
              </h3>
              <h3 style={{ display: item.display_red, color: "red" }}>
                <FaCalendarTimes />
              </h3>

              {/* <button type="button" class={item.color_license}>
                <FaCalendarCheck />
                <GoAlert />
                <FaCalendarTimes />
              </button> */}
            </td>
            <td>
              <h3 style={{ display: item.icon_pic }}>
                <FaAddressCard />
              </h3>
            </td>
            <td>
              <button
                type="button"
                class="btn btn-info btn-block"
                onClick={async (e) => {
                  // var d_exp
                  // var d_birth

                  if (item.birth_date == null) {
                    this.setState({
                      birth_date: moment().add(-0, "days").format("YYYY-MM-DD"),
                    });
                  } else {
                    this.setState({
                      birth_date: item.birth_date,
                    });
                  }
                  if (item.license_date == null) {
                    this.setState({
                      expire_date: moment().add(-0, "days").format("YYYY-MM-DD"),
                    });
                  } else {
                    this.setState({
                      expire_date: item.license_date,
                    });
                  }
                  this.setState({
                    emp_no: item.emp_no,
                    emp_name: item.driver_name,
                    // birth_date: item.birth_date,
                    // expire_date: item.license_date,
                    image: item.pic1,
                    path_image: `driver/picture/${item.emp_no}`,
                  });
                }}
              >
                Select
              </button>
            </td>
          </tr>
        ));
      }
    } catch (error) {}
  };
  click_delete = async (mydata) => {
    Swal.fire({
      title: "Confirm",
      text: "You are going to clear " + mydata,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let dell = await httpClient.patch(server.DRIVER_DEL, { emp_no: mydata });
        if (dell.data.api_result == "ok") {
          await Swal.fire({
            icon: "success",
            // title: "Welcome to the web-site of",
            // text: { APP_TITLE }.APP_TITLE,
            showConfirmButton: false,
            timer: 500,
          });

          this.call_master_data();
          this.setState({
            // rfid: "",
            emp_no: "",
            emp_name: "",
            // vender_name: "",
            // plate_id: "",
            // id: "",
            selectedPic1: null,
            image: null,
            path_image: "",
          });
        }
      }
    });
  };
  Click_Update = async () => {
    let find_data = await httpClient.post(server.DRIVER_FIND, { emp_no: this.state.emp_no });
    console.log(find_data.data.result);
    if (find_data.data.result == null) {
      console.log("add");
      this.driver_data_add();
    } else {
      console.log("update");
      this.driver_data_update();
    }

    //     return
    //     console.log("emp_no", this.state.emp_no);
    // console.log("expire_date", this.state.expire_date);
    // console.log("birth_date", this.state.birth_date);
    // console.log("pic1", this.state.selectedPic1);
  };
  driver_data_add = async () => {
    const formData = new FormData();
    formData.append("emp_no", this.state.emp_no);
    formData.append("license_date", this.state.expire_date);
    // formData.append("birth_date", this.state.birth_date);

    formData.append("pic1", this.state.selectedPic1);
    console.log(formData);
    let input_data = await httpClient.post(server.DRIVER_IN, formData);
    if (input_data.data.api_result == "ok") {
      await Swal.fire({
        icon: "success",
        // title: "Welcome to the web-site of",
        // text: { APP_TITLE }.APP_TITLE,
        showConfirmButton: false,
        timer: 500,
      });
      window.location.reload(false);
    } else {
      console.log(input_data.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please see Console.log",
        showConfirmButton: true,
        // timer: 100000,
      });
    }
  };
  driver_data_update = async () => {
    const formData = new FormData();
    formData.append("emp_no", this.state.emp_no);
    formData.append("license_date", this.state.expire_date);
    // formData.append("birth_date", this.state.birth_date);

    formData.append("pic1", this.state.selectedPic1);
    console.log(formData);
    let input_data = await httpClient.post(server.DRIVER_UPDATE, formData);
    if (input_data.data.api_result == "ok") {
      await Swal.fire({
        icon: "success",
        // title: "Welcome to the web-site of",
        // text: { APP_TITLE }.APP_TITLE,
        showConfirmButton: false,
        timer: 500,
      });
      window.location.reload(false);
    } else {
      console.log(input_data.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please see Console.log",
        showConfirmButton: true,
        // timer: 100000,
      });
    }
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>Driver License</h1>
        <div className="row">
          <div className="col-md-1"></div>
          <div className="card card-secondary col-md-10">
            <div className="card-header" style={{ backgroundColor: "lightgrey" }}>
              <div className="row">
                <div class="col-sm-12 col-md-2" style={{ marginTop: 10 }}>
                  <ExcelFile
                    element={
                      <button className="btn btn-dark btn-block">
                        Report Download <AiFillFileExcel />{" "}
                      </button>
                    }
                    filename="driver_list_report"
                    // fileExtension="XLSX"
                  >
                    <ExcelSheet data={this.state.table_driver} name="Sheet1">
                      <ExcelColumn label="emp_no" value="emp_no" />
                      <ExcelColumn label="driver_name" value="driver_name" />
                      {/* <ExcelColumn label="birth_date" value="birth_date" />
                      <ExcelColumn label="age" value="age" /> */}
                      <ExcelColumn label="license_date" value="license_date" />
                      <ExcelColumn label="license_remain" value="license_remain" />
                    </ExcelSheet>
                  </ExcelFile>
                </div>
                <div class="col-sm-12 col-md-2" style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    class="btn btn-info btn-block"
                    onClick={async (e) => {
                      this.setState({ table_driver: this.state.all_driver });
                    }}
                  >
                    All ({this.state.all_driver.length})
                  </button>
                </div>
                <div class="col-sm-12 col-md-2" style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    class="btn btn-danger btn-block"
                    onClick={async (e) => {
                      this.setState({ table_driver: this.state.incomplete_driver });
                    }}
                  >
                    Incomplete ({this.state.incomplete_driver.length})
                  </button>
                </div>
                <div class="col-sm-12 col-md-2" style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    class="btn btn-danger btn-block"
                    onClick={async (e) => {
                      this.setState({ table_driver: this.state.expire_driver });
                    }}
                  >
                    Expire ({this.state.expire_driver.length})
                  </button>
                </div>
                <div class="col-sm-12 col-md-2" style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    class="btn btn-warning btn-block"
                    onClick={async (e) => {
                      this.setState({ table_driver: this.state.alert_driver });
                    }}
                  >
                    Alert ({this.state.alert_driver.length})
                  </button>
                </div>
                <div class="col-sm-12 col-md-2" style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    class="btn btn-success btn-block"
                    onClick={async (e) => {
                      this.setState({ table_driver: this.state.good_driver });
                    }}
                  >
                    Activated ({this.state.good_driver.length})
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body table-responsive p-0" style={{ height: 400 }}>
              <table id="DivTable" className="table table-head-fixed table-hover text-nowrap" role="grid" aria-describedby="example2_info">
                <thead>
                  <tr>
                    <th>EMP No</th>
                    <th>Name</th>
                    <th>License Expire</th>
                    <th>Expired</th>
                    <th>Pic</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{this.renderTableRow()}</tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card card-secondary">
            <div className="card-header" style={{ backgroundColor: "#6666ff" }}>
              {/* <h3 className="card-title">Input Data</h3> */}
            </div>
            <div className="card-body">
              <div className="row">
                <div class="col-sm-12 col-md-8">
                  <div className="row">
                    <div class="col-sm-12 col-md-6">
                      <label>EMP No</label>
                      <input
                        // ref={(input) => {
                        //   this.input_emp_no = input;
                        // }}
                        // onKeyPress={this.emp_no_KeyPress}
                        readOnly={true}
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
                    <div class="col-sm-12 col-md-6">
                      <label>EMP Name</label>
                      <input
                        // ref={(input) => {
                        //   this.input_emp_name = input;
                        // }}
                        // onKeyPress={this.emp_name_KeyPress}
                        readOnly={true}
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
                  
                    <br />
                    <div class="col-sm-12 col-md-6">
                      <div className="custom-control custom-checkbox">
                        <input
                          className="custom-control-input"
                          type="checkbox"
                          id="customCheckbox2"
                          defaultChecked
                          onChange={async (e) => {
                            if (e.target.checked) {
                              this.setState({
                                read_only_expire_date: false,
                                expire_date: moment().format("YYYY-MM-DD"),
                              });
                            } else {
                              this.setState({
                                read_only_expire_date: true,
                                expire_date: null,
                              });
                            }
                          }}
                        />
                        <label htmlFor="customCheckbox2" className="custom-control-label">
                          License Expire
                        </label>
                      </div>
                      
                      <input
                      style={{marginTop:5}}
                        class="form-control is-valid"
                        type="date"
                        id="id_daydate"
                        readOnly={this.state.read_only_expire_date}
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
                    <div class="col-sm-12 col-md-6">
                      <label>License Picture</label>
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          // onChange={this.onImageChange}
                          onChange={async (e) => {
                            this.setState({ selectedPic1: e.target.files[0] });
                            document.getElementById("choosePic").innerHTML = e.target.files[0].name;
                            //show current picture
                            if (e.target.files && e.target.files[0]) {
                              this.setState({
                                image: URL.createObjectURL(e.target.files[0]),
                                path_image: "",
                              });
                            }
                          }}
                        />
                        <label className="custom-file-label" id="choosePic">
                          Choose Pic
                        </label>
                      </div>
                    </div>
                  </div>
                  <br />
                </div>
                <div class="col-sm-12 col-md-4" style={{ borderStyle: "groove" }}>
                  <img style={{ width: "100%" ,maxHeight:200}} id="target" src={join(apiUrl, this.state.path_image)} />
                  <img style={{ width:  "100%" ,maxHeight:200}} id="target" src={this.state.image} />
                </div>
              </div>
              <br />
              <div className="row" style={{ marginTop: 10 }}>
                <div class="col-sm-12 col-md-2">id:{this.state.id}</div>
                <div class="col-sm-12 col-md-3">
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      await this.Click_Update();
                    }}
                  >
                    Update
                  </button>
                </div>
                <div class="col-sm-12 col-md-2"> </div>
                <div class="col-sm-12 col-md-3" style={{ marginTop: 10 }}>
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-danger btn-block"
                    onClick={async (e) => {
                      await this.click_delete(this.state.emp_no);
                    }}
                  >
                    Delete
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

export default Driver_license;
