import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row, Table } from "reactstrap";
import logoDark from "../../../../../assets/images/logo-light.png"
import moment from "moment";
const OpdBill = (props: any) => {
    const data = props.data;

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card id="demo">
                        <Row>
                            <Col lg={12}>
                                <CardHeader className="border-bottom-dashed p-3">
                                    <Row className="d-flex justify-content-between">
                                        <Col xs="6">
                                            <img
                                                src={logoDark}
                                                className="card-logo card-logo-dark bg-dark"
                                                alt="logo dark"
                                                height="17"
                                            />
                                        </Col>
                                        <Col xs="6" className="text-end">
                                            <div>
                                                <div>
                                                    <h6 className="text-muted text-uppercase fw-semibold">
                                                        Address
                                                    </h6>
                                                    <p className="text-muted mb-1" id="address-details">
                                                        Nagercoil, India
                                                    </p>
                                                    <p className="text-muted mb-0" id="zip-code"><span>Zip-code: 629001</span></p>
                                                </div>

                                                <h6 className="mb-0">
                                                    <span className="text-muted fw-normal">Contact No:</span>{" "}
                                                    <span id="contact-no">  +(91) 6297650919</span>
                                                </h6>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardHeader>
                            </Col>
                            <Col lg={12}>
                                <CardBody className="p-3">
                                    <Row className="g-3 text-center">
                                        <h4>OPD Bill</h4>
                                    </Row>
                                </CardBody>
                            </Col>
                            <Col lg={12}>
                                <CardBody className="p-3 border-top border-top-dashed">
                                    <Row className="g-3">
                                        <Col sm={6}>
                                            <p className="fw-medium mb-2">OPD ID : <span className="text-muted"> {data.opdId}</span></p>
                                            <p className="fw-medium mb-2">Appointment No : <span className="text-muted"> {data.opdId}</span></p>
                                            <p className="fw-medium mb-2">Patient Name : <span className="text-muted"> {data.patient?.firstName}</span></p>
                                            <p className="fw-medium mb-2">Blood Group : <span className="text-muted"> {data.patient?.bloodType}</span></p>
                                            <p className="fw-medium mb-2">Gender : <span className="text-muted"> {data.patient?.gender}</span></p>
                                            <p className="fw-medium mb-2">Address : <span className="text-muted"> {data.patient?.address}</span></p>
                                            <p className="fw-medium mb-2">Previous Medical Issue : <span className="text-muted"> {data.previousMedicalIssue || 'NA'}</span></p>
                                        </Col>
                                        <Col sm={6}>
                                            <p className="fw-medium mb-2">Consultant Doctor : <span className="text-muted"> {data.doctor?.firstName} {data.doctor?.lastName} ({data.doctor?.staffId})</span></p>
                                            <p className="fw-medium mb-2">Appointment Date : <span className="text-muted"> {moment(data.appointmentDate).format('DD/MM/YYYY hh:mm A')}</span></p>
                                            <p className="fw-medium mb-2">OPD Checkup ID : <span className="text-muted"> {data.opdId}</span></p>
                                            <p className="fw-medium mb-2">Appointment S.No : <span className="text-muted"> </span></p>
                                            <p className="fw-medium mb-2">Age : <span className="text-muted"> {data.patient?.age}</span></p>
                                            <p className="fw-medium mb-2">Department : <span className="text-muted"> OT</span></p>
                                            <p className="fw-medium mb-2">Known Allergies : <span className="text-muted"> {data.anyKnownAllergies || 'NA'}</span></p>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Col>
                            <Col lg={12}>
                                <CardBody className="p-3">
                                    <h4>Payment Details</h4>
                                    <div className="table-responsive">
                                        <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                                            <thead className="table-light">
                                                <tr className="table-active">
                                                    <th scope="col" style={{ width: "50px" }}>
                                                        #
                                                    </th>
                                                    <th scope="col">Description</th>
                                                    <th scope="col">Tax (%)</th>
                                                    <th scope="col" className="text-end">
                                                        Amount
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody id="products-list">
                                                <tr>
                                                    <th scope="row">01</th>
                                                    <td>
                                                        <span className="fw-medium">
                                                            Appointment Fees
                                                        </span>
                                                        <p className="text-muted mb-0">
                                                        {data.doctor?.firstName} {data.doctor?.lastName} ({data.doctor?.staffId})
                                                        </p>
                                                    </td>
                                                    <td>24.00(20.00%)</td>
                                                    <td className="text-end">120.00</td>
                                                </tr>

                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="border-top border-top-dashed mt-2">
                                        <Table className="table table-borderless table-nowrap align-middle mb-0 ms-auto" style={{ width: "250px" }}>
                                            <tbody>
                                                <tr>
                                                    <td>Net Amount</td>
                                                    <td className="text-end">₹ 120.00</td>
                                                </tr>
                                                <tr>
                                                    <td>Discount</td>
                                                    <td className="text-end">₹0 (0.00%)</td>
                                                </tr>
                                                <tr>
                                                    <td>Tax </td>
                                                    <td className="text-end"> ₹24.00 (20.00%)</td>
                                                </tr>

                                                <tr className="border-top border-top-dashed fs-15">
                                                    <td scope="row">Total Amount</td>
                                                    <td className="text-end">₹144.00</td>
                                                </tr>

                                                <tr className="border-top border-top-dashed fs-15">
                                                    <td scope="row">Paid Amount</td>
                                                    <td className="text-end">₹144.00</td>
                                                </tr>

                                                <tr className="border-top border-top-dashed fs-15">
                                                    <td scope="row">Balance Amount</td>
                                                    <td className="text-end">₹00.00</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>

                                    <div className="mt-4">
                                        <div className="alert alert-info">
                                            <p className="mb-0">
                                                <span className="fw-semibold">NOTES:</span>
                                                <span id="note"> This invoice is printed electronically, so no signature is required
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    {/* <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                        <Link
                                            to="#"
                                            onClick={printInvoice}
                                            className="btn btn-success"
                                        >
                                            <i className="ri-printer-line align-bottom me-1"></i> Print
                                        </Link>
                                    </div> */}
                                </CardBody>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row >
        </Container >
    );
}
export default OpdBill