import React, { useEffect, useRef, useState } from "react";
import { Container } from "reactstrap";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/images/Logo_medic.jpg";
import { MdOutlineCurrencyRupee } from "react-icons/md";
const DownloadLeaveSummary = (props: any) => {
  const [employeeData, setEmployeeData] = useState<any>(props.data);
  const cardRef = useRef<HTMLDivElement>(null);
  const { fromMonth, toMonth, year } = props;
  const handleDownloadPdf = async () => {
    const input = cardRef.current;
    if (!input) {
      console.error("Could not find the card element to download.");
      return;
    }

    try {
      const fullCanvas = await html2canvas(input, {
        useCORS: true,
        // @ts-ignore
        scale: 1,
        scrollY: -window.scrollY,
      });

      const fullWidth = fullCanvas.width;
      const fullHeight = fullCanvas.height;

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const scale = (pdfWidth - margin * 2) / fullWidth;
      const pageHeightPx = (pdfHeight - margin * 2) / scale;

      const totalPages = Math.ceil(fullHeight / pageHeightPx);

      for (let page = 0; page < totalPages; page++) {
        const pageCanvas = document.createElement("canvas");
        const pageContext = pageCanvas.getContext("2d");

        const pageY = page * pageHeightPx;
        const pageHeightActual = Math.min(pageHeightPx, fullHeight - pageY);

        pageCanvas.width = fullWidth;
        pageCanvas.height = pageHeightActual;
        pageContext?.drawImage(
          fullCanvas,
          0,
          pageY,
          fullWidth,
          pageHeightActual,
          0,
          0,
          fullWidth,
          pageHeightActual
        );

        const imgData = pageCanvas.toDataURL("image/png");

        if (page > 0) pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin,
          pdfWidth - margin * 2,
          pageHeightActual * scale
        );

        const pageLabel = `Page ${page + 1}`;
        const labelWidth = pdf.getTextWidth(pageLabel);
        pdf.setFontSize(5);
        pdf.text(pageLabel, (pdfWidth - labelWidth) / 2, pdfHeight - 5);
      }

      pdf.save("LeaveSummary.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const formatDate = (
    dateString: string | null | undefined,
    format = "DD/MM/YYYY, hh:mm A"
  ) => {
    if (!dateString) return "-";
    return moment(dateString).isValid()
      ? moment(dateString).format(format)
      : dateString;
  };

  return (
    <Container>
      <div className="discharge-card-container">
        {/* <div>
          <pre>
            {JSON.stringify(employeeData,null ,2)}
          </pre>
        </div> */}
        <div className="discharge-card" ref={cardRef}>
          <header className="card-headermain">
            <div className="logo">
              <img src={logo} alt="Logo" className="hospital-logo" />
            </div>
            <div className="hospital-info">
              <h1>I-MEDIC-X</h1>
              <p>Surgery Clinic</p>
              <p>45 Wellness Blvd, Lakeview, NY 12000</p>
              <p>Phone: (212) 555-4321 | e-mail: info@riversidemed.com</p>
            </div>
          </header>

          <div className="employee-details">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td
                    colSpan={4}
                    className="text-center"
                    style={{ fontSize: "15px" }}
                  >
                    {" "}
                    <b>Leave Summary </b>{" "}
                  </td>
                </tr>

                <tr>
                  <th>Name</th>
                  <td>
                    {employeeData.employeeDetails.firstName}{" "}
                    {employeeData.lastName}
                  </td>
                  <th>Staff ID</th>
                  <td>{employeeData.employeeDetails.staffId}</td>
                </tr>

                <tr>
                  <th>Designation</th>
                  <td>{employeeData.employeeDetails.designation}</td>

                  <th>Department</th>
                  <td>{employeeData.employeeDetails.departmentName}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{employeeData.employeeDetails.email}</td>

                  <th>Phone</th>
                  <td>{employeeData.employeeDetails.phone}</td>
                </tr>
                <tr>
                  <td>
                    <strong>From</strong>
                  </td>
                  <td>
                    {fromMonth} : {year}
                  </td>
                  {toMonth ? (
                    <>
                      <td>
                        <strong>To </strong>
                      </td>
                      <td>
                        {toMonth} : {year}
                      </td>
                    </>
                  ) : (
                    <>
                      <td></td>
                      <td></td>
                    </>
                  )}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="leave-summary-form">
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th>Leave Type</th>
                  <th>Allocated Leaves</th>
                  <th>Used Leaves</th>
                  <th>Remaining Leaves</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.leaveSummary.map((leave: any) => (
                  <tr key={leave.leaveType}>
                    <td>{leave.leaveType}</td>
                    <td>{leave.allocatedLeaves}</td>
                    <td>{leave.usedLeaves}</td>
                    <td>{leave.remainingLeaves}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-3">
              Note: This is a summary of the employee's leave balances.
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 d-flex justify-content-end">
          <button
            onClick={handleDownloadPdf}
            className="btn btn-sm btn-primary"
            style={{ margin: "20px", padding: "10px 15px" }}
          >
            Download
          </button>
        </div>
      </div>
    </Container>
  );
};

export default DownloadLeaveSummary;
