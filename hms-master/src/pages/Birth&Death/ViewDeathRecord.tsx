import moment from 'moment';
import React from 'react'
import { Button, Col, Container, Row } from 'reactstrap';
import PrintComponent from '../../Components/Common/PrintComponent';

const ViewDeathRecord = (props: any) => {
    const openPDF = () => {
        const pdfWindow: any = window.open();
        pdfWindow.document.write(
            `<iframe width='100%' height='100%' src='data:application/pdf;base64,${props.data.attachment}'></iframe>`
        );
    };
    return (
        <Container>
            <div className='text-end'>
                <PrintComponent contentId="death" />
            </div>
            <div id="death">
                <Row >
                    <Col>
                        <Row className="my-2">
                            <Col>Death Id : </Col>
                            <Col>{props.data.deathId}</Col>
                        </Row>
                        <Row className="my-2">
                            <Col>Patient Name : </Col>
                            <Col>{props.data.patientName}
                            </Col>
                        </Row>
                        <Row className="my-2">
                            <Col>Date Of Death : </Col>
                            <Col>{moment(props.data.dateOfDeath).format('DD/MM/YYYY, h:mm A')}</Col>
                        </Row>
                        {props.data.attachment && (
                            <Row className='my-2 hide-print'>
                                <Col sm={6}>Document</Col>
                                <Col>
                                    <Button onClick={openPDF}>View Document</Button>
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
                            <Col>Guardian Name :</Col>
                            <Col>
                                {props.data.guardianName}
                            </Col>
                        </Row>

                        <Row className="my-2">
                            <Col>Report : </Col>
                            <Col>{props.data.report}</Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </Container>
    )
}

export default ViewDeathRecord