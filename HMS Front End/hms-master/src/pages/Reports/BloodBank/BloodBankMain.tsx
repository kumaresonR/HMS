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
 
import BloodIssueReport from './BloodIssueReport';

import ComponentIssueReport from './ComponentIssueReport';
import BloodDonorReport from './BloodDonorReport';
import FormHeader from "../../../common/FormHeader/FormHeader";

const BloodBankMain = () => {
    const [activeArrowTab, setActiveArrowTab] = useState(1);
    const [passedArrowSteps, setPassedArrowSteps] = useState([1]);

    function toggleArrowTab(tab: number) {
        if (activeArrowTab !== tab) {
            const modifiedSteps = [...passedArrowSteps, tab];

            if (tab >= 1 && tab <= 3) {
                setActiveArrowTab(tab);
                setPassedArrowSteps(modifiedSteps);
            }
        }
    }
    
    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Blood Bank Reports" pageTitle="Reports" />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Blood Bank Reports</h4>
                                </CardHeader>
                                <CardBody>
                                    <Form className="form-steps">
                                        <div className="step-arrow-nav mb-4">
                                            <Nav
                                                className="nav-pills custom-nav nav-justified"
                                                role="tablist">
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-blood-issue-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 1,
                                                            done: activeArrowTab > 1,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(1);
                                                        }}
                                                    >
                                                        Blood Issue Report
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-component-issue-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 2,
                                                            done: activeArrowTab > 2,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(2);
                                                        }}
                                                    >
                                                        Component Issue Report
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-blood-donor-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 3,
                                                            done: activeArrowTab > 3,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(3);
                                                        }}
                                                    >
                                                        Blood Donor Report
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeArrowTab}>
                                            <TabPane id="steparrow-blood-issue" tabId={1}>
                                                <BloodIssueReport />
                                            </TabPane>
                                            <TabPane id="steparrow-component-issue" tabId={2}>
                                                <ComponentIssueReport />
                                            </TabPane>
                                            <TabPane id="steparrow-blood-donor" tabId={3}>
                                                <BloodDonorReport />
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

export default BloodBankMain;
