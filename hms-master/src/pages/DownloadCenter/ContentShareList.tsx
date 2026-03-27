import React, { useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Input,
    Label,
    Row,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import FormHeader from "../../common/FormHeader/FormHeader";
import { Link } from "react-router-dom";

const ContentShareList = () => {
    const contentShareData = [
        { id: 1, title: 'Annual Report', sendTo: 'Team A', shareDate: '2024-06-01', validUpto: '2024-12-01', sharedBy: 'Alice', description: 'Year-end report' },
        { id: 2, title: 'Project Plan', sendTo: 'Team B', shareDate: '2024-06-05', validUpto: '2024-08-05', sharedBy: 'Bob', description: 'Project roadmap' },
        { id: 3, title: 'Budget Allocation', sendTo: 'Finance Team', shareDate: '2024-06-10', validUpto: '2024-07-10', sharedBy: 'Charlie', description: 'Department budget' },
        { id: 4, title: 'Event Schedule', sendTo: 'Marketing Team', shareDate: '2024-06-15', validUpto: '2024-09-15', sharedBy: 'Diana', description: 'Quarterly events' },
        { id: 5, title: 'Training Material', sendTo: 'HR Team', shareDate: '2024-06-20', validUpto: '2025-01-01', sharedBy: 'Eve', description: 'Onboarding training' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const contentShareColumns = [
        { header: 'Title', accessorKey: 'title' ,enableColumnFilter: false },
        { header: 'Send To', accessorKey: 'sendTo',enableColumnFilter: false  },
        { header: 'Share Date', accessorKey: 'shareDate' ,enableColumnFilter: false },
        { header: 'Valid Upto', accessorKey: 'validUpto',enableColumnFilter: false  },
        { header: 'Shared By', accessorKey: 'sharedBy' ,enableColumnFilter: false },
        { header: 'Description', accessorKey: 'description' ,enableColumnFilter: false },
        {
            header: "Action",
            cell: (cell: any) => {



                return (
                    <ul className="list-inline hstack gap-2 mb-0">

                        <li className="list-inline-item" title="Edit">
                            <Link className="edit-item-btn" to="#"

                            >
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
        },,
    ];

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Content Share List" pageTitle="Content Sharing" />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Shared Content List</h4>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg={4}>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="module-input">
                                                    Module
                                                </Label>
                                                <Input type="select" className="form-control" id="module-input">
                                                    <option>Select Module</option>
                                                    <option>Module A</option>
                                                    <option>Module B</option>
                                                    <option>Module C</option>
                                                </Input>
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="status-input">
                                                    Status
                                                </Label>
                                                <Input type="select" className="form-control" id="status-input">
                                                    <option>Select Status</option>
                                                    <option>Active</option>
                                                    <option>Inactive</option>
                                                    <option>Expired</option>
                                                </Input>
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="template-input">
                                                    Certificate Template
                                                </Label>
                                                <Input type="select" className="form-control" id="template-input">
                                                    <option>Select Template</option>
                                                    <option>Template A</option>
                                                    <option>Template B</option>
                                                    <option>Template C</option>
                                                </Input>
                                            </div>
                                        </Col>
                                    </Row>
                                    <ExportCSVModal
                                        show={isExportCSV}
                                        onCloseClick={() => setIsExportCSV(false)}
                                        data={contentShareData}
                                    />
                                    <Row>
                                        <Col lg={12} className="px-0">
                                            <Card id="contentShareListReport">
                                                <CardHeader className="border-0">
                                                    <Row className="g-4 align-items-end justify-content-end">
                                                        <div className="col-sm-auto">
                                                            <button type="button" className="btn btn-secondary" onClick={() => setIsExportCSV(true)}>
                                                                <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                                Export
                                                            </button>
                                                        </div>
                                                        <div className="col-sm-auto">
                                                            <button type="button" className="btn btn-success btn-label right ms-auto nexttab">
                                                                <i className="ri-search-2-line label-icon align-middle fs-16 ms-2"></i>
                                                                Search
                                                            </button>
                                                        </div>
                                                    </Row>
                                                </CardHeader>
                                                <div className="card-body pt-0">
                                                    <TableContainer
                                                        columns={contentShareColumns}
                                                        data={contentShareData}
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
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ContentShareList;
