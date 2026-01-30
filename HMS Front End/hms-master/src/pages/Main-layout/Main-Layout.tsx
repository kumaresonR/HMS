import React, { useEffect, useState } from "react"
import Header from "../../Layouts/Header"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Footer from "../../Layouts/Footer";
import Sidebar from "../../Layouts/Sidebar";
import { changeLayout, changeLayoutMode, changeLayoutPosition, changeLayoutWidth, changeLeftsidebarSizeType, changeLeftsidebarViewType, changeSidebarImageType, changeSidebarTheme, changeSidebarVisibility, changeTopbarTheme } from "../../slices/thunks";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect';
import RightSidebar from "../../Components/Common/RightSidebar";
import { RoleProvider } from "../../common/RolePermission/RoleContext";
import Spinner from "../../common/Spinner";
import { RootState } from "../../slices/loader/store";
import MinimizedPages from "../../Components/Common/MinimizedWindows";
import { Button } from "reactstrap";
import { IoArrowBack } from "react-icons/io5";
import GlobalModal from "../../Components/Common/GlobalModal";
import { ModalProvider } from "../../Components/Common/ModalContext";

const MainLayout = () => {
    const [headerClass, setHeaderClass] = useState("");
    const dispatch: any = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // Get minimized pages from Redux state
    const minimizedPages = useSelector((state: RootState) => state.ui.minimizedPages);

    // Check if the current page is minimized
    const isMinimized = minimizedPages.some((page) => page.route === location.pathname);

    const selectLayoutState = (state: any) => state.Layout;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (layout) => ({
            layoutType: layout.layoutType,
            leftSidebarType: layout.leftSidebarType,
            layoutModeType: layout.layoutModeType,
            layoutWidthType: layout.layoutWidthType,
            layoutPositionType: layout.layoutPositionType,
            topbarThemeType: layout.topbarThemeType,
            leftsidbarSizeType: layout.leftsidbarSizeType,
            leftSidebarViewType: layout.leftSidebarViewType,
            leftSidebarImageType: layout.leftSidebarImageType,
            preloader: layout.preloader,
            sidebarVisibilitytype: layout.sidebarVisibilitytype,
        })
    );
    // Inside your component
    const {
        layoutType,
        leftSidebarType,
        layoutModeType,
        layoutWidthType,
        layoutPositionType,
        topbarThemeType,
        leftsidbarSizeType,
        leftSidebarViewType,
        leftSidebarImageType,
        sidebarVisibilitytype
    } = useSelector(selectLayoutProperties);

    /*
    layout settings
    */
    useEffect(() => {
        if (
            layoutType ||
            leftSidebarType ||
            layoutModeType ||
            layoutWidthType ||
            layoutPositionType ||
            topbarThemeType ||
            leftsidbarSizeType ||
            leftSidebarViewType ||
            leftSidebarImageType ||
            sidebarVisibilitytype
        ) {
            window.dispatchEvent(new Event('resize'));
            dispatch(changeLeftsidebarViewType(leftSidebarViewType));
            dispatch(changeLeftsidebarSizeType(leftsidbarSizeType));
            dispatch(changeSidebarTheme(leftSidebarType));
            dispatch(changeLayoutMode(layoutModeType));
            dispatch(changeLayoutWidth(layoutWidthType));
            dispatch(changeLayoutPosition(layoutPositionType));
            dispatch(changeTopbarTheme(topbarThemeType));
            dispatch(changeLayout(layoutType));
            dispatch(changeSidebarImageType(leftSidebarImageType));
            dispatch(changeSidebarVisibility(sidebarVisibilitytype));
        }
    }, [layoutType,
        leftSidebarType,
        layoutModeType,
        layoutWidthType,
        layoutPositionType,
        topbarThemeType,
        leftsidbarSizeType,
        leftSidebarViewType,
        leftSidebarImageType,
        sidebarVisibilitytype,
        dispatch]);
    /*
    call dark/light mode
    */
    const onChangeLayoutMode = (value: any) => {
        if (changeLayoutMode) {
            dispatch(changeLayoutMode(value));
        }
    };

    // class add remove in header 
    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
    });

    function scrollNavigation() {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setHeaderClass("topbar-shadow");
        } else {
            setHeaderClass("");
        }
    }

    useEffect(() => {
        const humberIcon = document.querySelector(".hamburger-icon") as HTMLElement;
        if (sidebarVisibilitytype === 'show' || layoutType === "vertical" || layoutType === "twocolumn") {
            humberIcon.classList.remove('open');
        } else {
            humberIcon && humberIcon.classList.add('open');
        }
    }, [sidebarVisibilitytype, layoutType]);

    return (
        <React.Fragment>
            <ModalProvider>
                <RoleProvider>
                    <GlobalModal />
                    <div id="layout-wrapper">
                        <Header
                            headerClass={headerClass}
                            layoutModeType={layoutModeType}
                            onChangeLayoutMode={onChangeLayoutMode}
                        />
                        <Sidebar
                            layoutType={layoutType}
                        />
                        <div className="main-content">
                            <div className="page-content mb-5">
                                {isMinimized ? (
                                    <div className="text-end">
                                        <Button
                                            color="primary"
                                            onClick={() => navigate(-1)}
                                            className="btn btn-primary add-btn ms-3"
                                        >
                                            <IoArrowBack /> Back
                                        </Button>
                                    </div>
                                ) : (
                                    <Spinner />
                                )}

                                {!isMinimized && <Outlet />}
                            </div>
                            <MinimizedPages />
                            <Footer />
                        </div>

                        <RightSidebar />
                    </div>
                </RoleProvider>
            </ModalProvider>


        </React.Fragment>
    )
}
export default MainLayout