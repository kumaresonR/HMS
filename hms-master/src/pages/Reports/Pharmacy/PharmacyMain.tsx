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

import PharmacyBillReport from './PharmacyBillReport';
import ExpiryMedicineReport from './ExpiryMedicineReport';
import FormHeader from "../../../common/FormHeader/FormHeader";
import MedicineStockReport from "./MedicineStockReport";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const PharmacyMain = () => {
    const dispatch = useDispatch();
    const location = useLocation();
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
                    <FormHeader title="Pharmacy Reports"
                        pageTitle="Reports"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Pharmacy Reports",
                        }))} />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Pharmacy Reports</h4>
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
                                                        id="pharmacy-bill-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 1,
                                                            done: activeArrowTab > 1,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(1);
                                                        }}
                                                    >
                                                        Pharmacy Bill Report
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="expiry-medicine-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 2,
                                                            done: activeArrowTab > 2,
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(2);
                                                        }}
                                                    >
                                                        Expiry Medicine Report
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="expiry-medicine-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 3,
                                                            done: activeArrowTab > 3
                                                        })}
                                                        onClick={() => {
                                                            toggleArrowTab(3);
                                                        }}
                                                    >
                                                        Medicine Stock Report
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeArrowTab}>
                                            <TabPane id="pharmacy-bill" tabId={1}>
                                                <div>
                                                    <PharmacyBillReport />
                                                </div>
                                            </TabPane>
                                            <TabPane id="expiry-medicine" tabId={2}>
                                                <div>
                                                    <ExpiryMedicineReport />
                                                </div>
                                            </TabPane>
                                            <TabPane id="expiry-medicine" tabId={3}>
                                                <div>
                                                    <MedicineStockReport />
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

export default PharmacyMain;
