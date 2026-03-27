import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import ErrorHandler from "../../helpers/ErrorHandler";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch } from "react-redux";
import FormHeader from "../../common/FormHeader/FormHeader";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useModal } from "../../Components/Common/ModalContext";
import DownloadPayslip from "./DownloadPayslip";
import DownloadPayslipAll from "./DownloadPayslipAll";


type EmployeeDetails = {
  firstName: string;
  lastName: string;
  staffId: string;
  designation?: string;
  departmentName?: string;
  phone?: string;
  email?: string;
  dateOfJoining?: string;
  roleDetails?: {
    roleName: string;
  };
};

type PayRole = {
  payroll: any;
  employeeDetails: EmployeeDetails;
};

const SalarySlipDataTable = (props: any) => {
  const employeeApiService: EmployeeApiService = new EmployeeApiService();
  let navigate: any = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { showModal } = useModal();
  const [role, setRole] = useState("");
  const [roleData, setRoleData] = useState<any>([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [payRoleData, setPayRoleData] = useState<PayRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState<any>([]);

  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [staffName, setStaffName] = useState("");
  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1];
  const [isExportCSV, setIsExportCSV] = useState(false);

  const getAllRole = async () => {
    try {
      let result = await employeeApiService.getAllRole();
      setRoleData(result);
    } catch (error: any) {
      return ErrorHandler(error);
    }
  };

  const getAllEmployee = async () => {
    try {
      let result = await employeeApiService.searchAllEmployee("");
      console.log("Employee", result); 
      setEmployeeData(result);
    } catch (error: any) {
      return ErrorHandler(error);
    }
  }; 
  const getAllPayroll = async () => {
    try {
      setLoading(true);
  
      const params = new URLSearchParams();
  
      if (role) params.append("roleId", role);
      if (month) params.append("fromMonth", month);
      if (year) params.append("year", year);
      if (selectedEmployee) params.append("staffId", selectedEmployee); 
      params.append("page", "0");
      params.append("size", "100");
      
      const queryString = params.toString();
      let result = await employeeApiService.getAllMonthlyPaySlip(queryString);
      setPayRoleData(result.data);
  
    } catch (error: any) {
      return ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };
  
   
  const handleSearch = () => {
    if (!year) {
      toast.error("Please select  Year", { containerId: "TR" });
    } else {
      getAllPayroll();
    }
  };

  useEffect(() => {
    getAllEmployee();
    getAllRole();
  }, []);

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card id="payrollList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0">Payroll List</h5>
                      </div>
                    </div>

                    <div className="col-sm-auto">
                      <div>
                        {payRoleData && payRoleData.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              showModal({
                                content: (
                                  <DownloadPayslipAll data={payRoleData} />
                                ),
                                title: "PaySlip",
                                size: "xl",
                              });
                            }}
                            className="btn btn-primary ms-2 view-item-btn"
                          >
                            Download Over All Payslip
                          </button>
                        )}
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row className="align-items-center">
                    <Col>
                      <FormGroup>
                        <Label for="role">Role</Label>
                        <Input
                          type="select"
                          id="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="">Select Role</option>
                          {roleData.map((item: any, idx: any) => (
                            <option key={idx} value={item.roleId}>
                              {item.roleName}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label for="employee">Employee</Label>
                        <Input
                          type="select"
                          id="employee"
                          value={selectedEmployee}
                          onChange={(e) => setSelectedEmployee(e.target.value)}
                        >
                          <option value="">Select Employee</option>
                          {employeeData.map((item: any, idx: any) => {
                            const cleanName = item.fullName
                              .split("(")[0]
                              .trim();
                            const firstName = cleanName.split(" ")[0];
                            return (
                              <option key={idx} value={item.staffId}>
                                {" "}
                                {item.fullName}
                              </option>
                            );
                          })}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col>
                      <FormGroup>
                        <Label for="month">Month</Label>
                        <Input
                          type="select"
                          id="month"
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                        >
                          <option value="">Select Month</option>
                          {months.map((monthName, idx) => (
                            <option key={idx} value={monthName}>
                              {monthName}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label for="year">Year</Label>
                        <Input
                          type="select"
                          id="year"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                        >
                          <option value="">Select Year</option>
                          {years.map((yearValue, idx) => (
                            <option key={idx} value={yearValue}>
                              {yearValue}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col xs="auto">
                      <Button onClick={handleSearch}>Search</Button>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12}>
                      <div className="table-responsive">
                        <Table
                          hover
                          className="table-centered table-bordered align-middle table-nowrap mb-0"
                        >
                          <thead className="table-light">
                            <tr>
                              <th>Name</th>
                              <th>Staff ID</th>
                              {/* <th>Designation</th>
                              <th>Department</th>
                              <th>Phone</th>
                              <th>Email</th> */}
                              <th>Date of Joining</th>
                              <th>Role</th>
                              <th>Gross Salary</th> 
                              <th>Total Deductions</th> 
                              <th>Total Earnings</th> 
                              <th>Net Salary</th>
                              <th>Month</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payRoleData && payRoleData.length > 0 ? (
                              payRoleData.map((item: PayRole, idx: number) => {
                                const emp = item.employeeDetails;
                                const payroll = item.payroll;
                                return (
                                  <tr key={idx}>
                                    <td>
                                      {emp.firstName} {emp.lastName}
                                    </td>
                                    <td>
                                      <span className="badge p-2 bg-success-subtle text-success">
                                        {emp.staffId}
                                      </span>
                                    </td>
                                    {/* <td>{emp.designation || "-"}</td>
                                    <td>{emp.departmentName || "-"}</td>
                                    <td>{emp.phone || "-"}</td>
                                    <td>{emp.email || "-"}</td> */}
                                    <td>{emp.dateOfJoining || "-"}</td>
                                    <td>{emp.roleDetails?.roleName || "-"}</td>
                                    <td>{payroll?.grossSalary || "-"}</td>{" "}
                                    <td>{payroll?.totalDeductions || "-"}</td>{" "}
                                    <td>{payroll?.totalEarnings || "-"}</td>{" "}
                                    <td>{payroll?.netSalary || "-"}</td>{" "}
                                    <td>{payroll?.month || "-"}</td>{" "}
                                    <td>
                                      <li
                                        className="list-inline-item"
                                        title="View"
                                      >
                                        <Link
                                          onClick={(e) => {
                                            e.preventDefault();
                                            const empData = item;
                                            showModal({
                                              content: (
                                                <DownloadPayslip
                                                  data={empData}
                                                />
                                              ),
                                              title: "PaySlip",
                                              size: "xl",
                                            });
                                          }}
                                          className="view-item-btn"
                                          to="#"
                                        >
                                          <i className="ri-eye-fill align-bottom text-pink"></i>
                                        </Link>
                                      </li>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={12} className="text-center">
                                  No payroll records found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SalarySlipDataTable;