import moment from "moment";
import { Col, Container, Row } from "reactstrap"

const PreviewOperation = (props: any) => {

    return <>
        <Container fluid>
            <Row>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Reference No </label></Col>
                        <Col xs={6}>{props?.data?.otReferenceNo}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Operation Name</label></Col>
                        <Col xs={6}>{props?.data?.operationName}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Date</label></Col>
                        <Col xs={6}>{moment(props?.data?.operationDate).format('DD/MM/YYYY hh:mm A')}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Operation Category</label></Col>
                        <Col xs={6}>{props?.data?.operationCategory}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Consultant Doctor</label></Col>
                        <Col xs={6}>{props?.data?.doctor?.firstName} {props?.data?.doctor?.lastName} ({props?.data?.doctor?.staffId})</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Assistant Consultant 1</label>	</Col>
                        <Col xs={6}>{props?.data?.assistantConsultant1}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Assistant Consultant 2</label> </Col>
                        <Col xs={6}>{props?.data?.assistantConsultant2}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Anesthetist </label></Col>
                        <Col xs={6}>{props?.data?.anesthetist}</Col>
                    </Row>
                </Col>

                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Anaethesia Type </label></Col>
                        <Col xs={6}>{props?.data?.anesthesiaType}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">OT Technician </label></Col>
                        <Col xs={6}>{props?.data?.otTechnician}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">OT Assistant </label></Col>
                        <Col xs={6}>{props?.data?.OtAssistant || props?.data?.otAssistant}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Remark </label> </Col>
                        <Col xs={6}>{props?.data?.remark}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Result </label></Col>
                        <Col xs={6}>{props?.data?.result}</Col>
                    </Row>
                </Col>
            </Row>
        </Container >
    </>
}
export default PreviewOperation