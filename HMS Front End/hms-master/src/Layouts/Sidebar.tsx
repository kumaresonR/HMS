import { faList, faGear, faCartShopping, faRightFromBracket, faAngleDown, faBedPulse, faCalendarCheck, faDesktop, faDroplet, faFileInvoice, faFlask, faMicroscope, faMortarPestle, faStethoscope, faTruckMedical, faAngleRight, faMinus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import StorageService from "../helpers/storage/storage-service"
import { Col, Container, List, ListGroup, ListGroupItem, NavLink } from "reactstrap"
import SimpleBar from "simplebar-react"
//import logo
import logoSm from "../assets/images/RedHeart.png";
import logoDark from "../assets/images/Red_medic.png";
import VerticalLayout from "./VerticalLayouts"

const sideMenu = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: '/',
    subMenu: [],
    icon: <FontAwesomeIcon icon={faDesktop} />,
    roles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'RECEPTIONIST']
  },
  {
    id: "patient",
    name: "Patient",
    path: '',
    subMenu: [
      {
        id: "createPatient",
        name: "Create Patient",
        path: '/create-patient',
        code: 'createPatient',
        parentId: "patient",
        roles: ['admin', 'super_admin', 'RECEPTIONIST'],
      },
      {
        id: "editPatient",
        name: "Edi Patient",
        path: '',
        code: 'editPatient',
        parentId: "patient",
        roles: ['admin', 'super_admin', 'nurse', 'RECEPTIONIST']
      },
      {
        id: "deletePatient",
        name: "Delete Patient",
        path: '',
        code: 'deletePatient',
        parentId: "patient",
        roles: ['admin', 'super_admin', 'nurse', 'RECEPTIONIST']
      }
    ],
    icon: <FontAwesomeIcon icon={faStethoscope} />,
    roles: ['super_admin', 'admin', 'doctor', 'nurse', 'RECEPTIONIST']
  },
  {
    id: "appointment",
    name: "Appointment",
    path: '',
    subMenu: [
      {
        id: "createAppointment",
        name: "Create Appointment",
        path: '',
        code: 'createAppointment',
        parentId: "appointment",
        roles: ['admin', 'super_admin', 'RECEPTIONIST'],
        isChildItem: true,
        childItems: [
          {
            id: 1,
            name: "Main Calendar",
            path: "/apps-calendar",
            parentId: "appointment",
            code: 'mainCalendar',
            roles: ['admin', 'super_admin', 'RECEPTIONIST'],
          },
          {
            id: 2,
            name: "Month Grid",
            path: "/apps-calendar-month-grid",
            parentId: "appointment",
            code: 'monthGrid',
            roles: ['admin', 'super_admin', 'RECEPTIONIST'],
          },
        ]
      }
    ],
    icon: <FontAwesomeIcon icon={faCalendarCheck} />,
    roles: ['super_admin', 'admin', 'doctor', 'nurse', 'RECEPTIONIST']
  },
  {
    id: "mailbox",
    name: "Mailbox",
    path: '',
    subMenu: [
      {
        id: "createMailbox",
        name: "Create Mailbox",
        path: '',
        code: 'createMailbox',
        parentId: "mailbox",
        roles: ['admin', 'super_admin', 'RECEPTIONIST'],
        isChildItem: true,
        childItems: [
          {
            id: 1,
            name: "Main Calendars",
            path: "/apps-calendar",
            parentId: "createMailbox",
            code: 'mainCalendars',
            roles: ['admin', 'super_admin', 'RECEPTIONIST'],
            isChildItem: true,
            childItems: [
              {
                id: 2, name: "Basic Action",
                path: "/apps-email-basic",
                parentId: "createMailbox",
                roles: ['admin', 'super_admin', 'RECEPTIONIST'],
              },
              {
                id: 3,
                name: "Ecommerce Action",
                path: "/apps-email-ecommerce",
                parentId: "createMailbox",
                roles: ['admin', 'super_admin', 'RECEPTIONIST'],
              },
            ],
          }
        ]
      }
    ],
    icon: <FontAwesomeIcon icon={faCalendarCheck} />,
    roles: ['super_admin', 'admin', 'doctor', 'nurse', 'RECEPTIONIST']
  }
]
const SideBar = ({ layoutType }: any) => {
  const navigate: any = useNavigate();
  const [menus, setMenus] = useState<any[]>([]);
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);
  const [activeSubMenuItem, setActiveSubMenuItem] = useState<string>("");
  const [isDashboard, setIsDashboard] = useState<boolean>(false);

  const toggleSubMenu = (menu: any, index: number) => {
    setActiveSubMenu(index === activeSubMenu ? null : index);
    setActiveSubMenuItem("");
    if (menu.subMenu.length > 0) {
      navigate(menu.subMenu[0].path);
    } else {
      navigate(menu.path);
    }
  };

  const filterMenusBasedOnRole = () => {
    const userData = StorageService.getUserDataFromSessionStorage();
    const userRoles = userData ? userData.role : [];
    const newFilteredMenus = sideMenu.map(menu => {
      // Filter the submenu items based on roles
      const filteredSubMenu = menu.subMenu.filter((sub: any) =>
        sub.roles.some((role: any) => userRoles.includes(role))
      );

      // Return the menu item only if the main item roles match or subMenu is not empty
      return {
        ...menu,
        ...(menu.roles.some(role => userRoles.includes(role)) || filteredSubMenu.length > 0)
          ? { subMenu: filteredSubMenu }
          : { subMenu: [] }
      };
    }).filter(menu =>
      menu.roles.some(role => userRoles.includes(role)) || menu.subMenu.length > 0
    );

    setMenus(newFilteredMenus);
  }

  const toggleSubMenuItem = (subData: any) => {
    setActiveSubMenuItem(subData.name);
    navigate(subData.path);
  };

  useEffect(() => {
    var verticalOverlay = document.getElementsByClassName("vertical-overlay");
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener("click", function () {
        document.body.classList.remove("vertical-sidebar-enable");
      });
    }
  });

  const addEventListenerOnSmHoverMenu = () => {
    // add listener Sidebar Hover icon on change layout from setting
    if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active');
    } else if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover-active') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    } else {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    }
  };

  return (
    <React.Fragment>
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box pt-4 pb-3 ps-2">
          <Link to="#" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="42" />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="" height="50" />
            </span>
          </Link>
          <Link to="#" className="logo logo-light">
            <span className="logo-sm ">
              <img src={logoSm} alt="" height="42" />
            </span>
            <span className="logo-lg py-2">
              <img src={logoDark} alt="" height="50" />
            </span>
          </Link>

          {/* <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoLight} alt="" height="40" />
            </span>
          </Link> */}
          {/* <h3 style={{ color: 'white', padding: '10px' }}>I-HMS-X</h3> */}
          <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>

        <React.Fragment>
          <SimpleBar id="scrollbar" className="h-100">
            <Container fluid>
              <div id="two-column-menu"></div>
              <ul className="navbar-nav mb-5" id="navbar-nav" style={{marginTop:'10px'}}>
                <VerticalLayout layoutType={layoutType} />
              </ul>
            </Container>
          </SimpleBar>
          <div className="sidebar-background"></div>
        </React.Fragment>

      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  )
}
export default SideBar