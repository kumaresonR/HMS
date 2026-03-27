import React from "react";
import {
    Container,
    Row,
    Col,
} from "reactstrap";
import PatientDetailsTable from './PatientDetailsTable'
import AntenatalExamineTable from './AntenatalExamineTable'
const AntenatalFindingAll: React.FC = () => {
    return (
        <Container fluid>
            <Row>
                <Col lg={12}>
                    <AntenatalExamineTable />
                    <AntenatalExamineTable />
                    <PatientDetailsTable />
                </Col>
            </Row>
        </Container>
    );
};

export default AntenatalFindingAll;
