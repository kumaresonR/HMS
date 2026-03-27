import React, { useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Row,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";

import CountUp from "react-countup";
import AttendanceCalendar from './Calendar/AttendanceCalendar'
import './myProfile.css'
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsFillCalendar2WeekFill, BsFillCalendarCheckFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { MdGroups } from "react-icons/md";
const StaffAttendanceInfo = (props: any) => {
    const data = props.data.attendanceLeaves;

    let totalPresent = 0;
    let totalLate = 0;
    let totalAbsent = 0;
    let totalFirstHalf = 0;
    let totalSecondHalf = 0;
    let totalHoliday = 0;

    props?.data?.attendanceLeaves?.forEach((entry: any) => {
        switch (entry.staffAttendance) {
            case "Present":
                totalPresent++;
                break;
            case "Late":
                totalLate++;
                break;
            case "Absent":
                totalAbsent++;
                break;
            case "Half Day":
                totalFirstHalf++;
                break;
            case "Second Half":
                totalSecondHalf++;
                break;
            case "Holiday":
                totalHoliday++;
                break;
            default:
                break;
        }
    });

    console.log("Total Present:", totalPresent);
    console.log("Total Late:", totalLate);
    console.log("Total Absent:", totalAbsent);
    console.log("Total First Half:", totalFirstHalf);
    console.log("Total Second Half:", totalSecondHalf);
    console.log("Total Holiday:", totalHoliday);

    const StaffAttendanceWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: "Total Present",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            counter: totalPresent,
            link: "View Details",
            bgcolor: "primary",
            icon: MdGroups, 
            decimals: 0,
            prefix: "",
            suffix: ""
        },
        {
            id: 2,
            cardColor: "warning",
            label: "Total Late",
            badge: "ri-arrow-right-up-line",
            badgeClass: "warning",
            counter: totalLate,
            link: "View Details",
            bgcolor: "warning",
            icon: AiOutlineClockCircle, 
            decimals: 0,
            prefix: "",
            suffix: ""
        },
        {
            id: 3,
            cardColor: "danger",
            label: "Total Absent",
            badge: "ri-arrow-right-down-line",
            badgeClass: "danger",
            counter: totalAbsent,
            link: "View Details",
            bgcolor: "danger",
            icon: IoMdClose, 
            decimals: 0,
            prefix: "",
            suffix: ""
        },
        {
            id: 4,
            cardColor: "info",
            label: "Total First Half",
            badge: "ri-arrow-right-up-line",
            badgeClass: "info",
            counter: totalFirstHalf,
            link: "View Details",
            bgcolor: "info",
            icon: BsFillCalendar2WeekFill, 
            decimals: 0,
            prefix: "",
            suffix: ""
        },
        {
            id: 5,
            cardColor: "info",
            label: "Total Second Half",
            badge: "ri-arrow-right-up-line",
            badgeClass: "info",
            counter: totalSecondHalf,
            link: "View Details",
            bgcolor: "info",
            icon: BsFillCalendarCheckFill, 
            decimals: 0,
            prefix: "",
            suffix: ""
        },
        {
            id: 6,
            cardColor: "secondary",
            label: "Total Holiday",
            badge: "ri-arrow-right-up-line",
            badgeClass: "secondary",
            counter: totalHoliday,
            link: "View Details",
            bgcolor: "secondary",
            icon: BsFillCalendarCheckFill, 
            decimals: 0,
            prefix: "",
            suffix: ""
        }
    ];

    return (
        <React.Fragment>
            <Card>
                <CardBody className="myProfile">
                    <div>
                        <h5 className="card-title mb-4">Staff Attendance</h5>
                        <Row>

                            {StaffAttendanceWidgets.map((item: any, key: number) => (
                                <Col xl={3} md={6} className="col" key={key}>
                                    <Card className="card-animate">
                                        <CardBody>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-end justify-content-between mt-4">
                                                <div>
                                                    <h4 className="fs-20 fw-semibold ff-secondary mb-4">
                                                        <span className="counter-value" data-target="559.25">
                                                            <CountUp
                                                                start={0}
                                                                separator={item.separator}
                                                                end={item.counter}
                                                                decimals={item.decimals}
                                                                duration={4}
                                                            />
                                                        </span>
                                                    </h4>
                                                </div>
                                                <div className="avatar-sm icon_highlight flex-shrink-0">
                                                    <span className={`avatar-title rounded fs-3 `}>
                                                        <i className={`text-${item.bgcolor}`}>
                                                            <item.icon />
                                                        </i>
                                                    </span>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}

                        </Row>
                    </div>

                    <AttendanceCalendar data={data} />
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default StaffAttendanceInfo;
