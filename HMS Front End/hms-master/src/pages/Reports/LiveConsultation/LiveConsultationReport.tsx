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
import { Link } from "react-router-dom";

const LiveConsultationReport = () => {
    const liveConsultationData = [
        { module: 'OPD', consultationTitle: 'General Consultation', patient: 'John Doe', date: '2024-01-01', apiUsed: 'Zoom', createdBy: 'Admin', totalJoin: 5 },
        { module: 'IPD', consultationTitle: 'Specialist Consultation', patient: 'Jane Smith', date: '2024-02-02', apiUsed: 'Google Meet', createdBy: 'Dr. Brown', totalJoin: 3 },
        { module: 'OPD', consultationTitle: 'Follow-up', patient: 'Alex Johnson', date: '2024-03-03', apiUsed: 'Teams', createdBy: 'Nurse', totalJoin: 7 },
        { module: 'IPD', consultationTitle: 'Emergency Consultation', patient: 'Emily Davis', date: '2024-04-04', apiUsed: 'Skype', createdBy: 'Dr. Lee', totalJoin: 4 },
        { module: 'OPD', consultationTitle: 'Routine Check-up', patient: 'Michael Brown', date: '2024-05-05', apiUsed: 'Zoom', createdBy: 'Dr. Green', totalJoin: 6 },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const liveConsultationColumns = [
        {
            header: 'Module',
            accessorKey: 'module',
            enableColumnFilter: false,
            
        },
        {
            header: 'Consultation Title',
            accessorKey: 'consultationTitle',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Patient',
            accessorKey: 'patient',
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
   
        },
        {
            header: 'API Used',
            accessorKey: 'apiUsed',
            enableColumnFilter: false,
           
        },
        {
            header: 'Created By',
            accessorKey: 'createdBy',
            enableColumnFilter: false,
           
        },
        {
            header: 'Total Join',
            accessorKey: 'totalJoin',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
             
        },
        {
            header: "Action",
            cell: (cell: any) => {



                return (
                    <div className="d-flex justify-content-center"> 
                    <ul className="list-inline hstack gap-2 mb-0">

                        <li className="list-inline-item" title="Edit">
                            <Link className="edit-item-btn " to="#"

                            >
                                <i className="ri-pencil-fill align-bottom text- text-purple"></i>
                            </Link>
                        </li>
                        <li className="list-inline-item" title="Delete">
                            <Link
                                className="remove-item-btn"

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
                    </div>
                );
            },
        },
    ];


    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Live Consultation Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="time-duration-input">
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
                            <Label className="form-label" htmlFor="created-by-input">
                                Created By
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="created-by-input"
                            >
                                <option>Select Creator</option>
                                <option>Admin</option>
                                <option>Dr. Brown</option>
                                <option>Nurse</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="opd-ipd-input">
                                OPD / IPD
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="opd-ipd-input"
                            >
                                <option>Select Type</option>
                                <option>OPD</option>
                                <option>IPD</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={liveConsultationData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="liveConsultationReport">
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
                                        columns={liveConsultationColumns}
                                        data={liveConsultationData}
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

export default LiveConsultationReport;
