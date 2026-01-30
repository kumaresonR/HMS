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

import ComplaintTypeList from './ComplaintTypeList'
import PurposeList from './PurposeList'
import SourceList from './SourceList'
import FormHeader from "../../../common/FormHeader/FormHeader";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";

const FrontOfficeMain = () => {
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
                        pageTitle="Front Office"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Front Office",
                        }))} />

                    <Col xl={12}>
                        <form className="vertical-navs-step form-steps" onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={3}>
                                    <Card>
                                        <CardBody>
                                            <Nav className="flex-column custom-nav nav-pills">
                                                {[
                                                    { id: 1, label: "Purpose" },
                                                    { id: 2, label: "ComplaintType" },
                                                    { id: 3, label: "Source" },

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
                                                <PurposeList />

                                            </TabPane>
                                            <TabPane tabId={2}>


                                                <ComplaintTypeList />
                                            </TabPane>
                                            <TabPane tabId={3}>
                                                <SourceList />
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

export default FrontOfficeMain;
