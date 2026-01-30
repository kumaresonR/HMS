import { Col, Container, Label, Row, } from "reactstrap";
import moment from "moment";

const ManualPrescription = (props: any) => {
    const data = props.data;
    const printInvoice = () => {
        window.print();
    };
    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Row>
                        {/* <Col lg={12}>
                                <CardHeader className="border-bottom-dashed p-3">
                                    <Row className="d-flex justify-content-between">
                                        <Col xs="6">
                                            <img
                                                src={logoDark}
                                                className="card-logo card-logo-dark bg-dark"
                                                alt="logo dark"
                                                height="50"
                                            />
                                        </Col>
                                        <Col xs="6" className="text-end">
                                            <div>
                                                <h6 className="text-muted text-uppercase fw-semibold">
                                                    Address
                                                </h6>
                                                <p className="text-muted mb-1" id="address-details">
                                                    Nagercoil, India
                                                </p>
                                                <p className="text-muted mb-1" id="zip-code"><span>Zip-code: 629001</span></p>

                                                <span className="text-muted fw-normal">Contact No:</span>{" "}
                                                <span id="contact-no" className="text-muted "> +(91) 6297650919</span>

                                            </div>
                                        </Col>
                                    </Row>
                                </CardHeader>
                            </Col> */}
                        <Col lg={12} className="hide-print border-bottom border-bottom-dashed">
                            <div className="p-3">
                                <Row className="g-3 text-center">
                                    <h4>OPD MANUAL PRESCRIPTION</h4>
                                </Row>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="p-3">
                                <Row className="g-3 hide-print">
                                    <Col className="d-flex justify-content-between">
                                        <div>
                                            <p className="fw-medium mb-2">OPD No : <span className="text-primary"> {data.opdId}</span></p>
                                        </div>
                                        <div>
                                            <p className="fw-medium mb-2 text-end">Date  : <span className="text-muted"> {moment(data.appointmentDate).format('DD/MM/YYYY hh:mm A')}</span></p>
                                        </div>
                                    </Col>
                                    <hr />
                                </Row>

                                <Row>
                                    <Row>
                                        <Col className="d-grid">
                                            <Label>OPD ID: {data.opdId}</Label>
                                            <Label>Name: {data.patient?.firstName} {data.patient?.lastName} ({data.patientId})</Label>
                                            <Label>Blood Group: {data.patient?.bloodType || 'NA'}</Label>
                                        </Col>
                                        <Col className="d-grid">
                                            <Label>Date: {moment(data.appointmentDate).format('DD/MM/YYYY hh:mm A')}</Label>
                                            <Label>Consultant Doctor: {data.doctor?.firstName} {data.doctor?.lastName} ({data.doctor?.staffId})</Label>
                                            <Label>Age: {data.patient?.age}</Label>
                                        </Col>
                                    </Row>
                                    {/* <h4 className="text-start mb-3">Patient Information</h4> */}
                                </Row>
                                {/* <div className="mt-4">
                                    <div className="alert alert-primary">
                                        <p className="mb-0">
                                            <span className="fw-semibold">NOTES:</span>
                                            <span id="note"> This invoice is printed electronically, so no signature is required
                                            </span>
                                        </p>
                                    </div>
                                </div> */}
                                {/* <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                        <Link
                                            to="#"
                                            onClick={printInvoice}
                                            className="btn btn-success"
                                        >
                                            <i className="ri-printer-line align-bottom me-1"></i> Print
                                        </Link>
                                    </div> */}
                            </div>
                        </Col>

                    </Row>
                </Col>
            </Row >
        </Container >
    );
}
export default ManualPrescription