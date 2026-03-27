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

const AuditTrailReportList = () => {
    const auditTrailData = [
        { message: 'User logged in', user: 'John Doe', ipAddress: '192.168.1.1', action: 'Login', platform: 'Web', agent: 'Chrome', dateTime: '2024-10-01 08:15' },
        { message: 'User updated profile', user: 'Jane Smith', ipAddress: '192.168.1.2', action: 'Update', platform: 'Mobile', agent: 'Safari', dateTime: '2024-10-01 09:30' },
        { message: 'User logged out', user: 'Alex Johnson', ipAddress: '192.168.1.3', action: 'Logout', platform: 'Web', agent: 'Firefox', dateTime: '2024-10-02 17:00' },
        { message: 'Password changed', user: 'Emily Davis', ipAddress: '192.168.1.4', action: 'Change Password', platform: 'Web', agent: 'Chrome', dateTime: '2024-10-03 11:45' },
        { message: 'Account locked', user: 'Michael Brown', ipAddress: '192.168.1.5', action: 'Account Lock', platform: 'Web', agent: 'Edge', dateTime: '2024-10-04 14:30' },
        { message: 'User registered', user: 'Sarah Lee', ipAddress: '192.168.1.6', action: 'Register', platform: 'Mobile', agent: 'Safari', dateTime: '2024-10-05 15:20' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const auditTrailColumns = [
        {
            header: 'Message',
            accessorKey: 'message',
            enableColumnFilter: false,
         
        },
        {
            header: 'Message',
            accessorKey: 'message',
            enableColumnFilter: false,
            
        },
        {
            header: 'User',
            accessorKey: 'user',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'IP Address',
            accessorKey: 'ipAddress',
            enableColumnFilter: false,
          
        },
        {
            header: 'Action',
            accessorKey: 'action',
            enableColumnFilter: false,
            
        },
        {
            header: 'Platform',
            accessorKey: 'platform',
            enableColumnFilter: false,
           
        },
        {
            header: 'Agent',
            accessorKey: 'agent',
            enableColumnFilter: false,
         
        },
        {
            header: 'Date Time',
            accessorKey: 'dateTime',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
        },
    ];


    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Audit Trail Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="duration-input"
                            >
                                Time Duration
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="duration-input"
                            >
                                <option>Select Duration</option>
                                <option>30 mins</option>
                                <option>1 hour</option>
                                <option>2 hours</option>
                                <option>1 day</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={auditTrailData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="auditTrailReport">
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
                                    columns={auditTrailColumns}
                                    data={auditTrailData}
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

export default AuditTrailReportList;
