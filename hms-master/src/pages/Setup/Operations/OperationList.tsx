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

const OperationList = () => {
    // Dummy operation data
    const operationData = [
        { id: 1, operationName: 'Appendectomy', duration: '1 Hour', date: '2024-01-10', surgeon: 'Dr. Smith', patientId: 'P001', action: 'View' },
        { id: 2, operationName: 'Cholecystectomy', duration: '2 Hours', date: '2024-01-12', surgeon: 'Dr. Johnson', patientId: 'P002', action: 'View' },
        { id: 3, operationName: 'Hernia Repair', duration: '1.5 Hours', date: '2024-01-15', surgeon: 'Dr. Williams', patientId: 'P003', action: 'View' },
        // Add more operation data as needed
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated operation columns
    const operationColumns = [
        {
            header: '#',
            accessorKey: 'id',
            enableColumnFilter: false,
        },
        {
            header: 'Operation Name',
            accessorKey: 'operationName',
            enableColumnFilter: false,    cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
            
        },
        {
            header: 'Duration',
            accessorKey: 'duration',
            enableColumnFilter: false,
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
        },
        {
            header: 'Surgeon',
            accessorKey: 'surgeon',
            enableColumnFilter: false,    cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
            
        },
        {
            header: 'Patient ID',
            accessorKey: 'patientId',
            enableColumnFilter: false,    cell: (info: any) => (
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
                                        <Card id="operationList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Operation List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">

                                                        <div>
                                                            <Link to='/main/addOperation'>
                                                                <Button
                                                               
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Operation
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                type="button"
                                                    
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

export default OperationList;
