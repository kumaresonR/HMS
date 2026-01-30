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
} from "reactstrap"
import 'react-toastify/dist/ReactToastify.css';
import classnames from "classnames";

import OPDReportTable from "./OPDReportTable";
import '../reportStyle.css'
import FormHeader from "../../../common/FormHeader/FormHeader";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import OPDBalanceTable from "./OpdBalanceTable";
import OPDDischargedPatientTable from "./OPDReportTable";
import OPDChargesReport from "./OPDChargesReport";
import OPDPaymentReport from "./OPDPaymentReport";

const OPDMain = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const [activeArrowTab, setactiveArrowTab] = useState(4);
    const [passedarrowSteps, setPassedarrowSteps] = useState([1]);
    function toggleArrowTab(tab: any) {
        if (activeArrowTab !== tab) {
            var modifiedSteps = [...passedarrowSteps, tab];

            if (tab >= 4 && tab <= 7) {
                setactiveArrowTab(tab);
                setPassedarrowSteps(modifiedSteps);
            }
        }
    }

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="OPD"
                        pageTitle="Reports"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "OPD Report",
                        }))} />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">OPDs </h4>
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
                                                        id="steparrow-gen-info-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 4,
                                                            done: activeArrowTab <= 6 && activeArrowTab > 3,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(4);
                                                        }}
                                                    >
                                                        OPD Report
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-gen-info-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 5,
                                                            done: activeArrowTab <= 6 && activeArrowTab > 4,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(5);
                                                        }}
                                                    >
                                                        OPD Charges
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-gen-info-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 6,
                                                            done: activeArrowTab <= 6 && activeArrowTab > 5,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(6);
                                                        }}
                                                    >
                                                        OPD Payments
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeArrowTab}>
                                            <TabPane id="steparrow-gen-info" tabId={4}>
                                                <div>
                                                    <OPDReportTable />
                                                </div>
                                            </TabPane>

                                            <TabPane id="steparrow-description-info" tabId={5}>
                                                <div>
                                                    <OPDChargesReport />
                                                </div>
                                            </TabPane>

                                            <TabPane id="pills-experience" tabId={6}>
                                                <div>
                                                    <OPDPaymentReport />
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

export default OPDMain;
