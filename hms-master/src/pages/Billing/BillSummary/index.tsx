import React from "react"
import { Button, Card, CardBody, CardHeader, Col, Container, Label, Row } from "reactstrap"
import IpdCharges from "./IpdCharges"
import CommonBill from "./CommonBill"
import BillTransaction from "./BillTransaction"
import { billSummaryData } from "../../../common/data/FakeData"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrint } from "@fortawesome/free-solid-svg-icons"

const BillSummary = (props: any) => {
    const data = billSummaryData[0];

    return (
        <React.Fragment>
            <Container fluid>
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>
                                <Label>TPA : </Label>
                                <Label>Health Life Insurance</Label>
                            </Col>
                            <Col>
                                <Label>TPA Validity : </Label>
                                <Label>11/19/2026</Label>
                            </Col>
                            <Col className="d-flex justify-content-between">
                                <div>
                                    <Label>TPA ID : </Label>
                                    <Label> 7745855</Label>
                                </div>

                                <Button title="Print" data-bs-toggle="modal" onClick={() => window.print()}
                                    className="btn btn-sm btn-soft-secondary remove-list mx-1">
                                    <FontAwesomeIcon icon={faPrint} />
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                {/* <Row>
                                    <Col><Label>Case ID</Label></Col>
                                    <Col><Label>: 303</Label></Col>
                                </Row> */}
                                <Row>
                                    <Col><Label>Name</Label></Col>
                                    <Col><Label>: Vaisali Sharma</Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label>Gender</Label></Col>
                                    <Col><Label>: Female</Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label>Phone</Label></Col>
                                    <Col><Label>: 8890768756</Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label>TPA</Label></Col>
                                    <Col><Label>: Health Life Insurance</Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label>TPA ID</Label></Col>
                                    <Col><Label>: 7745855</Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label>IPD No</Label></Col>
                                    <Col><Label>: IPDN115</Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label>Admission Date</Label></Col>
                                    <Col><Label>: 12/02/2021</Label></Col>
                                </Row>
                            </Col>

                            <Col>
                                <Row>
                                    <Col><Label>Appointment Date</Label></Col>
                                    <Col><Label>: 303</Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label>Guardian Name</Label></Col>
                                    <Col><Label>: Vaisali Sharma</Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label>Age</Label></Col>
                                    <Col><Label>: Female</Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label>Credit Limit</Label></Col>
                                    <Col><Label>: 8890768756</Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label>TPA Validity</Label></Col>
                                    <Col><Label>: Health Life Insurance</Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label></Label></Col>
                                    <Col><Label></Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label></Label></Col>
                                    <Col><Label></Label></Col>
                                </Row>
                                <Row>
                                    <Col><Label>Bed</Label></Col>
                                    <Col><Label>: GF- 101 -VIP Ward - Ground Floor</Label></Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col>
                                <h4>IPD Charges</h4>
                                <IpdCharges data={data.IPDChargesData} />
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col>
                                <h4>Pharmacy Bill</h4>
                                <CommonBill data={data.pharmacyBill} />
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col>
                                <h4>Pathology Bill</h4>
                                <CommonBill data={data.pharmacyBill} />
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col>
                                <h4>Radiology Bill</h4>
                                <CommonBill data={data.pharmacyBill} />
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col>
                                <h4>Blood Issue</h4>
                                <CommonBill data={data.pharmacyBill} />
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col>
                                <h4>Transactions</h4>
                                <BillTransaction data={data.transaction} />
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col xs>
                                
                            </Col>
                            <Col xs={5}>
                                <h4>Amount Summary</h4>
                                <Row>
                                    <Col className="d-flex justify-content-between">
                                        <Label>Grand Total: </Label>
                                        <Label>₹ 20184.60</Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="d-flex justify-content-between">
                                        <Label>Amount Paid: </Label>
                                        <Label>₹ 21315.55</Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="d-flex justify-content-between">
                                        <Label>Refund Amount: </Label>
                                        <Label>₹ 0.00</Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="d-flex justify-content-between">
                                        <Label>Balance Amount : </Label>
                                        <Label>₹ -1130.95</Label>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

            </Container>
        </React.Fragment>
    )
}

export default BillSummary