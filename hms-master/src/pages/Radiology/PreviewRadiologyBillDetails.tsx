import React from "react"
import { Container, Row, Col, Label } from "reactstrap"
import SampleCollectionDataTable from "./SampleCollectionDatatable"
import moment from "moment"
import { toWords } from "number-to-words"
import CalculateAge from "../../Components/Common/CalculateAge"

const PreviewRadiologyBillDetails = (props: any) => {
    const data = props.data;

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col className="justify-content-between d-flex">
                        <Label> Bill No : {data.billId}</Label>
                        <Label>Date : {moment(data.dateTime).format('DD-MM-YYYY  h:ss A')}</Label>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>Name</Label></Col>
                            <Col><Label>: {data?.patientDetails?.firstName || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>Age</Label></Col>
                            <Col><Label>: <CalculateAge dateOfBirth={data?.patientDetails?.dateOfBirth} /></Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>Blood Group	</Label></Col>
                            <Col><Label>: {data?.patientDetails?.bloodType || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>TPA</Label></Col>
                            <Col><Label>: NA</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>Address</Label></Col>
                            <Col><Label>: {data?.patientDetails?.address || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>Patient ID	</Label></Col>
                            <Col><Label>: {data?.patientDetails?.patientId || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>Doctor Name</Label></Col>
                            <Col><Label>: {data.doctorName || 'NA'}	</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>Gender</Label></Col>
                            <Col><Label>: {data?.patientDetails?.gender || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>TPA ID</Label></Col>
                            <Col><Label>: NA</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>Email</Label></Col>
                            <Col><Label>: {data?.patientDetails?.email || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>Prescription No</Label></Col>
                            <Col><Label>: {data.prescriptionNo || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>Mobile No</Label></Col>
                            <Col><Label>: {data?.patientDetails?.contactNumber || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>Previous Report Value</Label></Col>
                            <Col><Label>: {data?.previousReportValue || 'NA'}</Label></Col>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Row>
                            <Col><Label>TPA Validity</Label></Col>
                            <Col><Label>: NA</Label></Col>
                        </Row>
                    </Col>
                </Row>

                <hr />
                <Row className="my-2">
                    <Col>
                        {props.title === 'radiology' ? (
                            <SampleCollectionDataTable handleClose={props.handleClose} title="radiology" data={data.radiologyItems} />
                        ) : (
                            <SampleCollectionDataTable handleClose={props.handleClose} data={data.pathologyItems} />
                        )}
                    </Col>
                </Row>

                <hr />
                <Row className="my-2">
                    <Col>
                        <Label className="text-capitalize"><b>Amount in words:</b> {toWords(data.paymentAmount)} only</Label>
                        <br />
                        <Label className="text-capitalize"><b>Payment Mode:</b> {data.paymentMode}</Label>
                    </Col>
                    <Col xs={4}>
                        <Col className="d-flex justify-content-between">
                            <Label>Total (₹) </Label>
                            <Label>{data.totalAmount}</Label>
                        </Col>
                        <Col className="d-flex justify-content-between">
                            <Label>Discount (0.00%)	</Label>
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
                            <Label>Due Amount (₹)  </Label>
                            <Label>{data.balanceAmount}</Label>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default PreviewRadiologyBillDetails