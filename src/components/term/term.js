import React, { Component } from "react";
import { APP_TITLE } from "../../constance/contance";

class Term extends Component {
  render() {
    return (
      <div className="row" style={{ marginTop: 70, marginBottom: 20 }}>
        <div className="col-3"></div>
        <div className="col-6">
          <h2>Terms And Conditions</h2>

          {/* xx */}
          <div>
            <p>
              Terms and Conditions for the Use of {APP_TITLE}. The user agrees
              to use {APP_TITLE} (web Application) provided by Manufacturing
              Improvement YOKOTEN Center (MIC) pursuant to the details
              prescribed by the admin. The user agrees to be bound by and comply
              with the following terms and conditions:
            </p>
          </div>
          {/* xx */}
          <div>
            <h5>Network&nbsp;</h5>
            <p>
            The {APP_TITLE} must be used with NMB network. You can connect via notebook with MGWN / TWN wifi 
            or internal LAN cable.
            </p>
          </div>
          {/* xx */}
          <div>
            <h5>Browser&nbsp;</h5>
            <p>
              The {APP_TITLE} is suitable for{" "}
              <a href="https://www.google.com/chrome/" target="_blank">
                GoogleChrome
              </a>
              {" "}or{" "}
              <a href="https://www.microsoft.com/th-th/edge" target="_blank">
                MicrosoftEdge
              </a>{" "}
              {" "}or newer only.if any user got problem with color scale or other
              visible object please change your web browser to supported browser
              or contact your System Admin for update your browser.
            </p>
          </div>
          {/* xx */}
          <div>
            <h5>Registeration&nbsp;</h5>
            <p>
              Username, Password and every account detail were kept in SQL
              Server database. Password which kept will converted to Hash
              language password. They can not convert back to normal Password.
              Users need to use this item for log-in. You should remember. Admin
              team can not recall your password. In worst case you can ask to
              delete your account.
            </p>
          </div>
          {/* xx */}
          <div>
            <h5>Login&nbsp;</h5>
            <p>
              user should log-out after use ,for protect someting wrong All user
              need to log-in again after 4 hours
            </p>
          </div>

          {/* xx */}
          <div className="input-group mb-3">
            <p>
              The Admin shall have the right to add, amend or modify the terms
              and conditions for the use of the Application including deny,
              temporarily suspend or cancel such services or any and all
              functions at anytime, provided that the Admin will inform the
              Applicant through the Application and/or by any other means as the
              Admin deems appropriate.
            </p>
          </div>
          {/* xx */}
          <div className="row">
            <div className="col-4">
              <button
                type="submit"
                className="btn btn-secondary btn-block"
                onClick={(e) => {
                  e.preventDefault();
                  //this.props.history.push("/register");
                  window.close();
                }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
        <div className="col-3"></div>
      </div>
    );
  }
}

export default Term;
