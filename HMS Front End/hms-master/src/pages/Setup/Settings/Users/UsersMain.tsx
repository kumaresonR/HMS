import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import classnames from "classnames";
import Patient from './Patient';
import Staff from './Staff';
import './userStyle.css'
const UsersMain = () => {

    // Card Header Tabs
    const [cardHeaderTab, setcardHeaderTab] = useState<string>("1");
    const cardHeaderToggle = (tab: any) => {
        if (cardHeaderTab !== tab) {
            setcardHeaderTab(tab);
        }
    };

    return (
        <React.Fragment>

            <div >


                <Card className='p-3' >
                  
                    <div className="card-header align-items-center d-flex">
                        <div className="flex-grow-1 oveflow-hidden">
                        <h5 className="mb-0">Users</h5>
                        </div>
                        <div className="flex-shrink-0 ms-2">

                            <Nav tabs className="nav justify-content-end nav-tabs-custom rounded card-header-tabs border-bottom-0">
                                <NavItem classname='p-0'>
                                    <NavLink classname='p-0' style={{ cursor: "pointer" }} className={classnames({ active: cardHeaderTab === "1", })} onClick={() => { cardHeaderToggle("1"); }} >
                                        Patient
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink style={{ cursor: "pointer" }} className={classnames({ active: cardHeaderTab === "2", })} onClick={() => { cardHeaderToggle("2"); }} >
                                        Staff
                                    </NavLink>
                                </NavItem>

                            </Nav>

                        </div>
                    </div>
                    <CardBody>
                        <TabContent activeTab={cardHeaderTab} className="text-muted">
                            <TabPane tabId="1" id="home2">
                                <Patient />
                            </TabPane>

                            <TabPane tabId="2" id="profile2">
                                <Staff />
                            </TabPane>


                        </TabContent>
                    </CardBody>
                </Card>



            </div>
        </React.Fragment>
    );
};

export default UsersMain;
