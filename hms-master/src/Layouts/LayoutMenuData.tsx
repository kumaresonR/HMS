import { faCalendarCheck, faClock } from "@fortawesome/free-regular-svg-icons";
import { faAmbulance, faBedPulse, faBox, faCalendar, faCalendarPlus, faHeartCirclePlus, faChartLine, faCloudDownloadAlt, faUserClock, faComments, faDesktop, faDollarSign, faDownload, faFileAlt, faFileInvoice, faGears, faHospital, faMapMarkerAlt, faNewspaper, faSolarPanel, faIndianRupeeSign, faStethoscope, faUserDoctor, faUsers, faUserShield, faVideo, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { faDroplet, faFlask, faMicroscope, faPrescriptionBottle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StorageService from "../helpers/storage/storage-service";

const Navdata = () => {
    const history = useNavigate();
    const [menus, setMenus] = useState<any[]>([]);
    //state data
    const [isPatient, setIsPatient] = useState<boolean>(false);
    const [isAppointment, setIsAppointment] = useState<boolean>(false);
    const [isAvailableTimeSheet, setIsAvailableTimeSheet] = useState<boolean>(false);
    const [isCreateAppointment, setIsCreateAppointment] = useState<boolean>(false);
    const [isPages, setIsPages] = useState<boolean>(false);
    const [isIPD, setIsIPD] = useState<boolean>(false);
    const [isBirthDeath, setIsBirthDeath] = useState<boolean>(false);
    const [isCertificate, setIsCertificate] = useState<boolean>(false);
    const [isLiveConsultation, setIsLiveConsultation] = useState<boolean>(false);
    const [isReport, setIsReport] = useState<boolean>(false);
    const [isFinance, setIsFinance] = useState<boolean>(false);
    const [isDownloadCenter, setIsDownloadCenter] = useState<boolean>(false);
    const [isSetup, setIsSetup] = useState<boolean>(false);
    const [isDownloadCenterOne, setIsDownloadCenterOne] = useState<boolean>(false);

    const [iscurrentState, setIscurrentState] = useState('');

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            const iconItems: any = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("sub-items");
                const getID = document.getElementById(id) as HTMLElement
                if (getID)
                    getID.classList.remove("show");
            });
        }
    }

    // const filterMenusBasedOnRole = () => {
    //     const userData = StorageService.getUserDataFromSessionStorage();
    //     const userRoles = userData ? userData.role : [];

    //     // Helper function to filter submenus and childItems recursively
    //     const filterSubMenu = (subMenu: any) => {
    //         return subMenu
    //             .map((sub: any) => {
    //                 // Filter the childItems based on roles
    //                 const filteredChildItems = sub.childItems
    //                     ? sub.childItems.filter((child: any) =>
    //                         child.roles.some((role: any) => userRoles.includes(role))
    //                     )
    //                     : [];

    //                 // Return the subItem only if roles match or filteredChildItems is not empty
    //                 return {
    //                     ...sub,
    //                     ...(sub.roles.some((role: any) => userRoles.includes(role)) || filteredChildItems.length > 0
    //                         ? { childItems: filteredChildItems }
    //                         : { childItems: [] }),
    //                 };
    //             })
    //             .filter(
    //                 (sub: any) =>
    //                     sub.roles.some((role: any) => userRoles.includes(role)) ||
    //                     sub.childItems.length > 0
    //             );
    //     };

    //     // Main filtering for sideMenu
    //     const newFilteredMenus = sideMenu
    //         .map((menu: any) => {
    //             // Filter the submenu items based on roles
    //             const filteredSubMenu = filterSubMenu(menu.subMenu || []);

    //             // Return the menu item only if the main item roles match or subMenu is not empty
    //             return {
    //                 ...menu,
    //                 ...(menu.roles.some((role: any) => userRoles.includes(role)) || filteredSubMenu.length > 0
    //                     ? { subMenu: filteredSubMenu }
    //                     : { subMenu: [] }),
    //             };
    //         })
    //         .filter(
    //             (menu: any) =>
    //                 menu.roles.some((role: any) => userRoles.includes(role)) ||
    //                 menu.subMenu.length > 0
    //         );

    //     setMenus(newFilteredMenus);
    //     // console.log('FilteredMenus===>', newFilteredMenus);
    // };


    const filterMenusBasedOnScope = () => {
        const userData = StorageService.getUserDataFromSessionStorage();
        const userScopes = userData?.roleDto?.scopes?.map((scope: any) => scope.scopeName.toLowerCase()) || [];

        // Helper function to filter submenus and childItems recursively
        const filterSubMenu = (subMenu: any) => {
            return subMenu
                .map((sub: any) => {
                    // Filter the childItems based on name matching scopeName (case-insensitive)
                    const filteredChildItems = sub.childItems
                        ? sub.childItems.filter((child: any) => userScopes.includes(child.name.toLowerCase()))
                        : [];

                    // Return the subItem only if the name matches or filteredChildItems is not empty
                    return {
                        ...sub,
                        ...(userScopes.includes(sub.name.toLowerCase()) || filteredChildItems.length > 0
                            ? { childItems: filteredChildItems }
                            : { childItems: [] }),
                    };
                })
                .filter(
                    (sub: any) =>
                        userScopes.includes(sub.name.toLowerCase()) ||
                        sub.childItems.length > 0
                );
        };

        // Main filtering for sideMenu
        const newFilteredMenus = sideMenu
            .map((menu: any) => {
                // Filter the submenu items based on name matching scopeName (case-insensitive)
                const filteredSubMenu = filterSubMenu(menu.subMenu || []);

                // Return the menu item only if the main item name matches or subMenu is not empty
                return {
                    ...menu,
                    ...(userScopes.includes(menu.name.toLowerCase()) || filteredSubMenu.length > 0
                        ? { subMenu: filteredSubMenu }
                        : { subMenu: [] }),
                };
            })
            .filter(
                (menu: any) =>
                    userScopes.includes(menu.name.toLowerCase()) ||
                    menu.subMenu.length > 0
            );

        setMenus(newFilteredMenus);
    };


    useEffect(() => {
        filterMenusBasedOnScope();
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Patient') {
            setIsPatient(false);
        }
        if (iscurrentState !== 'Appointment') {
            setIsAppointment(false);
        }
        if (iscurrentState !== 'AvailableTimeSheet') {
            setIsAvailableTimeSheet(false);
        }
        if (iscurrentState !== 'BirthDeath') {
            setIsBirthDeath(false);
        }
        if (iscurrentState !== 'Finance') {
            setIsFinance(false);
        }
        if (iscurrentState !== 'DownLoadCenter') {
            setIsDownloadCenter(false);
        }
        if (iscurrentState !== 'DownloadCenterOne') {
            setIsDownloadCenterOne(false);
        }
        if (iscurrentState !== 'Certificate') {
            setIsCertificate(false);
        }
        if (iscurrentState !== 'Report') {
            setIsReport(false);
        }
        if (iscurrentState !== 'LiveConsultation') {
            setIsLiveConsultation(false);
        }
        if (iscurrentState !== 'Setup') {
            setIsSetup(false);
        }
    }, [
        history,
        iscurrentState,
        isAppointment,
        isAvailableTimeSheet,
        isBirthDeath,
        isFinance,
        isDownloadCenter,
        isCertificate,
        isLiveConsultation,
        isSetup,
        isDownloadCenterOne,
        isReport
    ]);

    const sideMenu: any = [
        {
            id: "dashboard",
            name: "Dashboard",
            path: '/main',
            subMenu: [],
            icon: <FontAwesomeIcon icon={faDesktop} />,
            roles: ['SUPERADMIN', 'DOCTOR', 'NURSE', 'ADMIN', 'PHARMACIST', 'PATHOLOGIST', 'RADIOLOGIST', 'RECEPTIONIST', 'ACCOUNTANT']
        },
        {
            id: "billing",
            name: "Billing",
            path: '/main/billing',
            subMenu: [],
            icon: <FontAwesomeIcon icon={faFileInvoice} />,
            roles: ['SUPERADMIN', 'ADMIN', 'RECEPTIONIST', 'ACCOUNTANT']
        },
        // {
        //     id: "patient",
        //     name: "Patient",
        //     path: '/main/patient-datatable',
        //     subMenu: [],
        //     icon: <FontAwesomeIcon icon={faStethoscope} />,
        //     roles: ['RECEPTIONIST']
        // },

        {
            id: "appointment",
            name: "Appointment",
            path: '',
            click: function (e: any) {
                e.preventDefault();
                setIsAppointment(!isAppointment);
                setIscurrentState('Appointment');
                updateIconSidebar(e);
            },
            stateVariables: isAppointment,
            subMenu: [
                {
                    id: "createAppointment",
                    name: "Create Appointment",
                    path: '/main/create-appointment',
                    code: 'createAppointment',
                    parentId: "appointment",
                    roles: ['SUPERADMIN', 'RECEPTIONIST']
                },
                {
                    id: "viewAppointment",
                    name: "View Appointment",
                    path: '/main/appointment-datatable',
                    code: 'viewAppointment',
                    parentId: "appointment",
                    roles: ['SUPERADMIN', 'DOCTOR', 'ADMIN', 'RECEPTIONIST']
                }
            ],
            icon: <FontAwesomeIcon icon={faCalendarCheck} />,
            roles: ['SUPERADMIN', 'ADMIN', 'DOCTOR', 'RECEPTIONIST']
        },
        {
            id: "AvailableTimeSheet",
            name: "Duty Roster",
            path: '',
            stateVariables: isAvailableTimeSheet,
            click: function (e: any) {
                e.preventDefault();
                setIsAvailableTimeSheet(!isAvailableTimeSheet);
                setIscurrentState('AvailableTimeSheet');
                updateIconSidebar(e);
            },
            subMenu: [
                {
                    id: "AvailableTimeSlots",
                    name: "Available Time Slots",
                    path: '/main/available-time-slot',
                    code: 'AvailableTimeSlots',
                    parentId: "AvailableTimeSheet",
                    roles: ['DOCTOR'],
                },
                {
                    id: "AvailableTimeSheets",
                    name: "Available Time Sheet",
                    path: '/main/available-time-sheet',
                    code: 'AvailableTimeSlots',
                    parentId: "AvailableTimeSheet",
                    roles: ['DOCTOR'],
                }
            ],
            icon: <FontAwesomeIcon icon={faClock} />,
            roles: ['DOCTOR']
        },
        {
            id: "OPD",
            name: "OPD - Out Patient",
            path: '/main/OPD',
            subMenu: [],
            icon: <FontAwesomeIcon icon={faStethoscope} />,
            roles: ['DOCTOR', 'NURSE', 'PHARMACIST', 'PATHOLOGIST', 'RADIOLOGIST', 'SUPERADMIN', 'ADMIN', 'RECEPTIONIST', 'ACCOUNTANT']
        },
        {
            id: "IPD",
            name: "IPD - In Patient",
            path: '/main/inPatient-datatable',
            subMenu: [],
            icon: <FontAwesomeIcon icon={faBedPulse} />,
            roles: ['RECEPTIONIST', 'NURSE', 'DOCTOR', 'PHARMACIST', 'PATHOLOGIST', 'SUPERADMIN', 'ADMIN', 'RADIOLOGIST', 'ACCOUNTANT']
        },
        {
            id: "OT Management",
            name: "OT Management",
            path: '/main/ViewScheduledOperations',
            subMenu: [],
            icon: <FontAwesomeIcon icon={faStethoscope} />,
            roles: ['DOCTOR', 'NURSE', 'PHARMACIST', 'PATHOLOGIST', 'RADIOLOGIST', 'SUPERADMIN', 'ADMIN', 'RECEPTIONIST', 'ACCOUNTANT']
        },
        // {
        //     id: "TodayAppointments",
        //     name: "Today's Appointments",
        //     path: '/view-scheduled-appointment',
        //     subMenu: [],
        //     icon: <FontAwesomeIcon icon={faUserDoctor} />,
        //     roles: ['DOCTOR']
        // },
        // {
        //     id: "TodayAppointments",
        //     name: "Appointment List",
        //     path: '/view-scheduled-appointment',
        //     subMenu: [],
        //     icon: <FontAwesomeIcon icon={faUserDoctor} />,
        //     roles: ['DOCTOR']
        // },
        {
            id: "Pharmacy",
            name: "Pharmacy",
            path: '/main/Pharmacy-dashboard',
            subMenu: [],
            icon: <FontAwesomeIcon icon={faPrescriptionBottle} />,
            roles: ['RECEPTIONIST', 'SUPERADMIN', 'PHARMACIST', 'ADMIN', 'ACCOUNTANT']
        },
        {
            id: "Pathology",
            name: "Pathology",
            path: '/main/pathology-datatable',
            subMenu: [],
            icon: <FontAwesomeIcon icon={faFlask} />,
            roles: ['RECEPTIONIST', 'SUPERADMIN', 'ADMIN', 'PATHOLOGIST', 'DOCTOR', 'ACCOUNTANT']
        },
        {
            id: "Radiology",
            name: "Radiology",
            path: '/main/radiology-datatable',
            subMenu: [],
            icon: <FontAwesomeIcon icon={faMicroscope} />,
            roles: ['RECEPTIONIST', 'SUPERADMIN', 'ADMIN', 'RADIOLOGIST', 'DOCTOR', 'ACCOUNTANT']
        },
        {
            id: "Blood Bank",
            name: "Blood Bank",
            path: '/main/blood-bank-status',
            subMenu: [],
            icon: <FontAwesomeIcon icon={faDroplet} />,
            roles: ['RECEPTIONIST', 'SUPERADMIN', 'DOCTOR', 'PHARMACIST', 'PATHOLOGIST', 'ADMIN', 'ACCOUNTANT']
        },

        {
            id: "Ambulance",
            name: "Ambulance",
            icon: <FontAwesomeIcon icon={faAmbulance} />,
            path: "/main/ambulance",
            subMenu: [],
            roles: ['RECEPTIONIST', 'SUPERADMIN', 'ADMIN', 'ACCOUNTANT']
        },
        {
            id: "Front Office",
            name: "Front Office",
            icon: <FontAwesomeIcon icon={faHospital} />,
            path: "/main/visitorList",
            subMenu: [],
            roles: ['RECEPTIONIST', 'SUPERADMIN', 'ADMIN',]
        },

        {
            id: "Birth & Death Record",
            name: "Birth & Death Record",
            icon: <FontAwesomeIcon icon={faFileAlt} />,
            path: "",
            click: function (e: any) {
                e.preventDefault();
                setIsBirthDeath(!isBirthDeath);
                setIscurrentState('BirthDeath');
                updateIconSidebar(e);
            },
            stateVariables: isBirthDeath,
            subMenu: [
                { id: "Birth Record", name: "Birth Record", path: "/main/birthRecord", parentId: "BirthDeath", roles: ['RECEPTIONIST', 'SUPERADMIN', 'DOCTOR', 'ADMIN'] },
                { id: "Death Record", name: "Death Record", path: "/main/deathRecord", parentId: "BirthDeath", roles: ['RECEPTIONIST', 'SUPERADMIN', 'DOCTOR', 'ADMIN'] },
            ],
            roles: ['RECEPTIONIST', 'SUPERADMIN', 'DOCTOR', 'ADMIN']
        },

        {
            id: "Human Resource",
            name: "Human Resource",
            icon: <FontAwesomeIcon icon={faUserShield} />,
            path: "/main/stafflist",
            subMenu: [],
            roles: ['RECEPTIONIST', 'SUPERADMIN', 'NURSE', 'DOCTOR', 'PHARMACIST', 'ADMIN', 'PATHOLOGIST', 'RADIOLOGIST', 'ACCOUNTANT']
        },

        {
            id: "Annual Calendar ",
            name: "Annual Calendar",
            icon: <FontAwesomeIcon icon={faCalendar} />,
            path: "/main/annualCalender",
            subMenu: [],
            roles: ['SUPERADMIN', 'ADMIN']
        },

        {
            id: "Referral ",
            name: "Referral",
            icon: <FontAwesomeIcon icon={faUsers} />,
            path: "/main/referralPersonList",
            subMenu: [],
            roles: ['SUPERADMIN', 'ADMIN', 'ACCOUNTANT']
        },
        {
            id: "TPA Management ",
            name: "TPA Management",
            icon: <FontAwesomeIcon icon={faHeartCirclePlus} />,
            path: "/main/tpaManagement",
            subMenu: [],
            roles: ['RECEPTIONIST', 'SUPERADMIN', 'DOCTOR', 'ADMIN', 'ACCOUNTANT']
        },

        {
            id: "Finance ",
            name: "Finance",
            icon: <FontAwesomeIcon icon={faIndianRupeeSign} />,
            path: "",
            click: function (e: any) {
                e.preventDefault();
                setIsFinance(!isFinance);
                setIscurrentState('Finance');
                updateIconSidebar(e);
            },
            stateVariables: isFinance,
            subMenu: [
                { id: "income", name: "income", path: "/main/income", parentId: "Finance", roles: ['SUPERADMIN', 'ADMIN', 'ACCOUNTANT'] },
                { id: "Expense", name: "Expense", path: "/main/expense", parentId: "Finance", roles: ['SUPERADMIN', 'ADMIN', 'ACCOUNTANT'] },
            ],
            roles: ['SUPERADMIN', 'ADMIN', 'ACCOUNTANT']
        },
        // {
        //     id: "Messaging ",
        //     name: "Messaging",
        //     icon: <FontAwesomeIcon icon={faComments} />,
        //     path: "#",
        //     subMenu: [],
        //     roles: ['RECEPTIONIST']
        // },


        {
            id: "Inventory ",
            name: "Inventory",
            icon: <FontAwesomeIcon icon={faBox} />,
            path: "/main/inventory",
            subMenu: [],
            roles: ['SUPERADMIN', 'ADMIN', 'RECEPTIONIST', 'ACCOUNTANT']
        },
        // {
        //     id: "DownloadCenter",
        //     name: "Download Center",
        //     icon: <FontAwesomeIcon icon={faCloudDownloadAlt} />,
        //     path: "",
        //     click: function (e: any) {
        //         e.preventDefault();
        //         setIsDownloadCenter(!isDownloadCenter);
        //         setIscurrentState('DownloadCenter');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isDownloadCenter,
        //     subMenu: [
        //         { id: "Content Share List ", name: "Content Share List", path: "/contentShareList", code: 'ContentShareList', parentId: "DownloadCenter",roles: ['RECEPTIONIST'] },
        //         { id: "Content Type", name: "Content Type", path: "/contentType", code: 'ContentType', parentId: "DownloadCenter",roles: ['RECEPTIONIST'] },
        //         { id: "Upload / Share Content", name: "Upload / Share Content", path: "#", code: 'UploadShareContent', parentId: "DownloadCenter",roles: ['RECEPTIONIST'] },
        //     ],
        //     roles: ['RECEPTIONIST']
        // },
        {
            id: "Certificate",
            name: "Certificate",
            icon: <FontAwesomeIcon icon={faNewspaper} />,
            path: "",
            click: function (e: any) {
                e.preventDefault();
                setIsCertificate(!isCertificate);
                setIscurrentState('Certificate');
                updateIconSidebar(e);
            },
            stateVariables: isCertificate,
            subMenu: [
                { id: "Certificate", name: "Certificate", path: "/main/certificate", parentId: "Certificate", roles: ['ADMIN', 'SUPERADMIN'] },
                { id: "Patient ID Card", name: "Patient ID Card", path: "/main/patientIDCard", parentId: "Certificate", roles: ['ADMIN', 'SUPERADMIN'] },
                { id: "Staff ID Card", name: "Staff ID Card", path: "/main/staffIDCard", parentId: "Certificate", roles: ['ADMIN', 'SUPERADMIN'] },
            ],
            roles: ['RECEPTIONIST', 'SUPERADMIN', 'ADMIN']
        },

        // {
        //     id: "Front CMS ",
        //     name: "Front CMS ",
        //     icon: <FontAwesomeIcon icon={faSolarPanel} />,
        //     path: "/#",
        //     subMenu: [],
        //     roles: ['RECEPTIONIST']
        // },
        // {
        //     id: "Live Consultation",
        //     name: "Live Consultation",
        //     icon: <FontAwesomeIcon icon={faVideo} />,
        //     path: "",
        //     click: function (e: any) {
        //         e.preventDefault();
        //         setIsLiveConsultation(!isLiveConsultation);
        //         setIscurrentState('LiveConsultation');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isLiveConsultation,
        //     subMenu: [
        //         { id: "Live Consultation", name: "Live Consultation", path: "/liveConsultation", parentId: "LiveConsultation", roles: ['RECEPTIONIST'] },
        //         { id: "Live Meetings", name: "Live Meetings", path: "/liveMeetings", parentId: "LiveConsultation", roles: ['RECEPTIONIST'] },
        //     ],
        //     roles: ['RECEPTIONIST']
        // },
        // {
        //     id: "DownloadCenterOne",
        //     name: "Download Center",
        //     icon: <FontAwesomeIcon icon={faDownload} />,
        //     path: "",
        //     click: function (e: any) {
        //         e.preventDefault();
        //         setIsDownloadCenterOne(!isDownloadCenterOne);
        //         setIscurrentState('DownloadCenterOne');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isDownloadCenterOne,
        //     subMenu: [
        //         { id: "Content Type", name: "Content Type", path: "/main/contentType", parentId: "DownloadCenterOne", roles: ['ADMIN', 'SUPERADMIN'] },
        //         { id: "Content Share List", name: " Content Share List", path: "/main/contentShareList", parentId: "DownloadCenterOne", roles: ['ADMIN', 'SUPERADMIN'] },
        //     ],
        //     roles: ['ADMIN', 'SUPERADMIN']
        // },
        {
            id: "ViewInternalJobs",
            name: "Internal Jobs",
            path: '/main/ViewInternalJobs',
            subMenu: [],
            icon: <FontAwesomeIcon icon={faBullhorn} />,
            roles: ['RECEPTIONIST']
        },
        {
            id: "Reports",
            name: "Reports",
            icon: <FontAwesomeIcon icon={faChartLine} />,
            path: "",
            click: function (e: any) {
                e.preventDefault();
                setIsReport(!isReport);
                setIscurrentState('Report');
                updateIconSidebar(e);
            },
            stateVariables: isReport,
            subMenu: [
                { id: "OPD Report", name: "OPD Report", path: "/main/opdReport", parentId: "Reports", roles: ['ADMIN', 'SUPERADMIN', 'RECEPTIONIST', 'NURSE',] },
                { id: "Appointment Report", name: "Appointment Report", path: "/main/appointmentReport", parentId: "Reports", roles: ['ADMIN', 'SUPERADMIN'] },
                { id: "IPD Report", name: "IPD Report", path: "/main/ipdReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN', 'RECEPTIONIST', 'NURSE',] },
                { id: "Pharmacy Report", name: "Pharmacy Report", path: "/main/pharmacyReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN', 'PHARMACIST', 'RECEPTIONIST'] },
                { id: "Pathology Report", name: "Pathology Report", path: "/main/pathologyReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN', 'PATHOLOGIST', 'RECEPTIONIST'] },
                { id: "Radiology Report", name: "Radiology Report", path: "/main/radiologyReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN', 'RADIOLOGIST', 'RECEPTIONIST'] },
                { id: "Finance Report", name: "Finance Report", path: "/main/financeReport", parentId: "Reports", roles: ['ADMIN', 'SUPERADMIN'] },
                { id: "Additional Finance Report", name: "Additional Finance Report", path: "/main/additionalFinanceReport", parentId: "Reports", roles: ['ADMIN', 'SUPERADMIN'] },
                { id: "Ambulance Report", name: "Ambulance Report", path: "/main/ambulanceReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN'] },
                { id: "Blood Bank Report", name: "Blood Bank Report", path: "/main/bloodBankReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN'] },
                { id: "Birth/Death Report", name: "Birth/Death Report", path: "/main/birthDeathReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN'] },
                { id: "HR Report", name: "HR Report", path: "/main/hrReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN'] },
                // { id: "TPA Report", name: "TPA Report", path: "/main/tpaReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN'] },
                { id: "Inventory Report", name: "Inventory Report", path: "/main/inventoryReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN'] },
                // { id: "Live Consultation Report", name: "Live Consultation Report", path: "/liveConsultationReport", parentId: "Reports", roles: ['SUPERADMIN'] },
                // { id: "Log Report", name: "Log Report", path: "/main/logReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN'] },
                // { id: "OT Report", name: "OT Report", path: "/main/otReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN'] },
                // { id: "Patient Report", name: "Patient Report", path: "/main/patientReport", parentId: "Reports", roles: ['SUPERADMIN', 'ADMIN'] },
            ],
            roles: ['SUPERADMIN', 'ADMIN', 'RADIOLOGIST', 'PATHOLOGIST', 'PHARMACIST', 'RECEPTIONIST', 'NURSE',]
        },

        {
            id: "Setup",
            name: "Setup",
            icon: <FontAwesomeIcon icon={faGears} />,
            path: "",
            click: function (e: any) {
                e.preventDefault();
                setIsSetup(!isSetup);
                setIscurrentState('Setup');
                updateIconSidebar(e);
            },
            stateVariables: isSetup,
            subMenu: [
                { id: "patient", name: "Patient", path: "/main/patient-datatable", code: "Patient", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN',] },
                // { id: "Settings", name: "Settings", path: "/main/settingsMain", code: "Settings", parentId: "Setup", roles: ['SUPERADMIN', 'DOCTOR', 'NURSE','Admin','Pathology','Radiologist','Super Admin'] },
                { id: "HumanResource", name: "Human Resource", path: "/main/humanResourceMainSetup", code: "HumanResource", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN',] },
                { id: "Staff", name: "Staff", path: "/main/approveStaff", code: "Staff", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN'] },
                // { id: "Patient", name: "Patient", path: "/main/patientSetup", code: "Patient", parentId: "Setup", roles: ['SUPERADMIN', 'DOCTOR', 'ADMIN','PHARMACIST','PATHOLOGIST','RADIOLOGIST','NURSE','ACCOUNTANT'] },
                { id: "Hospital", name: "Hospital Charges", path: "/main/hospitalMain", code: "Hospital", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN', 'PHARMACIST', 'RADIOLOGIST', 'ACCOUNTANT'] },
                { id: "Bed", name: "Bed", path: "/main/bedMain", code: "Bed", parentId: "Setup", roles: ['SUPERADMIN', 'DOCTOR', 'NURSE', 'ADMIN', 'ACCOUNTANT', 'RECEPTIONIST'] },
                { id: "Front Office", name: "Front Office", path: "/main/frontofficeMain", code: "FrontOffice", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN', 'RECEPTIONIST'] },
                // { id: "Operation", name: "Operation", path: "/main/operationMain", code: "Operation", parentId: "Setup", roles: ['SUPERADMIN', 'DOCTOR', 'NURSE','Admin','Pathology','Radiologist','ADMIN'] },
                { id: "Pharmacy", name: "Pharmacy", path: "/main/pharmacyMainSetup", code: "Pharmacy", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN', 'PHARMACIST'] },

                { id: "Pathology", name: "Pathology", path: "/main/PathologyMainSetup", code: "Pathology", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN', 'PATHOLOGIST'] },

                { id: "Radiology", name: "Radiology", path: "/main/RadiologyMainSetup", code: "Radiology", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN', 'RADIOLOGIST'] },

                { id: "Blood Bank", name: "Blood Bank", path: "/main/BloadBankMainSetup", code: "Blood Bank", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN', 'PATHOLOGIST'] },
                { id: "Finance", name: "Finance", path: "/main/financeSetup", code: "Finance", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN', 'ACCOUNTANT'] },
                // { id: "Symptoms", name: "Symptoms", path: "/main/SymptomsMain", code: "Symptoms", parentId: "Setup", roles: ['SUPERADMIN', 'DOCTOR', 'NURSE','Admin','Pathology','Radiologist','ADMIN'] },
                // { id: "Findings", name: "Findings", path: "/main/FindingsMainSetup", code: "Findings", parentId: "Setup", roles: ['SUPERADMIN', 'DOCTOR', 'NURSE','Admin','Pathology','Radiologist','ADMIN'] },
                // { id: "Vitals", name: "Vitals", path: "/main/VitalsMainSetup", code: "Vitals", parentId: "Setup", roles: ['SUPERADMIN', 'DOCTOR', 'NURSE','Admin','Pathology','Radiologist','ADMIN'] },
                { id: "Inventory", name: "Inventory", path: "/main/InventoryMainSetup", code: "Inventory", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN', 'ACCOUNTANT'] },
                { id: "Referral", name: "Referral", path: "/main/referralMainSetup", code: "Referral", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN', 'ACCOUNTANT'] },
                { id: "Add Internal Jobs", name: "Add Internal Jobs", path: "/main/AddInternalJobs", code: "Add Jobs", parentId: "Setup", roles: ['SUPERADMIN', 'ADMIN', 'ACCOUNTANT'] },
            ],


            roles: ['SUPERADMIN', 'DOCTOR', 'NURSE', 'ADMIN', 'PATHOLOGIST', 'PHARMACIST', 'RADIOLOGIST', 'RECEPTIONIST', 'ACCOUNTANT']
        },
    ]
    return <React.Fragment>{menus}</React.Fragment>;
};
export default Navdata;