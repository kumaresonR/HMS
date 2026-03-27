import React, { useState } from "react";
import { Col, Container, Label, Row, Table } from "reactstrap";
import moment from "moment";
import { toWords } from 'number-to-words';

const PharmacyInvoice = (props: any) => {
    const data = props.data;
    const today = new Date();

    return (
        <React.Fragment>
            <Container fluid>
                <Row className="align-items-center">
                    <Col className=" text-center border-bottom border-bottom-dashed">
                        <h4 className="text-uppercase">Pharmacy Bill</h4>
                    </Col>

                    <Row className="py-3">
                        <Col className="d-grid">
                            <Label>Bill No: {data.billId}</Label>
                            <Label>Name: {data.patientDetails?.firstName} {data.patientDetails?.lastName} ({data.patientId})</Label>
                            <Label>Doctor: {data.doctorName || 'NA'}</Label>
                            <Label>Phone: {data.patientDetails?.contactNumber || 'NA'}</Label>
                        </Col>
                        <Col className="d-grid">
                            <Label>Date: {moment(data.dateTime).format('DD-MM-YYYY  h:ss A')}</Label>
                            <Label>Prescription: {data.prescriptionNo || 'NA'}</Label>
                            <Label>OPD/IPD ID: {data.ipdOrOpdId || 'NA'}</Label>
                            <Label>Doctor: {data.doctorName || 'NA'}</Label>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Table bordered >
                                <thead className="table-light">
                                    <tr>
                                        <th>Medicine Category</th>
                                        <th>Medicine Name</th>
                                        <th className="hide-print">Batch No</th>
                                        {/* <th>Unit</th> */}
                                        <th>Expiry Date</th>
                                        <th>Quantity</th>
                                        <th>Tax (%)</th>
                                        <th>Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {data.medicines.map((medicine: any, index: any) => (
                                        <tr key={index}>
                                            <td>{medicine.medicineCategory || 'NA'}</td>
                                            <td>{medicine.medicineName || 'NA'}</td>
                                            <td className="hide-print">{medicine.batchNo || 'NA'}</td>
                                            {/* <td>{medicine.unit || 'NA'}</td> */}
                                            <td>{medicine.expiryDate || 'NA'}</td>
                                            <td>{medicine.quantity || 'NA'}</td>
                                            <td>{medicine.tax ?? 'NA'}</td>
                                            <td>{medicine.amount || 'NA'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    <Row className="d-flex justify-content-end">
                        <Col xs className="">
                            <Label className="text-capitalize"><b>Amount in words:</b> {toWords(data.paymentAmount)} only</Label>
                            <br />
                            <Label className="text-capitalize"><b>Payment Mode:</b> {data.paymentMode}</Label>
                        </Col>
                        <Col xs="5" className="text-end">
                            <Row>
                                <Col xs={9}><label> Total (₹)  </label></Col>
                                <Col xs={3}>{data.totalAmount}</Col>
                            </Row>
                            <Row>
                                <Col xs={9}><label> Discount (0.00%)  </label></Col>
                                <Col xs={3}>{data.discount}</Col>
                            </Row>
                            <Row>
                                <Col xs={9}><label> Net Amount (₹)  </label></Col>
                                <Col xs={3}>{data.netAmount}</Col>
                            </Row>
                            <Row>
                                <Col xs={9}><label> Paid Amount (₹)  </label></Col>
                                <Col xs={3}>{data.paymentAmount}</Col>
                            </Row>
                            <Row>
                                <Col xs={9}><label> Due Amount (₹) </label></Col>
                                <Col xs={3}>{data.balanceAmount}</Col>
                            </Row>

                        </Col>
                    </Row>
                </Row>
            </Container>
        </React.Fragment>
    );
}

export default PharmacyInvoice;
