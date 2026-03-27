import React, { useRef } from "react";
import { Container } from "reactstrap";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/images/Logo_medic.jpg";
import { MdOutlineCurrencyRupee } from "react-icons/md";

const DownloadPayslipAll = (props: any) => {
  console.log("Received data:", props.data);  
  const payslipRefs = useRef<any[]>([]);  
 const cardRef = useRef<HTMLDivElement>(null);
  const numberToWords = (num: number): string => {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen",
    ];
    const b = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
      "Eighty", "Ninety",
    ];

    const inWords = (n: number): string => {
      if (n === 0) return "Zero";
      if (n < 20) return a[n];
      if (n < 100) return `${b[Math.floor(n / 10)]} ${a[n % 10]}`.trim();
      if (n < 1000) return `${a[Math.floor(n / 100)]} Hundred ${inWords(n % 100)}`.trim();
      if (n < 100000) return `${inWords(Math.floor(n / 1000))} Thousand ${inWords(n % 1000)}`.trim();
      if (n < 10000000) return `${inWords(Math.floor(n / 100000))} Lakh ${inWords(n % 100000)}`.trim();
      return `${inWords(Math.floor(n / 10000000))} Crore ${inWords(n % 10000000)}`.trim();
    };

    return inWords(num);
  };

  const handleDownloadPdf = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
  
    try {
      for (let index = 0; index < props.data.length; index++) {
        const payslipElement = payslipRefs.current[index];
        if (!payslipElement) continue; 
  
        const canvas = await html2canvas(payslipElement, {
          useCORS: true,
           // @ts-ignore
          scale: 1,
          scrollY: -window.scrollY,
        });
  
        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  
        if (index > 0) pdf.addPage(); 
  
        pdf.addImage(imgData, "PNG", margin, margin, pdfWidth - margin * 2, imgHeight);
  
        const pageLabel = `Page ${index + 1}`;
        const labelWidth = pdf.getTextWidth(pageLabel);
        pdf.setFontSize(5);
        pdf.text(pageLabel, (pdfWidth - labelWidth) / 2, pdfHeight - 5);
      }
  
      pdf.save("Payslips.pdf"); // Save the PDF with all payslips
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
      {props.data.map((employeeData: any, index: number) => (
        <div
          className="discharge-card-container"  
          key={index}
          ref={(el) => (payslipRefs.current[index] = el)}
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
              <b>{numberToWords(employeeData.payroll?.netSalary || 0)} Rupees Only</b>
            </p>
            <p>
              Note: This is a system generated document and does not require any signature.
            </p>
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

export default DownloadPayslipAll;
