import { faBell, } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useRef } from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Dropdown, DropdownToggle, Row, Col, DropdownMenu, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import SimpleBar from "simplebar-react";
import classnames from 'classnames';

//import images
// import avatar2 from "../assets/images/users/avatar-2.jpg";
// import avatar8 from "../assets/images/users/avatar-8.jpg";
// import avatar3 from "../assets/images/users/avatar-3.jpg";
// import avatar6 from "../assets/images/users/avatar-6.jpg";
import bell from "../assets/images/svg/bell.svg";
import { Stomp, Client as StompClient } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import StorageService from "../helpers/storage/storage-service"
import { toast } from "react-toastify"
import DashboardApiService from "../helpers/services/dashboard/dashboard-api-service"
import NotificationSound from "../assets/notification-sound.mp3";

const Notification = () => {
    const dashboardApiService: DashboardApiService = new DashboardApiService();
    
    const navigate: any = useNavigate();

    //Dropdown Toggle
    const [isNotificationDropdown, setIsNotificationDropdown] = useState<boolean>(false);

    const toggleNotificationDropdown = () => {
        setIsNotificationDropdown(!isNotificationDropdown);
    };
    const [userId, setUserId] = useState('');
    const [unReadData, setUnReadData] = useState<any>([]);
    const [unReadDataCount, setUnReadDataCount] = useState<any>();
    const [readData, setReadData] = useState([]);
    const audioPlayer = useRef<any>(null);

    //Tab 
    const [activeTab, setActiveTab] = useState<any>('1');
    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        const user = StorageService.getUserDataFromSessionStorage();
        setUserId(user?.user_id);
        if (user?.user_id) {

            const socket = new WebSocket("wss://13.201.55.241:8443/notification-management-services/ws");
            const stompClient = Stomp.over(socket);

            stompClient.connect({}, () => {
                stompClient.subscribe(`/topic/notifications/${user.user_id}`, (message: any) => {
                    const notification = JSON.parse(message.body);
                    audioPlayer.current.play();
                    getAllUnreadMessage(user.user_id);
                    toast(notification.message, { containerId: 'TR', autoClose: 30000 });
                });
            });

            return () => stompClient.disconnect();
        }

    }, []);

    useEffect(() => {
        const user:any = StorageService.getUserDataFromSessionStorage();
        setUserId(user?.user_id);
        if (user?.user_id) {
            // getNotification(user.user_id);
            getAllUnreadMessage(user.user_id);
        }
    }, []);

    // const getNotification = (id: any) => {
    //     // const socket = new WebSocket("ws://192.168.29.200:8097/ws");
    //     const stompClient = Stomp.over(socket);

    //     stompClient.connect({}, () => {
    //         stompClient.subscribe(`/topic/notifications/${id}`, (message: any) => {
    //             const notification = JSON.parse(message.body);
    //             getAllUnreadMessage(id);
    //             toast(notification.message, { containerId: 'TR', autoClose: 30000 });
    //         });
    //     });

    //     return () => stompClient.disconnect();
    // }

    const getAllUnreadMessage = async (id: any) => {
        try {
            let data = await dashboardApiService.getAllUnreadMessage(id);
            setUnReadData(data);
            setUnReadDataCount(data?.length || 0);
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const handleRead = async (id: any,item:any) => {
        try {
            let data = await dashboardApiService.getAllReadMessage(id);
            setReadData(data);
            if (item.title === "appointment") {
                navigate('/main/view-scheduled-appointment');
            }
            if (item.title === 'Pathology Report' || item.title === 'Radiology Report') {
                if (item.ipdOrOpdId.startsWith("IPD")) {
                    navigate('/main/ipd-overview', { state: { data: item.ipdOrOpdId } });
                } else if (item.ipdOrOpdId.startsWith("OPD")) {
                    navigate('/main/opd-overview', { state: { data: item.ipdOrOpdId } });
                }
            }
            if(item.title === "LeaveRequest") {
                navigate('/main/leaveApproval');
            }
            if(item.title === "LeaveDISAPPROVED" || item.title === "LeaveAPPROVED") {
                navigate('/main/myLeave');
            }
            getAllUnreadMessage(userId);
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const gotoAllNotification = () => {
        navigate('/main/view-all-notification');
    }

    return <>
        <React.Fragment>
            <Dropdown isOpen={isNotificationDropdown} toggle={toggleNotificationDropdown} className="topbar-head-dropdown ms-1 header-item">
                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                    <FontAwesomeIcon icon={faBell} />
                    <span
                        className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">{unReadDataCount || 0}<span
                            className="visually-hidden">unread messages</span></span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                    <div className="dropdown-head bg-primary bg-pattern rounded-top">
                        <div className="p-3">
                            <Row className="align-items-center">
                                <Col>
                                    <h6 className="m-0 fs-16 fw-semibold text-white"> Notifications </h6>
                                </Col>
                                <div className="col-auto dropdown-tabs">
                                    <span className="badge bg-light-subtle text-body fs-13"> {unReadDataCount} New</span>
                                </div>
                            </Row>
                        </div>

                        <div className="px-2 pt-2">
                            <Nav className="nav-tabs dropdown-tabs nav-tabs-custom">
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={classnames({ active: activeTab === '1' })}
                                        onClick={() => { toggleTab('1'); }}
                                    >
                                        All ({unReadDataCount || 0})
                                    </NavLink>
                                </NavItem>
                                {/* <NavItem>
                                    <NavLink
                                        href="#"
                                        className={classnames({ active: activeTab === '2' })}
                                        onClick={() => { toggleTab('2'); }}
                                    >
                                        Messages
                                    </NavLink>
                                </NavItem> */}
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={classnames({ active: activeTab === '3' })}
                                        onClick={() => { toggleTab('3'); }}
                                    >
                                        Alerts
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </div>

                    </div>

                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1" className="py-2 ps-2">
                            <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
                                {unReadData?.length > 0 ? (
                                    <>
                                        {unReadData?.map((item: any, idx: any) => (
                                            <div className="text-reset notification-item d-block dropdown-item position-relative" key={idx}>
                                                <div className="d-flex" onClick={(e) => handleRead(item.id,item)}>
                                                    <div className="avatar-xs me-3">
                                                        <span
                                                            className="avatar-title px-2 bg-danger-subtle text-danger rounded-circle fs-16">
                                                            <i className='bx bx-message-square-dots'></i>
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <Link to="#" className="stretched-link">
                                                            <h6 className="mt-0 mb-2 lh-base">{item.message}
                                                                <span className="text-secondary"></span>
                                                            </h6>
                                                        </Link>
                                                        {/* <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                    <span><i className="mdi mdi-clock-outline"></i> 2 hrs ago</span>
                                                </p> */}
                                                    </div>
                                                    <div className="px-2 fs-15">
                                                        <div className="form-check notification-check">
                                                            <input className="form-check-input" type="checkbox" value="" id="all-notification-check03" />
                                                            <label className="form-check-label" htmlFor="all-notification-check03"></label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="my-3 text-center">
                                            <button type="button" onClick={gotoAllNotification}
                                            className="btn btn-soft-success waves-effect waves-light">View
                                                All Notifications <i className="ri-arrow-right-line align-middle"></i></button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="w-25 w-sm-50 pt-3 mx-auto">
                                            <img src={bell} className="img-fluid" alt="no-notifications" />
                                        </div>
                                        <div className="text-center pb-5 mt-2">
                                            <h6 className="fs-18 fw-semibold lh-base">
                                                Hey! You have no any notifications
                                            </h6>
                                        </div>
                                    </div>
                                )}
                            </SimpleBar>

                        </TabPane>

                        {/* <TabPane tabId="2" className="py-2 ps-2">
                            <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
                                <div className="text-reset notification-item d-block dropdown-item">
                                    <div className="d-flex">
                                        <img src={avatar3}
                                            className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                        <div className="flex-grow-1">
                                            <Link to="#" className="stretched-link"><h6 className="mt-0 mb-1 fs-13 fw-semibold">James Lemire</h6></Link>
                                            <div className="fs-13 text-muted">
                                                <p className="mb-1">It's time for your follow-up consultation. Schedule now.</p>
                                            </div>
                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                <span><i className="mdi mdi-clock-outline"></i> 30 min ago</span>
                                            </p>
                                        </div>
                                        <div className="px-2 fs-15">
                                            <div className="form-check notification-check">
                                                <input className="form-check-input" type="checkbox" value="" id="messages-notification-check01" />
                                                <label className="form-check-label" htmlFor="messages-notification-check01"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-reset notification-item d-block dropdown-item">
                                    <div className="d-flex">
                                        <img src={avatar2}
                                            className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                        <div className="flex-grow-1">
                                            <Link to="#" className="stretched-link"><h6 className="mt-0 mb-1 fs-13 fw-semibold">Angela Bernier</h6></Link>
                                            <div className="fs-13 text-muted">
                                                <p className="mb-1">From doctors or medical staff with patient-related updates or consultations. 🔔.</p>
                                            </div>
                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                <span><i className="mdi mdi-clock-outline"></i> 2 hrs ago</span>
                                            </p>
                                        </div>
                                        <div className="px-2 fs-15">
                                            <div className="form-check notification-check">
                                                <input className="form-check-input" type="checkbox" value="" id="messages-notification-check02" />
                                                <label className="form-check-label" htmlFor="messages-notification-check02"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-reset notification-item d-block dropdown-item">
                                    <div className="d-flex">
                                        <img src={avatar6}
                                            className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                        <div className="flex-grow-1">
                                            <Link to="#" className="stretched-link"><h6 className="mt-0 mb-1 fs-13 fw-semibold">Kenneth Brown</h6></Link>
                                            <div className="fs-13 text-muted">
                                                <p className="mb-1"> has updated your consultation notes. Please review them. </p>
                                            </div>
                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                <span><i className="mdi mdi-clock-outline"></i> 10 hrs ago</span>
                                            </p>
                                        </div>
                                        <div className="px-2 fs-15">
                                            <div className="form-check notification-check">
                                                <input className="form-check-input" type="checkbox" value="" id="messages-notification-check03" />
                                                <label className="form-check-label" htmlFor="messages-notification-check03"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-reset notification-item d-block dropdown-item">
                                    <div className="d-flex">
                                        <img src={avatar8}
                                            className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                        <div className="flex-grow-1">
                                            <Link to="#" className="stretched-link"><h6 className="mt-0 mb-1 fs-13 fw-semibold">Maureen Gibson</h6></Link>
                                            <div className="fs-13 text-muted">
                                                <p className="mb-1">has updated your treatment plan. Please review the details.</p>
                                            </div>
                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                <span><i className="mdi mdi-clock-outline"></i> 3 days ago</span>
                                            </p>
                                        </div>
                                        <div className="px-2 fs-15">
                                            <div className="form-check notification-check">
                                                <input className="form-check-input" type="checkbox" value="" id="messages-notification-check04" />
                                                <label className="form-check-label" htmlFor="messages-notification-check04"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="my-3 text-center">
                                    <button type="button" className="btn btn-soft-success waves-effect waves-light">View
                                    </button>
                                </div>
                            </SimpleBar>
                        </TabPane> */}
                        <TabPane tabId="3" className="p-4">
                            <div className="w-25 w-sm-50 pt-3 mx-auto">
                                <img src={bell} className="img-fluid" alt="user-pic" />
                            </div>
                            <div className="text-center pb-5 mt-2">
                                <h6 className="fs-18 fw-semibold lh-base">Hey! You have no any notifications </h6>
                            </div>
                        </TabPane>
                        <audio ref={audioPlayer} src={NotificationSound} />
                    </TabContent>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    </>
}
export default Notification