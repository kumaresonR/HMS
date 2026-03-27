import React, { useState } from "react";
import {
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
 
import PatientVisitReport from './PatientVisitReport'; // Import the new report component
import PatientLoginCredential from './PatientLoginCredential'; // Import the new login credential component
import FormHeader from "../../../common/FormHeader/FormHeader";

const PatientReportMain = () => {
    const [activeArrowTab, setActiveArrowTab] = useState(1);
    const [passedArrowSteps, setPassedArrowSteps] = useState([1]);

    function toggleArrowTab(tab: number) {
        if (activeArrowTab !== tab) {
            const modifiedSteps = [...passedArrowSteps, tab];

            if (tab >= 1 && tab <= 2) { 
                setActiveArrowTab(tab);
                setPassedArrowSteps(modifiedSteps);
            }
        }
    }

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Patient Reports" pageTitle="Reports" />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Patient Reports</h4>
                                </CardHeader>
                                <CardBody>
                                    <Form className="form-steps">
                                        <div className="step-arrow-nav mb-4">
                                            <Nav
                                                className="nav-pills custom-nav nav-justified"
                                                role="tablist"
                                            >
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-patient-visit-report-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 1,
                                                            done: activeArrowTab < 2 && activeArrowTab > 1,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(1);
                                                        }}
                                                    >
                                                        Patient Visit Report
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-patient-login-credential-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 2,
                                                            done: activeArrowTab < 2 && activeArrowTab > 2,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(2);
                                                        }}
                                                    >
                                                        Patient Login Credential
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeArrowTab}>
                                            <TabPane id="steparrow-patient-visit-report" tabId={1}>
                                                <div>
                                                    <PatientVisitReport />
                                                </div>
                                            </TabPane>
                                            <TabPane id="steparrow-patient-login-credential" tabId={2}>
                                                <div>
                                                    <PatientLoginCredential />
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

export default PatientReportMain;
