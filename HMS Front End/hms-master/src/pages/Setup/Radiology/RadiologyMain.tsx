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

import RadiologyParameterList from './RadiologyParameterList';
import RadiologyCategoryList from './RadiologyCategoryList';
import UnitList from './Units';
import FormHeader from "../../../common/FormHeader/FormHeader";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const RadiologyMain = () => {
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
                        pageTitle="Radiology"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Radiology",
                        }))} />

                    <Col xl={12}>
                        <form className="vertical-navs-step form-steps" onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={3}>
                                    <Card>
                                        <CardBody>
                                            <Nav className="flex-column custom-nav nav-pills">
                                                {[
                                                    { id: 1, label: "Radiology Category" },
                                                    { id: 2, label: "Unit" },
                                                    { id: 3, label: "Radiology Parameter" },
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
                                                <RadiologyCategoryList />
                                            </TabPane>
                                            <TabPane tabId={2}>
                                                <UnitList />
                                            </TabPane>
                                            <TabPane tabId={3}>
                                                <RadiologyParameterList />
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

export default RadiologyMain;
