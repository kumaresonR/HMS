import React, { useState } from "react";
import { Container, Row, Col, Card, CardHeader } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import FormHeader from "../../common/FormHeader/FormHeader";

const PatientCredentials = () => {
    const patientData = [
        { id: 1124, name: 'Vaisali Sharma', email: 'vaisali65@gmail.com', mobile: '8890768756', username: 'pat1124', password: 'oh8mjt' },
        { id: 1123, name: 'Deepak Mahajan', email: 'deepak90@gmail.com', mobile: '8906757456', username: 'pat1123', password: 'x33r9k' },
        { id: 1125, name: 'Ritika Gupta', email: 'ritika.gupta@gmail.com', mobile: '9876543210', username: 'pat1125', password: 'ab12cd' },
        { id: 1126, name: 'Aman Kumar', email: 'aman.kumar@gmail.com', mobile: '8765432109', username: 'pat1126', password: 'z7y6xw' },
        { id: 1127, name: 'Sneha Verma', email: 'sneha.verma@gmail.com', mobile: '9988776655', username: 'pat1127', password: 'lm12op' },
        { id: 1128, name: 'Rajesh Singh', email: 'rajesh.singh@gmail.com', mobile: '8123456789', username: 'pat1128', password: 'as34df' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const patientColumns = [
        {
            header: 'Patient Id',
            accessorKey: 'id',
        },
        {
            header: 'Patient Name',
            accessorKey: 'name',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Mobile Number',
            accessorKey: 'mobile',
        },
        {
            header: 'Username',
            accessorKey: 'username',
        },
        {
            header: 'Password',
            accessorKey: 'password',
        },
    ];

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={patientData}
                />

                <Container fluid>
                    <FormHeader title="Patient Credentials" pageTitle="Patient Management" />
                    <Row>
                        <Col lg={12}>
                            <Card id="patientCredentials">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Patient Credentials</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button type="button" className="btn btn-secondary" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </button>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>

                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={patientColumns}
                                            data={patientData}
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

export default PatientCredentials;
