import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Button,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

import { Link } from "react-router-dom";
import FormHeader from "../../../common/FormHeader/FormHeader";

const SymptomsHeadList = () => {
    // Dummy symptoms data
    const symptomsData = [
        { id: 1, symptomsHead: 'Headache', symptomsType: 'Primary', symptomsDescription: 'Pain or discomfort in the head or neck region', action: 'View' },
        { id: 2, symptomsHead: 'Fever', symptomsType: 'Secondary', symptomsDescription: 'High body temperature above normal', action: 'View' },
        { id: 3, symptomsHead: 'Nausea', symptomsType: 'Primary', symptomsDescription: 'Feeling of wanting to vomit', action: 'View' },
        { id: 4, symptomsHead: 'Fatigue', symptomsType: 'Secondary', symptomsDescription: 'Extreme tiredness, lack of energy', action: 'View' },
        { id: 5, symptomsHead: 'Cough', symptomsType: 'Primary', symptomsDescription: 'A sudden, forceful hacking sound to release air', action: 'View' },
        { id: 6, symptomsHead: 'Dizziness', symptomsType: 'Secondary', symptomsDescription: 'Lightheadedness or unsteady feeling', action: 'View' },
        { id: 7, symptomsHead: 'Shortness of Breath', symptomsType: 'Primary', symptomsDescription: 'Difficult or labored breathing', action: 'View' },
        { id: 8, symptomsHead: 'Chest Pain', symptomsType: 'Secondary', symptomsDescription: 'Pain in the chest area', action: 'View' },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated symptoms columns
    const symptomsColumns = [
        {
            header: '#',
            accessorKey: 'id',
            enableColumnFilter: false,
        },
        {
            header: 'Symptoms Head',
            accessorKey: 'symptomsHead',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Symptoms Type',
            accessorKey: 'symptomsType',
            enableColumnFilter: false,

        },
        {
            header: 'Symptoms Description',
            accessorKey: 'symptomsDescription',
            enableColumnFilter: false,
        },
        {
            header: "Action",
            cell: (cell: any) => {
                return (

                    <ul className="list-inline hstack gap-2 mb-0">


                        <li className="list-inline-item">
                            <Link
                                className="edit-item-btn"
                                to="#"

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
                );
            },
        },
    ];

    return (
        <React.Fragment>
            <div>
                <Container fluid>

                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <ExportCSVModal
                                    show={isExportCSV}
                                    onCloseClick={() => setIsExportCSV(false)}
                                    data={symptomsData}
                                />

                                <Row>
                                    <Col lg={12}>
                                        <Card id="symptomsHeadList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Symptoms Head List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Link to='/main/addSymptomsHead'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Symptoms
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                className="btn btn-secondary"
                                                                onClick={() => setIsExportCSV(true)}
                                                            >
                                                                <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                                Export
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Row>
                                            </CardHeader>

                                            <div className="card-body pt-0">
                                                <div>
                                                    <TableContainer
                                                        columns={symptomsColumns}
                                                        data={symptomsData}
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
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default SymptomsHeadList;
