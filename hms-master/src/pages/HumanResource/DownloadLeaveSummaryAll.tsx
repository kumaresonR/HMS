import React, { useRef } from "react";
import { Container } from "reactstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/images/Logo_medic.jpg";

const DownloadLeaveSummaryAll = (props: any) => {
  console.log("Received data:", props.data);
  const leavesummaryRefs = useRef<any[]>([]);
  const { fromMonth, toMonth, year } = props;
  const handleDownloadPdf = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    try {
      for (let index = 0; index < props.data.length; index++) {
        const leavesummaryElement = leavesummaryRefs.current[index];
        if (!leavesummaryElement) continue;

        const canvas = await html2canvas(leavesummaryElement, {
          useCORS: true,
          // @ts-ignore
          scale: 1,
          scrollY: -window.scrollY,
        });

        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        if (index > 0) pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin,
          pdfWidth - margin * 2,
          imgHeight
        );

        const pageLabel = `Page ${index + 1}`;
        const labelWidth = pdf.getTextWidth(pageLabel);
        pdf.setFontSize(5);
        pdf.text(pageLabel, (pdfWidth - labelWidth) / 2, pdfHeight - 5);
      }

      pdf.save("LeaveSummarys.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Container>
      {props.data.map((employeeData: any, index: number) => (
        <div
          className="discharge-card-container"
          key={index}
          ref={(el) => (leavesummaryRefs.current[index] = el)}
          style={{ marginBottom: "30px" }}
        >
          <div className="discharge-card">
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
        </div>
      ))}

      <div className="row">
        <div className="col-12 d-flex justify-content-end">
          <button
            onClick={handleDownloadPdf}
            className="btn btn-sm btn-primary"
            style={{ margin: "20px", padding: "10px 15px" }}
          >
            Download All
          </button>
        </div>
      </div>
    </Container>
  );
};

export default DownloadLeaveSummaryAll;
