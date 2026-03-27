import React, { useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Row, Input
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import FormHeader from "../../common/FormHeader/FormHeader";
import { Link } from "react-router-dom";

const ContentType = () => {
    const contentData = [
        { id: 1, name: 'Article', description: 'Informative content for users', action: 'Edit' },
        { id: 2, name: 'Blog', description: 'Regular updates and tips', action: 'Edit' },
        { id: 3, name: 'Tutorial', description: 'Step-by-step guides', action: 'Edit' },
        { id: 4, name: 'Case Study', description: 'Detailed project analysis', action: 'Edit' },
        { id: 5, name: 'News', description: 'Latest updates in the field', action: 'Edit' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const contentColumns = [
        {
            header: 'Name', accessorKey: 'name', enableColumnFilter: false, cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            )
        },
        { header: 'Description', accessorKey: 'description', enableColumnFilter: false },
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
            <div> <ExportCSVModal
                show={isExportCSV}
                onCloseClick={() => setIsExportCSV(false)}
                data={contentData}
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
                                            columns={contentColumns}
                                            data={contentData}
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

export default ContentType;
