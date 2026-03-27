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

const EmailOrSMSLog = () => {
    const emailOrSmsLogData = [
        { title: 'Welcome Message', date: '2024-01-01', email: 'Sent', sms: 'Not Sent', group: 'New Patients', individual: 'John Doe' },
        { title: 'Appointment Reminder', date: '2024-02-10', email: 'Sent', sms: 'Sent', group: 'All Patients', individual: 'Jane Smith' },
        { title: 'Discharge Summary', date: '2024-03-15', email: 'Not Sent', sms: 'Sent', group: 'Outpatients', individual: 'Alex Johnson' },
        { title: 'Follow-up Reminder', date: '2024-04-20', email: 'Sent', sms: 'Sent', group: 'Critical Cases', individual: 'Emily Davis' },
        { title: 'Monthly Updates', date: '2024-05-05', email: 'Sent', sms: 'Not Sent', group: 'All Patients', individual: 'Michael Brown' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const emailOrSmsLogColumns = [
        {
            header: 'Title',
            accessorKey: 'title',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Email',
            accessorKey: 'email',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                let badgeClass = "badge bg-secondary-subtle text-secondary";
                let displayText = "Not Sent";

                if (value === "Sent") {
                    badgeClass = "badge bg-success-subtle text-success";
                    displayText = "Sent";
                } else if (value === "Not Sent") {
                    badgeClass = "badge bg-danger-subtle text-danger";
                    displayText = "Not Sent";
                }
                return (
                    <div >
                        <span className={badgeClass}>
                            {displayText}
                        </span>
                    </div>
                );
            },
        },
        {
            header: 'SMS',
            accessorKey: 'sms',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                let badgeClass = "badge bg-secondary-subtle text-secondary";
                let displayText = "Not Sent";

                if (value === "Sent") {
                    badgeClass = "badge bg-success-subtle text-success";
                    displayText = "Sent";
                } else if (value === "Not Sent") {
                    badgeClass = "badge bg-danger-subtle text-danger";
                    displayText = "Not Sent";
                }
                return (
                    <div >
                        <span className={badgeClass}>
                            {displayText}
                        </span>
                    </div>
                );
            },
        },




        {
            header: 'Group',
            accessorKey: 'group',
            enableColumnFilter: false,

        },
        {
            header: 'Individual',
            accessorKey: 'individual',
            enableColumnFilter: false,

        },
    ];


    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Email or SMS Log</h5>
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
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={emailOrSmsLogData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="emailOrSmsLogReport">
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
                                <div>
                                    <TableContainer
                                        columns={emailOrSmsLogColumns}
                                        data={emailOrSmsLogData}
                                        isGlobalFilter={true}
                                        isCustomerFilter={true}
                                        customPageSize={5}
                                        tableClass="table table-bordered"
                                        theadClass="thead-light"
                                        divClass="table-responsive"
                                    />
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default EmailOrSMSLog;
