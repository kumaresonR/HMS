import moment from 'moment'
import React from 'react'
import { Col, Container, Label, Row } from 'reactstrap'

const PreviewAmbulanceCall = (props: any) => {
    const data = props.data;
    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col className="justify-content-between d-flex">
                        <Label> Bill No : {data?.billNo}</Label>
                        <Label> Date : {moment(data?.date).format('DD/MM/YYYY hh:mm A')}</Label>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <Row>
                            <Col><Label>Patient Name</Label></Col>
                            <Col><Label>: {data?.patients?.firstName && data?.patients?.lastName && data?.patients?.patientId
                                ? `${data.patients.firstName} ${data.patients.lastName} (${data.patients.patientId})`
                                : 'NA'}
                            </Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Vehicle Number</Label></Col>
                            <Col><Label>: {data?.vehicle?.vehicleNumber || 'NA'}</Label></Col>
                        </Row>
                        {/* <Row>
                            <Col><Label>Case ID</Label></Col>
                            <Col><Label>: {data?.caseId || 'NA'}</Label></Col>
                        </Row> */}
                        <Row>
                            <Col><Label>Charge Category</Label></Col>
                            <Col><Label>: {data?.chargeCategory || 'NA'}</Label></Col>
                        </Row>
                        
                    </Col>
                    <Col>
                        <Row>
                            <Col><Label>Driver Name</Label></Col>
                            <Col><Label>: {data?.driverName || 'NA'}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Vehicle Model</Label></Col>
                            <Col><Label>: {data?.vehicleModel || 'NA'}</Label></Col>
                        </Row>
                        
                        <Row>
                            <Col><Label>Contact Number</Label></Col>
                            <Col><Label>: {data?.driverContact || 'NA'}</Label></Col>
                        </Row>
                        <Row>
                            <Col><Label>Charge Name	</Label></Col>
                            <Col><Label>: {data?.chargeName || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <Row className="my-2 justify-content-end">
                    <Col md={4}>
                        <Col className="d-flex justify-content-between">
                            <Label>Standard Charge (₹) </Label>
                            <Label>{data?.standardCharge}</Label>
                        </Col>
                        <Col className="d-flex justify-content-between">
                            <Label>Amount (₹)</Label>
                            <Label>{data?.total}</Label>
                        </Col>
                        <Col className="d-flex justify-content-between">
                            <Label>Discount ({data.discountPercentage}%)	 </Label>
                            <Label>{data?.discountAmount}</Label>
                        </Col>
                        <Col className="d-flex justify-content-between">
                            <Label>Tax ({data.taxPercentage} %)	</Label>
                            <Label>{data?.taxAmount}</Label>
                        </Col>
                        <Col className="d-flex justify-content-between">
                            <Label>Net Amount  (₹)  </Label>
                            <Label>{data?.netAmount}</Label>
                        </Col>
                        <Col className="d-flex justify-content-between">
                            <Label>Paid Amount  (₹)  </Label>
                            <Label>{data?.transactions[0]?.paymentAmount}</Label>
                        </Col>

                        <Col className="d-flex justify-content-between">
                            <Label>Due Amount (₹)  </Label>
                            <Label>{data?.balanceAmount}</Label>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default PreviewAmbulanceCall