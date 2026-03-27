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

import IPDReport from './IPDReport';
import FormHeader from "../../../common/FormHeader/FormHeader";
import { useDispatch, } from "react-redux";
import { useLocation } from "react-router-dom";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import IPDPaymentReport from "./IPDPaymentReport";
import IpdChargesReport from "./IpdChargesReport";

const IPDMain = () => {
    const dispatch = useDispatch();
    const location = useLocation();
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
                    <FormHeader title="IPD Reports"
                        pageTitle="Reports"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "IPD Reports",
                        }))} />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">IPD Reports</h4>
                                </CardHeader>
                                <CardBody>
                                    <Form className="form-steps">
                                        <div className="step-arrow-nav mb-4">
                                            <Nav
                                                className="nav-pills custom-nav nav-justified"
                                                role="tablist">
                                                <NavItem className="col-4">
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({
                                                            active: activeArrowTab === 1,
                                                            done: activeArrowTab <= 3 && activeArrowTab > 1,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(1);
                                                        }}
                                                    >
                                                        IPD Report
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({
                                                            active: activeArrowTab === 2,
                                                            done: activeArrowTab <= 3 && activeArrowTab > 2,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(2);
                                                        }}
                                                    >
                                                        IPD Charges
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        className={classnames({
                                                            active: activeArrowTab === 3,
                                                            done: activeArrowTab <= 3 && activeArrowTab > 3,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(3);
                                                        }}
                                                    >
                                                        IPD Payments
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeArrowTab}>
                                            <TabPane tabId={1}>
                                                <div>
                                                    <IPDReport />
                                                </div>
                                            </TabPane>
                                            <TabPane tabId={2}>
                                                <div>
                                                    <IpdChargesReport />
                                                </div>
                                            </TabPane>
                                            <TabPane tabId={3}>
                                                <div>
                                                    <IPDPaymentReport />
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

export default IPDMain;
