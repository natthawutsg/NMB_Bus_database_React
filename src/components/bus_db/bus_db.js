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
import { AiFillFileExcel, AiOutlineFileProtect } from "react-icons/ai";
import { BsShieldShaded } from "react-icons/bs";
import { ImFilePicture, ImSpinner2 } from "react-icons/im";
import { TbEngine } from "react-icons/tb";
import { RiFilePaper2Fill, RiCheckboxMultipleBlankFill, RiCheckboxMultipleBlankLine } from "react-icons/ri";
import Resizer from "react-image-file-resizer";
import Autocomplete from "react-autocomplete";
import readXlsxFile from "read-excel-file";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Bus_db extends Component {
  constructor(props) {
    super(props);
    // this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.state = {
      list_all: [],
      list_incomplete: [],
      list_tax_expired: [],
      list_insurance_expired: [],
      list_inspection_expired: [],
      list_good: [],
      list_show: [],

      list_tax_alert: [],
      list_insurance_alert: [],
      list_inspection_alert: [],

      img_tax: null,
      img_inspection: null,
      img_insurance: null,
      show_img_tax: null,
      show_img_inspection: null,
      show_img_insurance: null,
      list_plate: [],
      vender: "",
      plate_id: "",
      name_bu: "",
      name_owner: "",
      date_tax: "",
      date_inspection: "",
      date_insurance: "",
      valid_tax: "white",
      valid_inspection: "white",
      valid_insurance: "white",
      path_image_tax: "",
      path_image_inspection: "",
      path_image_insurance: "",
      list_vender: [],
      read_only_vender: false,
      example: [
        {
          plate_id: "ก999",
          date_inspection: "2023-02-24",
          date_insurance: "2023-01-26",
          date_tax: "2023-02-17",
          name_bu: "ประกอบการ",
          name_owner: "กรรมสิทธิ์",
          vender: "VD1",
        },
        {
          plate_id: "ฉส",
          date_inspection: "2023-05-24",
          date_insurance: "2023-07-26",
          date_tax: "2023-10-17",
          name_bu: "ประโยชน์",
          name_owner: "หนึ่ง",
          vender: "VD2",
        },
      ],
      excel_data: [],
      date_archive: moment().add(-0, "days").format("YYYY-MM-DD"),
      remark: "",
      display_confirm_delete: "none",
      display_normal: "",
    };
  }
  // fileChangedHandler(event) {
  //   var fileInput = false;
  //   if (event.target.files[0]) {
  //     fileInput = true;
  //   }
  //   if (fileInput) {
  //     try {
  //       Resizer.imageFileResizer(
  //         event.target.files[0],
  //         300,
  //         300,
  //         "JPEG",
  //         100,
  //         0,
  //         (uri) => {
  //           // console.log(uri);
  //           this.setState({ newImage: uri });
  //         },
  //         "base64",
  //         200,
  //         200
  //       );
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // }
  async componentDidMount() {
    console.log("lv", localStorage.getItem(key.USER_LV));
    console.log("vender", localStorage.getItem(key.USER_VENDER));

    if (localStorage.getItem(key.USER_LV) == "Admin" || localStorage.getItem(key.USER_LV) == "Super") {
      this.setState({ read_only_vender: false });
    } else {
      this.setState({ vender: localStorage.getItem(key.USER_LV), read_only_vender: true });
    }
    let vender_data = await httpClient.get(server.VENDER_ALL);
    let bus_data = await httpClient.post(server.BUS_LIST_PLATE, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    this.setState({ list_plate: bus_data.data.result, list_vender: vender_data.data.result });

    let all_data = await httpClient.post(server.BUS_ALL, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    let incomplete_data = await httpClient.post(server.BUS_incomplete, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    let good_data = await httpClient.post(server.BUS_good, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });

    let tax_data = await httpClient.post(server.BUS_tax, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    let insurance_data = await httpClient.post(server.BUS_insurance, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    let inspection_data = await httpClient.post(server.BUS_inspection, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });

    let tax_alert = await httpClient.post(server.BUS_ALERT_TAX, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    let insurance_alert = await httpClient.post(server.BUS_ALERT_insurance, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    let inspection_alert = await httpClient.post(server.BUS_ALERT_inspection, {
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });

    this.setState({
      list_tax_alert: tax_alert.data.result,
      list_insurance_alert: insurance_alert.data.result,
      list_inspection_alert: inspection_alert.data.result,
      list_all: all_data.data.result,
      list_incomplete: incomplete_data.data.result,
      list_tax_expired: tax_data.data.result,
      list_insurance_expired: insurance_data.data.result,
      list_inspection_expired: inspection_data.data.result,
      list_good: good_data.data.result,
      list_show: incomplete_data.data.result,
    });
    // console.log(all_data.data.result);
  }
  renderTableRow_data = () => {
    try {
      if (this.state.list_show !== null) {
        const myResult = this.state.list_show;
        return myResult.map((item) => (
          <tr>
            <td>{item.vender}</td>
            <td>{item.plate_id}</td>
            <td>{item.name_bu}</td>
            <td>{item.name_owner}</td>
            <td>
              <div className="row">
                {item.date_tax}&nbsp;
                <div style={{ fontWeight: "bold" }}>({item.dif_tax})</div>&nbsp;
                <FaCalendarCheck style={{ display: item.icon_date_tax_ok, color: "green" }} />
                <FaCalendarTimes style={{ display: item.icon_date_tax_ng, color: "red" }} />
              </div>
            </td>
            <td>
              <h4 style={{ display: item.icon_pic_tax }}>
                <ImFilePicture />
              </h4>
            </td>
            <td>
              <div className="row">
                {item.date_inspection}&nbsp;
                <div style={{ fontWeight: "bold" }}>({item.dif_inspection})</div>&nbsp;
                <FaCalendarCheck style={{ display: item.icon_date_inspection_ok, color: "green" }} />
                <FaCalendarTimes style={{ display: item.icon_date_inspection_ng, color: "red" }} />{" "}
              </div>
            </td>
            <td>
              <h4 style={{ display: item.icon_pic_inspection }}>
                <ImFilePicture />
              </h4>
            </td>
            <td>
              <div className="row">
                {item.date_insurance}&nbsp;
                <div style={{ fontWeight: "bold" }}>({item.dif_insurance})</div>&nbsp;
                <FaCalendarCheck style={{ display: item.icon_date_insurance_ok, color: "green" }} />
                <FaCalendarTimes style={{ display: item.icon_date_insurance_ng, color: "red" }} />{" "}
              </div>
            </td>
            <td>
              <h4 style={{ display: item.icon_pic_insurance }}>
                <ImFilePicture />
              </h4>
            </td>
            <td>
              <button
                type="button"
                class="btn btn-info btn-block"
                onClick={async (e) => {
                  await this.setState({
                    plate_id: item.plate_id,
                    plate_id: item.plate_id,
                    vender: item.vender,
                    name_bu: item.name_bu,
                    name_owner: item.name_owner,
                    date_tax: item.date_tax,
                    date_inspection: item.date_inspection,
                    date_insurance: item.date_insurance,

                    path_image_tax: "",
                    path_image_inspection: "",
                    path_image_insurance: "",
                    img_tax: null,
                    img_inspection: null,
                    img_insurance: null,
                    show_img_tax: null,
                    show_img_inspection: null,
                    show_img_insurance: null,
                  });
                  this.find_data(item.plate_id);
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
  renderTableRow = () => {
    try {
      if (this.state.list_vender !== null) {
        const myResult = this.state.list_vender;
        return myResult.map((item) => <option value={item.vender_name}>{item.vender_name}</option>);
      }
    } catch (error) {}
  };
  find_data = async (plate_id) => {
    let picData_tax = await httpClient.post(server.BUS_PIC_tax, { plate_id: plate_id });
    let picData_insurance = await httpClient.post(server.BUS_PIC_insurance, { plate_id: plate_id });
    let picData_inspection = await httpClient.post(server.BUS_PIC_inspection, { plate_id: plate_id });

    var data_color_tax = "";
    var data_color_inspection = "";
    var data_color_insurance = "";

    if (this.state.date_tax < moment().format("YYYY-MM-DD")) {
      data_color_tax = "lightcoral";
    } else {
      data_color_tax = "lightgreen";
    }

    if (this.state.date_inspection < moment().format("YYYY-MM-DD")) {
      data_color_inspection = "lightcoral";
    } else {
      data_color_inspection = "lightgreen";
    }

    if (this.state.date_insurance < moment().format("YYYY-MM-DD")) {
      data_color_insurance = "lightcoral";
    } else {
      data_color_insurance = "lightgreen";
    }
    // console.log("moment",moment().format("YYYY-MM-DD"));
    // console.log("inspection",this.state.date_inspection);

    try {
      this.setState({
        // name_bu: _data.data.result.name_bu,
        // name_owner: _data.data.result.name_owner,
        // vender: _data.data.result.vender,
        // date_tax: _data.data.result.date_tax,
        // date_inspection: _data.data.result.date_inspection,
        // date_insurance: _data.data.result.date_insurance,
        valid_tax: data_color_tax,
        valid_inspection: data_color_inspection,
        valid_insurance: data_color_insurance,

        path_image_tax: `bus_tax/pic_tax/${plate_id}`,
        path_image_inspection: `bus_inspection/pic_inspection/${plate_id}`,
        path_image_insurance: `bus_insurance/pic_insurance/${plate_id}`,

        img_tax: picData_tax.data.result.pic_tax,
        img_inspection: picData_inspection.data.result.pic_inspection,
        img_insurance: picData_insurance.data.result.pic_insurance,
        show_img_tax: picData_tax.data.result.pic_tax,
        show_img_inspection: picData_inspection.data.result.pic_inspection,
        show_img_insurance: picData_insurance.data.result.pic_insurance,
      });
    } catch (error) {
      this.setState({
        name_bu: "",
        name_owner: "",
        name_bu: "",
        vender: "",
        date_tax: "",
        date_inspection: "",
        date_insurance: "",
        // img_tax: "",
        // img_inspection: "",
        // img_insurance: "",
        valid_tax: "white",
        valid_inspection: "white",
        valid_insurance: "white",
        // path_image_tax: "",
        // path_image_inspection: "",
        // path_image_insurance: "",
      });
    }
  };
  Click_Update = async () => {
    if (
      this.state.date_tax === "" ||
      this.state.date_inspection === "" ||
      this.state.date_insurance === "" ||
      this.state.vender == "" ||
      this.state.plate_id == "" ||
      this.state.name_bu == "" ||
      this.state.name_owner == ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Can not Regist.",
        text: "Please input all data.",
      });
      return;
    }

    let plate_data = await httpClient.post(server.BUS_FIND_DUP, {
      plate_id: this.state.plate_id,
      lv: localStorage.getItem(key.USER_LV),
      vender: localStorage.getItem(key.USER_VENDER),
    });
    // console.log(plate_data.data.result);
    // console.log(this.state.plate_id, plate_data.data.result.length);

    if (plate_data.data.result.length !== 0) {
      Swal.fire({
        title: "Update bus.",
        text: this.state.plate_id,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Update,",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.go_update();
        }
      });
    } else {
      Swal.fire({
        title: "Add new bus.",
        text: this.state.plate_id,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Add,",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.go_insert();
        }
      });
    }
  };
  go_insert = async () => {
    // insert text
    let insert_text = await httpClient.post(server.BUS_text_in, {
      plate_id: this.state.plate_id,
      vender: this.state.vender,
      name_bu: this.state.name_bu,
      name_owner: this.state.name_owner,
      date_tax: this.state.date_tax,
      date_inspection: this.state.date_inspection,
      date_insurance: this.state.date_insurance,
    });
    console.log(insert_text.data);
    if (insert_text.data.api_result == "ok") {
      Swal.fire({
        icon: "success",
        title: "Text OK",
        showConfirmButton: false,
        timer: 500,
      });
    } else {
      console.log(insert_text.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please see Console.log",
        showConfirmButton: true,
      });
      return;
    }

    if (this.state.img_tax.type !== "Buffer" && this.state.img_tax.type !== null) {
      console.log("in_tax");
      await this.go_insert_tax();
    }
    if (this.state.img_inspection.type !== "Buffer" && this.state.img_inspection.type !== null) {
      console.log("in_inspec");
      await this.go_insert_inspection();
    }

    if (this.state.img_insurance.type !== "Buffer" && this.state.img_insurance.type !== null) {
      console.log("in_insurance");
      await this.go_insert_insurance();
    }
    window.location.reload(false);
  };

  go_insert_tax = async () => {
    const formData = new FormData();
    formData.append("plate_id", this.state.plate_id);
    formData.append("pic_tax", this.state.img_tax);
    // formData.append("pic_inspection", this.state.img_inspection);
    // formData.append("pic_insurance", this.state.img_insurance);
    let input_data = await httpClient.post(server.BUS_IN_tax, formData);
    console.log(input_data.data);
    if (input_data.data.api_result == "ok") {
      Swal.fire({
        icon: "success",
        title: "Updated",
        // text: { APP_TITLE }.APP_TITLE,
        showConfirmButton: false,
        timer: 500,
      });
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
  go_insert_inspection = async () => {
    const formData = new FormData();
    formData.append("plate_id", this.state.plate_id);
    // formData.append("pic_tax", this.state.img_tax);
    formData.append("pic_inspection", this.state.img_inspection);
    // formData.append("pic_insurance", this.state.img_insurance);
    let input_data = await httpClient.post(server.BUS_IN_inspection, formData);
    console.log(input_data.data);
    if (input_data.data.api_result == "ok") {
      Swal.fire({
        icon: "success",
        title: "Updated",
        // text: { APP_TITLE }.APP_TITLE,
        showConfirmButton: false,
        timer: 500,
      });
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
  go_insert_insurance = async () => {
    const formData = new FormData();
    formData.append("plate_id", this.state.plate_id);
    // formData.append("pic_tax", this.state.img_tax);
    // formData.append("pic_inspection", this.state.img_inspection);
    formData.append("pic_insurance", this.state.img_insurance);
    let input_data = await httpClient.post(server.BUS_IN_insurance, formData);
    console.log(input_data.data);
    if (input_data.data.api_result == "ok") {
      Swal.fire({
        icon: "success",
        title: "Updated",
        // text: { APP_TITLE }.APP_TITLE,
        showConfirmButton: false,
        timer: 500,
      });
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

  go_update = async () => {
    // console.log(formData);

    let up_text = await httpClient.put(server.BUS_UPDATE_TEXT, {
      plate_id: this.state.plate_id,
      vender: this.state.vender,
      name_bu: this.state.name_bu,
      name_owner: this.state.name_owner,
      date_tax: this.state.date_tax,
      date_inspection: this.state.date_inspection,
      date_insurance: this.state.date_insurance,
    });

    console.log(up_text.data);
    if (up_text.data.api_result !== "ok") {
      Swal.fire({
        icon: "error",
        title: up_text.data.api_result,
        text: "Please check console.log",
      });
      console.log(up_text.data);
      return;
    } else {
      await Swal.fire({
        icon: "success",
        // title: "Welcome to the web-site of",
        // text: { APP_TITLE }.APP_TITLE,
        showConfirmButton: false,
        timer: 300,
      });
      // console.log("img_tax",this.state.img_tax.type);
      // console.log("img_inspection",this.state.img_inspection.type);
      // console.log("img_insurance",this.state.img_insurance.type);

      // window.location.reload(false);
      if (this.state.img_tax.type !== "Buffer" && this.state.img_tax.type !== null) {
        console.log("up_tax");
        await httpClient.patch(server.BUS_DEL_TAX, { plate_id: this.state.plate_id });
        await this.go_insert_tax();
      }
      if (this.state.img_inspection.type !== "Buffer" && this.state.img_inspection.type !== null) {
        console.log("up_inspec");
        await httpClient.patch(server.BUS_DEL_inspection, { plate_id: this.state.plate_id });
        await this.go_insert_inspection();
      }

      if (this.state.img_insurance.type !== "Buffer" && this.state.img_insurance.type !== null) {
        console.log("up_insurance");
        await httpClient.patch(server.BUS_DEL_insurance, { plate_id: this.state.plate_id });
        await this.go_insert_insurance();
      }
      window.location.reload(false);
    }
  };
  // go_update_tax = async () => {
  //   const formData = new FormData();
  //   formData.append("plate_id", this.state.plate_id);
  //   formData.append("pic_tax", this.state.img_tax);
  //   // formData.append("pic_inspection", this.state.img_inspection);
  //   // formData.append("pic_insurance", this.state.img_insurance);
  //   let input_data = await httpClient.post(server.BUS_UPDATE_tax, formData);
  //   console.log(input_data.data);
  //   if (input_data.data.api_result == "ok") {
  //     Swal.fire({
  //       icon: "success",
  //       title: "Updated",
  //       // text: { APP_TITLE }.APP_TITLE,
  //       showConfirmButton: false,
  //       timer: 3000,
  //     });
  //     window.location.reload(false);
  //   } else {
  //     console.log(input_data.data);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Please see Console.log",
  //       showConfirmButton: true,
  //       // timer: 100000,
  //     });
  //   }
  // };
  // go_update_inspection = async () => {
  //   const formData = new FormData();
  //   formData.append("plate_id", this.state.plate_id);
  //   // formData.append("pic_tax", this.state.img_tax);
  //   formData.append("pic_inspection", this.state.img_inspection);
  //   // formData.append("pic_insurance", this.state.img_insurance);
  //   let input_data = await httpClient.post(server.BUS_UPDATE_inspection, formData);
  //   console.log(input_data.data);
  //   if (input_data.data.api_result == "ok") {
  //     Swal.fire({
  //       icon: "success",
  //       title: "Updated",
  //       // text: { APP_TITLE }.APP_TITLE,
  //       showConfirmButton: false,
  //       timer: 3000,
  //     });
  //     window.location.reload(false);
  //   } else {
  //     console.log(input_data.data);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Please see Console.log",
  //       showConfirmButton: true,
  //       // timer: 100000,
  //     });
  //   }
  // };
  // go_update_insurance = async () => {
  //   this.timeout(30000);
  //   const formData = new FormData();
  //   formData.append("plate_id", this.state.plate_id);
  //   // formData.append("pic_tax", this.state.img_tax);
  //   // formData.append("pic_inspection", this.state.img_inspection);
  //   formData.append("pic_insurance", this.state.img_insurance);
  //   let input_data = await httpClient.post(server.BUS_UPDATE_insurance, formData);
  //   console.log(input_data.data);
  //   if (input_data.data.api_result == "ok") {
  //     Swal.fire({
  //       icon: "success",
  //       title: "Updated",
  //       // text: { APP_TITLE }.APP_TITLE,
  //       showConfirmButton: false,
  //       timer: 3000,
  //     });
  //     window.location.reload(false);
  //   } else {
  //     console.log(input_data.data);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Please see Console.log",
  //       showConfirmButton: true,
  //       // timer: 100000,
  //     });
  //   }
  // };
  click_delete = async (mydata) => {
    Swal.fire({
      title: "ต้องการเก็บประวัติ รถ ไว้หรือไม่ ?",
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
        await httpClient.patch(server.BUS_DEL_TAX, { plate_id: mydata });
        await httpClient.patch(server.BUS_DEL_TEXT, { plate_id: mydata });
        await httpClient.patch(server.BUS_DEL_inspection, { plate_id: mydata });
        await httpClient.patch(server.BUS_DEL_insurance, { plate_id: mydata });
        window.location.reload(false);
      }
    });
  };
  click_check = async () => {
    const input = document.getElementById("input");
    input.addEventListener("change", async () => {});
    const data1 = await readXlsxFile(input.files[0]);
    this.setState({
      excel_data: data1,
    });
    console.log(this.state.excel_data);
    let input_data;
    for (let index = 1; index < this.state.excel_data.length; index++) {
      // this.Click_Regist(
      //   this.state.excel_data[index][0],
      //   this.state.excel_data[index][1],
      //   this.state.excel_data[index][2],
      //   this.state.excel_data[index][3],
      //   this.state.excel_data[index][4]
      // );

      input_data = await httpClient.post(server.BUS_text_in, {
        plate_id: this.state.excel_data[index][0],
        date_inspection: this.state.excel_data[index][2],
        date_insurance: this.state.excel_data[index][3],
        date_tax: this.state.excel_data[index][4],
        name_bu: this.state.excel_data[index][5],
        name_owner: this.state.excel_data[index][6],
        vender: this.state.excel_data[index][1],
      });
    }
    if (input_data.data.api_result !== "ok") {
      Swal.fire({
        icon: "error",
        title: input_data.data.api_result,
        text: "Please check console.log",
      });
      console.log(input_data.data);
      return;
    } else {
      Swal.fire({
        icon: "success",
        title: "Please wait .....",
        showConfirmButton: false,
      });
      window.location.reload(false);
    }
  };
  confirm_delete = async () => {
    await httpClient.post(server.ACHIVE_BUS_IN, {
      plate_id: this.state.plate_id,
      vender: this.state.vender,
      name_bu: this.state.name_bu,
      name_owner: this.state.name_owner,
      date_tax: this.state.date_tax,
      date_inspection: this.state.date_inspection,
      date_insurance: this.state.date_insurance,
      date_archive: this.state.date_archive,
      remark: this.state.remark,
      date_record: moment().add(-0, "days").format("YYYY-MM-DD"),
    });

    let BUS_DEL_TAX = await httpClient.patch(server.BUS_DEL_TAX, { plate_id: this.state.plate_id });
    let BUS_DEL_TEXT = await httpClient.patch(server.BUS_DEL_TEXT, { plate_id: this.state.plate_id });
    let BUS_DEL_inspection = await httpClient.patch(server.BUS_DEL_inspection, { plate_id: this.state.plate_id });
    let BUS_DEL_insurance = await httpClient.patch(server.BUS_DEL_insurance, { plate_id: this.state.plate_id });
    if (
      BUS_DEL_TAX.data.api_result == "ok" &&
      BUS_DEL_TEXT.data.api_result == "ok" &&
      BUS_DEL_inspection.data.api_result == "ok" &&
      BUS_DEL_insurance.data.api_result == "ok"
    ) {
      Swal.fire({
        icon: "success",
        title: "Deleted",
        // text: { APP_TITLE }.APP_TITLE,
        showConfirmButton: false,
        timer: 500,
      });
      window.location.reload(false);
    } else {
      await console.log(BUS_DEL_TAX.data);
      await console.log(BUS_DEL_TEXT.data);
      await console.log(BUS_DEL_inspection.data);
      await console.log(BUS_DEL_insurance.data);
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
        <h1 style={{ textAlign: "center" }}>Bus Database</h1>
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
          <div className="card card col-sm-12 col-md-12">
            <div className="card-header"  style={{backgroundColor:"#d9d9d9"}}  >
              <div className="row"  >
                <div className="col-lg-3 col-6" >
                  <div className="small-box bg-light " >
                    <ExcelFile
                      element={
                        <button className="btn btn-dark btn-block" style={{ marginBottom: 5 }}>
                          Download
                          <AiFillFileExcel />
                        </button>
                      }
                      filename="bus_list_report"
                      // fileExtension="XLSX"
                    >
                      <ExcelSheet data={this.state.list_show} name="Sheet1">
                        <ExcelColumn label="vender" value="vender" />
                        <ExcelColumn label="plate_id" value="plate_id" />
                        <ExcelColumn label="name_bu" value="name_bu" />
                        <ExcelColumn label="name_owner" value="name_owner" />
                        <ExcelColumn label="date_tax" value="date_tax" />
                        <ExcelColumn label="date_inspection" value="date_inspection" />
                        <ExcelColumn label="date_insurance" value="date_insurance" />
                      </ExcelSheet>
                    </ExcelFile>
                    <button
                      type="button"
                      class="btn btn-success btn-block"
                      onClick={async (e) => {
                        this.setState({ list_show: this.state.list_good });
                      }}
                    >
                      <RiCheckboxMultipleBlankFill /> &nbsp;Complete &nbsp;({this.state.list_good.length})
                    </button>
                    <button
                      type="button"
                      class="btn btn-warning btn-block"
                      onClick={async (e) => {
                        this.setState({ list_show: this.state.list_incomplete });
                      }}
                    >
                      <RiCheckboxMultipleBlankLine /> &nbsp;Inconplete &nbsp;({this.state.list_incomplete.length})
                    </button>
                    <button
                      type="button"
                      class="btn btn-info btn-block"
                      onClick={async (e) => {
                        this.setState({ list_show: this.state.list_all });
                      }}
                    >
                      <ImSpinner2 />
                      &nbsp;All&nbsp;({this.state.list_all.length})
                    </button>
                  </div>
                </div>
                <div className="col-lg-3 col-6"  >
                  <div className="small-box bg-light">
                    <div className="inner">
                      <h3>Tax</h3>
                    </div>
                    <div className="icon" style={{ marginTop: "-5vh" }}>
                      <h1 style={{ marginRight: "auto", display: "flex", justifyContent: "flex-end" }}>
                        <RiFilePaper2Fill />
                      </h1>
                    </div>

                    <a
                      onClick={() => {
                        this.setState({ list_show: this.state.list_tax_alert });
                      }}
                      className="btn btn-default btn-block"
                    >
                      Alert &nbsp;({this.state.list_tax_alert.length})&nbsp;
                      <i className="fas fa-arrow-circle-right" style={{ color: "orange " }} />
                    </a>
                    <a
                      onClick={() => {
                        this.setState({ list_show: this.state.list_tax_expired });
                      }}
                      className="btn btn-default btn-block"
                    >
                      Expired &nbsp;({this.state.list_tax_expired.length})&nbsp;
                      <i className="fas fa-arrow-circle-right" style={{ color: "red " }} />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-6"  >
                  <div className="small-box bg-light" style={{ backgroundColor: "whitesmoke  " }}>
                    <div className="inner">
                      <h3>M/Y Inspection</h3>
                    </div>
                    <div className="icon" style={{ marginTop: "-5vh" }}>
                      <h1 style={{ marginRight: "auto", display: "flex", justifyContent: "flex-end" }}>
                        <TbEngine />
                      </h1>
                    </div>
                    <a
                      onClick={() => {
                        this.setState({ list_show: this.state.list_inspection_alert });
                      }}
                      className="btn btn-default btn-block"
                    >
                      Alert &nbsp;({this.state.list_inspection_alert.length})&nbsp;
                      <i className="fas fa-arrow-circle-right" style={{ color: "orange " }} />
                    </a>
                    <a
                      onClick={() => {
                        this.setState({ list_show: this.state.list_inspection_expired });
                      }}
                      className="btn btn-default btn-block"
                    >
                      Expired &nbsp;({this.state.list_inspection_expired.length})&nbsp;
                      <i className="fas fa-arrow-circle-right" style={{ color: "red " }} />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-6"  >
                  <div className="small-box bg-light">
                    <div className="inner">
                      <h3>Insurance</h3>
                    </div>
                    <div className="icon" style={{ marginTop: "-5vh" }}>
                      <h1 style={{ marginRight: "auto", display: "flex", justifyContent: "flex-end" }}>
                        <AiOutlineFileProtect />
                      </h1>
                    </div>
                    <a
                      onClick={() => {
                        this.setState({ list_show: this.state.list_insurance_alert });
                      }}
                      className="btn btn-default btn-block"
                    >
                      Alert &nbsp;({this.state.list_insurance_alert.length})&nbsp;
                      <i className="fas fa-arrow-circle-right" style={{ color: "orange " }} />
                    </a>
                    <a
                      onClick={() => {
                        this.setState({ list_show: this.state.list_insurance_expired });
                      }}
                      className="btn btn-default btn-block"
                    >
                      Expired&nbsp;({this.state.list_insurance_expired.length})&nbsp;
                      <i className="fas fa-arrow-circle-right" style={{ color: "red " }} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body table-responsive p-0" style={{ height: 400 }}>
              <table id="DivTable" className="table table-head-fixed table-hover text-nowrap" role="grid" aria-describedby="example2_info">
                <thead>
                  <tr>
                    <th>Vender</th>
                    <th>ทะเบียนรถ</th>
                    <th>ชื่อประกอบการ</th>
                    <th>ชื่อผู้ถือกรรมสิทธิ์</th>
                    <th>ภาษี</th>
                    <th>ไฟล์</th>
                    <th>ตรวจกลางปี</th>
                    <th>ไฟล์</th>
                    <th>ประกัน</th>
                    <th>ไฟล์</th> <th></th>
                  </tr>
                </thead>
                <tbody>{this.renderTableRow_data()}</tbody>
              </table>
            </div>
          </div>
          <div className="card card-secondary col-sm-12 col-md-11">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
              <div className="row">
                <div class="col-sm-12 col-md-3">
                  <label>ทะเบียนรถ</label>

                  <div style={{ zIndex: 9998, position: "absolute" }}>
                    <Autocomplete
                      style={{ zIndex: 9998, position: "absolute" }}
                      className="form-control col-sm-12"
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
                      }}
                      onSelect={async (val) => {
                        await this.setState({
                          plate_id: val,
                        });
                        this.find_data(this.state.plate_id);
                      }}
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-1"> &nbsp;</div>
                <div class="col-sm-12 col-md-2">
                  <label>Vender</label>
                  <select
                    disabled={this.state.read_only_vender}
                    value={this.state.vender}
                    className="form-control"
                    onChange={async (e) => {
                      e.preventDefault();
                      await this.setState({
                        vender: e.target.value,
                      });
                    }}
                  >
                    <option value="-">Select One.</option>
                    {this.renderTableRow()}
                  </select>
                </div>

                <div class="col-sm-12 col-md-2">
                  <label>ชื่อประกอบการ</label>
                  <input
                    type="text"
                    value={this.state.name_bu}
                    className="form-control"
                    onChange={async (e) => {
                      e.preventDefault();
                      await this.setState({
                        name_bu: e.target.value,
                      });
                    }}
                  />
                </div>
                <div class="col-sm-12 col-md-4">
                  <label>ชื่อผู้ถือกรรมสิทธิ์</label>
                  <input
                    type="text"
                    value={this.state.name_owner}
                    className="form-control"
                    onChange={async (e) => {
                      e.preventDefault();
                      await this.setState({
                        name_owner: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-sm-12 col-md-4" style={{ borderStyle: "groove", borderRadius: 7, marginBottom: 5 }}>
                  <div className="row">
                    <label className="col-sm-6 col-md-3">ภาษี</label>
                    <input
                      style={{ marginBottom: 5, backgroundColor: this.state.valid_tax }}
                      className="col-sm-6 col-md-7 form-control"
                      type="date"
                      id="id_daydate"
                      // readOnly={this.state.read_only_birth_date}
                      name="name_daydate"
                      value={this.state.date_tax}
                      onChange={async (e) => {
                        if (moment(e.target.value).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
                          this.setState({
                            date_tax: moment(e.target.value).format("YYYY-MM-DD"),
                            valid_tax: "lightcoral",
                          });
                        } else {
                          this.setState({
                            date_tax: moment(e.target.value).format("YYYY-MM-DD"),
                            valid_tax: "lightgreen",
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        // onChange={this.onImageChange}
                        onChange={async (e) => {
                          this.setState({ img_tax: e.target.files[0] });
                          document.getElementById("choosePic").innerHTML = e.target.files[0].name;
                          //show current picture
                          if (e.target.files && e.target.files[0]) {
                            this.setState({
                              show_img_tax: URL.createObjectURL(e.target.files[0]),
                              path_image_tax: "",
                            });
                          }
                        }}
                      />
                      <label className="custom-file-label" id="choosePic">
                        Choose Pic
                      </label>
                    </div>
                    <img src={join(apiUrl, this.state.path_image_tax)} style={{ width: "100%", marginBottom: 10 }} id="target" />
                    <img src={this.state.show_img_tax} alt="" style={{ width: "100%", marginBottom: 10 }} />
                  </div>
                </div>
                <div className="col-sm-12 col-md-4" style={{ borderStyle: "groove", borderRadius: 7, marginBottom: 5 }}>
                  <div className="row">
                    <label className="col-sm-6 col-md-5">ตรวจกลางปี</label>
                    <input
                      style={{ marginBottom: 5, backgroundColor: this.state.valid_inspection }}
                      className="col-sm-6 col-md-7 form-control"
                      type="date"
                      id="id_daydate"
                      // readOnly={this.state.read_only_birth_date}
                      name="name_daydate"
                      value={this.state.date_inspection}
                      onChange={async (e) => {
                        if (moment(e.target.value).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
                          this.setState({
                            date_inspection: moment(e.target.value).format("YYYY-MM-DD"),
                            valid_inspection: "lightcoral",
                          });
                        } else {
                          this.setState({
                            date_inspection: moment(e.target.value).format("YYYY-MM-DD"),
                            valid_inspection: "lightgreen",
                          });
                        }
                        // this.call_data();
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        // onChange={this.onImageChange}
                        onChange={async (e) => {
                          this.setState({ img_inspection: e.target.files[0] });
                          document.getElementById("choosePic").innerHTML = e.target.files[0].name;
                          //show current picture
                          if (e.target.files && e.target.files[0]) {
                            this.setState({
                              show_img_inspection: URL.createObjectURL(e.target.files[0]),
                              path_image_inspection: "",
                            });
                          }
                        }}
                      />
                      <label className="custom-file-label" id="choosePic">
                        Choose Pic
                      </label>
                    </div>
                    <img src={join(apiUrl, this.state.path_image_inspection)} style={{ width: "100%", marginBottom: 10 }} id="target" />
                    <img src={this.state.show_img_inspection} alt="" style={{ width: "100%", marginBottom: 10 }} />
                  </div>
                </div>
                <div className="col-sm-12 col-md-4" style={{ borderStyle: "groove", borderRadius: 7, marginBottom: 5 }}>
                  <div className="row">
                    <label className="col-sm-6 col-md-3">ประกัน</label>
                    <input
                      className="col-sm-6 col-md-7 form-control"
                      type="date"
                      id="id_daydate"
                      style={{ marginBottom: 5, backgroundColor: this.state.valid_insurance }}
                      name="name_daydate"
                      value={this.state.date_insurance}
                      onChange={async (e) => {
                        if (moment(e.target.value).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
                          this.setState({
                            date_insurance: moment(e.target.value).format("YYYY-MM-DD"),
                            valid_insurance: "lightcoral",
                          });
                        } else {
                          this.setState({
                            date_insurance: moment(e.target.value).format("YYYY-MM-DD"),
                            valid_insurance: "lightgreen",
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        // onChange={this.onImageChange}
                        onChange={async (e) => {
                          this.setState({ img_insurance: e.target.files[0] });
                          document.getElementById("choosePic").innerHTML = e.target.files[0].name;
                          //show current picture
                          if (e.target.files && e.target.files[0]) {
                            this.setState({
                              show_img_insurance: URL.createObjectURL(e.target.files[0]),
                              path_image_insurance: "",
                            });
                          }
                        }}
                      />
                      <label className="custom-file-label" id="choosePic">
                        Choose Pic
                      </label>
                    </div>
                    <img src={join(apiUrl, this.state.path_image_insurance)} style={{ width: "100%", marginBottom: 10 }} id="target" />
                    <img src={this.state.show_img_insurance} alt="" style={{ width: "100%", marginBottom: 10 }} />
                  </div>
                </div>
              </div>
              <br />
              <div className="row">
                <div class="col-sm-0 col-md-2"></div>
                <div class="col-sm-12 col-md-3">
                  <button
                    style={{ width: "100%", marginBottom: 10 }}
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={async (e) => {
                      await this.Click_Update();
                    }}
                  >
                    Add/Update
                  </button>
                </div>
                <div class="col-sm-4 col-md-1"></div>
                <div class="col-sm-12 col-md-3">
                  <button
                    style={{ width: "100%", marginBottom: 10 }}
                    type="submit"
                    className="btn btn-danger btn-block"
                    onClick={async (e) => {
                      await this.click_delete(this.state.plate_id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card card-secondary col-md-10">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
              <div className="row" style={{ width: "100%" }}>
                <div style={{ width: "20%" }}>
                  <ExcelFile
                    element={<button className="btn btn-info btn-block">Format Download</button>}
                    filename="bus_upload_example"
                    // fileExtension="XLSX"
                  >
                    <ExcelSheet data={this.state.example} name="Sheet1">
                      <ExcelColumn label="ทะเบียนรถ" value="plate_id" />
                      <ExcelColumn label="vender" value="vender" />
                      <ExcelColumn label="ตรวจกลางปี" value="date_inspection" />
                      <ExcelColumn label="ประกัน" value="date_insurance" />
                      <ExcelColumn label="ภาษี" value="date_tax" />
                      <ExcelColumn label="ชื่อประกอบการ" value="name_bu" />
                      <ExcelColumn label="ชื่อผู้ถือกรรมสิทธิ์" value="name_owner" />
                    </ExcelSheet>
                  </ExcelFile>
                </div>
                <div style={{ width: "5%" }}></div>
                <div style={{ width: "50%" }}>
                  <input type="file" id="input" />
                </div>

                <div style={{ width: "20%" }}>
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
        <div
          className="row"
          style={{
            display: this.state.display_confirm_delete,
            justifyContent: "center",
            alignItems: "center",
            // width: "100%",
          }}
        >
          <div className="card card-danger col-5">
            <div className="card-header">{/* <h3 className="card-title">Input Data</h3> */}</div>
            <div className="card-body">
              <div className="row">
                <div style={{ width: "100%" }}>
                  <div className="row">
                    <div style={{ width: "65%" }}>
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
                    <div style={{ width: "5%" }}></div>
                    <div style={{ width: "30%" }}>
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
                </div>
              </div>
              <br />
              <div className="row">
                <div style={{ width: "30%" }}></div>
                <div style={{ width: "40%" }}>
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    className="btn btn-danger btn-block"
                    onClick={async (e) => {
                      await this.confirm_delete();
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

export default Bus_db;
