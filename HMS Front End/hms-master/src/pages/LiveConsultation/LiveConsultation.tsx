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

const LiveConsultation = () => {
    const consultationData = [
        {
            id: 1,
            title: 'Hair Fall Discussion',
            description: 'Hair Fall Discussion',
            date: '10/30/2024 04:30 PM',
            apiUsed: 'Global',
            createdBy: 'Self',
            createdFor: 'Reyan Jain (Doctor: 9011)',
            status: 'Awaited',
        },
        {
            id: 2,
            title: 'Skin Consultation',
            description: '',
            date: '10/25/2024 12:30 PM',
            apiUsed: 'Global',
            createdBy: 'Self',
            createdFor: 'Amit Singh (Doctor: 9009)',
            status: 'Awaited',
        },
        {
            id: 3,
            title: 'Diabetes Checkup',
            description: 'Discussion on blood sugar levels.',
            date: '10/22/2024 10:00 AM',
            apiUsed: 'Global',
            createdBy: 'Self',
            createdFor: 'Michael Scott (Doctor: 9012)',
            status: 'Scheduled',
        },
        {
            id: 4,
            title: 'Cardiac Screening',
            description: 'Routine cardiac screening.',
            date: '10/21/2024 02:15 PM',
            apiUsed: 'Global',
            createdBy: 'Self',
            createdFor: 'Pam Beesly (Doctor: 9005)',
            status: 'Completed',
        },
        {
            id: 5,
            title: 'Pediatric Checkup',
            description: 'Routine checkup for child.',
            date: '10/20/2024 09:00 AM',
            apiUsed: 'Global',
            createdBy: 'Self',
            createdFor: 'Jim Halpert (Doctor: 9007)',
            status: 'Awaited',
        },
        {
            id: 6,
            title: 'Allergy Consultation',
            description: 'Discussing allergy symptoms.',
            date: '10/19/2024 03:30 PM',
            apiUsed: 'Global',
            createdBy: 'Self',
            createdFor: 'Dwight Schrute (Doctor: 9003)',
            status: 'Cancelled',
        },
        {
            id: 7,
            title: 'Eye Examination',
            description: '',
            date: '10/18/2024 01:00 PM',
            apiUsed: 'Global',
            createdBy: 'Self',
            createdFor: 'Stanley Hudson (Doctor: 9004)',
            status: 'Awaited',
        },
        {
            id: 8,
            title: 'Nutritional Counseling',
            description: 'Discussion on diet and nutrition.',
            date: '10/17/2024 11:00 AM',
            apiUsed: 'Global',
            createdBy: 'Self',
            createdFor: 'Ryan Howard (Doctor: 9006)',
            status: 'Scheduled',
        },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    const consultationColumns = [
        {
            header: 'Consultation Title',
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
                <div>
                    {info.getValue()}
                </div>
            )
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    {info.getValue()}
                </div>
            )
        },
        {
            header: 'API Used',
            accessorKey: 'apiUsed',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-pink">
                    {info.getValue()}
                </div>
            )
        },
        {
            header: 'Created By',
            accessorKey: 'createdBy',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-success">
                    {info.getValue()}
                </div>
            )
        },
        {
            header: 'Created For',
            accessorKey: 'createdFor',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    {info.getValue()}
                </div>
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
            header: 'Action',
            accessorKey: 'action',
            enableColumnFilter: false,
            cell: () => (
                <ul className="list-inline hstack gap-2 mb-0">


                    <li className="list-inline-item">
                        <Link
                            className="edit-item-btn"
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();

                            }}
                            title="Edit"
                        >
                            <i className="ri-pencil-fill align-bottom text-purple"></i>
                        </Link>
                    </li>

                    <li className="list-inline-item" title="Delete">
                        <Link
                            className="remove-item-btn" data-bs-toggle="modal"

                            to="#"
                        >
                            <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                        </Link>
                    </li><li className="list-inline-item" title="View">
                        <Link
                            className="view-item-btn"
                            to="#"
                        >
                            <i className="ri-eye-fill align-bottom text-pink"></i>
                        </Link>
                    </li>
                </ul>
            ),
        },
    ];


    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={consultationData}
                />

                <Container fluid>
                    <FormHeader title="Live Consultation" pageTitle="Consultations" />
                    <Row>
                        <Col lg={12}>
                            <Card id="consultationList">


                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Live Consultation List</h5>
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
                                                <Link to='/main/addConsultation'>
                                                    <Button

                                                        color="primary"
                                                        className="btn btn-primary add-btn ms-3"

                                                    >
                                                        <i className="ri-add-fill me-1 align-bottom"></i> Add Live Consultation
                                                    </Button>
                                                </Link>

                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>





                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={consultationColumns}
                                            data={consultationData}
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

export default LiveConsultation;
