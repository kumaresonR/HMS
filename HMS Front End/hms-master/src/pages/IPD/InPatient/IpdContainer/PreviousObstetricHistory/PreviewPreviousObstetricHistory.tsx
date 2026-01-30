import { Col, Container, Row } from "reactstrap";
import CalculateAge from "../../../../../Components/Common/CalculateAge";

const PreviewPreviousObstetricHistory = (props: any) => {
    
    return <>
        <Container fluid>
            <Row>
                <Col md={6}>
                    <Row>
                        <Col xs={6}>Patient Name</Col>
                        <Col xs={6}>{props?.patientData?.patient?.firstName} {props.data?.patient?.lastName}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Gender</Col>
                        <Col xs={6}>{props?.patientData?.patient?.gender}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Phone</Col>
                        <Col xs={6}>{props?.patientData?.patient?.contactNumber || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}>Age</Col>
                        <Col xs={6}><CalculateAge dateOfBirth={props?.patientData?.patient?.dateOfBirth} /></Col>
                    </Row><Row>
                        <Col xs={6}>Blood Group	</Col>
                        <Col xs={6}>{props?.patientData?.patient?.bloodType || 'NA'}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Email</Col>
                        <Col xs={6}>{props?.patientData?.patient?.email || 'NA'} </Col>
                    </Row>
                </Col>
            </Row>
            <hr />
            <Row>
                <h5>Previous Obstetric History </h5>
                <Col md={6}>
                    <Row>
                        <Col xs={6}>Place Of Delivery</Col>
                        <Col xs={6}>{props?.data?.placeOfDelivery}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Complication In Pregnancy Or Puerperium	</Col>
                        <Col xs={6}>{props?.data?.complicationsInPregnancyOrPuerperium}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Gender</Col>
                        <Col xs={6}>{props?.data?.gender}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Birth Status</Col>
                        <Col xs={6}>{props?.data?.birthStatus}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}>Duration Of Pregnancy</Col>
                        <Col xs={6}>{props?.data?.durationOfPregnancy}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Birth Weight</Col>
                        <Col xs={6}>{props?.data?.birthWeight}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Infant Feeding</Col>
                        <Col xs={6}>{props?.data?.infantFeeding}</Col>
                    </Row>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col md={6}>
                    <Row>
                        <Col xs={6}>Previous Medical History</Col>
                        <Col xs={6}>{props?.data?.previousMedicalHistory}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Special Instruction	</Col>
                        <Col xs={6}>{props?.data?.specialInstruction}</Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    </>
}
export default PreviewPreviousObstetricHistory