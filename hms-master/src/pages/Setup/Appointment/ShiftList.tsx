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

const ShiftList = () => {
    // Dummy shift data
    const shiftData = [
        { id: 1, name: 'John Doe', timeFrom: '8:00 AM', timeTo: '4:00 PM', action: 'View' },
        { id: 2, name: 'Jane Smith', timeFrom: '9:00 AM', timeTo: '5:00 PM', action: 'View' },
        { id: 3, name: 'James Brown', timeFrom: '10:00 AM', timeTo: '6:00 PM', action: 'View' },
        { id: 4, name: 'Emily White', timeFrom: '7:00 AM', timeTo: '3:00 PM', action: 'View' },
        { id: 5, name: 'Daniel Green', timeFrom: '8:30 AM', timeTo: '4:30 PM', action: 'View' },
        { id: 6, name: 'Sophia King', timeFrom: '9:30 AM', timeTo: '5:30 PM', action: 'View' },
        { id: 7, name: 'Liam Turner', timeFrom: '10:30 AM', timeTo: '6:30 PM', action: 'View' },
        { id: 8, name: 'Mia Scott', timeFrom: '6:00 AM', timeTo: '2:00 PM', action: 'View' },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated shift columns
    const shiftColumns = [
        {
            header: '#',
            accessorKey: 'id',
            enableColumnFilter: false,
        },
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,
        },
        {
            header: 'Time From',
            accessorKey: 'timeFrom',
            enableColumnFilter: false,
        },
        {
            header: 'Time To',
            accessorKey: 'timeTo',
            enableColumnFilter: false,
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
                            <Link
                                className="remove-item-btn"
                                to="#"
                            >
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
                <Container fluid>
              
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <ExportCSVModal
                                    show={isExportCSV}
                                    onCloseClick={() => setIsExportCSV(false)}
                                    data={shiftData}
                                />

                                <Row>
                                    <Col lg={12}>
                                        <Card id="shiftList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Shift List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Link to='/main/addShiftSetup'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Shift
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
                                                        columns={shiftColumns}
                                                        data={shiftData}
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

export default ShiftList;
