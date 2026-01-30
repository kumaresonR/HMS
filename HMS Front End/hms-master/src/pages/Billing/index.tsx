import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Row } from "reactstrap"
import SingleModuleBilling from "./SingleModuleBilling"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Billing = () => {
    let navigate: any = useNavigate();

    const [caseId, setCase] = useState('');

    const search = () => {
        navigate('/main/billing-by-caseId')
    }

    return <>
        <Container fluid>
            <Row>

                {/* <Col md={12}>
                    <Card>
                        <CardHeader>
                            <h5 className="mb-0">
                            OPD or IPD Billing via Case ID</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md={8}>
                                    <FormGroup className="d-flex align-items-center">
                                        <label className="m-0 me-2">Case ID</label>
                                        <Input
                                            id="case"
                                            name="case"
                                            type="text"
                                            placeholder="Search Case ID"
                                            value={caseId}
                                            onChange={e => setCase(e.target.value)}
                                            style={{ flex: '1' }}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <Button color="primary" onClick={search}>Search</Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col> */}
                <Col md={12} >
                    <SingleModuleBilling />
                </Col>
            </Row>
        </Container>
    </>
}
export default Billing