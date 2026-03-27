import React, { useEffect, useState, useRef } from "react";
import { Container, Button, UncontrolledTooltip } from "reactstrap";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import "react-perfect-scrollbar/dist/css/styles.css";
import { createSelector } from "reselect";

interface DirectContact {
    id: number;
    roomId: number;
    status: string;
    name: string;
    image: string;
    number: string;
    email: string;
    bgColor: string;
    badge: string | number;
    location: string;
}

interface channelsListType {
    id: number;
    name: string;
    unReadMessage?: number;
    image: string;
}

interface chatContactType {
    direactContact?: DirectContact[];
    channelsList?: channelsListType[];
}

interface contact {
    id: number;
    name: string;
    status: string;
    roomId: number;
    image?: string;
}

interface chatContactDataTye {
    id: number;
    title: string;
    contacts?: contact[];
}

type UserMessage = {
    id: number;
    from_id: number;
    to_id: number;
    msg: string | null;
    reply: { sender: string; msg: string; id: number };
    isImages: boolean;
    has_images: { id: number; image: string }[];
    datetime: string;
};

const ChatUsers = () => {
    const userChatShow: any = useRef();
    const [isInfoDetails, setIsInfoDetails] = useState<boolean>(false);
    const [Chat_Box_Username, setChat_Box_Username] = useState<any>("Lisa Parker");
    const [user_Status, setUser_Status] = useState<string | null>("online");
    const [Chat_Box_Image, setChat_Box_Image] = useState<any>(avatar2);
    const [currentRoomId, setCurrentRoomId] = useState<any>(1);
    const [curMessage, setcurMessage] = useState<string>("");
    const [search_Menu, setsearch_Menu] = useState<boolean>(false);
    const [settings_Menu, setsettings_Menu] = useState<boolean>(false);
    const [reply, setreply] = useState<any>("");

    // Dummy data
    const dummyContacts = [
        {
            id: 1,
            roomId: 1,
            status: "online",
            name: "John Doe",
            image: "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png",
            number: "123456789",
            email: "john.doe@example.com",
            bgColor: "primary",
            badge: 5,
            location: "New York"
        },
        {
            id: 2,
            roomId: 2,
            status: "away",
            name: "Alice Smith",
            image: "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png",
            number: "987654321",
            email: "alice.smith@example.com",
            bgColor: "success",
            badge: 3,
            location: "Los Angeles"
        },
        {
            id: 3,
            roomId: 3,
            status: "offline",
            name: "Bob Lee",
            // image: "avatar3.png",
            number: "123987654",
            email: "bob.lee@example.com",
            bgColor: "danger",
            badge: 0,
            location: "Chicago"
        },
        {
            id: 4,
            roomId: 4,
            status: "busy",
            name: "Eva Green",
            image: "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png",
            number: "654321987",
            email: "eva.green@example.com",
            bgColor: "warning",
            badge: 7,
            location: "Miami"
        },
        {
            id: 5,
            roomId: 5,
            status: "offline",
            name: "David Brown",
            image: "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png",
            number: "987123654",
            email: "david.brown@example.com",
            bgColor: "secondary",
            badge: 2,
            location: "Austin"
        }
    ];

    const dummyChannels = [
        {
            id: 1,
            name: "General Chat",
            unReadMessage: 10,
            image: "channel1.png"
        },
        {
            id: 2,
            name: "Support",
            unReadMessage: 2,
            image: "channel2.png"
        },
        {
            id: 3,
            name: "Team A",
            unReadMessage: 0,
            image: "channel3.png"
        },
        {
            id: 4,
            name: "Marketing",
            unReadMessage: 5,
            image: "channel4.png"
        },
        {
            id: 5,
            name: "HR",
            unReadMessage: 8,
            image: "channel5.png"
        }
    ];

    // Dummy messages
    const dummyMessages = [
        {
            id: 1,
            from_id: 1,
            to_id: 2,
            msg: "Hey Alice, how are you?",
            reply: { sender: "Alice", msg: "I'm good, thanks!", id: 2 },
            isImages: false,
            has_images: [],
            datetime: "10:15 am"
        },
        {
            id: 2,
            from_id: 2,
            to_id: 1,
            msg: "I'm doing well, John. What about you?",
            reply: { sender: "John", msg: "I'm good too!", id: 1 },
            isImages: false,
            has_images: [],
            datetime: "10:16 am"
        },
        {
            id: 3,
            from_id: 3,
            to_id: 1,
            msg: "Hey John, long time no see!",
            reply: { sender: "John", msg: "Yeah, it's been a while!", id: 1 },
            isImages: false,
            has_images: [],
            datetime: "10:20 am"
        },
        {
            id: 4,
            from_id: 4,
            to_id: 2,
            msg: "Eva here! Let's discuss the new project details.",
            reply: { sender: "Alice", msg: "Sure, let's talk more about it.", id: 2 },
            isImages: false,
            has_images: [],
            datetime: "10:25 am"
        },
        {
            id: 5,
            from_id: 5,
            to_id: 1,
            msg: "David here! When can we catch up?",
            reply: { sender: "John", msg: "Let's schedule a call this afternoon.", id: 1 },
            isImages: false,
            has_images: [],
            datetime: "10:30 am"
        }
    ];


    const [chats, setChats] = useState<any[]>([
        {
            direactContact: dummyContacts,
            channelsList: dummyChannels
        }
    ]);
    const [messages, setMessages] = useState(dummyMessages);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Simulating fetching messages
        setMessages(dummyMessages);
    }, [currentRoomId]);

    const userChatOpen = (chat: any) => {
        setChat_Box_Username(chat.name);
        setCurrentRoomId(chat.roomId);
        setChat_Box_Image(chat.image);
        setUser_Status(chat.status);
        // Simulate message fetching
        setMessages(dummyMessages);

        if (window.innerWidth < 892) {
            userChatShow.current.classList.add("user-chat-show");
        }

        // remove unread msg on read in chat
        var unreadMessage: any = document.getElementById("unread-msg-user" + chat.id);
        var msgUser: any = document.getElementById("msgUser" + chat.id);
        if (unreadMessage) {
            unreadMessage.style.display = "none";
        }
        if (msgUser) {
            msgUser.classList.remove("unread-msg-user");
        }
    };

    const addMessage = () => {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        if (curMessage !== '') {
            const message: any = {
                id: Math.floor(Math.random() * 100),
                from_id: 1,
                to_id: 2,
                msg: curMessage,
                reply: reply,
                isImages: false,
                has_images: [],
                datetime: `${hours}:${minutes} ${ampm}`
            };
            setMessages([...messages, message]); // Update with new message
        }
        setcurMessage("");
        setreply('');
    };

    const chatRef = useRef<any>(null);
    useEffect(() => {
        if (chatRef.current?.el) {
            chatRef.current.getScrollElement().scrollTop = chatRef.current.getScrollElement().scrollHeight;
        }
    }, [messages]);

    return (
        <div>
            <SimpleBar className="chat-room-list pt-3" style={{ margin: "-16px 0px 0px" }}>
                <div className="d-flex align-items-center px-4 mb-2">
                    <div className="flex-grow-1">
                        <h4 className="mb-0 fs-11 text-muted text-uppercase">
                            Direct Messages
                        </h4>
                    </div>
                    <div className="flex-shrink-0">
                        <UncontrolledTooltip placement="bottom" target="addnewmsg">
                            New Message
                        </UncontrolledTooltip>

                        <button
                            type="button"
                            id="addnewmsg"
                            className="btn btn-soft-success btn-sm material-shadow"
                        >
                            <i className="ri-add-line align-bottom"></i>
                        </button>
                    </div>
                </div>

                <div className="chat-message-list">
                    <ul className="list-unstyled chat-list chat-user-list users-list" id="userList">
                        {(chats || []).map((chatContact: chatContactType) => (
                            chatContact.direactContact && (chatContact.direactContact || [])?.map((chat) => (
                                <li
                                    key={chat.id + chat.status}
                                    className={`py-2 px-3 ${Chat_Box_Username === chat.name ? "active bg-light rounded" : ""}`}
                                >
                                    <Link
                                        to="#!"
                                        onClick={() => userChatOpen(chat)}
                                        className={`d-flex align-items-center text-decoration-none ${chat.badge && chat.badge !== 0 ? "unread-msg-user" : ""
                                            }`}
                                        id={"msgUser" + chat.id}
                                    >
                                        {/* User Image */}
                                        <div
                                            className={`flex-shrink-0 chat-user-img ${chat.status === "Online" ? "online" : "away"
                                                } align-self-center me-3`}
                                        >
                                            <div className="avatar-sm">
                                                {chat.image ? (
                                                    <img
                                                        src={chat.image}
                                                        className="rounded-circle img-fluid userprofile"
                                                        alt={`${chat.name}'s avatar`}
                                                    />
                                                ) : (
                                                    <div
                                                        className={
                                                            "avatar-title rounded-circle bg-" + chat.bgColor + " userprofile"
                                                        }
                                                    >
                                                        {chat.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="user-status"></span>
                                        </div>
                                        {/* User Details */}
                                        <div className="flex-grow-1 overflow-hidden">
                                            <p className="text-truncate mb-0 fw-semibold">{chat.name}</p>
                                        </div>
                                        {/* Badge */}
                                        {chat.badge && (
                                            <div className="flex-shrink-0">
                                                <span className="badge bg-dark-subtle text-body rounded p-1">
                                                    {chat.badge}
                                                </span>
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            ))
                        ))}
                    </ul>
                </div>



            </SimpleBar>
        </div>
    );
};

export default ChatUsers;
