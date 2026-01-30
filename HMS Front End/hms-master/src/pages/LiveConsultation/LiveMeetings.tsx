import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { Link } from "react-router-dom";
import FormHeader from "../../common/FormHeader/FormHeader";

const LiveMeetings = () => {
    
    const liveMeetingData = [
        { id: 1, title: 'Salary Discussion', description: 'Salary Discussion', date: '10/30/2024 02:00 PM', duration: 35, apiUsed: 'Global', createdBy: 'Self', status: 'Awaited' },
        { id: 2, title: 'Hospital Equipment for Operation', description: 'Hospital Equipment for Operation', date: '10/20/2024 01:30 PM', duration: 45, apiUsed: 'Global', createdBy: 'Jason Abbot (9017)', status: 'Awaited' },
        { id: 3, title: 'Monthly Budget Review', description: 'Review of the monthly budget and expenses.', date: '11/05/2024 10:00 AM', duration: 60, apiUsed: 'Zoom', createdBy: 'Emily Davis', status: 'Scheduled' },
        { id: 4, title: 'New Software Training', description: 'Training session for new hospital management software.', date: '11/15/2024 09:00 AM', duration: 120, apiUsed: 'Teams', createdBy: 'Michael Brown', status: 'Scheduled' },
        { id: 5, title: 'Policy Update Discussion', description: 'Discussion on the updated policies for staff.', date: '11/20/2024 03:00 PM', duration: 30, apiUsed: 'Global', createdBy: 'Alex Johnson', status: 'Pending' },
        { id: 6, title: 'Emergency Protocol Review', description: 'Review of emergency protocols and procedures.', date: '11/25/2024 11:00 AM', duration: 50, apiUsed: 'Webex', createdBy: 'Jane Smith', status: 'Scheduled' },
        { id: 7, title: 'Patient Care Workshop', description: 'Workshop focusing on patient care techniques.', date: '12/01/2024 01:00 PM', duration: 90, apiUsed: 'Global', createdBy: 'John Doe', status: 'Awaited' },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    const liveMeetingColumns = [
        {
            header: 'Meeting Title',
            accessorKey: 'title',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            )
        },
        {
            header: 'Description',
            accessorKey: 'description',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>{info.getValue()}</div>
            )
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-nowrap text-success">{info.getValue()}</div>
            )
        },
        {
            header: 'Meeting Duration (Minutes)',
            accessorKey: 'duration',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-indigo">{info.getValue()}</div>
            )
        },
        {
            header: 'API Used',
            accessorKey: 'apiUsed',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-pink">{info.getValue()}</div>
            )
        },
        {
            header: 'Created By',
            accessorKey: 'createdBy',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>{info.getValue()}</div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                let badgeClass = "badge bg-secondary-subtle text-secondary";
                let displayText = "Not Specified";

                if (value === "Scheduled") {
                    badgeClass = "badge bg-success-subtle text-success";
                    displayText = "Scheduled";
                } else if (value === "Awaited") {
                    badgeClass = "badge bg-danger-subtle text-danger";
                    displayText = "Awaited";
                } else if (value === "Pending") {
                    badgeClass = "badge bg-warning-subtle text-warning";
                    displayText = "Pending";
                }

                return (
                    <div className="text-center">
                        <span className={badgeClass}>
                            {displayText}
                        </span>
                    </div>
                );
            },
        },
        {
            header: "Action",
            cell: (cell: any) => {
                return (
                    <ul className="list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item" title="Edit">
                            <Link className="edit-item-btn" to="#">
                                <i className="ri-pencil-fill align-bottom text-muted"></i>
                            </Link>
                        </li>
                        <li className="list-inline-item" title="Delete">
                            <Link className="remove-item-btn" to="#">
                                <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                            </Link>
                        </li>
                    </ul>
                );
            },
        },
    ];


    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={liveMeetingData}
                />

                <Container fluid>
                    <FormHeader title="Live Meeting List" pageTitle="Meetings" />
                    <Row>
                        <Col lg={12}>
                            <Card id="meetingList">


                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Live Meeting List</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <Button
                                                    type="button"

                                                    className="btn btn-primary"
                                                    color="primary"
                                                    onClick={() => setIsExportCSV(true)}
                                                >
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </Button>
                                                <Link to='/main/addLiveMeeting'>
                                                    <Button

                                                        color="primary"
                                                        className="btn btn-primary add-btn ms-3"

                                                    >
                                                        <i className="ri-add-fill me-1 align-bottom"></i> Add Live Meeting
                                                    </Button>
                                                </Link>

                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>




                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={liveMeetingColumns}
                                            data={liveMeetingData}
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
                </Container>
            </div>
        </React.Fragment>
    );
};

export default LiveMeetings;
