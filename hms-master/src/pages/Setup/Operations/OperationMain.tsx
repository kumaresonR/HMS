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
import OperationList from './OperationList'
import OperationCategoryList from './OperationCategoryList'
import FormHeader from "../../../common/FormHeader/FormHeader";

const OperationMain = () => {
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
                    <FormHeader title="Setup" pageTitle="Operations" />

                    <Col xl={12}>
                        <form className="vertical-navs-step form-steps" onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={3}>
                                    <Card>
                                        <CardBody>
                                            <Nav className="flex-column custom-nav nav-pills">
                                                {[
                                                    

                                                    { id: 1, label: "Operation List" },
                                                    { id: 2, label: "Operation Category List" },
                                                  

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
                                                <OperationList />
                                            </TabPane>
                                            <TabPane tabId={2}>
                                                <OperationCategoryList />
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

export default OperationMain;
