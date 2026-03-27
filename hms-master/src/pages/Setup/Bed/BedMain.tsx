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

import BedStatus from './BedStatus'
import BedList from './BedList'
import BedTypeList from './BedTypeList'
import BedGroupList from './BedGroupList'
import Floor from './FloorList'
import FormHeader from "../../../common/FormHeader/FormHeader";
import RoleBasedComponent from "../../../common/RolePermission/RoleBasedComponent";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const BedMain = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [activeVerticalTab, setactiveVerticalTab] = useState(1);
    const [passedverticalSteps, setPassedverticalSteps] = useState([1]);

    function toggleVerticalTab(tab: any) {
        if (activeVerticalTab !== tab) {
            const modifiedSteps = [...passedverticalSteps, tab];
            setactiveVerticalTab(tab);
            setPassedverticalSteps(modifiedSteps);
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
                        pageTitle="Bed"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Bed",
                        }))} />

                    <Col xl={12}>
                        <form className="vertical-navs-step form-steps" onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={3}>
                                    <Card>
                                        <CardBody>
                                            <Nav className="flex-column custom-nav nav-pills">
                                                {[
                                                    { id: 1, label: "Bed Status" },
                                                    { id: 2, label: "Bed" },
                                                    { id: 3, label: "Bed Type" },
                                                    { id: 4, label: "Bed Group " },
                                                    { id: 5, label: "Floor" },

                                                ].map((tab) => (
                                                    <NavItem key={tab.id}>
                                                        <NavLink
                                                            href="#"
                                                            className={classnames({
                                                                active: activeVerticalTab === tab.id
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
                                                <BedStatus />

                                            </TabPane>
                                            <TabPane tabId={2}>
                                                <BedList />
                                            </TabPane>
                                            <RoleBasedComponent allowedRoles={["ADMIN", "SUPERADMIN"]}>
                                                <TabPane tabId={3}>
                                                    <BedTypeList />
                                                </TabPane>
                                                <TabPane tabId={4}>
                                                    <BedGroupList />
                                                </TabPane>
                                                <TabPane tabId={5}>
                                                    <Floor />
                                                </TabPane>
                                            </RoleBasedComponent>
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

export default BedMain;
