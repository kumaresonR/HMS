import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StorageService from "../helpers/storage/storage-service";
import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem,  Modal,  ModalBody } from "reactstrap";
//import images
import avatar1 from "../assets/images/users/user.jpeg";
import AuthApiService from "../helpers/services/auth/auth-api-service";
import { toast } from "react-toastify";
import LogoutModal from "../Components/Common/LogoutModal";

const ProfileDropdown = () => {
    const authService: AuthApiService = new AuthApiService();

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const navigate: any = useNavigate();

    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [expiredIn, setExpiredIn] = useState<any>('');
    const [refreshToken, setRefreshToken] = useState('');
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState('');
    const [modal_center, setmodal_center] = useState<boolean>(false);
    const [logoutModal, setLogoutModal] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    function tog_center() {
        setmodal_center(!modal_center);
    }
    useEffect(() => {
        const user = StorageService.getUserDataFromSessionStorage();
        // if(!user) {
        //     navigate('/')
        // }
        setUserName(user?.name);
        setUserRole(user?.role);
        setName(user?.name);
        setUserId(user?.user_id);
        setExpiredIn(user?.expire_in);
        setRefreshToken(user?.refresh_token);

        const refreshIntervalId = setInterval(() => {
            doRefresh(user?.refresh_token);
        }, 3000000);

        return () => {
            clearInterval(refreshIntervalId);
        };
    }, []);


    // const doLogout = () => {
    //     StorageService.clear();
    //     navigate('/');
    // }

    const viewDetails = (id: any) => {
        navigate('/main/MyProfiles', { state: { id: id } })
    }

    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    const handleLogout = () => {
        setLogoutModal(true);
    }

    const doLogout = async () => {
        try {
            const response = await authService.doLogout();
            if (response?.data) {
                toast(response?.data, { containerId: 'TR' });
            }
            navigate('/');
        } catch (error: any) {
            sessionStorage.clear();
            navigate('/');
            // return ErrorHandler(error);
        }
    }

    const doRefresh = async (data: any) => {
        if (!data) return;
        try {
            const loginResponse = await authService.refreshToken(data);
            if (loginResponse?.data) {
                const currentUserData = JSON.parse(sessionStorage.getItem('userData') || '{}');
                const updatedUserData = {
                    ...currentUserData,
                    access_token: loginResponse.data.access_token,
                    refresh_token: loginResponse.data.refresh_token,
                };
                sessionStorage.setItem('userData', JSON.stringify(updatedUserData));

                // setTimeout(() => {
                //     tog_center();
                // }, 240000);

                // setTimeout(() => {
                //     setmodal_center(false);
                //     doLogout();
                // }, 300000);
            }
        } catch (error: any) {
            console.log(error);
            // return ErrorHandler(error);
        }
    };

    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <img className="rounded-circle header-profile-user" src={avatar1}
                            alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{userName}</span>
                            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{userRole}</span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">Welcome {userName}!</h6>
                    <DropdownItem className='p-0'>
                        <Link to="#" onClick={(e) => { e.preventDefault(); viewDetails(userId) }} className="dropdown-item">
                            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                            <span className="align-middle">Profile</span>
                        </Link>
                    </DropdownItem>
                    {/* <DropdownItem className='p-0'>
                        <Link to="#" className="dropdown-item">
                            <i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle">Messages</span>
                        </Link>
                    </DropdownItem>
                    <DropdownItem className='p-0'>
                        <Link to={"#"} className="dropdown-item">
                            <i className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle">Taskboard</span>
                        </Link>
                    </DropdownItem>
                    <DropdownItem className='p-0'>
                        <Link to="#" className="dropdown-item">
                            <i
                                className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i> <span
                                    className="align-middle">Help</span>
                        </Link>
                    </DropdownItem>
                    <div className="dropdown-divider"></div>
                    <DropdownItem className='p-0'>
                        <Link to="#" className="dropdown-item">
                            <span
                                className="badge bg-success-subtle text-success mt-1 float-end">New</span><i
                                    className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i> <span
                                        className="align-middle">Settings</span>
                        </Link>
                    </DropdownItem>
                    <DropdownItem className='p-0'>
                        <Link to="#" className="dropdown-item">
                            <i
                                className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Lock screen</span>
                        </Link>
                    </DropdownItem> */}
                    <DropdownItem className='p-0' onClick={handleLogout}>
                        <Link to="#" className="dropdown-item">
                            <i
                                className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                                    className="align-middle" data-key="t-logout">Logout</span>
                        </Link>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Modal modalClassName="flip"
                isOpen={modal_center}
                toggle={() => {
                    tog_center();
                }}
                centered
            >
                <ModalBody className="py-3 px-5">
                    <div className="mt-2 text-center">
                        <i className={`ri-alert-line display-5 text-primary`}></i>
                        <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                            <h4 className={`mx-4 mb-0 text-primary`}>
                                Please save your work! You will be logged out in 1 minute.
                            </h4>
                        </div>
                    </div>
                    <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                        <button
                            type="button"
                            className="btn w-sm btn-light material-shadow-none"
                            data-bs-dismiss="modal"
                            onClick={tog_center}
                        >
                            Close
                        </button>
                    </div>
                </ModalBody>
            </Modal>

            <LogoutModal
                show={logoutModal}
                onDeleteClick={doLogout}
                onCloseClick={() => setLogoutModal(false)}
            />
        </React.Fragment>
    );
}
export default ProfileDropdown