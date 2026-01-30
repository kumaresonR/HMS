import moment from "moment";
import React from "react"
import { Container, Row, Col, Label } from "reactstrap"

const PreviewComponentIssueDetails = (props: any) => {
    const data = props.data;

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col className="justify-content-between d-flex">
                        <Label> Bill No : {data.issueComponentId}</Label>
                        <Label>Issue Date :{moment(data.issueDate).format('DD/MM/YYYY hh:mm A')}</Label>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <Row>
                            <Col><Label>Received To	</Label></Col>
                            <Col><Label>: {data.patientDetails?.firstName} {data.patientDetails?.lastName} ({data.patientId})	</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Blood Group	</Label></Col>
                            <Col><Label>: {data.bloodGroup}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Technician</Label></Col>
                            <Col><Label>: {data.technician}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Referance	</Label></Col>
                            <Col><Label>: {data.referenceName}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Donor Name</Label></Col>
                            <Col><Label>: {data.donorName || 'NA'}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Note</Label></Col>
                            <Col><Label>: {data.note || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col><Label>Bags</Label></Col>
                            <Col><Label>: {data.componentId || data.bag}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Component</Label></Col>
                            <Col><Label>: {data.components}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>TPA</Label></Col>
                            <Col><Label>: {data.tps || 'NA'}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>TPA ID</Label></Col>
                            <Col><Label>: {data.tpaId || 'NA'}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>TPA Validity</Label></Col>
                            <Col><Label>: {data.tpaValidity || 'NA'}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Blood Qty</Label></Col>
                            <Col><Label>: {data.bloodQty || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <Row className="my-2 justify-content-end">
                    <Col md={4}>
                        <Col className="d-flex justify-content-between">
                            <Label>Amount (₹) </Label>
                            <Label>{data.total}</Label>
                        </Col>
                        <Col className="d-flex justify-content-between">
                            <Label>Discount (₹)  </Label>
                            <Label>{data.discount}</Label>
                        </Col>
                        <Col className="d-flex justify-content-between">
                            <Label>Tax  (₹) </Label>
                            <Label>{data.tax}</Label>
                        </Col>
                        <Col className="d-flex justify-content-between">
                            <Label>Net Amount (₹) </Label>
                            <Label>{data.netAmount}</Label>
                        </Col>
                        <Col className="d-flex justify-content-between">
                            <Label>Paid Amount  (₹)  </Label>
                            <Label>{data.paymentAmount}</Label>
                        </Col>

                        <Col className="d-flex justify-content-between">
                            <Label>Balance Amount (₹)  </Label>
                            <Label>{data.balanceAmount}</Label>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}
export default PreviewComponentIssueDetails