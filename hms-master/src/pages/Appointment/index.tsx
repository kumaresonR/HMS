import React, { useState } from "react"
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Row } from "reactstrap"
import FormHeader from "../../common/FormHeader/FormHeader"
import AppointmentDataTable from "./AppointmentDataTable";
import { IoArrowBack } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const Appointment = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    let navigate: any = useNavigate();

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Appointment Datatable"
                    pageTitle="Appointment"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Appointment Datatable",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader >
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">View Appointment</h4>
                                    <Button onClick={() => navigate('/main/create-appointment')} color="light" className="ms-3 bg-gradient backBtn">
                                        <IoArrowBack />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <AppointmentDataTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}
export default Appointment