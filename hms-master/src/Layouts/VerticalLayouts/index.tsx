import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Collapse } from "reactstrap";
// Import Data
import navdata from "../LayoutMenuData";
import { useSelector } from "react-redux";
import { createSelector } from 'reselect';

const VerticalLayout = (props: any) => {
    const navData = navdata().props.children;
    const [selectedItem, setSelectedItem] = useState(null);
    const location = useLocation();
    const isActive = (path:any) => location.pathname === path;

    const selectLayoutProperties = createSelector(
        (state: any) => state.Layout,
        (layout) => ({
            leftsidbarSizeType: layout.leftsidbarSizeType,
            sidebarVisibilitytype: layout.sidebarVisibilitytype,
            layoutType: layout.layoutType
        })
    );
    // Inside your component
    const {
        leftsidbarSizeType, sidebarVisibilitytype, layoutType
    } = useSelector(selectLayoutProperties);

    //vertical and semibox resize events
    const resizeSidebarMenu = useCallback(() => {
        var windowSize = document.documentElement.clientWidth;
        const humberIcon = document.querySelector(".hamburger-icon") as HTMLElement;
        var hamburgerIcon = document.querySelector(".hamburger-icon");
        if (windowSize >= 1025) {
            if (document.documentElement.getAttribute("data-layout") === "vertical") {
                document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType);
            }
            if (document.documentElement.getAttribute("data-layout") === "semibox") {
                document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType);
            }
            if ((sidebarVisibilitytype === "show" || layoutType === "vertical" || layoutType === "twocolumn") && document.querySelector(".hamburger-icon")) {
                if (hamburgerIcon !== null) {
                    hamburgerIcon.classList.remove("open");
                }
            } else {
                // var hamburgerIcon = document.querySelector(".hamburger-icon");
                if (hamburgerIcon !== null) {
                    hamburgerIcon.classList.add("open");
                }
            }

        } else if (windowSize < 1025 && windowSize > 767) {
            document.body.classList.remove("twocolumn-panel");
            if (document.documentElement.getAttribute("data-layout") === "vertical") {
                document.documentElement.setAttribute("data-sidebar-size", "sm");
            }
            if (document.documentElement.getAttribute("data-layout") === "semibox") {
                document.documentElement.setAttribute("data-sidebar-size", "sm");
            }
            if (humberIcon) {
                humberIcon.classList.add("open");
            }
        } else if (windowSize <= 767) {
            document.body.classList.remove("vertical-sidebar-enable");
            if (document.documentElement.getAttribute("data-layout") !== "horizontal") {
                document.documentElement.setAttribute("data-sidebar-size", "lg");
            }
            if (humberIcon) {
                humberIcon.classList.add("open");
            }
        }
    }, [leftsidbarSizeType, sidebarVisibilitytype, layoutType]);

    useEffect(() => {
        window.addEventListener("resize", resizeSidebarMenu, true);
    }, [resizeSidebarMenu]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const initMenu = () => {
            const ul = document.getElementById("navbar-nav") as HTMLElement;
            const items: any = ul.getElementsByTagName("a");
            let itemsArray = [...items]; // converts NodeList to Array
            removeActivation(itemsArray);
        };
        initMenu();
    }, [props.layoutType]);

    function activateParentDropdown(item: any) {
        item.classList.add("active");
        let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

        if (parentCollapseDiv) {
            // to set aria expand true remaining
            parentCollapseDiv.classList.add("show");
            parentCollapseDiv.parentElement.children[0].classList.add("active");
            parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
            if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
                parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
                if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
                if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse")) {
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").classList.add("show");
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").previousElementSibling.classList.add("active");
                }
            }
            return false;
        }
        return false;
    }

    const removeActivation = (items: any) => {
        let actiItems = items.filter((x: any) => x.classList.contains("active"));

        actiItems.forEach((item: any) => {
            if (item.classList.contains("menu-link")) {
                if (!item.classList.contains("active")) {
                    item.setAttribute("aria-expanded", false);
                }
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
            }
            if (item.classList.contains("nav-link")) {
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
                item.setAttribute("aria-expanded", false);
            }
            item.classList.remove("active");
        });
    };

    return (
        <React.Fragment>
            {/* menu Items */}
            {(navData || []).map((item: any, key: number) => {
                return (
                    <React.Fragment key={key}>
                        {/* Main Header */}
                        {item['isHeader'] ?
                            <li className="menu-title"><span data-key="t-menu">{item.name} </span></li>
                            : (
                                (item.subMenu ? (
                                    <li className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
                                        <Link
                                            onClick={item.click}
                                            className="nav-link menu-link"
                                            to={item.path}
                                            data-bs-toggle={item.subMenu && item.subMenu.length > 0 ? "collapse" : undefined}
                                        >
                                            <i>{item.icon}</i>
                                            <span data-key="t-apps">{item.name}</span>
                                        </Link>
                                        {item.subMenu && item.subMenu.length > 0 && (
                                            <Collapse
                                                className="menu-dropdown"
                                                isOpen={item.stateVariables}
                                                id="sidebarApps">
                                                <ul className="nav nav-sm flex-column test">
                                                    {/* subItms  */}
                                                    {item.subMenu && ((item.subMenu || []).map((subItem: any, key: number) => (
                                                        <React.Fragment key={key}>
                                                            {!subItem.isChildItem ? (
                                                                <li className={`nav-item ${isActive(subItem.path) ? 'active' : ''}`}>
                                                                    <Link
                                                                        to={subItem.path ? subItem.path : "/#"}
                                                                        className="nav-link"
                                                                    >
                                                                        {subItem.name}
                                                                    </Link>
                                                                </li>
                                                            ) : (
                                                                <li className="nav-item">
                                                                    <Link
                                                                        onClick={subItem.click}
                                                                        className="nav-link"
                                                                        to="/#"
                                                                        data-bs-toggle="collapse"
                                                                    >
                                                                        {subItem.name}
                                                                    </Link>
                                                                    <Collapse className="menu-dropdown" isOpen={subItem.stateVariables} id="sidebarEcommerce">
                                                                        <ul className="nav nav-sm flex-column">
                                                                            {/* child subItms  */}
                                                                            {subItem.childItems && (
                                                                                (subItem.childItems || []).map((childItem: any, key: number) => (
                                                                                    <React.Fragment key={key}>
                                                                                        {!childItem.childItems ?
                                                                                            <li className="nav-item">
                                                                                                <Link
                                                                                                    to={childItem.path ? childItem.path : "/#"}
                                                                                                    className="nav-link">
                                                                                                    {childItem.name}
                                                                                                </Link>
                                                                                            </li>
                                                                                            : <li className="nav-item">
                                                                                                <Link to="/main#" className="nav-link" onClick={childItem.click} data-bs-toggle="collapse">
                                                                                                    {childItem.name}
                                                                                                </Link>
                                                                                                <Collapse className="menu-dropdown" isOpen={childItem.stateVariables} id="sidebaremailTemplates">
                                                                                                    <ul className="nav nav-sm flex-column">
                                                                                                        {childItem.childItems.map((subChildItem: any, key: number) => (
                                                                                                            <li className="nav-item" key={key}>
                                                                                                                <Link to={subChildItem.path} className="nav-link" data-key="t-basic-action">{subChildItem.name} </Link>
                                                                                                            </li>
                                                                                                        ))}
                                                                                                    </ul>
                                                                                                </Collapse>
                                                                                            </li>
                                                                                        }
                                                                                    </React.Fragment>
                                                                                ))
                                                                            )}
                                                                        </ul>
                                                                    </Collapse>
                                                                </li>
                                                            )}
                                                        </React.Fragment>
                                                    ))
                                                    )}
                                                </ul>

                                            </Collapse>
                                        )}
                                    </li>
                                ) : (
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link menu-link"
                                            to={item.path ? item.path : "/#"}>
                                            <i className={item.icon}></i> <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))
                            )
                        }
                    </React.Fragment>
                );
            })}
        </React.Fragment>
    )
}
export default VerticalLayout