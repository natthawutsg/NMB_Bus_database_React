import React, { Component } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES, apiUrl } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import join from "url-join";
// import { FaCalendarCheck, FaCalendarTimes, FaAddressCard } from "react-icons/fa";
// import { GoAlert } from "react-icons/go";
// import { AiFillFileExcel } from "react-icons/ai";
import Autocomplete from "react-autocomplete";
import readXlsxFile from "read-excel-file";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class Opd_input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_plate: [],
      list_opd: [],
      opd_name: "",
      date: moment().add(-0, "days").format("YYYY-MM-DD"),
      qty: "",
      price: "",
      detail: "",
      emp_no: "",
      emp_name: "",
      vender_name: "",
      item: "",
      remark: "",
      example: [
        {
          plate_id: "10-999",
          vender: "vdr1",
          mfgdate: "2023-01-30",
          opd_category: "น้ำมันเครื่อง",
          item: "น้ำมันเครื่อง 10W-50",
          price: 2500,
          qty: 1,
          detail: "",
          remark: "",
        },
        {
          plate_id: "99-100",
          vender: "vdr2",
          mfgdate: "2023-01-31",
          opd_category: "น้ำมันเบรค",
          item: "dot 5",
          price: 500,
          qty: 1,
          detail: "",
          remark: "",
        },
      ],
      excel_data: [],
      // valid_id: "form-control is-invalid",
    };
  }
  async componentDidMount() {
    let opd_data = await httpClient.get(server.OPD_ALL);
    let all_data = await httpClient.post(server.RFID_ALL_VENDER, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    this.setState({ list_plate: all_data.data.result, list_opd: opd_data.data.result });
  }
  find_data = async (plate_id) => {
    console.log(plate_id);
    // let _data = await httpClient.post(server.BUS_FIND_VENDER, { plate_id: plate_id, lv: localStorage.getItem(key.USER_LV) });
    let _data = await httpClient.post(server.BUS_FIND_VENDER, { plate_id: plate_id, });
   
    try {
      console.log(_data.data.result);
      this.setState({
        vender_name: _data.data.result[0].vender,
      });
    } catch (error) {}
  };
  renderTableRow = () => {
    try {
      if (this.state.list_opd !== null) {
        const myResult = this.state.list_opd;
        return myResult.map((item) => <option value={item.category}>{item.category}</option>);
      }
    } catch (error) {}
  };
  Click_Confirm = async () => {
    if (this.state.qty == "" || this.state.detail == "") {
      console.log(this.state);
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ครบ",
        // text: "RFID is duplicated.",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    } else {
      let input_data = await httpClient.post(server.OPD_RECORD_IN, {
        plate_id: this.state.plate_id,

        item: this.state.item,
        vender: this.state.vender_name,
        detail: this.state.detail,
        mfgdate: this.state.date,
        opd_category: this.state.opd_name,
        qty: this.state.qty,
        price: this.state.price,
        detail: this.state.detail,
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
  click_check = async () => {
    const input = document.getElementById("input");
    input.addEventListener("change", async () => {});
    const data1 = await readXlsxFile(input.files[0]);
    this.setState({
      excel_data: data1,
    });
    console.log(this.state.excel_data);

    for (let index = 1; index < this.state.excel_data.length; index++) {
// var mydate = ''
      // console.log(moment(this.state.excel_data[index][2]).add(-0, "days").format("YYYY"));
      // if (moment(this.state.excel_data[index][2]).format("YYYY-MM-DD") < moment("2000-01-31").format("YYYY-MM-DD")) {
      //   console.log("< 2000");
      //   mydate = moment(this.state.excel_data[index][2]).add(543, "years").format("YYYY-MM-DD") 
      // } else{
      //   console.log("else");
      //   mydate = moment(this.state.excel_data[index][2]).add(0, "years").format("YYYY-MM-DD") 
      // }
      // console.log(mydate);
      let input_data = await httpClient.post(server.OPD_RECORD_IN, {
        plate_id: this.state.excel_data[index][0],
        vender: this.state.excel_data[index][1],

        mfgdate: moment(this.state.excel_data[index][2]).format("YYYY-MM-DD"),
        opd_category: this.state.excel_data[index][3],
        item: this.state.excel_data[index][4],
        price: this.state.excel_data[index][5],
        qty: this.state.excel_data[index][6],

        detail: this.state.excel_data[index][7],
        remark: this.state.excel_data[index][8],
      });

      console.log(input_data);
      if (input_data.data.api_result !== "ok") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please see Console.log",
          showConfirmButton: true,
          // timer: 100000,
        });
        return;
      }
    }
    Swal.fire({
      icon: "success",
      title: "Please wait .....",
      showConfirmButton: false,
      timer: 1000,
    });
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>OPD Input</h1>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="card card-info col-md-10">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
              <div className="row">
                <div class="col-sm-6 col-md-2">
                  <div className="row">
                    <label>ทะเบียนรถ</label>
                  </div>
                  <div className="row" style={{ zIndex: 9999, position: "absolute" }}>
                    <Autocomplete
                      style={{ zIndex: 9999, position: "absolute" }}
                      items={this.state.list_plate}
                      ref={(input) => {
                        this.input_plate_id = input;
                      }}
                      shouldItemRender={(item, value) =>
                        // item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                        item.plate_id.indexOf(value) > -1
                      }
                      getItemValue={(item) => item.plate_id}
                      renderItem={(item, isHighlighted) => (
                        <div style={{ background: isHighlighted ? "blue" : "white", color: isHighlighted ? "white" : "grey" }}>{item.plate_id}</div>
                      )}
                      value={this.state.plate_id}
                      onChange={async (e) => {
                        await this.setState({
                          plate_id: e.target.value,
                        });
                        this.find_data(this.state.plate_id);
                        // this.find_data(e.target.value);
                      }}
                      onSelect={async (val) => {
                        await this.setState({
                          plate_id: val,
                        });
                        this.find_data(this.state.plate_id);
                        // this.find_data(val);
                        
                      }}
                    />
                  </div>
                </div>
              </div>
              <br />
              <br />
              <div className="row">
                <div class="col-sm-6 col-md-3">
                  <label>ผู้ประกอบการ</label>
                  <input
                    value={this.state.vender_name}
                    className="form-control"
                    style={{ backgroundColor: "white" }}
                    readOnly={true}
                    type="text"
                  ></input>
                </div>
                <div class="col-sm-6 col-md-3">
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
                <div class="col-sm-6 col-md-3">
                  <label>OPD</label>
                  <select
                    value={this.state.opd_name}
                    className="form-control"
                    onChange={async (e) => {
                      e.preventDefault();
                      await this.setState({
                        opd_name: e.target.value,
                      });
                      // this.input_plate_id.focus();
                    }}
                  >
                    <option value="-" selected>
                      Select One.
                    </option>
                    {this.renderTableRow()}
                  </select>
                </div>
                <div class="col-sm-6 col-md-3">
                  <label>จำนวน</label>
                  <input
                    value={this.state.qty}
                    className="form-control"
                    type="text"
                    onChange={(e) => {
                      this.setState({
                        qty: e.target.value,
                      });
                    }}
                  ></input>
                </div>
              </div>
              <br />
              <div className="row">
                <div class="col-sm-6 col-md-3">
                  <label>รายการสิ่งของ</label>
                  <input
                    value={this.state.item}
                    className="form-control"
                    type="text"
                    onChange={(e) => {
                      this.setState({
                        item: e.target.value,
                      });
                    }}
                  ></input>
                </div>
                <div class="col-9">
                  <label>รายละเอียด</label>
                  <input
                    value={this.state.detail}
                    className="form-control"
                    type="text"
                    onChange={(e) => {
                      this.setState({
                        detail: e.target.value,
                      });
                    }}
                  ></input>
                </div>
              </div>
              <br />
              <div className="row">
                <div class="col-sm-6 col-md-3">
                  <label>ค่าใช้จ่าย</label>
                  <input
                    value={this.state.price}
                    className="form-control"
                    type="text"
                    onChange={(e) => {
                      this.setState({
                        price: e.target.value,
                      });
                    }}
                  ></input>
                </div>

                <div class="col-9">
                  <label>หมายเหตุ</label>
                  <input
                    value={this.state.remark}
                    className="form-control"
                    type="text"
                    onChange={(e) => {
                      this.setState({
                        remark: e.target.value,
                      });
                    }}
                  ></input>
                </div>
              </div>
              <br /> <br />
              <div className="row">
                <div class="col-sm-3 col-md-4"> </div>
                <div class="col-sm-6 col-md-4">
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      await this.Click_Confirm();
                    }}
                  >
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card card-info col-md-8">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
              <div className="row">
                <div class="col-sm-12 col-md-4">
                  <ExcelFile
                    element={<button className="btn btn-info btn-block">Format Download</button>}
                    filename="opd_upload_example"
                    // fileExtension="XLSX"
                  >
                    <ExcelSheet data={this.state.example} name="Sheet1">
                      <ExcelColumn label="plate_id" value="plate_id" />
                      <ExcelColumn label="vender" value="vender" />
                      <ExcelColumn label="mfgdate" value="mfgdate" />
                      <ExcelColumn label="opd_category" value="opd_category" />
                      <ExcelColumn label="item" value="item" />
                      <ExcelColumn label="price" value="price" />
                      <ExcelColumn label="qty" value="qty" />
                      <ExcelColumn label="detail" value="detail" />
                      <ExcelColumn label="remark" value="remark" />
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

export default Opd_input;
