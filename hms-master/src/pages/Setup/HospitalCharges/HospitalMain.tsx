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


import ChargeDetailsdList from './ChargeDetailsdList';
import ChargeCategoryList from './ChargeCategoryList';
import ChargeTypeList from './ChargeTypeList';
import TaxCategoryList from './TaxCategoryList';
import UnitTypeList from './UnitTypeList';
import FormHeader from "../../../common/FormHeader/FormHeader";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const HospitalMain = () => {
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
                        pageTitle="Hospital Charges"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Hospital Charges",
                        }))} />

                    <Col xl={12}>
                        <form className="vertical-navs-step form-steps" onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={3}>
                                    <Card>
                                        <CardBody>
                                            <Nav className="flex-column custom-nav nav-pills">
                                                {[
                                                    { id: 1, label: "Charges" },
                                                    { id: 2, label: "Charges Category" },
                                                    { id: 3, label: "Charges Type" },
                                                    { id: 4, label: "Tax Category " },
                                                    { id: 5, label: "Unit Type" },

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
                                                <ChargeDetailsdList />
                                            </TabPane>
                                            <TabPane tabId={2}>
                                                <ChargeCategoryList />
                                            </TabPane>
                                            <TabPane tabId={3}>
                                                <ChargeTypeList />
                                            </TabPane>
                                            <TabPane tabId={4}>
                                                <TaxCategoryList />
                                            </TabPane>
                                            <TabPane tabId={5}>
                                                <UnitTypeList />
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

export default HospitalMain;
