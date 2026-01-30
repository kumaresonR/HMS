import React, { useState, useRef } from "react";
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
import classnames from "classnames";

import IncomeReport from "./IncomeReport";
import ExpenseReport from "./ExpenseReport";
import FormHeader from "../../../common/FormHeader/FormHeader";
import ProfitAndLoss from "./ProfitAndLoss";
import { useNavigate } from "react-router-dom";
import MonthlyExpenceReport from "./MonthlyExpenceReport";
import MonthlyIncomeReport from "./MonthlyIncomeReport";
import MonthlyProfitAndLoss from "./MonthlyProfitAndLoss";
import { IoArrowBack } from "react-icons/io5";

const MonthlyReportMain = () => {
    const [activeArrowTab, setActiveArrowTab] = useState(1);
    const [passedArrowSteps, setPassedArrowSteps] = useState([1]);
    const navigate = useNavigate();

    const toggleArrowTab = (tab: any) => {
        if (activeArrowTab !== tab) {
            const modifiedSteps = [...passedArrowSteps, tab];
            if (tab >= 1 && tab <= 9) {
                setActiveArrowTab(tab);
                setPassedArrowSteps(modifiedSteps);
            }
        }
    };

    const scrollNav = (direction: "left" | "right") => {
        const scrollAmount = 100; // Amount to scroll
        const container = document.querySelector(".nav-pills.custom-nav") as HTMLDivElement;

        if (container) {
            if (direction === "left") {
                container.scrollLeft -= scrollAmount; 
            } else {
                container.scrollLeft += scrollAmount; 
            }
        }
    };

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Finance Reports" pageTitle="Reports" />
                <Row className="d-flex justify-content-center">
                    <Col xl={12} className="p-0">
                        <Card>
                            <CardHeader className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-title mb-0">Finance Reports </h4>
                                    <small className="text-primary mt-1 d-block">
                                        <strong>Note:</strong> Monthly data will be generated based on complete months.
                                    </small>
                                </div>

                                <div>
                                    <Button color="primary" onClick={() => navigate('/main/financeReport')}><IoArrowBack /> Back</Button>
                                </div>
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
                                                    Income Report
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
                                                    Expense Report
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
                                                    Profit&Loss Report
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </div>

                                    <TabContent activeTab={activeArrowTab}>
                                        <TabPane id="pharmacy-bill" tabId={1}>
                                            <div>
                                                <MonthlyIncomeReport />
                                            </div>
                                        </TabPane>

                                        <TabPane id="expiry-medicine" tabId={2}>
                                            <div>
                                                <MonthlyExpenceReport />
                                            </div>
                                        </TabPane>

                                        <TabPane id="expiry-medicine" tabId={3}>
                                            <div>
                                                <MonthlyProfitAndLoss />
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default MonthlyReportMain;