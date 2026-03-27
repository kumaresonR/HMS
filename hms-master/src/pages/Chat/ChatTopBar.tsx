import React, { useEffect, useState, useRef } from "react";
import {
    Container,
    Button,
    UncontrolledTooltip,
    Input,
    DropdownToggle,
    DropdownMenu,
    Dropdown,
    DropdownItem,
    Row,
    Col,
    Card,
    CardBody,
    UncontrolledDropdown,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Alert
} from "reactstrap";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import classnames from "classnames";
import EmojiPicker from 'emoji-picker-react';

// Import Icons
import FeatherIcon from "feather-icons-react";
import { useSelector, useDispatch } from "react-redux";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import userDummayImage from "../../assets/images/users/user-dummy-img.jpg";
import "react-perfect-scrollbar/dist/css/styles.css";
import { createSelector } from "reselect";
import Spinners from "../../Components/Common/Spinner";

const dummyContacts = [
    {
        id: 1,
        roomId: 1,
        status: "online",
        name: "John Doe",
        image: avatar2,
        number: "123456789",
        email: "johndoe@example.com",
        bgColor: "bg-primary",
        badge: 2,
        location: "New York"
    },
    {
        id: 2,
        roomId: 2,
        status: "offline",
        name: "Jane Smith",
        image: userDummayImage,
        number: "987654321",
        email: "janesmith@example.com",
        bgColor: "bg-secondary",
        badge: 0,
        location: "Los Angeles"
    }
];

const dummyMessages = [
    {
        id: 1,
        roomId: 1,
        sender: "John Doe",
        createdAt: "12:45 PM",
        usermessages: [
            {
                id: 1,
                from_id: 1,
                to_id: 2,
                msg: "Hello, how are you?",
                reply: { sender: "Jane Smith", msg: "I'm good, thanks!", id: 1 },
                isImages: false,
                has_images: [],
                datetime: "12:45 PM"
            }
        ]
    }
];

