import { Button, Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap"
import AppointmentDataTable from "../../Appointment/AppointmentDataTable"
import React from "react"
import FormHeader from "../../../common/FormHeader/FormHeader"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { useDispatch } from "react-redux"
import { minimizePage } from "../../../slices/pageResizer/uiSlice"

const AppointmentBilling = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    let navigate: any = useNavigate();

    return <>
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="Appointment Billing"
                    pageTitle="Billing"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Appointment Billing",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex flex-wrap justify-content-between">
                                <h4 className="card-title mb-0">Appointment Billing</h4>
                                <Button color="light" onClick={() => navigate('/main/billing')} className="ms-3 bg-gradient backBtn">
                                    <IoArrowBack />
                                </Button>
                            </CardHeader>

                            <CardBody>
                                <AppointmentDataTable title="Billing" />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    </>
}
export default AppointmentBilling