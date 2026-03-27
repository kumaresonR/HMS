import moment from "moment";
import { useState } from "react";
import { Button, Col, Container, Row, Table } from "reactstrap";
import DicomViewer from "../../../../Radiology/DicomViewer";

const PreviewLabInvestigation = (props: any) => {
    // const [data, setData] = useState(props.data);
    // const patientData = props.patientData;
    const openPDF = () => {
        const pdfWindow: any = window.open();
        pdfWindow.document.write(
            `<iframe width='100%' height='100%' src='data:application/pdf;base64,${props?.data?.uploadReport}'></iframe>`
        );
    };
    return <>
        <Container fluid>
            <Row>
                <Col xs={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Bill No </label></Col>
                        <Col xs={6}>{props?.data?.billId || 'NA'}</Col>
                    </Row>
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Patient</label></Col>
                        <Col xs={6}>{props?.patientData?.patient?.firstName} </Col>
                    </Row>
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Approve Date	</label></Col>
                        <Col xs={6}>{props?.data?.approvedDate ? moment(props?.data?.approvedDate).format('DD/MM/YYYY') : 'NA'}</Col>
                    </Row>
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">	Report Collection Date</label></Col>
                        <Col xs={6}>{props?.data?.collectedDate ? moment(props?.data?.collectedDate).format('DD/MM/YYYY') : 'NA'}</Col>
                    </Row>
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Test Name</label></Col>
                        <Col xs={6}>{props?.data?.testName}</Col>
                    </Row>
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Expected Date</label></Col>
                        <Col xs={6}>{props?.data?.reportDate ? moment(props?.data?.reportDate).format('DD/MM/YYYY hh:mm A') : 'Pending'}</Col>
                    </Row>
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Collection By</label> </Col>
                        <Col xs={6}>{props?.data?.sampleCollected || 'NA'}</Col>
                    </Row>
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">{props?.data?.type} Center </label></Col>
                        <Col xs={6}>{props?.data?.pathologyCenter || props?.data?.radiologyCenter || 'NA'}</Col>
                    </Row>
                </Col>

                {/* <Col xs={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Case ID</label></Col>
                        <Col xs={6}>{props?.patientData?.admissions?.caseId}</Col>
                    </Row>
                </Col> */}
                <Col xs={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Approved By	</label></Col>
                        <Col xs={6}>{props?.data?.approvedBy || 'NA'}</Col>
                    </Row>
                </Col>
            </Row>
            <Row className="my-3">
                <Col className="text-center">
                    <h4>{props?.data?.testName}</h4>
                </Col>
            </Row>

            <Row>
                <Col>
                    <div className="table-responsive">
                        <Table hover className="table-centered align-middle  mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Test Parameter Name</th>
                                    <th>Report Value</th>
                                    <th>Reference Range</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props?.data?.testParameters?.map((item: any, idx: any) => (
                                    <tr>
                                        <td>  {idx + 1}</td>
                                        <td>
                                            <span>
                                                <h6>{item.parameterName}</h6>
                                                {/* <b>Description: </b> {item.designation  || 'NA'} */}
                                            </span>
                                        </td>
                                        <td>{item.reportValue || 'NA'}</td>
                                        <td>{item.normalRange}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
            <Row className="hide-print">
                {props?.data?.type === "Radiology" && props?.data?.uploadReport && (
                    <>
                        <h3>Document Preview:</h3>
                        <DicomViewer img={props?.data?.uploadReport} />
                    </>
                )}
                {props?.data?.type === "Pathology" && props?.data?.uploadReport && (
                    <Row className='my-2 hide-print'>
                        <Col sm={6}>Document Preview:</Col>
                        <Col>
                            <Button onClick={openPDF}>View Document</Button>
                        </Col>
                    </Row>
                )}
            </Row>
        </Container >
    </>
}
export default PreviewLabInvestigation