import React, { useState } from "react";
import {
    Card,
    CardHeader,
    Col,
    Input,
    Label,
    Row,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

const UserLog = () => {
    const userLogData = [
        { userName: 'John Doe', role: 'Admin', ipAddress: '192.168.0.1', loginTime: '2024-10-01 09:30', userAgent: 'Chrome' },
        { userName: 'Jane Smith', role: 'User', ipAddress: '192.168.0.2', loginTime: '2024-10-01 10:15', userAgent: 'Firefox' },
        { userName: 'Alex Johnson', role: 'Manager', ipAddress: '192.168.0.3', loginTime: '2024-10-01 11:00', userAgent: 'Safari' },
        { userName: 'Emily Davis', role: 'User', ipAddress: '192.168.0.4', loginTime: '2024-10-01 12:30', userAgent: 'Edge' },
        { userName: 'Michael Brown', role: 'Admin', ipAddress: '192.168.0.5', loginTime: '2024-10-01 13:45', userAgent: 'Chrome' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const userLogColumns = [
        {
            header: 'Users',
            accessorKey: 'userName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className={`text-primary`}>
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Role',
            accessorKey: 'role',
            enableColumnFilter: false,
        
        },
        {
            header: 'IP Address',
            accessorKey: 'ipAddress',
            enableColumnFilter: false,
            
        },
        {
            header: 'Login Time',
            accessorKey: 'loginTime',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'User Agent',
            accessorKey: 'userAgent',
            enableColumnFilter: false,
            
        },
    ];

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">User Log</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="time-duration-input"
                            >
                                Time Duration
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="time-duration-input"
                            >
                                <option>Select Duration</option>
                                <option>30 mins</option>
                                <option>1 hour</option>
                                <option>2 hours</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="user-role-input"
                            >
                                User Role
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="user-role-input"
                            >
                                <option>Select Role</option>
                                <option>Admin</option>
                                <option>User</option>
                                <option>Manager</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={userLogData}
                />
                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="userLogReport">
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
                            <div className="card-body pt-0">
                                <TableContainer
                                    columns={userLogColumns}
                                    data={userLogData}
                                    isGlobalFilter={true}
                                    isCustomerFilter={true}
                                    customPageSize={5}
                                    tableClass="table table-bordered"
                                    theadClass="thead-light"
                                    divClass="table-responsive"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default UserLog;
