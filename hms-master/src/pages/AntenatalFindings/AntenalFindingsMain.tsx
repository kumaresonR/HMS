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

import PatientDetailsTable from "./PatientDetailsTable";
import PrimaryExamineTable from "./PrimaryExamineTable";
import AntenatalExamineTable from "./AntenatalExamineTable";
import AntenatalFindingAll from "./AntenatalFindingsAll";
import FormHeader from "../../common/FormHeader/FormHeader";

const AntenatalFindingsMain = () => {
    const [activeArrowTab, setActiveArrowTab] = useState(1); // Set default to "All"
    const [passedArrowSteps, setPassedArrowSteps] = useState([1]);

    function toggleArrowTab(tab: any) {
        if (activeArrowTab !== tab) {
            var modifiedSteps = [...passedArrowSteps, tab];
            setActiveArrowTab(tab);
            setPassedArrowSteps(modifiedSteps);
        }
    }

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Antenatal Finding" pageTitle="Antenatal Finding" />
                    <Row className="d-flex justify-content-center">

                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Antenatal Finding</h4>
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
                                                        className={classnames({
                                                            active: activeArrowTab === 1,
                                                            done: activeArrowTab <= 4 && activeArrowTab > 0,
                                                        })}
                                                        onClick={() => toggleArrowTab(1)}
                                                    >
                                                        All
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({
                                                            active: activeArrowTab === 2,
                                                            done: activeArrowTab <= 4 && activeArrowTab > 1,
                                                        })}
                                                        onClick={() => toggleArrowTab(2)}
                                                    >
                                                        Patient Details
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({
                                                            active: activeArrowTab === 3,
                                                            done: activeArrowTab <= 4 && activeArrowTab > 2,
                                                        })}
                                                        onClick={() => toggleArrowTab(3)}
                                                    >
                                                        Primary Examine
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({
                                                            active: activeArrowTab === 4,
                                                            done: activeArrowTab <= 4 && activeArrowTab > 3,
                                                        })}
                                                        onClick={() => toggleArrowTab(4)}
                                                    >
                                                        Antenatal Examine
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeArrowTab}>
                                            <TabPane tabId={1}>
                                                <div>
                                                 <AntenatalFindingAll/>
                                                </div>
                                            </TabPane>

                                            <TabPane tabId={2}>
                                                <div>
                                                    <PatientDetailsTable />
                                                </div>
                                            </TabPane>

                                            <TabPane tabId={3}>
                                                <div>
                                                    <PrimaryExamineTable />
                                                </div>
                                            </TabPane>

                                            <TabPane tabId={4}>
                                                <div>
                                                    <AntenatalExamineTable />
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

export default AntenatalFindingsMain;
