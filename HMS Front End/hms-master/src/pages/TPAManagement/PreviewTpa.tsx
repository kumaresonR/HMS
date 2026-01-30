import moment from 'moment'
import { Col, Container, Row } from 'reactstrap'

const PreviewTpa = (props: any) => {
    return (
        <Container fluid>
            <Row>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Patient Name </label></Col>
                        <Col xs={6}>{props?.data?.patientDetails?.firstName} {props?.data?.patientDetails?.lastName} ({props?.data?.patientId})</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Admission Date</label></Col>
                        <Col xs={6}>{moment(props?.data?.admissionDate).format('DD/MM/YYYY hh:mm A')}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Reason For Admission</label></Col>
                        <Col xs={6}>{props?.data?.reasonForAdmission || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">TPA</label></Col>
                        <Col xs={6}>{props?.data?.tpaDetails?.tpaName || props.data?.patientDetails?.insuranceProviders?.providerName || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Gender</label></Col>
                        <Col xs={6}>{props?.data?.patientDetails?.gender || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Contact Number</label>	</Col>
                        <Col xs={6}>{props?.data?.patientDetails?.contactNumber || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Address</label> </Col>
                        <Col xs={6}>{props?.data?.patientDetails?.address || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Pincode </label></Col>
                        <Col xs={6}>{props?.data?.patientDetails?.pinCode || 'NA'}</Col>
                    </Row>
                </Col>

                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Id Proof </label></Col>
                        <Col xs={6}>{props?.data?.patientDetails?.idProof || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Id Number</label></Col>
                        <Col xs={6}>{props?.data?.patientDetails?.idNumber || 'NA'}</Col>
                    </Row>
                </Col>
            </Row>
        </Container >
    )
}

export default PreviewTpa