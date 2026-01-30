import React, { useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';
import classnames from "classnames";

import PathologyPatientReport from './PathologyPatientReport';
import FormHeader from "../../../common/FormHeader/FormHeader";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";

const PathologyMain = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const [activeArrowTab, setActiveArrowTab] = useState(1);
    const [passedArrowSteps, setPassedArrowSteps] = useState([1]);

    function toggleArrowTab(tab: number) {
        if (activeArrowTab !== tab) {
            const modifiedSteps = [...passedArrowSteps, tab];

            if (tab >= 1 && tab <= 9) {
                setActiveArrowTab(tab);
                setPassedArrowSteps(modifiedSteps);
            }
        }
    }

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Pathology Reports"
                        pageTitle="Reports"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Pathology Reports",
                        }))} />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">Pathology Reports</h4>
                                    {/* <Button
                                        color="primary"
                                        onClick={() => navigate(-1)}
                                        className="btn btn-primary add-btn mx-2"
                                    >
                                        <IoArrowBack /> Back
                                    </Button> */}
                                </CardHeader>
                                <CardBody>
                                    <Form className="form-steps">
                                        <div className="step-arrow-nav mb-4">
                                            <Nav
                                                className="nav-pills custom-nav nav-justified w-50"
                                                role="tablist">
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-pathology-report-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 1,
                                                            done: activeArrowTab <= 2 && activeArrowTab > 1,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(1);
                                                        }}
                                                    >
                                                        Pathology Patient Report
                                                    </NavLink>
                                                </NavItem>

                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeArrowTab}>
                                            <TabPane id="steparrow-pathology-report" tabId={1}>
                                                <div>
                                                    <PathologyPatientReport />
                                                </div>
                                            </TabPane>
                                        </TabContent>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default PathologyMain;
