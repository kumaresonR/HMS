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
 
import PayrollReport from './PayrollReport';
import PayrollMonthReport from './PayrollMonthReport';
import StaffAttendanceReport from './StaffAttendanceReport';
import FormHeader from "../../../common/FormHeader/FormHeader";
import SalarySlipDataTable from "../../HumanResource/SalarySlipDataTable";
import LeaveSummaryDataTable from "../../HumanResource/LeaveSummaryDataTable";

const HumanResource = () => {

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
                    <FormHeader title="Human Resource Reports" pageTitle="Reports" />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Human Resource Reports</h4>
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
                                                        id="steparrow-gen-info-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 1,
                                                            done: activeArrowTab <= 3 && activeArrowTab > 1,
                                                        })}
                                                        onClick={() => toggleArrowTab(1)}
                                                    >
                                                        Payroll Report
                                                    </NavLink>
                                                </NavItem>
                                                {/* <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-gen-info-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 2,
                                                            done: activeArrowTab <= 3 && activeArrowTab > 2,
                                                        })}
                                                        onClick={() => toggleArrowTab(2)}
                                                    >
                                                        Payroll Month Report
                                                    </NavLink>
                                                </NavItem> */}
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-gen-info-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 3,
                                                            done: activeArrowTab <= 3 && activeArrowTab > 3,
                                                        })}
                                                        onClick={() => toggleArrowTab(3)}
                                                    >
                                                        Staff Attendance Report
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeArrowTab}>
                                            <TabPane id="steparrow-gen-info" tabId={1}>
                                                <SalarySlipDataTable />
                                            </TabPane>
                                            {/* <TabPane id="steparrow-gen-info" tabId={2}>
                                                <PayrollMonthReport />
                                            </TabPane> */}
                                            <TabPane id="steparrow-gen-info" tabId={3}>
                                                <LeaveSummaryDataTable />
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

export default HumanResource;
