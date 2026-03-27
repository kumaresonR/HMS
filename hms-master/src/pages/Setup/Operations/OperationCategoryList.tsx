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

const OperationCategoryList = () => {
    // Dummy operation category data
    const operationData = [
        { id: 1, categoryName: 'Cardiac Surgery', description: 'Surgery related to heart conditions', action: 'View' },
        { id: 2, categoryName: 'Orthopedic Surgery', description: 'Surgery related to bones and joints', action: 'View' },
        { id: 3, categoryName: 'Neurosurgery', description: 'Surgery related to the brain and nervous system', action: 'View' },
        { id: 4, categoryName: 'Plastic Surgery', description: 'Surgery for reconstruction and cosmetic purposes', action: 'View' },
        { id: 5, categoryName: 'General Surgery', description: 'Surgery for various conditions', action: 'View' },
        { id: 6, categoryName: 'Pediatric Surgery', description: 'Surgery for children', action: 'View' },
        { id: 7, categoryName: 'Urology', description: 'Surgery related to urinary tract and male reproductive organs', action: 'View' },
        { id: 8, categoryName: 'Gynecological Surgery', description: 'Surgery related to female reproductive system', action: 'View' },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated operation category columns
    const operationColumns = [
        {
            header: '#',
            accessorKey: 'id',
            enableColumnFilter: false,
        },
        {
            header: 'Category Name',
            accessorKey: 'categoryName',
            enableColumnFilter: false,   cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
            
        },
        {
            header: 'Description',
            accessorKey: 'description',
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

            <Container fluid>

                <Row className="d-flex justify-content-center">
                    <Col xl={12} className="p-0">
                        <Card>
                            <ExportCSVModal
                                show={isExportCSV}
                                onCloseClick={() => setIsExportCSV(false)}
                                data={operationData}
                            />
                            <Row>
                                <Col lg={12}>
                                    <Card id="operationCategoryList">
                                        <CardHeader className="border-0">
                                            <Row className="g-4 align-items-center">
                                                <div className="col-sm">
                                                    <div>
                                                        <h5 className="card-title mb-0">Operation Category List</h5>
                                                    </div>
                                                </div>
                                                <div className="col-sm-auto">
                                                    <div>
                                                        <Link to='/main/addCategory'>
                                                            <Button
                                                                color="primary"
                                                                className="btn btn-primary add-btn me-3"
                                                            >
                                                                <i className="ri-add-fill me-1 align-bottom"></i> Add New Category
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
                                                    columns={operationColumns}
                                                    data={operationData}
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

        </React.Fragment>
    );
};

export default OperationCategoryList;
