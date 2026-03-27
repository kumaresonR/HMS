import { MdGroups } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { BsFillCalendar2WeekFill, BsFillCalendarCheckFill } from "react-icons/bs";

const StaffAttendanceWidgets = [
    {
        id: 1,
        cardColor: "primary",
        label: "Total Present",
        badge: "ri-arrow-right-up-line",
        badgeClass: "success",
        counter: 57,
        link: "View Details",
        bgcolor: "primary",
        icon: MdGroups, // Icon for total present
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
        counter: 13,
        link: "View Details",
        bgcolor: "warning",
        icon: AiOutlineClockCircle, // Icon for total late
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
        counter: 10,
        link: "View Details",
        bgcolor: "danger",
        icon: IoMdClose, // Icon for total absent
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
        counter: 8,
        link: "View Details",
        bgcolor: "info",
        icon: BsFillCalendar2WeekFill, // Icon for total first half
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
        counter: 2,
        link: "View Details",
        bgcolor: "info",
        icon: BsFillCalendarCheckFill, // Icon for total second half
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
        counter: 1,
        link: "View Details",
        bgcolor: "secondary",
        icon: BsFillCalendarCheckFill, // Icon for total holidays
        decimals: 0,
        prefix: "",
        suffix: ""
    }
];

export { StaffAttendanceWidgets };
