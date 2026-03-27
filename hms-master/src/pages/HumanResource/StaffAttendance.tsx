import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Card, CardHeader, FormGroup, Label, Input, Button } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import FormHeader from "../../common/FormHeader/FormHeader";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import ErrorHandler from "../../helpers/ErrorHandler";
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../slices/pageResizer/uiSlice";

const StaffAttendance = () => {
  const employeeApiService: EmployeeApiService = new EmployeeApiService();

  let navigate: any = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const today = moment().format("YYYY-MM-DD");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>(null);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [role, setRole] = useState('');
  const [roleData, setRoleData] = useState<any>([]);
  const [attendanceDate, setAttendanceDate] = useState(today);
  const [attendanceData, setAttendanceData] = useState<any>([]);

  const toggle = useCallback(() => {
    setModal(!modal);
    setCustomer(null);
  }, [modal]);

  const staffColumn = useMemo(() => [
    {
      header: "Staff Id",
      accessorKey: "staffId",
      enableColumnFilter: false,
    },
    {
      header: "Name",
      accessorKey: "name",
      enableColumnFilter: false,
    },
    {
      header: "Role",
      accessorKey: "roleName",
      enableColumnFilter: false,
    },
    {
      header: "Staff Attendance",
      accessorKey: "staffAttendance",
      enableColumnFilter: false,
      cell: (info: any) => (
        <div>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name={`attendance-${info.row.index}`}
                value="Present"
                checked={info.getValue() === "Present"}
                onChange={() => handleAttendanceChange(info.row.index, "Present")}
              />
              Present
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name={`attendance-${info.row.index}`}
                value="Late"
                checked={info.getValue() === "Late"}
                onChange={() => handleAttendanceChange(info.row.index, "Late")}
              />
              Late
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name={`attendance-${info.row.index}`}
                value="Absent"
                checked={info.getValue() === "Absent"}
                onChange={() => handleAttendanceChange(info.row.index, "Absent")}
              />
              Absent
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name={`attendance-${info.row.index}`}
                value="Half Day"
                checked={info.getValue() === "Half Day"}
                onChange={() => handleAttendanceChange(info.row.index, "Half Day")}
              />
              Half Day
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name={`attendance-${info.row.index}`}
                value="Holiday"
                checked={info.getValue() === "Holiday"}
                onChange={() => handleAttendanceChange(info.row.index, "Holiday")}
              />
              Holiday
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name={`attendance-${info.row.index}`}
                value="Second Half"
                checked={info.getValue() === "Second Half"}
                onChange={() => handleAttendanceChange(info.row.index, "Second Half")}
              />
              Second Half
            </Label>
          </FormGroup>
        </div>
      ),
    },
    {
      header: "Entry Time",
      accessorKey: "entryTime",
      enableColumnFilter: false,
      cell: (info: any) => (
        <Input
          type="time"
          value={info.getValue() || ""}
          onChange={(e) => handleTimeChange(info.row.index, "entryTime", e.target.value)}
        />
      ),
    },
    {
      header: "Exit Time",
      accessorKey: "exitTime",
      enableColumnFilter: false,
      cell: (info: any) => (
        <Input
          type="time"
          value={info.getValue() || ""}
          onChange={(e) => handleTimeChange(info.row.index, "exitTime", e.target.value)}
        />
      ),
    },
    {
      header: "Note",
      accessorKey: "notes",
      enableColumnFilter: false,
      cell: (info: any) => {
        const currentNote = info.getValue();
        return (
          <Input
            id="type"
            name="type"
            type="text"
            value={currentNote || ""}
            onChange={(e) => handleNoteChange(info.row.index, e.target.value)}
          />
        );
      },
    },
  ], []);

  const handleAttendanceChange = (index: number, value: string) => {
    setAttendanceData((prevData: any) => {
      const updatedRow = { ...prevData[index], staffAttendance: value };
      const updatedData = [...prevData];
      updatedData[index] = updatedRow;
      return updatedData;
    });
  };

  const handleTimeChange = (index: number, field: string, value: string) => {
    setAttendanceData((prevData: any) => {
      const updatedRow = { ...prevData[index], [field]: value };
      const updatedData = [...prevData];
      updatedData[index] = updatedRow;
      return updatedData;
    });
  };

  const handleNoteChange = (index: number, value: any) => {
    setAttendanceData((prevData: any) => {
      const updatedRow = { ...prevData[index], notes: value };
      const updatedData = [...prevData];
      updatedData[index] = updatedRow;
      return updatedData;
    });
  };


  const handleAttendanceDateChange = (value: any) => {
    setAttendanceDate(value);
  }

  const handleSearch = () => {
    if (role || attendanceDate) {
      getAllAttendance();
    }
  }

  const handleRoleChange = (value: any) => {
    setRole(value);
  }

  const getAllRole = async () => {
    try {
      let result = await employeeApiService.getAllRole();
      console.log("getAllRole", result);
      setRoleData(result);
    } catch (error: any) {
      console.log("getAllRole Error");
      console.log(error);
      return ErrorHandler(error)
    }
  }

  const getAllAttendance = async () => {
    try {
      const url = 'attendanceDate=' + attendanceDate + '&roleId=' + role
      let result = await employeeApiService.getAllAttendance(url);
      console.log("getAllAttendance", result);
      setAttendanceData(result);
    } catch (error: any) {
      console.log("getAllAttendance Error");
      console.log(error);
      return ErrorHandler(error)
    }
  }

  // const handleSubmit = async () => {
  //   try {
  //     const payload = attendanceData;
  //     await employeeApiService.staffAttendance(payload);
  //     getAllAttendance();
  //     toast.success('Record Saved Successfully', { containerId: 'TR' });
  //   } catch (error: any) {
  //     return ErrorHandler(error)
  //   }
  // }

  const handleSubmit = async () => {
    try {
      const recordsToUpdate = attendanceData.filter((record: any) => record.attendanceId);
      const recordsToCreate = attendanceData.filter((record: any) => !record.attendanceId);

      if (recordsToUpdate.length > 0) {
        await employeeApiService.updateStaffAttendance(recordsToUpdate);
      }

      if (recordsToCreate.length > 0) {
        await employeeApiService.staffAttendance(recordsToCreate);
      }
      getAllAttendance();
      toast.success('Record Saved Successfully', { containerId: 'TR' });
    } catch (error: any) {
      return ErrorHandler(error);
    }
  };

  useEffect(() => {
    getAllRole();
    getAllAttendance();
  }, []);

  const setAttendanceForAll = (value: string) => {
    const updatedData = attendanceData.map((staff: any) => ({
      ...staff,
      staffAttendance: value,
    }));
    setAttendanceData(updatedData);
    console.log("updated", updatedData)
    // toast.info(`Attendance set to "${value}" for all staff.`, { containerId: 'TR' });
  };

  return (
    <React.Fragment>
      <Container fluid>
        <FormHeader title="Staff Attendance"
          pageTitle="Attendance"
          onMinimize={() => dispatch(minimizePage({
            route: location.pathname,
            pageName: "Staff Attendance",
          }))} />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col className="d-flex justify-content-between">
                    <h5 className="card-title">Attendance List</h5>
                    <Button
                      color="primary"
                      onClick={() => navigate(-1)}
                      className="btn btn-primary add-btn ms-3"
                    >
                      <IoArrowBack /> Back
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <div className="card-body">
                <Row className="align-items-center">
                  <Col>
                    <FormGroup>
                      <Label for="role">Role</Label>
                      <Input type="select"
                        id="role"
                        value={role}
                        onChange={e => handleRoleChange(e.target.value)}
                      >
                        <option value="">Select Role</option>
                        {roleData.map((item: any, idx: any) => (
                          <option key={idx} value={item.roleId}>{item.roleName}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="attendanceDate">Attendance Date</Label>
                      <Input type="date"
                        id="attendanceDate"
                        value={attendanceDate}
                        onChange={e => handleAttendanceDateChange(e.target.value)}
                      >
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col xs="auto">
                    <Button onClick={handleSearch}>Search</Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <div className="d-flex gap-2">
                        <h5>Set Attendance for All Staff</h5>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="radio"
                              name="attendanceOption"
                              value="Present"
                              onChange={(e) => setAttendanceForAll(e.target.value)}
                            />
                            Present
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="radio"
                              name="attendanceOption"
                              value="Absent"
                              onChange={(e) => setAttendanceForAll(e.target.value)}
                            />
                            Absent
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="radio"
                              name="attendanceOption"
                              value="Late"
                              onChange={(e) => setAttendanceForAll(e.target.value)}
                            />
                            Late
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="radio"
                              name="attendanceOption"
                              value="Half Day"
                              onChange={(e) => setAttendanceForAll(e.target.value)}
                            />
                            Half Day
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="radio"
                              name="attendanceOption"
                              value="Holiday"
                              onChange={(e) => setAttendanceForAll(e.target.value)}
                            />
                            Holiday
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="radio"
                              name="attendanceOption"
                              value="Second Half"
                              onChange={(e) => setAttendanceForAll(e.target.value)}
                            />
                            Second Half
                          </Label>
                        </FormGroup>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col xs="auto"><Button onClick={handleSubmit}>Save Attendance</Button></Col>
                </Row>
                <TableContainer
                  columns={staffColumn}
                  data={attendanceData}
                  isGlobalFilter={true}
                  customPageSize={10}
                  tableClass="table table-bordered"
                  theadClass="thead-light"
                  divClass="table-responsive"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={attendanceData}
      />

    </React.Fragment>
  );
};

export default StaffAttendance;
