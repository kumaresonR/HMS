import radiology from "../../assets/images/dashboard/Radiology.png";
import bloodbank from "../../assets/images/dashboard/blood-bank.png";
import ambulance from "../../assets/images/dashboard/Ambulance.png";
import general from "../../assets/images/dashboard/General.png";
import pathology from "../../assets/images/dashboard/Pathology.png";
import pharmacy from "../../assets/images/dashboard/Pharmacy.png";
import ipd from "../../assets/images/dashboard/IPD.png";
import opd from "../../assets/images/dashboard/OPD.png";

const incomeWidgetData = [
    {
        name: "OPD",
        income: 13,
        icon: "",
        color: "#66aa18"
    },
    {
        name: "IPD",
        income: 15,
        icon: "",
        color: "#66aa18"
    },
    {
        name: "Pharmacy",
        income: 9,
        icon: "",
        color: "#66aa18"
    },
    {
        name: "Pathology",
        income: 9,
        icon: "",
        color: "#66aa18"
    },
    {
        name: "Radiology",
        income: 4,
        icon: "",
        color: "#66aa18"
    },
    {
        name: "Blood Bank",
        income: 7,
        icon: "",
        color: "#66aa18"
    },
    {
        name: "Ambulance",
        income: 8,
        icon: "",
        color: "#66aa18"
    },
    {
        name: "Income",
        income: 5,
        icon: "",
        color: "#66aa18"
    }
]

const yearlyIncomeAndExpenseData = [
    {
        name: 'income',
        data: [15089, 16097, 14435, 89722, 2345, 78645, 67458, 65747, 34565, 67543, 56478, 12486]
    },
    {
        name: 'expenses',
        data: [289408, 414170, 304576, 678976, 68346, 654765, 675434, 564565, 76547, 234543, 289898, 565798]
    }
]

const ecomWidgets = [
    {
        id: 1,
        cardColor: "primary",
        label: "OPD Income",
        badge: "ri-arrow-right-up-line",
        badgeClass: "success",
        percentage: "+16.24",
        counter: 559.25,
        link: "See details",
        bgcolor: "secondary",
        icon: opd,
        decimals: 2,
        prefix: "₹",
        suffix: "k"
    },
    {
        id: 2,
        cardColor: "secondary",
        label: "IPD Income",
        badge: "ri-arrow-right-down-line",
        badgeClass: "danger",
        percentage: "-3.57",
        counter: 36894,
        link: "See details",
        bgcolor: "secondary",
        icon: ipd,
        decimals: 0,
        prefix: "",
        separator: ",",
        suffix: ""
    },
    {
        id: 3,
        cardColor: "success",
        label: "Pharmacy Income",
        badge: "ri-arrow-right-up-line",
        badgeClass: "success",
        percentage: "+29.08",
        counter: 183.35,
        link: "See details",
        bgcolor: "secondary",
        icon: pharmacy,
        decimals: 2,
        prefix: "",
        suffix: "M"
    },
    {
        id: 4,
        cardColor: "info",
        label: "Pathology Income",
        badgeClass: "muted",
        percentage: "+0.00",
        counter: 165.89,
        link: "See details",
        bgcolor: "secondary",
        icon: pathology,
        decimals: 2,
        prefix: "₹",
        suffix: "k"
    },
    {
        id: 5,
        cardColor: "primary",
        label: "Radiology Income",
        badge: "ri-arrow-right-up-line",
        badgeClass: "success",
        percentage: "+16.24",
        counter: 559.25,
        link: "See details",
        bgcolor: "secondary",
        icon: radiology,
        decimals: 2,
        prefix: "₹",
        suffix: "k"
    },
    {
        id: 6,
        cardColor: "secondary",
        label: "Blood Bank Income",
        badge: "ri-arrow-right-down-line",
        badgeClass: "danger",
        percentage: "-3.57",
        counter: 36894,
        link: "See details",
        bgcolor: "secondary",
        icon: bloodbank,
        decimals: 0,
        prefix: "",
        separator: ",",
        suffix: ""
    },
    {
        id: 7,
        cardColor: "success",
        label: "Ambulance Income",
        badge: "ri-arrow-right-up-line",
        badgeClass: "success",
        percentage: "+29.08",
        counter: 183.35,
        link: "See details",
        bgcolor: "secondary",
        icon: ambulance,
        decimals: 2,
        prefix: "",
        suffix: "M"
    },
    {
        id: 8,
        cardColor: "info",
        label: "General Income",
        badgeClass: "muted",
        percentage: "+0.00",
        counter: 165.89,
        link: "See details",
        bgcolor: "secondary",
        icon: general,
        decimals: 2,
        prefix: "₹",
        suffix: "k"
    }
];

const humanResourceData = [
    { role: "Admin", count: 1, icon: "FaUserTie" },
    { role: "Accountant", count: 1, icon: "FaCalculator" },
    { role: "Doctor", count: 4, icon: "FaStethoscope" },
    { role: "Pharmacist", count: 1, icon: "FaPrescriptionBottle" },
    { role: "Radiologist", count: 1, icon: "FaXRay" },
    { role: "Super Admin", count: 1, icon: "FaUserShield" },
    { role: "Receptionist", count: 1, icon: "FaConciergeBell" },
    { role: "Nurse", count: 3, icon: "FaUserNurse" }
];


export { incomeWidgetData, yearlyIncomeAndExpenseData, ecomWidgets, humanResourceData }