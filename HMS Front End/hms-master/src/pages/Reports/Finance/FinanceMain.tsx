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

import ReferralReport from "./ReferralReport";
import AllTransactionReport from "./AllTransactionReport";
import IncomeGroupReport from "./IncomeGroupReport";
import IncomeReport from "./IncomeReport";
import ExpenseReport from "./ExpenseReport";
import ExpenseGroupReport from "./ExpenseGroupReport";
import PatientBillReport from "./PatientBillReport";
import ProcessingTransactionReport from "./ProcessingTransactionReport";
import DailyTransactionReport from "./DailyTransactionReport";
import FormHeader from "../../../common/FormHeader/FormHeader";
import ProfitAndLoss from "./ProfitAndLoss";
import { useNavigate } from "react-router-dom";

const FinanceMain = () => {
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
                <FormHeader title="Finance Reports" pageTitle="Reports" />
                <Row className="d-flex justify-content-center">
                    <Col xl={12} className="p-0">
                        <Card>
                            <CardHeader className="d-flex justify-content-between">
                                <h4 className="card-title mb-0">Finance Reports </h4>
                                <div>
                                    <Button onClick={() => navigate('/main/monthlyReport')}>Monthly Report</Button>
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
                                                <IncomeReport />
                                            </div>
                                        </TabPane>

                                        <TabPane id="expiry-medicine" tabId={2}>
                                            <div>
                                                <ExpenseReport />
                                            </div>
                                        </TabPane>

                                        <TabPane id="expiry-medicine" tabId={3}>
                                            <div>
                                                <ProfitAndLoss />
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {/* <Row className="d-flex justify-content-center">
                    <Col xl={12} className="p-0">
                        <Card>
                            <CardHeader>
                                <h4 className="card-title mb-0">Finance Reports</h4>
                            </CardHeader>
                            <CardBody>
                                <Form className="form-steps">
                                    <div className="step-arrow-nav mb-4 d-flex align-items-center">

                                        <button
                                            type="button"
                                            className="btn btn-light me-2"
                                            onClick={() => scrollNav("left")}
                                            style={{ zIndex: 10, color: "#9facd6" }}
                                        >
                                            <FaChevronLeft />
                                        </button>

                                        <Nav
                                            innerRef={navRef}
                                            className="nav-pills custom-nav nav-justified flex-nowrap"
                                            role="tablist"
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflowX: "hidden",
                                                display: "flex",
                                                position: "relative",
                                            }}
                                        >
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeArrowTab === 1,
                                                    })}
                                                    onClick={() => toggleArrowTab(1)}
                                                >
                                                    Daily Transaction Report
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeArrowTab === 2,
                                                    })}
                                                    onClick={() => toggleArrowTab(2)}
                                                >
                                                    All Transaction Report
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeArrowTab === 3,
                                                    })}
                                                    onClick={() => toggleArrowTab(3)}
                                                >
                                                    Income Report
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeArrowTab === 4,
                                                    })}
                                                    onClick={() => toggleArrowTab(4)}
                                                >
                                                    Income Group Report
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeArrowTab === 5,
                                                    })}
                                                    onClick={() => toggleArrowTab(5)}
                                                >
                                                    Expense Report
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeArrowTab === 6,
                                                    })}
                                                    onClick={() => toggleArrowTab(6)}
                                                >
                                                    Expense Group Report
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeArrowTab === 7,
                                                    })}
                                                    onClick={() => toggleArrowTab(7)}
                                                >
                                                    Patient Bill Report
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeArrowTab === 8,
                                                    })}
                                                    onClick={() => toggleArrowTab(8)}
                                                >
                                                    Referral Report
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeArrowTab === 9,
                                                    })}
                                                    onClick={() => toggleArrowTab(9)}
                                                >
                                                    Processing Transaction Report
                                                </NavLink>
                                            </NavItem>
                                        </Nav>

                                        <button
                                            type="button"
                                            className="btn btn-light ms-2"
                                            onClick={() => scrollNav("right")}
                                                style={{ zIndex: 10, color: "#9facd6" }}
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </div>

                                    <TabContent activeTab={activeArrowTab}>
                                        <TabPane tabId={1}>
                                            <DailyTransactionReport />
                                        </TabPane>
                                        <TabPane tabId={2}>
                                            <AllTransactionReport />
                                        </TabPane>
                                        <TabPane tabId={3}>
                                            <IncomeReport />
                                        </TabPane>
                                        <TabPane tabId={4}>
                                            <IncomeGroupReport />
                                        </TabPane>
                                        <TabPane tabId={5}>
                                            <ExpenseReport />
                                        </TabPane>
                                        <TabPane tabId={6}>
                                            <ExpenseGroupReport />
                                        </TabPane>
                                        <TabPane tabId={7}>
                                            <PatientBillReport />
                                        </TabPane>
                                        <TabPane tabId={8}>
                                            <ReferralReport />
                                        </TabPane>
                                        <TabPane tabId={9}>
                                            <ProcessingTransactionReport />
                                        </TabPane>
                                    </TabContent>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row> */}
            </Container>
        </React.Fragment>
    );
};

export default FinanceMain;
