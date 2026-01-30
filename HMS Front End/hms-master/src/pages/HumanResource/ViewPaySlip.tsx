import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";
import ErrorHandler from "../../helpers/ErrorHandler";
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService";
import "./payslip.css";
import logoDark from "../../assets/images/Logo f (1).png"; // Adjust the path as needed

const ViewPaySlip = (props: any) => {
  const employeeApiService: EmployeeApiService = new EmployeeApiService();

  const [data, setPayRoleData] = useState<any>("");
  const [employeeData, setEmployeeData] = useState<any>("");

  const viewPaySlip = async () => {
    try {
      let result = await employeeApiService.getPaySlipId(props.data.payrollId);
      console.log("getAllPayroll", result);
      setPayRoleData(result.payroll);
      setEmployeeData(result.employeeDetails);
    } catch (error: any) {
      console.log("getAllPayroll Error");
      console.log(error);
      return ErrorHandler(error);
    }
  };

  useEffect(() => {
    viewPaySlip();
  }, []);

  return (
    <Container fluid>
      <Row className="justify-content-center viewPayslip">
        <Col lg={8}>
          <Card id="demo" className="p-4">
            <Row>

              <div className="justify-content-center">
                <p className="text-center payslip">Payslip</p>
              </div>
              <h3 className="text-center">
                {data.month} {data.year}
              </h3>
              <div className="row d-flex justify-content-between pe-0">
                <div className="col-6">
                  {" "}
                  {/* <p className="mb-0"><b>Payslip #471</b></p> */}
                </div>
                <div className="col-6 pe-0">
                  {" "}
                  <p className="  text-end"><b>Payment Date: {moment(data.payrollDate).format('DD/MM/YYYY')}</b></p>
                </div>
              </div>

              <Col lg={12}>
                <CardBody className="p-3 border">
                  <Row>
                    <Col sm={6}>
                      <p>
                        <strong>Staff ID:</strong> {employeeData?.staffId}
                      </p>
                      <p>
                        <strong>Department:</strong>{" "}
                        {employeeData?.departmentId}
                      </p>
                    </Col>
                    <Col sm={6}>
                      <p>
                        <strong>Name:</strong> {employeeData?.firstName}
                      </p>
                      <p>
                        <strong>Designation:</strong>{" "}
                        {employeeData?.designation}
                      </p>
                    </Col>
                  </Row>
                </CardBody>
              </Col>

              <Col lg={12} className="mt-4">
                <Row>
                  <Col md={6}>
                    <Table>
                      <thead>
                        <tr className=" text-center">
                          <th>Earning </th>
                          <th>Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.earnings?.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td>{item.type}</td>
                            <td className="text-end">{item.amount}</td>
                          </tr>
                        ))}
                        <tr className="fw-bold">
                          <td>Total Earnings</td>
                          <td className="text-end">{data.totalEarnings}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <Table>
                      <thead>
                        <tr className=" text-center">
                          <th>Deduction</th>
                          <th>Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.deductions?.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td>{item.type}</td>
                            <td className="text-end">{item.amount}</td>
                          </tr>
                        ))}
                        <tr className="fw-bold">
                          <td>Total Deductions</td>
                          <td className="text-end">{data.totalDeductions}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Col>


            </Row>
            <div className="row d-flex justify-content-end netsalary"><div className="col-6">

              <Table className="w-100 kuutytable">
                <tbody>
                  <tr>
                    <td className="text-right p-0" >Payment Mode</td>
                    <td className="text-end p-0 ">{data.paymentMode}</td>
                  </tr>
                  <tr>
                    <td className="text-right p-0">
                      Basic Salary (₹)
                    </td>
                    <td className="text-end p-0">{data.basicSalary}</td>
                  </tr>
                  <tr>
                    <td className="text-right p-0">
                      Gross Salary (₹)
                    </td>
                    <td className="text-end p-0">{data.grossSalary}</td>
                  </tr>
                  <tr>
                    <td className="text-right p-0">
                      Tax (₹)
                    </td>
                    <td className="text-end p-0">
                      {data.tax} ({data.taxPercentage}%)
                    </td>
                  </tr>
                  <tr className="fs-5">
                    <td className="text-right p-0">
                      Net Salary (₹)
                    </td>
                    <td className="text-end p-0">{data.netSalary}</td>
                  </tr>
                </tbody>
              </Table>
            </div></div>
          </Card>
        </Col>
        <p>This invoice is printed electronically, so no signature is required
        </p>
      </Row>
    </Container>
  );
};

export default ViewPaySlip;