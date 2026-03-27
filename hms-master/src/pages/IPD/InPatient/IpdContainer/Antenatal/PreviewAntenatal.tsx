import moment from "moment";
import { Col, Container, Row } from "reactstrap"
import CalculateAge from "../../../../../Components/Common/CalculateAge";

const PreviewAntenatal = (props: any) => {

    return <>
        <Container fluid>
            <Row>
                <Col md={6}>
                    <Row>
                        <Col xs={6}>IPD No</Col>
                        <Col xs={6}>{props?.data?.ipdId}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Age</Col>
                        <Col xs={6}><CalculateAge dateOfBirth={props.patientData?.patient?.dateOfBirth} /></Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Gender</Col>
                        <Col xs={6}>{props.patientData?.patient?.gender}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Email</Col>
                        <Col xs={6}>{props.patientData?.patient?.email || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}>Patient Name</Col>
                        <Col xs={6}>{props.patientData?.patient?.firstName} {props.patientData?.patient?.lastName} ({props.patientData?.patient?.patientId})</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Blood Group	</Col>
                        <Col xs={6}>{props.patientData?.patient?.bloodType || 'NA'}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Phone</Col>
                        <Col xs={6}>{props.patientData?.patient?.contactNumber}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Known Allergies	</Col>
                        <Col xs={6}>
                            {props.patientData?.admissions?.knownAllergies ? (
                                <label>{props.patientData?.admissions?.knownAllergies}</label>
                            ) : (
                                <p>No known allergies available.</p>
                            )}
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr />
            <Row>
                <h5>Primary Examine </h5>
                <Col md={6}>
                    <Row>
                        <Col xs={6}>Bleeding</Col>
                        <Col xs={6}>{props?.data?.bleeding}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Pain</Col>
                        <Col xs={6}>{props?.data?.pain}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Vomiting</Col>
                        <Col xs={6}>{props?.data?.vomiting}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Vaginal</Col>
                        <Col xs={6}>{props?.data?.vaginal}</Col>
                    </Row>

                    <Row>
                        <Col xs={6}>Height</Col>
                        <Col xs={6}>{props?.data?.height}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Discharge</Col>
                        <Col xs={6}>{props?.data?.discharge}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Condition</Col>
                        <Col xs={6}>{props?.data?.condition}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Special Findings And Remark	</Col>
                        <Col xs={6}>{props?.data?.specialFindingsAndRemark}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Pelvic Examination	</Col>
                        <Col xs={6}>{props?.data?.pelvicExamination}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>SP	</Col>
                        <Col xs={6}>{props?.data?.sp}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}>Headache</Col>
                        <Col xs={6}>{props?.data?.headache}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Constipation	</Col>
                        <Col xs={6}>{props?.data?.constipation}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Cough</Col>
                        <Col xs={6}>{props?.data?.cough}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Weight</Col>
                        <Col xs={6}>{props?.data?.weight}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Date</Col>
                        <Col xs={6}>{props?.data?.date ? moment(props?.data?.date).format('DD/MM/YYYY hh:mm A') : 'NA'}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Oedema</Col>
                        <Col xs={6}>{props?.data?.oedema}</Col>
                    </Row>
                </Col>
            </Row>
            <hr />
            <Row>
                <h5>Antenatal Examine</h5>
                <Col md={6}>
                    <Row>
                        <Col xs={6}>Uter Size</Col>
                        <Col xs={6}>{props?.data?.uterSize}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Presentation Position	</Col>
                        <Col xs={6}>{props?.data?.presentationPosition}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Foeta Heart	</Col>
                        <Col xs={6}>{props?.data?.foetalHeart}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Vaginal</Col>
                        <Col xs={6}>{props?.data?.vaginal}</Col>
                    </Row>

                    <Row>
                        <Col xs={6}>Antenatal Oedema</Col>
                        <Col xs={6}>{props?.data?.antenatalOedema}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Urine Aaibumen	</Col>
                        <Col xs={6}>{props?.data?.urineAlbumen}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Remark</Col>
                        <Col xs={6}>{props?.data?.remark}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Next Visit	</Col>
                        <Col xs={6}>{props?.data?.nextVisit ? moment(props?.data?.nextVisit).format('DD/MM/YYYY hh:mm A') : 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}>Uterus Size	</Col>
                        <Col xs={6}>{props?.data?.uterusSize}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Presenting Part To Brim	</Col>
                        <Col xs={6}>{props?.data?.presentingPartToBrim}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Blood Pressure</Col>
                        <Col xs={6}>{props?.data?.bloodPressure}</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Antenatal weight</Col>
                        <Col xs={6}>{props?.data?.antenatalWeight} kg</Col>
                    </Row>
                    <Row>
                        <Col xs={6}>Urine (Sugar)</Col>
                        <Col xs={6}>{props?.data?.urineSugar}</Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    </>
}

export default PreviewAntenatal