// App_Init
export const APP_INIT = "APP_INIT";
export const APP_TITLE = "Driver Attendance";

//////////////// Localization Begin ////////////////
export const apiUrl = "http://115.178.63.42:1800/"; // <<<<< same back end  >>>>>>
//export const apiUrl = "http://localhost:1800/"; // <<<<< same back end  >>>>>>

export const YES = "YES";
export const NO = "NO";
export const OK = "ok";
export const NOK = "nok";
export var plate_id_bus_database = "";
export const server = {
  URL_REGIST: `user/regist`,
  LOGIN_URL: `user/login`,
  LOGIN_EMP: `user/elogin`,
  URL_PASSWORD: `user/password`,
  URL_USER: `user/all`,
  URL_EDITUSER: `user/level`,
  URL_DELETEUSER: `user/delete`,
  USER_QUERY: `user/level_query`,

  VENDER_ALL: `vender/all`,
  VENDER_IN: `vender/in`,
  VENDER_DEL: `vender/del`,

  RFID_RFID: `rfid/find_rfid`,
  RFID_EMP: `rfid/find_emp`,
  RFID_IN: `rfid/in_new`,
  RFID_ALL: `rfid/all`,
  RFID_ALL_FINDER: `rfid/all_finder`,
  RFID_ALL_VENDER: `rfid/all_vender`,
  RFID_DEL: `rfid/del`,
  RFID_UPDATE: `rfid/update`,
  RFID_UPDATE_TEXT: `rfid/update_text`,
  RFID_PLATE: `rfid/plate`,

  RECORD_IN: `record/in`,
  RECORD_LAST: `record/find_last`,

  REPORT_RAW: `record/report_raw`,
  REPORT_PIVOT: `record/report_pivot`,
  REPORT_PIVOT_EXCEL: `record/report_pivot_excel`,
  REPORT_DEL: `record/delete`,

  CAMEAR_IN: `camera/in`,
  CAMEAR_RAW: `camera/report_raw`,
  CAMEAR_PIVOT: `camera/report_pivot`,
  CAMEAR_EXCEL: `camera/report_excel`,
  CAMEAR_DEL: `camera/delete`,
  CAMEAR_LAST: `camera/find_last`,
  CAMEAR_5: `camera/top_5`,

  RFID_DEL_ALL: `rfid/del_all`,

  DRIVER_ALL: `driver/all`,
  DRIVER_INCOMPLETE: `driver/incomplete`,
  DRIVER_EXPIRE: `driver/expire`,
  DRIVER_ALERT: `driver/alert`,
  DRIVER_GOOD: `driver/good`,

  DRIVER_DEL: `driver/del`,
  DRIVER_IN: `driver/in_new`,
  DRIVER_FIND: `driver/find_emp_no`,
  DRIVER_UPDATE: `driver/update`,
  DRIVER_UPDATE_BIRTHDATE: `driver/update_birthdate`,

  EMP_VENDER: `black/all_emp`,
  BLACK_IN: `black/in`,
  BLACK_FIND: `black/find_id_card`,

  OPD_ALL: `opd/all`,
  OPD_IN: `opd/in`,
  OPD_DEL: `opd/del`,

  OPD_RECORD_IN: `opd_record/in`,
  OPD_report_raw: `opd_record/report_raw`,
  OPD_RECORD_DEL: `opd_record/delete`,

  BUS_LIST_PLATE: `bus_text/all_plate`,
  // BUS_FIND: `bus/find_plate`,
 
  BUS_FIND_DUP: `bus_text/find_plate_checkdup`,
  // BUS_FIND_VENDER: `bus/find_vender_plate`,
  // BUS_IN: `bus/in_new`,
  // BUS_UPLOAD: `bus/in`,

  BUS_DEL_TEXT: `bus_text/del`,
  BUS_DEL_TAX: `bus_tax/del`,
  BUS_DEL_inspection: `bus_inspection/del`,
  BUS_DEL_insurance: `bus_insurance/del`,

  BUS_ALL: `bus_text/all`,
  BUS_incomplete: `bus_text/incomplete`,
  BUS_tax: `bus_text/tax`,
  BUS_insurance: `bus_text/insurance`,
  BUS_inspection: `bus_text/inspection`,
  BUS_good: `bus_text/good`,
  BUS_PIC_tax: `bus_tax/find_plate2`,
  BUS_PIC_insurance: `bus_insurance/find_plate2`,
  BUS_PIC_inspection: `bus_inspection/find_plate2`,
  BUS_text_in: `bus_text/in`,
  BUS_IN_tax: `bus_tax/in`,
  BUS_IN_inspection: `bus_inspection/in`,
  BUS_IN_insurance: `bus_insurance/in`,


  BUS_UPDATE_TEXT: `bus_text/update`,

  BUS_ALERT_TAX: `bus_text/tax_alert`,
  BUS_ALERT_inspection: `bus_text/inspection_alert`,
  BUS_ALERT_insurance: `bus_text/insurance_alert`,
  // BUS_UPDATE_tax: `bus_tax/update_pic_tax`,
  // BUS_UPDATE_insurance: `bus_insurance/update_pic_insurance`,
  // BUS_UPDATE_inspection: `bus_inspection/update_pic_inspection`,

  ACHIVE_BUS_ALL: `achive_bus/all`,
  ACHIVE_BUS_IN: `achive_bus/in`,
  ACHIVE_DRIVER_IN: `achive_driver/in`,
  ACHIVE_DRIVER_ALL: `achive_driver/all`,


};

export const key = {
  LOGIN_PASSED: "LOGIN_PASSED",
  USER_LV: "USER_LV",
  USER_VENDER: "USER_VENDER",
  USER_NAME: "USER_NAME",
  USER_EMP: "USER_EMP",
  TIME_LOGIN: "TIME_LOGIN",
  EDITTED_USER: "USER_EMP",
};

// Error Code
export const E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
export const E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR = "E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR";
export const E_PERMISSION_MISSING = "E_PERMISSION_MISSING";
export const E_PICKER_NO_CAMERA_PERMISSION = "E_PICKER_NO_CAMERA_PERMISSION";
export const E_USER_CANCELLED = "E_USER_CANCELLED";
export const E_UNKNOWN = "E_UNKNOWN";
export const E_DEVELOPER_ERROR = "E_DEVELOPER_ERROR";
export const TIMEOUT_NETWORK = "ECONNABORTED"; // request service timeout
export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK";

export const NETWORK_CONNECTION_MESSAGE = "Cannot connect to server, Please try again.";
export const NETWORK_TIMEOUT_MESSAGE = "A network timeout has occurred, Please try again.";
export const UPLOAD_PHOTO_FAIL_MESSAGE = "An error has occurred. The photo was unable to upload.";
