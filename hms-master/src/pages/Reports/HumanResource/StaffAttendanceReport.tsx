import React, { useState } from "react";
import { Card, CardHeader, Col, Input, Label, Row } from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

const StaffAttendanceReport = () => {
    const staffAttendanceData = [
        { id: 1, name: 'Alice Johnson', role: 'Nurse', month: 'January', year: '2024', attendance: 'Present' },
        { id: 2, name: 'Bob Smith', role: 'Doctor', month: 'January', year: '2024', attendance: 'Absent' },
        { id: 3, name: 'Clara Davis', role: 'Receptionist', month: 'January', year: '2024', attendance: 'Present' },
        { id: 4, name: 'David Lee', role: 'Pharmacist', month: 'January', year: '2024', attendance: 'Present' },
        { id: 5, name: 'Eve Brown', role: 'Surgeon', month: 'January', year: '2024', attendance: 'Absent' },
        { id: 6, name: 'Frank Green', role: 'Lab Technician', month: 'January', year: '2024', attendance: 'Present' },
        { id: 7, name: 'Grace Hall', role: 'Nurse', month: 'January', year: '2024', attendance: 'Present' },
        { id: 8, name: 'Henry White', role: 'Doctor', month: 'January', year: '2024', attendance: 'Present' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Staff Attendance Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="role-input">
                                Role
                            </Label>
                            <Input type="select" className="form-control" id="role-input">
                                <option>Select Role</option>
                                <option>Doctor</option>
                                <option>Nurse</option>
                                <option>Receptionist</option>
                                <option>Pharmacist</option>
                                <option>Surgeon</option>
                                <option>Lab Technician</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="month-input">
                                Month
                            </Label>
                            <Input type="select" className="form-control" id="month-input">
                                <option>Select Month</option>
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                                <option>April</option>
                                <option>May</option>
                                <option>June</option>
                                <option>July</option>
                                <option>August</option>
                                <option>September</option>
                                <option>October</option>
                                <option>November</option>
                                <option>December</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="year-input">
                                Year
                            </Label>
                            <Input type="select" className="form-control" id="year-input">
                                <option>Select Year</option>
                                <option>2022</option>
                                <option>2023</option>
                                <option>2024</option>
                                <option>2025</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={staffAttendanceData}
                />
                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="staffAttendanceReport">
                               <CardHeader className="border-0">
                                                           <Row className="g-4 align-items-center">
                                                               <div className="col-sm">
                           
                                                               </div>
                                                               <div className="col-sm-auto">
                                                                   <div>
                                                                       <button type="button" className="btn btn-primary" onClick={() => setIsExportCSV(true)}>
                                                                           <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                                           Export
                                                                       </button>
                                                                   </div>
                                                               </div>
                                                               <div className="col-sm-auto">
                           
                                                                   <div className="input-group">
                           
                                                                       <Input
                                                                           type="text"
                                                                           className="form-control"
                                                                           id="Search"
                                                                           placeholder="Search..."
                                                                       />
                                                                       <span className="input-group-text searchBtn">
                                                                           <i className="ri-search-2-line label-icon align-middle fs-16 ms-2"></i>
                                                                       </span>
                                                                   </div>
                           
                           
                                                               </div>
                                                           </Row>
                                                       </CardHeader>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default StaffAttendanceReport;
