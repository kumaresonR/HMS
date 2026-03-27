import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import { Link } from 'react-router-dom';
import classnames from "classnames";

// Import Content
import FormHeader from '../../../common/FormHeader/FormHeader';
import UiContent from '../../../Components/Common/UiContent';
//import Components

const Modules = () => {

    const [cardHeaderTab, setcardHeaderTab] = useState<string>("1");
    const cardHeaderToggle = (tab: any) => {
        if (cardHeaderTab !== tab) {
            setcardHeaderTab(tab);
        }
    };

    return (
        <React.Fragment>
            <UiContent />
            <div>
                <Container fluid>
                    <FormHeader title="Tabs" pageTitle="Base UI" />
                    <Row>

                        <Col xxl={6}>
                            <h5 className="mb-3">Card Header Tabs</h5>
                            <Card>
                                <div className="card-header align-items-center d-flex">
                                    <div className="flex-grow-1 oveflow-hidden">
                                        <p className="text-muted text-truncates mb-0">Use <code>card-header-tabs</code> class to create card header tabs.</p>
                                    </div>
                                    <div className="flex-shrink-0 ms-2">

                                        <Nav tabs className="nav justify-content-end nav-tabs-custom rounded card-header-tabs border-bottom-0">
                                            <NavItem>
                                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: cardHeaderTab === "1", })} onClick={() => { cardHeaderToggle("1"); }} >
                                                    Home
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: cardHeaderTab === "2", })} onClick={() => { cardHeaderToggle("2"); }} >
                                                    Profile
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: cardHeaderTab === "3", })} onClick={() => { cardHeaderToggle("3"); }} >
                                                    Messages
                                                </NavLink>
                                            </NavItem>
                                        </Nav>

                                    </div>
                                </div>
                                <CardBody>
                                    <TabContent activeTab={cardHeaderTab} className="text-muted">
                                        <TabPane tabId="1" id="home2">
                                            <p className="flex-grow-1 mb-0">
                                                Food truck fixie locavore, accusamus mcsweeney's marfa nulla
                                                If you’re using multiple elements, make sure that your principal object is larger than assumenda.
                                            </p>
                                        </TabPane>

                                        <TabPane tabId="2" id="profile2">
                                            <p className="me-3 mb-0">
                                                Experiment and play around with the fonts that you already have in the software you’re working with reputable font websites. commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus.commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus Scale all elements of your design: text, elements, buttons, everything. Increase or decrease the letter spacing depending on the situation and try, try again until it looks right, and each /.
                                            </p>
                                        </TabPane>

                                        <TabPane tabId="3" id="messages2">
                                            <p className="ms-3 mb-0">
                                                Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art party before they sold out master cleanse gluten-free squid scenester freegan cosby sweater. Fanny pack portland seitan DIY, art party locavore wolf cliche high life echo park Austin. Cred vinyl keffiyeh DIY salvia PBR, beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aes Homo nostrud organic, assumenda labore aesthetic magna delectus Scale all elements of your design: text, elements, buttons, everything.Increase or decrease the letter spacing depending on the situation and try, try again until it looks right, and each.
                                            </p>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>


                </Container>
            </div>
        </React.Fragment>
    );
};

export default Modules;
