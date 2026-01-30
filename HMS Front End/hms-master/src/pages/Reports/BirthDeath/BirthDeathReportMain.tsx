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
 
import BirthReport from './BirthReport'; // Component for Birth Report
import DeathReport from './DeathReport'; // Component for Death Report
import FormHeader from "../../../common/FormHeader/FormHeader";

const BirthDeathReportMain = () => {
    const [activeArrowTab, setActiveArrowTab] = useState(1);
    const [passedArrowSteps, setPassedArrowSteps] = useState([1]);

    function toggleArrowTab(tab: any) {
        if (activeArrowTab !== tab) {
            const modifiedSteps = [...passedArrowSteps, tab];
            if (tab >= 1 && tab <= 2) { // Adjusted for only two tabs
                setActiveArrowTab(tab);
                setPassedArrowSteps(modifiedSteps);
            }
        }
    }

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Birth & Death Reports" pageTitle="Reports" />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Birth & Death Reports</h4>
                                </CardHeader>
                                <CardBody>
                                    <Form className="form-steps">
                                        <div className="step-arrow-nav mb-4">
                                            <Nav className="nav-pills custom-nav nav-justified" role="tablist">
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({
                                                            active: activeArrowTab === 1,
                                                            done: activeArrowTab <= 2 && activeArrowTab > 1,
                                                        })}
                                                        onClick={() => toggleArrowTab(1)}
                                                    >
                                                        Birth Report
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({
                                                            active: activeArrowTab === 2,
                                                            done: activeArrowTab <= 2 && activeArrowTab > 2,
                                                        })}
                                                        onClick={() => toggleArrowTab(2)}
                                                    >
                                                        Death Report
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeArrowTab}>
                                            <TabPane id="birth-report" tabId={1}>
                                                <div>
                                                    <BirthReport /> {/* Component to display Birth Report */}
                                                </div>
                                            </TabPane>
                                            <TabPane id="death-report" tabId={2}>
                                                <div>
                                                    <DeathReport /> {/* Component to display Death Report */}
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

export default BirthDeathReportMain;
