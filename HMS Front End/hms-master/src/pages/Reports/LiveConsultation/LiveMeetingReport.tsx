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

const LiveMeetingReport = () => {
    const liveMeetingData = [
        { meetingTitle: 'Weekly Standup', date: '2024-01-01', apiUsed: 'Zoom', createdBy: 'Alice', totalJoin: 15 },
        { meetingTitle: 'Project Review', date: '2024-02-02', apiUsed: 'Teams', createdBy: 'Bob', totalJoin: 10 },
        { meetingTitle: 'Client Update', date: '2024-03-03', apiUsed: 'Google Meet', createdBy: 'Charlie', totalJoin: 12 },
        { meetingTitle: 'Training Session', date: '2024-04-04', apiUsed: 'Zoom', createdBy: 'David', totalJoin: 20 },
        { meetingTitle: 'Sales Meeting', date: '2024-05-05', apiUsed: 'WebEx', createdBy: 'Eve', totalJoin: 18 },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const liveMeetingColumns = [
        {
            header: 'Meeting Title',
            accessorKey: 'meetingTitle',
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
            header: 'Api Used',
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
                    <div className="d-flex justify-content-center"> <ul className="list-inline hstack gap-2 mb-0 ">

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

                    </ul></div>
                );
            },
        },
    ];

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Live Meeting Report</h5>
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
                                htmlFor="created-by-input"
                            >
                                Created By
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="created-by-input"
                            >
                                <option>Select Creator</option>
                                <option>Alice</option>
                                <option>Bob</option>
                                <option>Charlie</option>
                                <option>David</option>
                                <option>Eve</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={liveMeetingData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="liveMeetingReport">
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
            </div>
        </React.Fragment>
    );
};

export default LiveMeetingReport;
