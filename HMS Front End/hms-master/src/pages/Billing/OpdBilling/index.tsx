import React from "react"
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap"
import PatientViewDataTable from "../../OPD/OutPatient/PatientViewDataTable"
import FormHeader from "../../../common/FormHeader/FormHeader"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { useDispatch } from "react-redux"
import { minimizePage } from "../../../slices/pageResizer/uiSlice"

const OpdBilling = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    return <>
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="OPD Billing"
                    pageTitle="Billing"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "OPD Billing",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex flex-wrap justify-content-between">
                                <h4 className="card-title mb-0">OPD Billing</h4>
                                <Link to="/main/billing" className="ms-3">
                                    <Button color="light" className="bg-gradient backBtn">
                                        <IoArrowBack />
                                    </Button>
                                </Link>

                            </CardHeader>

                            <PatientViewDataTable title="Billing" />

                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    </>
}
export default OpdBilling