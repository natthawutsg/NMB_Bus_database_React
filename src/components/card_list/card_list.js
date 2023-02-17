import React, { Component } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES, apiUrl } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import join from "url-join";
import ReactExport from "react-export-excel";
import _ from "lodash";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class Card_list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_card: [],
      list_vender: [],
      rfid: "",
      emp_no: "",
      emp_name: "",
      vender_name: "",
      plate_id: "",
      id: "",
      selectedPic1: null,
      image: null,
      path_image: "",
      pw: "",
      display_btn_del: "none",
      read_only_vender: false,
      employ_date: moment().add(-0, "days").format("YYYY-MM-DD"),
      date_archive: moment().add(-0, "days").format("YYYY-MM-DD"),
      birth_date: moment().add(-0, "days").format("YYYY-MM-DD"),
      remark: "",
      display_confirm_delete: "none",
      display_normal: "",
      vender_name_find: "All",
      emp_name_find: "",
    };
  }
  onChange = (e) => {
    e.persist();
    this.debounceSearch(e);
  };
  get_lodash = async (e) => {
    console.log("dash : ", this.state.emp_name_find);
    // lv    admin / other
    // lv
    // lv
    // lv
    let all_data = await httpClient.post(server.RFID_ALL_FINDER, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
      finder: this.state.emp_name_find,
      vender_find: this.state.vender_name_find,
    });
    // console.log(all_data.data.result);
    this.setState({ list_card: all_data.data.result });
  };

  componentDidMount = async () => {
    this.debounceSearch = _.debounce(this.get_lodash, 500);
    if (localStorage.getItem(key.USER_LV) == "Admin") {
      this.setState({ read_only_vender: false, vender_name_find: "All" });
    } else {
      this.setState({ vender_name_find: localStorage.getItem(key.USER_LV), vender_name: localStorage.getItem(key.USER_LV), read_only_vender: true });
    }
    this.call_master_data();
  };
  call_master_data = async () => {
    let all_data = await httpClient.post(server.RFID_ALL, { lv: localStorage.getItem(key.USER_LV), vender: localStorage.getItem(key.USER_VENDER) });
    let vender_data = await httpClient.get(server.VENDER_ALL);
    // console.log(all_data.data.result);
    this.setState({ list_card: all_data.data.result, list_vender: vender_data.data.result });
  };
  renderTableRow_vender = () => {
    try {
      if (this.state.list_vender !== null) {
        const myResult = this.state.list_vender;
        return myResult.map((item) => <option value={item.vender_name}>{item.vender_name}</option>);
      }
    } catch (error) {}
  };
  renderTableRow = () => {
    try {
      if (this.state.list_card !== null) {
        const myResult = this.state.list_card;
        return myResult.map((item) => (
          <tr>
            <td>{item.rfid}</td>
            <td>{item.emp_no}</td>
            <td>{item.driver_name}</td> <td>{item.birth_date}</td>
            <td>{item.age}</td>
            <td>{item.plate_id}</td>
            <td>{item.vender}</td>
            <td>{item.employ_date}</td>
            {/* <td>
              <div>
                <img
                  style={{ maxHeight: 50 }}
                  src={join(apiUrl, `rfid/picture/${item.emp_no}`)}
                  alt={item.control_no}
                />
              </div>
            </td> */}
            <td>
              <button
                type="button"
                class="btn btn-outline-warning btn-block"
                onClick={async (e) => {
                  e.preventDefault();
                  this.setState({
                    rfid: item.rfid,
                    emp_no: item.emp_no,
                    emp_name: item.driver_name,
                    vender_name: item.vender,
                    plate_id: item.plate_id,
                    id: item.id,
                    birth_date: item.birth_date,
                    // image: item.pic1.data,
                    path_image: `rfid/picture/${item.emp_no}`,
                  });
                  // console.log(this.state.image);
                  // this.click_delete(item.emp_no);
                }}
              >
                <span className="fas fa-arrow-circle-right" />
              </button>
            </td>
          </tr>
        ));
      }
    } catch (error) {}
  };
  click_delete = async (mydata) => {
    Swal.fire({
      title: "ต้องการเก็บประวัติ พขร ไว้หรือไม่ ?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "เก็บ",
      denyButtonText: `ลบเท่านั้น`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.setState({
          display_confirm_delete: "",
          display_normal: "none",
        });
      } else if (result.isDenied) {
        await httpClient.patch(server.RFID_DEL, { emp_no: mydata });
        await httpClient.patch(server.DRIVER_DEL, { emp_no: mydata });
        window.location.reload(false);
        // this.call_master_data();
        // this.setState({
        //   rfid: "",
        //   emp_no: "",
        //   emp_name: "",
        //   vender_name: "",
        //   plate_id: "",
        //   id: "",
        //   selectedPic1: null,
        //   image: null,
        //   path_image: "",
        // });
      }
    });
  };
  Click_Update = async () => {
    let up_data = await httpClient.put(server.RFID_UPDATE_TEXT, {
      id: this.state.id,
      rfid: this.state.rfid,
      emp_no: this.state.emp_no,
      driver_name: this.state.emp_name,
      plate_id: this.state.plate_id,
      vender: this.state.vender_name,
      employ_date: this.state.employ_date,
    });
    let up_birth = await httpClient.put(server.DRIVER_UPDATE_BIRTHDATE, {
      birth_date: this.state.birth_date,
      emp_no: this.state.emp_no,
    });
    if (up_data.data.api_result !== "ok" || up_birth.data.api_result !== "ok") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please check console.log",
      });
      console.log("up_data", up_data.data);
      console.log("up_birth", up_birth.data);
      return;
    }

    if (this.state.selectedPic1 !== null) {
      console.log(this.state.id, this.state.selectedPic1);

      const formData = new FormData();
      formData.append("id", this.state.id);
      // formData.append("rfid", this.state.rfid);
      // formData.append("emp_no", this.state.emp_no);
      // formData.append("driver_name", this.state.emp_name);
      // formData.append("plate_id", this.state.plate_id);
      // formData.append("vender", this.state.vender_name);
      formData.append("pic1", this.state.selectedPic1);
      // console.log(formData);
      let input_data = await httpClient.put(server.RFID_UPDATE, formData);
      if (input_data.data.api_result !== "ok") {
        Swal.fire({
          icon: "error",
          title: input_data.data.api_result,
          text: "Please check console.log",
        });
        console.log(input_data.data);
        return;
      }
    }
    window.location.reload(false);
  };
  click_delete_all = async () => {
    Swal.fire({
      title: "Confirm",
      text: "You are going to delete all RFID data.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await httpClient.patch(server.RFID_DEL_ALL);
        window.location.reload(false);
      }
    });
  };
  confirm_delete = async () => {
    await httpClient.post(server.ACHIVE_DRIVER_IN, { emp_no: this.state.emp_no, date_archive: this.state.date_archive, remark: this.state.remark });
    await httpClient.patch(server.RFID_DEL, { emp_no: this.state.emp_no });
    await httpClient.patch(server.DRIVER_DEL, { emp_no: this.state.emp_no });
    window.location.reload(false);
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>RFID Card List</h1>
        <div
          className="row"
          style={{
            display: this.state.display_normal,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* <div className="col-md-1"></div> */}
          <div className="card card-warning col-md-11">
            <div className="card-header" style={{ backgroundColor: "#6666ff" }}>
              <div className="row  justify-content-start">
                <div class="col-sm-2 col-md-4">
                  <label>ค้นหา &nbsp;</label>
                  <input
                    // onKeyPress={this.emp_name_KeyPress}
                    placeholder="รหัส / ชื่อ / ทะเบียน"
                    type="text"
                    value={this.state.emp_name_find}
                    className="form-control"
                    onChange={async (e) => {
                      e.preventDefault();
                      await this.setState({
                        emp_name_find: e.target.value,
                      });
                      this.onChange(e);
                    }}
                  />
                </div>
                <div class="col-sm-2 col-md-4">
                  <label>Vender &nbsp;</label>
                  <select
                    disabled={this.state.read_only_vender}
                    value={this.state.vender_name_find}
                    className="form-control"
                    onChange={async (e) => {
                      e.preventDefault();
                      await this.setState({
                        vender_name_find: e.target.value,
                      });
                      this.onChange(e);
                    }}
                  >
                    <option value="All" selected>
                      All
                    </option>
                    {this.renderTableRow_vender()}
                  </select>
                </div>
                <div class="col-sm-2 col-md-4">
                  <label>&nbsp;</label>
                  <ExcelFile
                    element={<button className="btn btn-success btn-block">Report Download &nbsp; ({this.state.list_card.length})</button>}
                    filename="driver_list_report"
                    // fileExtension="XLSX"
                  >
                    <ExcelSheet data={this.state.list_card} name="Sheet1">
                      <ExcelColumn label="rfid" value="rfid" />
                      <ExcelColumn label="emp_no" value="emp_no" />
                      <ExcelColumn label="driver_name" value="driver_name" />
                      <ExcelColumn label="plate_id" value="plate_id" />
                      <ExcelColumn label="vender" value="vender" />
                    </ExcelSheet>
                  </ExcelFile>
                </div>
              </div>
            </div>
            <div className="card-body table-responsive p-0" style={{ height: 400 }}>
              <table id="DivTable" className="table table-head-fixed table-hover text-nowrap" role="grid" aria-describedby="example2_info">
                <thead>
                  <tr>
                    <th>RFID</th>
                    <th>EMP No</th>
                    <th>Name</th> <th>Birth Date</th>
                    <th>Age</th>
                    <th>Plate ID</th>
                    <th>Vender</th>
                    <th>Employ Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{this.renderTableRow()}</tbody>
              </table>
            </div>
          </div>
          <div className="card card-secondary col-md-11">
            <div className="card-header" style={{ backgroundColor: "#6666ff" }}>
              {/* <h3 className="card-title">Input Data</h3> */}
            </div>
            <div className="card-body">
              <div className="row">
                <div class="row col-sm-12 col-md-9">
                  <div class="col-sm-12 col-md-6">
                    <label>RFID</label>
                    <input
                      // autoFocus
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
                  <div class="col-sm-12 col-md-6">
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
                  <div class="col-sm-12 col-md-6">
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
                  <div class="col-sm-12 col-md-3">
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
                  <div class="col-sm-12 col-md-3">
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
                  <div class="col-sm-12 col-md-4">
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
                  <div class="col-sm-12 col-md-4">
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
                      {this.renderTableRow_vender()}
                    </select>
                  </div>
                  <div class="col-sm-12 col-md-4">
                    <label>&nbsp;</label>
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

                  <br />
                </div>
                <div class="col-sm-12 col-md-3" style={{ borderStyle: "groove" }}>
                  <img style={{ width: 250 }} id="target" src={join(apiUrl, this.state.path_image)} />
                  <img style={{ width: 250 }} id="target" src={this.state.image} />
                </div>
              </div>

              <div className="row">
                <div class="col-sm-12 col-md-3">id:{this.state.id}</div>
                <div class="col-sm-12 col-md-3">
                  <label>&nbsp;</label>
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
                <div class="col-sm-12 col-md-3">
                  <label>&nbsp;</label>
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
          <div className="card card-secondary col-md-11">
            <div className="card-body">
              <div className="row">
                <div class="col-sm-2 col-md-3"></div>
                <div class="col-sm-2 col-md-3">
                  <label>&nbsp;</label>
                  <input
                    type="password"
                    // value={this.state.pw}
                    className="form-control"
                    onChange={async (e) => {
                      // console.log(e.target.value);
                      e.preventDefault();
                      // await this.setState({
                      //   pw: e.target.value,
                      // });

                      if (e.target.value == "adminTERK") {
                        this.setState({
                          display_btn_del: "",
                        });
                      } else {
                        this.setState({
                          display_btn_del: "none",
                        });
                      }
                    }}
                  />
                </div>
                <div class="col-sm-2 col-md-3">
                  <label>&nbsp;</label>
                  <button
                    style={{ width: "100%", display: this.state.display_btn_del }}
                    type="submit"
                    className="btn btn-secondary btn-block"
                    onClick={async (e) => {
                      await this.click_delete_all();
                    }}
                  >
                    Delete All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="row"
          style={{
            display: this.state.display_confirm_delete,
            justifyContent: "center",
            alignItems: "center",
            // width: "100%",
          }}
        >
          <div className="card card-danger col-sm-2 col-md-7">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
              <div className="row">
                <div class="col-sm-2 col-md-8">
                  <label>Remark</label>
                  <input
                    type="text"
                    value={this.state.remark}
                    className="form-control"
                    onChange={async (e) => {
                      e.preventDefault();
                      await this.setState({
                        remark: e.target.value,
                      });
                    }}
                  />
                </div>
                <div class="col-sm-2 col-md-4">
                  <label>Archive Date</label>
                  <input
                    class="form-control is-valid"
                    type="date"
                    id="id_daydate"
                    name="name_daydate"
                    value={this.state.date_archive}
                    onChange={async (e) => {
                      await this.setState({
                        date_archive: moment(e.target.value).format("YYYY-MM-DD"),
                      });
                      // this.call_data();
                    }}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div class="col-sm-2 col-md-4"> </div>
                <div class="col-sm-2 col-md-4">
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-danger btn-block"
                    onClick={(e) => {
                      this.confirm_delete();
                    }}
                  >
                    Confirm Delete
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

export default Card_list;
