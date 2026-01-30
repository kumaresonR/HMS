import React from "react"
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "reactstrap"
import { bloodIssueData } from "../../../common/data/FakeData"
import FormHeader from "../../../common/FormHeader/FormHeader"
import BloodIssueDataTable from "../../BloodBank/BloodIssueDataTable"
import { IoArrowBack } from "react-icons/io5"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { minimizePage } from "../../../slices/pageResizer/uiSlice"

const BloodIssueBilling = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    let navigate: any = useNavigate();

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="Blood Issue Billing"
                    pageTitle="Billing"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Blood Issue Billing",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>

                            <CardHeader className="border-0 align-items-center d-flex flex-wrap justify-content-between">
                                <h4 className="card-title mb-0">Blood Issue List</h4>
                                <Button color="light" onClick={() => navigate('/main/billing')} className="ms-3 bg-gradient backBtn">
                                    <IoArrowBack />
                                </Button>
                            </CardHeader>
                            <CardBody>
                                <BloodIssueDataTable data={bloodIssueData} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>

    )
}
export default BloodIssueBilling