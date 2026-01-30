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
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Icons for navigation

import AdditionalIncomeReport from "./AdditionalIncomeReport";
import AdditionalExpenseReport from "./AdditionalExpenseReport";

import FormHeader from "../../../common/FormHeader/FormHeader";
// import ProfitAndLoss from "./ProfitAndLoss";
import { useNavigate } from "react-router-dom";

const AdditionalFinanceMain = () => {
    const [activeArrowTab, setActiveArrowTab] = useState(1);
    const [passedArrowSteps, setPassedArrowSteps] = useState([1]);
    const navRef = useRef(null); // Ref to access the Nav container
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
                container.scrollLeft -= scrollAmount; // Scroll left
            } else {
                container.scrollLeft += scrollAmount; // Scroll right
            }
        }
    };


    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Additional Finance Reports" pageTitle="Reports" />
                <Row className="d-flex justify-content-center">
                    <Col xl={12} className="p-0">
                        <Card>
                            <CardHeader className="d-flex justify-content-between">
                                <h4 className="card-title mb-0">Additional Finance Reports </h4>
                                {/* <div>
                                    <Button onClick={() => navigate('/main/monthlyReport')}>Monthly Report</Button>
                                </div> */}
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
                                                    id="additional-income-tab"
                                                    className={classnames({
                                                        active: activeArrowTab === 1,
                                                        done: activeArrowTab > 1,
                                                    })}
                                                    onClick={() => {
                                                        toggleArrowTab(1);
                                                    }}
                                                >
                                                    Additional Income Report
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    id="additional-expense-tab"
                                                    className={classnames({
                                                        active: activeArrowTab === 2,
                                                        done: activeArrowTab > 2,
                                                    })}
                                                    onClick={() => {
                                                        toggleArrowTab(2);
                                                    }}
                                                >
                                                    Additional Expense Report
                                                </NavLink>
                                            </NavItem>
                                            {/* <NavItem>
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
                                            </NavItem> */}
                                        </Nav>
                                    </div>

                                    <TabContent activeTab={activeArrowTab}>
                                        <TabPane id="additional-income" tabId={1}>
                                            <div>
                                                <AdditionalIncomeReport />
                                            </div>
                                        </TabPane>

                                        <TabPane id="additional-expense" tabId={2}>
                                            <div>
                                                <AdditionalExpenseReport />
                                            </div>
                                        </TabPane>

                                        {/* <TabPane id="expiry-medicine" tabId={3}>
                                            <div>
                                                <ProfitAndLoss />
                                            </div>
                                        </TabPane> */}
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

export default AdditionalFinanceMain;
