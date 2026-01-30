import React, { useState } from "react";

import {
    Card,
    CardBody,
    Col,
    Container,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from "reactstrap";
import classnames from "classnames";

import LeaveTypeList from './LeaveTypeList';
import DepartmentList from './DepartmentList';
import DesignationList from './DesignationList';
import SpecialistList from './SpecialistList';
import FormHeader from "../../../common/FormHeader/FormHeader";
import ScopeList from "./ScopeList";
import Role from "./Role";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";

const HumanResourcemain = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [activeVerticalTab, setActiveVerticalTab] = useState(1);
    const [passedVerticalSteps, setPassedVerticalSteps] = useState([1]);

    function toggleVerticalTab(tab: any) {
        if (activeVerticalTab !== tab) {
            const modifiedSteps = [...passedVerticalSteps, tab];
            setActiveVerticalTab(tab);
            setPassedVerticalSteps(modifiedSteps);
        }
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Form submitted!");
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Setup"
                        pageTitle="Human Resource Main"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Human Resource Main",
                        }))} />

                    <Col xl={12}>
                        <form className="vertical-navs-step form-steps" onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={3}>
                                    <Card>
                                        <CardBody>
                                            <Nav className="flex-column custom-nav nav-pills">
                                                {[
                                                    { id: 1, label: "Scope" },
                                                    { id: 2, label: "Role" },
                                                    { id: 3, label: "Leave Type" },
                                                    { id: 4, label: "Department" },
                                                    { id: 5, label: "Designation" },
                                                    { id: 6, label: "Specialist" },
                                                ].map((tab) => (
                                                    <NavItem key={tab.id}>
                                                        <NavLink
                                                            href="#"
                                                            className={classnames({
                                                                active: activeVerticalTab === tab.id,
                                                            })}
                                                            onClick={() => toggleVerticalTab(tab.id)}
                                                        >
                                                            {tab.label}
                                                        </NavLink>
                                                    </NavItem>
                                                ))}
                                            </Nav>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xl={9}>
                                    <div className="">
                                        <TabContent activeTab={activeVerticalTab}>
                                            <TabPane tabId={1}>
                                                <ScopeList />
                                            </TabPane>
                                            <TabPane tabId={2}>
                                                <Role />
                                            </TabPane>
                                            <TabPane tabId={3}>
                                                <LeaveTypeList />
                                            </TabPane>
                                            <TabPane tabId={4}>
                                                <DepartmentList />
                                            </TabPane>
                                            <TabPane tabId={5}>
                                                <DesignationList />
                                            </TabPane>
                                            <TabPane tabId={6}>
                                                <SpecialistList />
                                            </TabPane>
                                        </TabContent>
                                    </div>
                                </Col>
                            </Row>
                        </form>
                    </Col>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default HumanResourcemain;
