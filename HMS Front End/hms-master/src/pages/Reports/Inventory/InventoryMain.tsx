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
 
import InventoryStockReport from './InventoryStockReport';
import InventoryItemReport from './InventoryItemReport';
import InventoryIssueReport from './InventoryIssueReport';
import FormHeader from "../../../common/FormHeader/FormHeader";

const InventoryMain = () => {
    const [activeArrowTab, setActiveArrowTab] = useState(1);
    const [passedArrowSteps, setPassedArrowSteps] = useState([1]);

    function toggleArrowTab(tab: number) {
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
                    <FormHeader title="Inventory Reports" pageTitle="Reports" />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Inventory Reports</h4>
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
                                                        id="steparrow-inventory-stock-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 1,
                                                            done: activeArrowTab > 1,
                                                        })}
                                                        onClick={() => toggleArrowTab(1)}
                                                    >
                                                        Inventory Item Report
                                                    </NavLink>
                                                </NavItem>
                                                {/* <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-inventory-item-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 2,
                                                            done: activeArrowTab > 2,
                                                        })}
                                                        onClick={() => toggleArrowTab(2)}
                                                    >
                                                        Inventory Item Report
                                                    </NavLink>
                                                </NavItem> */}
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="steparrow-inventory-issue-tab"
                                                        className={classnames({
                                                            active: activeArrowTab === 3,
                                                            done: activeArrowTab > 3,
                                                        })}
                                                        onClick={() => toggleArrowTab(3)}
                                                    >
                                                        Inventory Issue Report
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeArrowTab}>
                                            <TabPane id="steparrow-inventory-stock" tabId={1}>
                                                <InventoryStockReport />
                                            </TabPane>
                                            {/* <TabPane id="steparrow-inventory-item" tabId={2}>
                                                <InventoryItemReport />
                                            </TabPane> */}
                                            <TabPane id="steparrow-inventory-issue" tabId={3}>
                                                <InventoryIssueReport />
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

export default InventoryMain;
