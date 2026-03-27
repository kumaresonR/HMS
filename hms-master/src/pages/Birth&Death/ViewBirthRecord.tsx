import React from 'react'
import { Button, Col, Container, Row } from 'reactstrap'
import moment from 'moment';
import PrintComponent from '../../Components/Common/PrintComponent';

const ViewBirthRecord = (props: any) => {
    const openPDF = () => {
        const pdfWindow: any = window.open();
        pdfWindow.document.write(
            `<iframe width='100%' height='100%' src='data:application/pdf;base64,${props.data.documentPhoto}'></iframe>`
        );
    };
    return (
        <Container>
            <div className='text-end'>
                <PrintComponent contentId="birth" />
            </div>
            <div id="birth">
                <Row>
                    <Col>
                        <Row className="my-2">
                            <Col>Birth Record Id : </Col>
                            <Col>{props.data.birthRecordId}</Col>
                        </Row>
                        <Row className="my-2">
                            <Col>Mother Name : </Col>
                            <Col>{props.data.motherName}
                            </Col>
                        </Row>
                        <Row className="my-2">
                            <Col>Child Name : </Col>
                            <Col>
                                {props.data.childName}
                            </Col>
                        </Row>
                        <Row className="my-2">
                            <Col>Gender : </Col>
                            <Col>{props.data.gender}</Col>
                        </Row>
                        <Row className="my-2">
                            <Col>Phone : </Col>
                            <Col>{props.data.phone}</Col>
                        </Row>
                        {props.data.motherPhoto && (
                            <Row className="my-2 hide-print">
                                <Col>Mother Id Proof</Col>
                                <Col sm={12}>
                                    <div>
                                        <img height={150}
                                            src={`data:image;base64,${props.data.motherPhoto}`}
                                            alt="Mother"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        )}
                        {props.data.childPhoto && (
                            <Row className="my-2 hide-print">
                                <Col sm={12}>Child Photo</Col>
                                <Col>
                                    <div>
                                        <img height={150}
                                            src={`data:image;base64,${props.data.childPhoto}`}
                                            alt="childPhoto"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Col>
                    <Col>
                        <Row className="my-2">
                            <Col>Ipd/Opd Id : </Col>
                            <Col>{props.data.ipdOrOpdId}</Col>
                        </Row>

                        <Row className="my-2">
                            <Col>Father Name :</Col>
                            <Col>
                                {props.data.fatherName}
                            </Col>
                        </Row>
                        <Row className="my-2">
                            <Col>DOB : </Col>
                            <Col>{moment(props.data.dateOfBirth).format('DD/MM/YYYY, h:mm A')}</Col>
                        </Row>
                        <Row className="my-2">
                            <Col>Weight : </Col>
                            <Col>{props.data.weight}</Col>
                        </Row>
                        <Row className="my-2">
                            <Col>Report : </Col>
                            <Col>{props.data.report}</Col>
                        </Row>
                        {props.data.fatherPhoto && (
                            <Row className="my-2 hide-print">
                                <Col sm={12}>Father Id Proof</Col>
                                <Col>
                                    <div>
                                        <img height={150}
                                            src={`data:image;base64,${props.data.fatherPhoto}`}
                                            alt="fatherPhoto"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        )}
                        {props.data.documentPhoto && (
                            <Row className='my-2 hide-print'>
                                <Col sm={6}>Other Document</Col>
                                <Col>
                                    <Button onClick={openPDF}>View Document</Button>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            </div>
        </Container>
    )
}

export default ViewBirthRecord