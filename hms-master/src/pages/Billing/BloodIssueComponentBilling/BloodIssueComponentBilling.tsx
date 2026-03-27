import React from "react"
import ComponentIssueDetailDataTable from "../../BloodBank/ComponentIssueDetails/ComponentIssueDetailDataTable"
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "reactstrap"
import FormHeader from "../../../common/FormHeader/FormHeader"
import { IoArrowBack } from "react-icons/io5"
import { Link, useLocation } from "react-router-dom"
import { minimizePage } from "../../../slices/pageResizer/uiSlice"
import { useDispatch } from "react-redux"

const BloodIssueComponentBilling = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="Blood Issue Component Billing"
                    pageTitle="Billing"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Blood Issue Component Billing",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex flex-wrap justify-content-between">
                                <h4 className="card-title mb-0">Blood Issue Component Billing</h4>
                                <Link to="/main/billing" className="ms-3">
                                    <Button color="light" className="bg-gradient backBtn">
                                        <IoArrowBack />
                                    </Button>
                                </Link>

                            </CardHeader>

                            <CardBody>
                                <ComponentIssueDetailDataTable title="Billing" />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>

    )
}

export default BloodIssueComponentBilling