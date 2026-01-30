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

import RadiologyPatientReport from './RadiologyPatientReport';
import FormHeader from "../../../common/FormHeader/FormHeader";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";

const RadiologyMain = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(1);
    const [passedSteps, setPassedSteps] = useState([1]);

    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            const modifiedSteps = [...passedSteps, tab];

            if (tab >= 1 && tab <= 2) {
                setActiveTab(tab);
                setPassedSteps(modifiedSteps);
            }
        }
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader
                        title="Radiology Reports"
                        pageTitle="Reports"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Radiology Reports",
                        }))} />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Radiology Reports</h4>
                                </CardHeader>
                                <CardBody>
                                    <Form className="form-steps">
                                        <div className="step-arrow-nav mb-4">
                                            <Nav className="nav-pills custom-nav nav-justified w-50" role="tablist">
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-gen-info-tab"
                                                        className={classnames({
                                                            active: activeTab === 1,
                                                            done: activeTab > 1,
                                                        })}
                                                        onClick={() => toggleTab(1)}
                                                    >
                                                        Radiology Patient Report
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeTab}>
                                            <TabPane id="steparrow-gen-info" tabId={1}>
                                                <div>
                                                    <RadiologyPatientReport />
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

export default RadiologyMain;
