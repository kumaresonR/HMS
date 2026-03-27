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

import MedicineCategory from "./MedicineCategoryList";
import Supplier from "./SupplierList";
import MedicineDosage from "./MedicineDosageList";
import DoseInterval from "./DosageIntervalList";
import DoseDuration from "./DosageDurationList";
import Unit from "./UnitList";
import Company from "./CompanyList";
import MedicineGroup from "./MedicineGroupList";
import FormHeader from "../../../common/FormHeader/FormHeader";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";

const PharmacyMain = () => {
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
                        pageTitle="Pharmacy"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Pharmacy",
                        }))} />

                    <Col xl={12}>
                        <form className="vertical-navs-step form-steps" onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={3}>
                                    <Card>
                                        <CardBody>
                                            <Nav className="flex-column custom-nav nav-pills">
                                                {[
                                                    { id: 1, label: "Medicine Category" },
                                                    { id: 2, label: "Supplier" },
                                                    { id: 3, label: "Medicine Dosage" },
                                                    { id: 4, label: "Dose Interval" },
                                                    { id: 5, label: "Dose Duration" },
                                                    { id: 6, label: "Unit" },
                                                    { id: 7, label: "Company" },
                                                    { id: 8, label: "Medicine Group" },
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
                                    <div>
                                        <TabContent activeTab={activeVerticalTab}>
                                            <TabPane tabId={1}>
                                                <MedicineCategory />
                                            </TabPane>
                                            <TabPane tabId={2}>
                                                <Supplier />
                                            </TabPane>
                                            <TabPane tabId={3}>
                                                <MedicineDosage />
                                            </TabPane>
                                            <TabPane tabId={4}>
                                                <DoseInterval />
                                            </TabPane>
                                            <TabPane tabId={5}>
                                                <DoseDuration />
                                            </TabPane>
                                            <TabPane tabId={6}>
                                                <Unit />
                                            </TabPane>
                                            <TabPane tabId={7}>
                                                <Company />
                                            </TabPane>
                                            <TabPane tabId={8}>
                                                <MedicineGroup />
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

export default PharmacyMain;
