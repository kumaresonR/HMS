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
import DownloadLeaveSummaryAll from "./DownloadLeaveSummaryAll";
import DownloadLeaveSummary from "./DownloadLeaveSummary";

type LeaveSummaryItem = {
  leaveType: string;
  allocatedLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
};

type EmployeeDetails = {
  firstName: string;
  lastName: string;
  staffId: string;
  designation?: string;
  departmentName?: string;
  specialist?: string;
  phone?: string;
  email?: string;
  leave?: string;
  dateOfJoining?: string;
  roleDetails?: {
    roleName: string;
  };
};

type PayRole = {
  employeeDetails: EmployeeDetails;
  leaveSummary: LeaveSummaryItem[];
  payroll?: any;
};

const LeaveSummaryDataTable = (props: any) => {
  const employeeApiService: EmployeeApiService = new EmployeeApiService();
  let navigate: any = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { showModal } = useModal();
  const [role, setRole] = useState("");
  const [roleData, setRoleData] = useState<any>([]);
  const [employeeData, setEmployeeData] = useState<any>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [year, setYear] = useState("");
  const [payRoleData, setPayRoleData] = useState<PayRole[]>([]);
  const [loading, setLoading] = useState(false);
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

      if (fromMonth) params.append("fromMonth", fromMonth.toUpperCase());
      if (toMonth) params.append("toMonth", toMonth.toUpperCase());
      if (year) params.append("year", year);
      if (role) params.append("roleId", role);
      if (selectedEmployee) params.append("staffId", selectedEmployee);
      params.append("page", "0");
      params.append("size", "100");

      const queryString = params.toString();
      const result = await employeeApiService.getAllMonthlyPayLeave(queryString);
      console.log(result);

      setPayRoleData(result.leaveSummaries);
    } catch (error: any) {
      return ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!year || !fromMonth) {
      toast.error("Please select both Year and Month", { containerId: "TR" });
    } else {
      getAllPayroll();
    }
  };

  useEffect(() => {
    getAllRole();
    getAllEmployee();
  }, []);
  const allLeaveTypes = Array.from(
    new Set(
      payRoleData.flatMap((item) =>
        item.leaveSummary.map((leave) => leave.leaveType)
      )
    )
  );

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          {/* <div>
            <h2>Leave Summary :</h2>
            <pre>{JSON.stringify(payRoleData, null, 2)}</pre>
          </div> */}
          {/* <div>
            <pre>{JSON.stringify(employeeData, null, 2)}</pre>
          </div> */}
          {/* <div>
            <pre>
              {JSON.stringify(roleData, null, 2)}
            </pre>
           </div> */}
          <Row>
            <Col lg={12}>
              <Card id="payrollList">
                <CardHeader className="border-0">
                  <div className="col-sm">
                    <div>
                      <h5 className="card-title mb-0">Leave Summary</h5>
                    </div>
                  </div>
                  <Row className="g-4 align-items-center justify-content-end">
                    <div className="col-sm-auto">
                      <div>
                        {/* <Button
                          color="primary"
                          onClick={() => setIsExportCSV(true)}
                        >
                          Export to Excel
                        </Button> */}
                        {payRoleData && payRoleData.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              showModal({
                                content: (

                                  <DownloadLeaveSummaryAll data={payRoleData} fromMonth={fromMonth} toMonth={toMonth} year={year} />
                                ),
                                title: "Leave Summary",
                                size: "xl",
                              });
                            }}
                            className="btn btn-primary ms-2 view-item-btn"
                          >
                            Download Overall Summary
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

                                {item.fullName}
                              </option>
                            );
                          })}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col>
                      <FormGroup>
                        <Label for="frommonth">From Month</Label>
                        <Input
                          type="select"
                          id="frommonth"
                          value={fromMonth}
                          onChange={(e) => setFromMonth(e.target.value)}
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
                        <Label for="toMonth">To Month</Label>
                        <Input
                          type="select"
                          id="toMonth"
                          value={toMonth}
                          onChange={(e) => setToMonth(e.target.value)}
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
                              <th>Staff ID</th>
                              <th>Name</th>
                              {/* <th>Email</th> */}
                              {/* <th>Phone</th>
                              <th>Department</th> */}
                              {allLeaveTypes.map((leaveType) => (
                                <th key={leaveType}>{leaveType}</th>
                              ))}
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payRoleData.map((item, idx) => {
                              const emp = item.employeeDetails;
                              const leaveSummary = item.leaveSummary;

                              const leaveMap: Record<string, LeaveSummaryItem> =
                                {};
                              leaveSummary.forEach((leave) => {
                                leaveMap[leave.leaveType] = leave;
                              });

                              return (
                                <tr key={idx}>
                                  <td>
                                    <span className="badge p-2 bg-success-subtle text-success">
                                      {emp.staffId}
                                    </span>
                                  </td>
                                  <td className="text-nowrap">
                                    {emp.firstName} {emp.lastName}
                                  </td>
                                  {/* <td>{emp.email}</td> */}
                                  {/* <td>{emp.phone}</td>
                                  <td>{emp.departmentName}</td> */}
                                  {allLeaveTypes.map((leaveType) => (
                                    <td key={`${idx}-${leaveType}`}>
                                      <div className="d-flex justify-content-between text-nowrap">
                                        <p>Allocated</p>
                                        <p>:</p>
                                        <p>
                                          {leaveMap[leaveType]
                                            ?.allocatedLeaves || 0}
                                        </p>
                                      </div>
                                      <div className="d-flex justify-content-between text-nowrap">
                                        <p>Used</p>
                                        <p>:</p>
                                        <p>
                                          {leaveMap[leaveType]?.usedLeaves || 0}
                                        </p>
                                      </div>
                                      <div className="d-flex justify-content-between text-nowrap">
                                        <p>Remaining</p>
                                        <p>:</p>
                                        <p>
                                          {leaveMap[leaveType]
                                            ?.remainingLeaves || 0}
                                        </p>
                                      </div>
                                    </td>
                                  ))}
                                  <td>
                                    {" "}
                                    <Link
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const empData = item;
                                        showModal({
                                          content: (

                                            <DownloadLeaveSummary data={empData} fromMonth={fromMonth} toMonth={toMonth} year={year} />

                                            // <DownloadLeaveSummary data={empData} />
                                          ),
                                          title: "Leave Summary",
                                          size: "xl",
                                        });
                                      }}
                                      className="view-item-btn"
                                      to="#"
                                    >
                                      <i className="ri-eye-fill align-bottom text-pink"></i>
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
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

export default LeaveSummaryDataTable;
