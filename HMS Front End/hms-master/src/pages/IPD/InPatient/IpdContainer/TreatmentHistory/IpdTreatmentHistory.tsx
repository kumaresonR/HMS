import { useState } from "react";
import { Card, CardBody, Col, Table } from "reactstrap";

const IpdTreatmentHistory = (props: any) => {

    return <>
        <Col>

            <Card >
                <CardBody>
                    <h5>Treatment History</h5>
                    <div className="table-responsive">
                        <Table hover className="table-centered align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>IPD No</th>
                                    <th>Symptoms</th>
                                    <th>Consultant</th>
                                    {/* <th>Bed</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {props?.data?.admissions?.ipdId}
                                    </td>
                                    <td>
                                        <span>{props?.data?.admissions?.symptomsDescription}</span>
                                    </td>
                                    <td>{props?.data?.admissions?.doctor?.firstName} {props?.data?.admissions?.doctor?.lastName} ({props?.data?.admissions?.doctor?.staffId})</td>
                                    {/* <td>{data.bedGroup?.bedGroupName} - {data.bedGroup?.rooms?.roomNumber}</td> */}
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </CardBody>
            </Card>
        </Col>
    </>
}
export default IpdTreatmentHistory