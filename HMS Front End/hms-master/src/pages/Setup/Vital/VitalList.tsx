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

const VitalList = () => {
    // Dummy vital data
    const vitalData = [
        { id: 1, name: 'Heart Rate', referenceRange: '60-100', unit: 'bpm', action: 'View' },
        { id: 2, name: 'Blood Pressure', referenceRange: '90/60 - 120/80', unit: 'mmHg', action: 'View' },
        { id: 3, name: 'Respiratory Rate', referenceRange: '12-20', unit: 'breaths/min', action: 'View' },
        { id: 4, name: 'Body Temperature', referenceRange: '36.1-37.2', unit: '°C', action: 'View' },
        { id: 5, name: 'Oxygen Saturation', referenceRange: '95-100', unit: '%', action: 'View' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    // Vital columns
    const vitalColumns = [
        {
            header: '#',
            accessorKey: 'id',
            enableColumnFilter: false,
        },
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Reference Range',
            accessorKey: 'referenceRange',
            enableColumnFilter: false,
        },
        {
            header: 'Unit',
            accessorKey: 'unit',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
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
                    <FormHeader title="Vitals" pageTitle="Setup" />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <ExportCSVModal
                                    show={isExportCSV}
                                    onCloseClick={() => setIsExportCSV(false)}
                                    data={vitalData}
                                />
                                <Row>
                                    <Col lg={12}>
                                        <Card id="vitalList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Vital List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Link to='/main/addVitalForm'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Vital
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
                                                        columns={vitalColumns}
                                                        data={vitalData}
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

export default VitalList;
