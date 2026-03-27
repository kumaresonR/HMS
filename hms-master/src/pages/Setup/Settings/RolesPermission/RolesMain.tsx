import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    CardBody,
} from "reactstrap";
import TableContainer from "../../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import AddRole from './AddRole'
import RoleList from './RoleList'


const RolesMain = () => {


    return (
        <React.Fragment>
            <div >


                <Container fluid>
                    <Card>
                        <CardHeader>
                            <h5 className="mb-0">Email Setting</h5>
                        </CardHeader>
                        <CardBody>

                            <Row>
                                <Col lg={4}>
                                    <AddRole />
                                </Col>
                                <Col lg={8}>
                                    <RoleList />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default RolesMain;
