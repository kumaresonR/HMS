import React, { useEffect, useRef, useState } from "react";
import { Container } from "reactstrap";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/images/Logo_medic.jpg";
import { MdOutlineCurrencyRupee } from "react-icons/md";
const DownloadPayslip = (props: any) => {
  const [employeeData, setEmployeeData] = useState<any>(props.data);
  const cardRef = useRef<HTMLDivElement>(null);
  const numberToWords = (num: number): string => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const inWords = (n: number): string => {
      if (n === 0) return "Zero";
      if (n < 20) return a[n];
      if (n < 100) return `${b[Math.floor(n / 10)]} ${a[n % 10]}`.trim();
      if (n < 1000)
        return `${a[Math.floor(n / 100)]} Hundred ${inWords(n % 100)}`.trim();
      if (n < 100000)
        return `${inWords(Math.floor(n / 1000))} Thousand ${inWords(
          n % 1000
        )}`.trim();
      if (n < 10000000)
        return `${inWords(Math.floor(n / 100000))} Lakh ${inWords(
          n % 100000
        )}`.trim();
      return `${inWords(Math.floor(n / 10000000))} Crore ${inWords(
        n % 10000000
      )}`.trim();
    };

    return inWords(num);
  };

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

      pdf.save("Payslip.pdf");
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
          {/* <div>
            <h2>Payroll Data:</h2>
            <pre>{JSON.stringify(employeeData, null, 2)}</pre>
          </div> */}
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
                    <b>Employee Pay Slip</b>{" "}
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
                  <th>Month</th>
                  <td>{employeeData.payroll?.month || "-"}</td>

                  <th>Year</th>
                  <td>{employeeData.payroll?.year || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="row d-flex justify-content-start">
            <div className="col-6">
              <div className="payroll-details">
                <table className="table table-bordered">
                  <tbody>
                    <tr className="bg-light">
                      <th> Earnings</th>
                      <th className="text-end">
                        {" "}
                        Amount <MdOutlineCurrencyRupee />{" "}
                      </th>
                    </tr>
                    <tr>
                      <th>PF</th>
                      <td className="text-end">
                        <b>
                          {employeeData.payroll?.earnings?.reduce(
                            (acc: any, curr: { type: string; amount: any }) => {
                              return curr.type === "PF" ? curr.amount : acc;
                            },
                            0
                          )}
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <th>Total Earnings</th>
                      <td className="text-end">
                        <b>{employeeData.payroll?.totalEarnings || "-"}</b>
                      </td>
                    </tr>
                    <tr>
                      <th>Total Deductions</th>
                      <td className="text-end">
                        <b>{employeeData.payroll?.totalDeductions || "-"}</b>
                      </td>
                    </tr>
                    <tr>
                      <th>Gross Salary</th>
                      <td className="text-end">
                        <b>{employeeData.payroll?.grossSalary || "-"}</b>
                      </td>
                    </tr>
                    <tr>
                      <th>Net Salary</th>
                      <td className="text-end">
                        <b>{employeeData.payroll?.netSalary || "-"}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <p>
            Amount in Words:{" "}
            <b>
              {numberToWords(employeeData.payroll?.netSalary || 0)} Rupees Only
            </b>
          </p>
          <p>
            Note: This is a system generated document and does not require any
            signature.
          </p>
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

export default DownloadPayslip;
