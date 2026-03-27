import { Card, CardBody, Col, Container, Row } from "reactstrap"
import LabInvestigationDataTable from "./LabInvestigationDataTable"

const LabInvestigation = (props: any) => {
    return <>
        <Container fluid>
            <Card>
                <CardBody>
                    <Row>
                        <Col className="align-items-center d-flex justify-content-between">
                            <h5>Lab Investigation</h5>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <LabInvestigationDataTable refresh={props.refresh} patientData={props.data} data={props?.data?.prescriptions} />
                    </Row>
                </CardBody>
            </Card >
        </Container >
    </>
}
export default LabInvestigation