import React, { Component } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES, apiUrl } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import join from "url-join";
import ReactExport from "react-export-excel";
// import { FaCalendarCheck, FaCalendarTimes, FaAddressCard } from "react-icons/fa";
// import { GoAlert } from "react-icons/go";
// import { AiFillFileExcel } from "react-icons/ai";
import Autocomplete from "react-autocomplete";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Black_list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_emp: [],

      date: moment().add(-0, "days").format("YYYY-MM-DD"),
      // expire_date: moment().add(-0, "days").format("YYYY-MM-DD"),
      // read_only_birth_date: false,
      // read_only_expire_date: false,
      // list_vender: [],
      detail: "",
      emp_no: "",
      emp_name: "",
      vender_name: "",
      id_card: "",
      // id: "",
      // selectedPic1: null,
      // image: null,
      // path_image: "",
      // pw: "",
      // display_btn_del: "none",
      valid_id: "form-control is-invalid",
    };
  }
  async componentDidMount() {
    let all_data = await httpClient.post(server.EMP_VENDER, { lv: localStorage.getItem(key.USER_LV), vender: localStorage.getItem(key.USER_VENDER) });
    this.setState({ list_emp: all_data.data.result });
    // console.log(this.state.list_emp);
  }
  find_data = async (emp) => {
    // console.log(emp);
    let _data = await httpClient.post(server.RFID_EMP, { emp_no: emp });
    // if (rfid_data.data.result !== "rfid_not_found") {
    console.log(_data.data.result);

    this.setState({
      // emp_no: _data.data.result.emp_no,
      emp_name: _data.data.result.driver_name,
      vender_name: _data.data.result.vender,

      // rfid: _data.data.result.rfid,
    });
  };
  Click_Submit = async () => {
    if (this.state.emp_name == "" || this.state.valid_id == "form-control is-invalid") {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ครบ",
        // text: "RFID is duplicated.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    } else {
      let input_data = await httpClient.post(server.BLACK_IN, {
        emp_no: this.state.emp_no,
        detail: this.state.detail,
        on_date: this.state.date,
        id_card: this.state.id_card,
      });
      if (input_data.data.api_result == "ok") {
        Swal.fire({
          icon: "success",
          // title: "Welcome to the web-site of",
          // text: { APP_TITLE }.APP_TITLE,
          showConfirmButton: false,
          timer: 1000,
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
    }
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>Black List Driver</h1>

        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card card-dark col-md-11">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
              <div className="row">
                <div class="col-sm-12 col-md-4" style={{ zIndex: 9998 }}>
                  <label style={{ zIndex: 9990 }}>EMP No</label>
                  <div>
                    <Autocomplete
                      // className="form-control"
                      // type="text"
                      style={{ width: "100%", zIndex: 9998 }}
                      items={this.state.list_emp}
                      ref={(input) => {
                        this.emp_no = input;
                      }}
                      shouldItemRender={(item, value) =>
                        // item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                        item.emp_no.indexOf(value) > -1
                      }
                      getItemValue={(item) => item.emp_no}
                      renderItem={(item, isHighlighted) => (
                        <div style={{ background: isHighlighted ? "blue" : "white", color: isHighlighted ? "white" : "grey" }}>{item.emp_no}</div>
                      )}
                      value={this.state.emp_no}
                      onChange={async (e) => {
                        await this.setState({
                          emp_no: e.target.value,
                        });
                        this.find_data(this.state.emp_no);
                      }}
                      onSelect={async (val) => {
                        await this.setState({
                          emp_no: val,
                        });
                        this.find_data(this.state.emp_no);
                      }}
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-2">
                  <label>Vender</label>
                  <input style={{ width: "100%" }} readOnly={true} type="text" value={this.state.vender_name} className="form-control" />
                </div>
                <div class="col-sm-12 col-md-6">
                  <label>EMP Name</label>
                  <input readOnly={true} type="text" value={this.state.emp_name} className="form-control" />
                </div>
              </div>
              <br />
              <div className="row">
                <div class="col-sm-12 col-md-3">
                  <label>ID Card</label>
                  <input
                    class={this.state.valid_id}
                    type="number"
                    maxLength={13}
                    // value={this.state.id_card}
                    onChange={async (e) => {
                      // if(e.target.value.length === 1 ||e.target.value.length === 6||e.target.value.length === 11||e.target.value.length === 13) {
                      //   e.target.value = e.target.value += "-"
                      // }

                      await this.setState({
                        id_card: e.target.value,
                      });

                      if (this.state.id_card.length == 13) {
                        this.setState({
                          valid_id: "form-control is-valid",
                        });
                      } else {
                        this.setState({
                          valid_id: "form-control is-invalid",
                        });
                      }

                      // this.call_data();
                    }}
                  />
                </div>
                <div class="col-sm-12 col-md-3">
                  <label>Date</label>
                  <input
                    class="form-control is-valid"
                    type="date"
                    id="id_daydate"
                    name="name_daydate"
                    value={this.state.date}
                    onChange={async (e) => {
                      await this.setState({
                        date: moment(e.target.value).format("YYYY-MM-DD"),
                      });
                      // this.call_data();
                    }}
                  />
                </div>
                <div class="col-sm-12 col-md-6">
                  <label>Detail</label>
                  <textarea
                    type="text"
                    value={this.state.detail}
                    className="form-control"
                    onChange={async (e) => {
                      await this.setState({
                        detail: e.target.value,
                      });
                      // this.call_data();
                    }}
                  />
                </div>
              </div>
      
              <div className="row">
              <div class="col-sm-12 col-md-3">  </div>
                <div class="col-sm-12 col-md-3">
                <label>&nbsp;</label>
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      await this.Click_Submit();
                    }}
                  >
                    Submit
                  </button>
                </div>
                <div class="col-sm-12 col-md-3">
                <label>&nbsp;</label>
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-secondary btn-block"
                    onClick={async (e) => {
                      window.location.replace("../black_report");
                    }}
                  >
                    Check Blacklist
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

export default Black_list;
