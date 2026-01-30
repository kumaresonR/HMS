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

import SlotList from './Slots'; 
import DoctorShiftList from './DoctorShift'; 
import ShiftList from './ShiftList'; 
import AppointmentPriorityList from './AppointmentPriority'; 
import FormHeader from "../../../common/FormHeader/FormHeader";

const AppointmentMain = () => {
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
                    <FormHeader title="Setup" pageTitle="Appointment Setup" />

                    <Col xl={12}>
                        <form className="vertical-navs-step form-steps" onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={3}>
                                    <Card>
                                        <CardBody>
                                            <Nav className="flex-column custom-nav nav-pills">
                                                {[
                                                    { id: 1, label: "Slots" },
                                                    { id: 2, label: "Doctor Shift" },
                                                    { id: 3, label: "Shift" },
                                                    { id: 4, label: "Appointment Priority" },
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
                                                <SlotList />
                                            </TabPane>
                                            <TabPane tabId={2}>
                                                <DoctorShiftList />
                                            </TabPane>
                                            <TabPane tabId={3}>
                                                <ShiftList />
                                            </TabPane>
                                            <TabPane tabId={4}>
                                                <AppointmentPriorityList />
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

export default AppointmentMain;
