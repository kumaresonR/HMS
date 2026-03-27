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
 
import UserLog from './UserLog'; // Import the new components for each log tab
import EmailSmsLog from './EmailOrSMSLog';
import AuditTrailReportList from './AuditTrailReportList';
import FormHeader from "../../../common/FormHeader/FormHeader";

const LogMain = () => {

    const [activeArrowTab, setActiveArrowTab] = useState(1);
    const [passedArrowSteps, setPassedArrowSteps] = useState([1]);

    function toggleArrowTab(tab: any) {
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
                    <FormHeader title="Log Reports" pageTitle="Reports" />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Log Reports</h4>
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
                                                        id="steparrow-user-log-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 1,
                                                            done: activeArrowTab > 1,
                                                        })}
                                                        onClick={() => toggleArrowTab(1)}
                                                    >
                                                        User Log
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-email-sms-log-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 2,
                                                            done: activeArrowTab > 2,
                                                        })}
                                                        onClick={() => toggleArrowTab(2)}
                                                    >
                                                        Email / Sms Log
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-audit-trail-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 3,
                                                        })}
                                                        onClick={() => toggleArrowTab(3)}
                                                    >
                                                        Audit Trail Report List
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeArrowTab}>
                                            <TabPane id="steparrow-user-log" tabId={1}>
                                                <UserLog />
                                            </TabPane>
                                            <TabPane id="steparrow-email-sms-log" tabId={2}>
                                                <EmailSmsLog />
                                            </TabPane>
                                            <TabPane id="steparrow-audit-trail" tabId={3}>
                                                <AuditTrailReportList />
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

export default LogMain;
