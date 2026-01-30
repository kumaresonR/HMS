import React from "react";
import TableContainer from "../../Components/Common/TableContainer"; // Adjust the path if needed
import { Row, Col, Card, CardHeader } from "reactstrap";

const patientDetails = [
    { id: 1, label: "IPD No", value: "IPDN100" },
    { id: 2, label: "Age", value: "25 Year 4 Month 25 Days" },
    { id: 3, label: "Gender", value: "Female" },
    { id: 4, label: "Email", value: "matthews90@gmail.com" },
    { id: 5, label: "Patient Name", value: "Hayley Matthews (100)" },
    { id: 6, label: "Blood Group", value: "A+" },
    { id: 7, label: "Phone", value: "7809078654" },
    { id: 8, label: "Known Allergies", value: "-" },
    { id: 9, label: "Emergency Contact", value: "1234567890" },
    { id: 10, label: "Next of Kin", value: "John Doe" },
];

const patientDetailsColumns = [
    { header: "Label", accessorKey: "label", enableColumnFilter: false },
    { header: "Value", accessorKey: "value", enableColumnFilter: false },
];

const PatientDetailsTable = () => {
    return (
        <Row>
            <Col lg={12} className="px-0">
                <Card id="birthReport">
                    <CardHeader className="border-0">
                        <h4>Patient Details</h4>
                    </CardHeader>

                    <div className="card-body pt-0">
                        <div>
                            <TableContainer
                                columns={patientDetailsColumns}
                                data={patientDetails}
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
    );
};

export default PatientDetailsTable;