const ChatTopBar = () => {
    const userChatShow: any = useRef();
    const [customActiveTab, setcustomActiveTab] = useState("1");
    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };

    const dispatch = useDispatch<any>();
    const [isInfoDetails, setIsInfoDetails] = useState<boolean>(false);
    const [Chat_Box_Username, setChat_Box_Username] = useState<any>("John Doe");
    const [user_Status, setUser_Status] = useState<string | null>("online");
    const [Chat_Box_Image, setChat_Box_Image] = useState<any>(avatar2);
    const [currentRoomId, setCurrentRoomId] = useState<any>(1);
    const [curMessage, setcurMessage] = useState<string>("");
    const [search_Menu, setsearch_Menu] = useState<boolean>(false);
    const [settings_Menu, setsettings_Menu] = useState<boolean>(false);
    const [reply, setreply] = useState<any>("");
    const [emojiPicker, setemojiPicker] = useState<boolean>(false);

    // Dummy data selector
    const chatProperties = createSelector(
        () => ({
            chats: dummyContacts,
            messages: dummyMessages,
            loading: false
        })
    );


    const { chats, messages, loading } = useSelector(chatProperties);

    const [isLoading, setLoading] = useState(loading);

    const toggleSearch = () => {
        setsearch_Menu(!search_Menu);
    };

    const toggleInfo = () => {
        setIsInfoDetails(!isInfoDetails);
    };

    const toggleSettings = () => {
        setsettings_Menu(!settings_Menu);
    };

    const userChatOpen = (chat: any) => {
        setChat_Box_Username(chat.name);
        setCurrentRoomId(chat.roomId);
        setChat_Box_Image(chat.image);
        setUser_Status(chat.status);
        // Remove unread messages (no backend logic here)
    };

    const backToUserChat = () => {
        userChatShow.current.classList.remove("user-chat-show");
    };

    const addMessage = () => {
        if (curMessage !== '') {
            const message: any = {
                id: Math.floor(Math.random() * 100),
                from_id: 1,
                to_id: 2,
                msg: curMessage,
                reply: reply,
                isImages: false,
                has_images: [],
                datetime: new Date().toLocaleTimeString()
            };
            // dispatch(onAddMessage(message)); // Using dummy data, no dispatch required
        }
        setcurMessage("");
        setreply('');
    };

    const chatRef = useRef<any>(null);

    const onKeyPress = (e: any) => {
        const { key, value } = e;
        if (key === "Enter") {
            e.preventDefault();
            setcurMessage(value);
            addMessage();
        }
    };

    const searchMessages = () => {
        const searchInput = document.getElementById("searchMessage") as HTMLInputElement;
        const searchFilter = searchInput.value.toUpperCase();
        const searchUL = document.getElementById("users-conversation") as HTMLInputElement;
        const searchLI = searchUL.getElementsByTagName("li");

        Array.prototype.forEach.call(searchLI, (search: HTMLElement) => {
            const a = search.getElementsByTagName("p")[0] || '';
            const txtValue = a.textContent || a.innerText || '';

            if (txtValue.toUpperCase().indexOf(searchFilter) > -1) {
                search.style.display = "";
            } else {
                search.style.display = "none";
            }
        });
    };

    const handleClick = (ele: HTMLElement) => {
        const copy = ele.closest(".chat-list")?.querySelector('.ctext-content')?.innerHTML;
        if (copy) {
            navigator.clipboard.writeText(copy);
        }

        const copyClipboardElement = document.getElementById("copyClipBoard");
        if (copyClipboardElement) {
            copyClipboardElement.style.display = "block";
            setTimeout(() => {
                copyClipboardElement.style.display = "none";
            }, 1000);
        }
    };

    const [emojiArray, setemojiArray] = useState<any>([]);
    const onEmojiClick = (event: any, emojiObject: any) => {
        setemojiArray([...emojiArray, event.emoji]);
        setcurMessage(curMessage + event.emoji);
    };

    return (
        <Row className="align-items-center">
            <Col sm={4} xs={8}>
                <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 d-block d-lg-none me-3">
                        <Link to="#" onClick={backToUserChat} className="user-chat-remove fs-18 p-1">
                            <i className="ri-arrow-left-s-line align-bottom"></i>
                        </Link>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 chat-user-img online user-own-img align-self-center me-3 ms-0">
                                {Chat_Box_Image === undefined ? (
                                    <img src={userDummayImage} className="rounded-circle avatar-xs" alt="" />
                                ) : (
                                    <img src={Chat_Box_Image} className="rounded-circle avatar-xs" alt="" />
                                )}
                                <span className="user-status"></span>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                                <h5 className="text-truncate mb-0 fs-16">
                                    <a className="text-reset username" data-bs-toggle="offcanvas" href="#userProfileCanvasExample" aria-controls="userProfileCanvasExample">
                                        {Chat_Box_Username}
                                    </a>
                                </h5>
                                <p className="text-truncate text-muted fs-14 mb-0 userStatus">
                                    <small>{user_Status === null ? "24 Members" : user_Status}</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col sm={8} xs={4}>
                <ul className="list-inline user-chat-nav text-end mb-0">
                    <li className="list-inline-item m-0">
                        <Dropdown isOpen={search_Menu} toggle={toggleSearch}>
                            <DropdownToggle className="btn btn-ghost-secondary btn-icon material-shadow-none" tag="button">
                                <FeatherIcon icon="search" className="icon-sm" />
                            </DropdownToggle>
                            <DropdownMenu className="p-0 dropdown-menu-end dropdown-menu-lg">
                                <div className="p-2">
                                    <div className="search-box">
                                        <Input
                                            id="searchMessage"
                                            onKeyUp={searchMessages}
                                            type="text"
                                            className="form-control"
                                            placeholder="Search"
                                        />
                                    </div>
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </li>
                    <li className="list-inline-item m-0">
                        <Dropdown isOpen={settings_Menu} toggle={toggleSettings}>
                            <DropdownToggle className="btn btn-ghost-secondary btn-icon material-shadow-none" tag="button">
                                <FeatherIcon icon="settings" className="icon-sm" />
                            </DropdownToggle>
                            <DropdownMenu className="p-0 dropdown-menu-end">
                                <DropdownItem tag="button" onClick={toggleInfo}>Profile</DropdownItem>
                                <DropdownItem tag="button">Block</DropdownItem>
                                <DropdownItem tag="button">Clear Chat</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </li>
                </ul>
            </Col>
        </Row>
    );
};

export default ChatTopBar;
