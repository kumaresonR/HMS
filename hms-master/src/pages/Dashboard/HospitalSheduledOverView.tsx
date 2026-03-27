import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from "reactstrap";
import SimpleBar from 'simplebar-react';
import AnualCalenderApiService from '../../helpers/services/annualCalendar/annual-calendar-api-service';
import ErrorHandler from '../../helpers/ErrorHandler';
import moment from 'moment';

const colorMapping = {
    info: "info",
    danger: "danger",
    warning: "warning",
    primary: "primary",
    success: "success"
} as const;

interface Event {
    title: string;
    start: string;
    end: string;
    description: string;
    className: keyof typeof colorMapping;
}

const HospitalScheduleOverview: React.FC = () => {
    const anualCalenderApiService: AnualCalenderApiService = new AnualCalenderApiService();

    const [anualCalenderData, setAnualCalenderData] = useState<any[]>([]);

    const getTime = (params: string): string => {
        const date = new Date(params);
        const hour = date.getHours();
        const minute = date.getMinutes() ? date.getMinutes() : "00";
        return hour + ":" + minute;
    };

    const tConvert = (time: string): string => {
        const t = time.split(":");
        let hours: number = parseInt(t[0], 10);
        let minutes: string = t[1];

        const newformat = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        return hours + ":" + minutes + " " + newformat;
    };

    const str_dt = (date: string): string => {
        const monthNames: string[] = [
            "January", "February", "March", "April", "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];
        const d = new Date(date),
            month = "" + monthNames[d.getMonth()],
            day = "" + d.getDate(),
            year = d.getFullYear();
        return [day + " " + month, year].join(",");
    };

    const upcomingEvents: Event[] = [
        {
            title: "Consultation with Dr. John Doe",
            start: "2024-12-12T09:00:00",
            end: "2024-12-12T10:00:00",
            description: "Check up for routine health issues.",
            className: "info"
        },
        {
            title: "Surgical Operation",
            start: "2024-12-12T11:00:00",
            end: "2024-12-12T13:00:00",
            description: "Minor surgery for a patient.",
            className: "danger"
        },
        {
            title: "Meeting with Medical Team",
            start: "2024-12-12T14:00:00",
            end: "2024-12-12T15:00:00",
            description: "Team briefing and planning for patient care.",
            className: "warning"
        }
    ];

    const getAllAnualCalender = async () => {
        try {
            let result = await anualCalenderApiService.getAllAnualCalender();
            console.log("getAllAnualCalender", result || []);
            setAnualCalenderData(result || []);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllAnualCalender();
    }, []);

    return (
        <div>
            <div>
                <Card className="card-height-100">
                    <CardHeader className="">
                        <h4 className="card-title mb-0 flex-grow-1">Hospital Schedule Overview</h4>
                        <p className="text-muted mb-0">Urgent Notifications, Patient Statistics, and Reminders</p>
                    </CardHeader>

                    <div className="card-body">
                        <SimpleBar
                            className="pe-2 me-n1 mb-3"
                            style={{ height: "420px" }}
                        >
                            <div id="upcoming-event-list">
                                {anualCalenderData.map((event:any, index:any) => {
                                    const category = event.className;
                                    const startDate = event.fromDate ? moment(event.fromDate).format('DD MMMM, YYYY') : moment(event.date).format('DD MMMM, YYYY');
                                    const endDate = event.toDate ? moment(event.toDate).format('DD MMMM, YYYY') : '';
                                    const startTime = event.type;
                                    const badgeColor = event.type === 'Holiday' ? 'danger' : event.type === 'Activity' ? 'info' : 'warning';
                                    // const endTime = tConvert(getTime(event.end));
                                    // const circleColor = colorMapping[category] || "secondary";
                                    // const badgeColor = `badge bg-${circleColor}-subtle text-${circleColor}`;

                                    return (
                                        <Card className="mb-3" key={index}>
                                            <CardBody>
                                                <div className="d-flex mb-3">
                                                    <div className="flex-grow-1">
                                                        <i
                                                            className={`mdi mdi-checkbox-blank-circle me-2 text-${badgeColor}`}
                                                        ></i>
                                                        <span className="fw-medium">
                                                            {startDate} {endDate && `to ${endDate}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <small className={`badge bg-${badgeColor}-subtle text-${badgeColor}`}>
                                                            {startTime} 
                                                        </small>
                                                    </div>
                                                </div>
                                                <h6 className="card-title fs-16">{event.title}</h6>
                                                <p className="text-muted text-truncate-two-lines mb-0">
                                                    {event.description}
                                                </p>
                                            </CardBody>
                                        </Card>
                                    );
                                })}
                            </div>
                        </SimpleBar>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default HospitalScheduleOverview;
