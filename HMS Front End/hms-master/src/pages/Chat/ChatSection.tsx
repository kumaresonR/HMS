import { useEffect, useState, useRef } from "react";
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Row,
    Card,
    CardBody,
    UncontrolledDropdown,
    Nav,

} from "reactstrap";
import SimpleBar from "simplebar-react";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import userDummayImage from "../../assets/images/users/user-dummy-img.jpg";
import "react-perfect-scrollbar/dist/css/styles.css";
// import Spinners from "Components/Common/Spinner";
import Spinners from "../../Components/Common/Spinner";


type UserMessage = {
    id: number;
    from_id: number;
    to_id: number;
    msg: string | null;
    reply: { sender: string, msg: string, id: number },
    isImages: boolean;
    has_images: { id: number; image: string }[];
    datetime: string;
};

type UserMessagesType = {
    sender: string;
    usermessages: UserMessage[];
};
const dummyMessages = [
    { sender: 'User1', usermessages: [{ to_id: 1, msg: 'Hello!', datetime: '2024-12-05 10:00' }] },
    { sender: 'User2', usermessages: [{ to_id: 2, msg: 'Hi!', datetime: '2024-12-05 10:05' }] }
];

const ChatSection = () => {
    const userChatShow: any = useRef();
    const [customActiveTab, setcustomActiveTab] = useState("1");
    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };
    useEffect(() => {
        setMessages(dummyMessages);
    }, []);
    const [isInfoDetails, setIsInfoDetails] = useState<boolean>(false);
    const [Chat_Box_Username, setChat_Box_Username] = useState<any>("Lisa Parker");
    const [user_Status, setUser_Status] = useState<string | null>("online");
    const [Chat_Box_Image, setChat_Box_Image] = useState<any>(avatar2);
    const [currentRoomId, setCurrentRoomId] = useState<any>(1);
    const [curMessage, setcurMessage] = useState<string>("");
    const [search_Menu, setsearch_Menu] = useState<boolean>(false);
    const [settings_Menu, setsettings_Menu] = useState<boolean>(false);
    const [reply, setreply] = useState<any>("");
    const [emojiPicker, setemojiPicker] = useState<boolean>(false);

    const dummyContacts = [
        {
            id: 1,
            roomId: 1,
            status: "online",
            name: "John Doe",
            image: avatar2,
            number: "+123456789",
            email: "johndoe@example.com",
            bgColor: "#f0f0f0",
            badge: 5,
            location: "New York, USA"
        },
        {
            id: 2,
            roomId: 2,
            status: "offline",
            name: "Jane Smith",
            image: userDummayImage,
            number: "+987654321",
            email: "janesmith@example.com",
            bgColor: "#e0e0e0",
            badge: 0,
            location: "London, UK"
        }
    ];

    const dummyMessages = [
        {
            id: 1,
            roomId: 1,
            sender: "John Doe",
            createdAt: "10:00 AM",
            usermessages: [
                {
                    id: 1,
                    from_id: 1,
                    to_id: 2,
                    msg: "Hello, how are you?",
                    reply: { sender: "", msg: "", id: 0 },
                    isImages: false,
                    has_images: [],
                    datetime: "10:00 AM"
                },
                {
                    id: 2,
                    from_id: 2,
                    to_id: 1,
                    msg: "I'm good, thanks for asking!",
                    reply: { sender: "", msg: "", id: 0 },
                    isImages: false,
                    has_images: [],
                    datetime: "10:02 AM"
                },
                {
                    id: 3,
                    from_id: 1,
                    to_id: 2,
                    msg: "What are your plans for today?",
                    reply: { sender: "", msg: "", id: 0 },
                    isImages: false,
                    has_images: [],
                    datetime: "10:05 AM"
                },
                {
                    id: 4,
                    from_id: 2,
                    to_id: 1,
                    msg: "Just working on some projects. You?",
                    reply: { sender: "", msg: "", id: 0 },
                    isImages: false,
                    has_images: [],
                    datetime: "10:07 AM"
                },
                {
                    id: 5,
                    from_id: 1,
                    to_id: 2,
                    msg: "Same here, lots of deadlines to meet!",
                    reply: { sender: "", msg: "", id: 0 },
                    isImages: false,
                    has_images: [],
                    datetime: "10:10 AM"
                },
                {
                    id: 6,
                    from_id: 2,
                    to_id: 1,
                    msg: "Let me know if you need any help.",
                    reply: { sender: "", msg: "", id: 0 },
                    isImages: false,
                    has_images: [],
                    datetime: "10:12 AM"
                },
                {
                    id: 7,
                    from_id: 1,
                    to_id: 2,
                    msg: "Thanks! By the way, did you check the updates from yesterday?",
                    reply: { sender: "", msg: "", id: 0 },
                    isImages: false,
                    has_images: [],
                    datetime: "10:15 AM"
                },
                {
                    id: 8,
                    from_id: 2,
                    to_id: 1,
                    msg: "Yes, I did. Looks like we're on track.",
                    reply: { sender: "", msg: "", id: 0 },
                    isImages: false,
                    has_images: [],
                    datetime: "10:18 AM"
                },
                {
                    id: 9,
                    from_id: 1,
                    to_id: 2,
                    msg: "That's great! Let's catch up later to discuss.",
                    reply: { sender: "", msg: "", id: 0 },
                    isImages: false,
                    has_images: [],
                    datetime: "10:20 AM"
                },
                {
                    id: 10,
                    from_id: 2,
                    to_id: 1,
                    msg: "Sure thing. Talk to you later!",
                    reply: { sender: "", msg: "", id: 0 },
                    isImages: false,
                    has_images: [],
                    datetime: "10:25 AM"
                }
            ]
        }
    ];

    const [isLoading, setLoading] = useState(false);

    //Toggle Chat Box Menus
    const toggleSearch = () => {
        setsearch_Menu(!search_Menu);
    };

    //Info details offcanvas
    const toggleInfo = () => {
        setIsInfoDetails(!isInfoDetails);
    };

    const toggleSettings = () => {
        setsettings_Menu(!settings_Menu);
    };

    // Simulate the chat opening action with dummy data
    const userChatOpen = (chats: any) => {
        setChat_Box_Username(chats.name);
        setCurrentRoomId(chats.roomId);
        setChat_Box_Image(chats.image);
        setUser_Status(chats.status)
        // Dispatching dummy messages instead of backend calls
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const backToUserChat = () => {
        userChatShow.current.classList.remove("user-chat-show");
    }

    // add message function with dummy data
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
            // Add message to dummy data instead of dispatching to redux
            dummyMessages[0].usermessages.push(message);
        }
        setcurMessage("");
        setreply('');
    };

    const chatRef = useRef<any>(null);
    useEffect(() => {
        if (chatRef.current?.el) {
            chatRef.current.getScrollElement().scrollTop = chatRef.current.getScrollElement().scrollHeight;
        }
    }, [dummyMessages]);

    const onKeyPress = (e: any) => {
        const { key, value } = e;
        if (key === "Enter") {
            e.preventDefault();
            setcurMessage(value);
            addMessage();
        }
    };

    //Dummy data search functions
    const searchUsers = () => {
        const input = document.getElementById("search-user") as HTMLInputElement;
        const filter = input.value.toUpperCase();
        const userList = document.getElementsByClassName("users-list");

        Array.prototype.forEach.call(userList, (el: HTMLElement) => {
            const li = el.getElementsByTagName("li");

            for (let i = 0; i < li.length; i++) {
                const a = li[i].getElementsByTagName("a")[0];
                const txtValue = a.textContent || a.innerText;

                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }
        });
    };

    //Search Message
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


    const [messages, setMessages] = useState<UserMessagesType[]>([]);
    useEffect(() => {
        setMessages(dummyMessages);
    }, []);

    const setReply = (message: UserMessage) => {
        console.log('Reply clicked:', message);
    };
    // emoji
    const [emojiArray, setemojiArray] = useState<any>([]);
    const onEmojiClick = (event: any, emojiObject: any) => {
        setemojiArray([...emojiArray, event.emoji]);
        setcurMessage(curMessage + event.emoji);
    };


    return (
        <div>

            <div className="position-relative" id="users-chat">
                <div className="chat-conversation p-3 p-lg-4 simplebar-scrollable-y" id="chat-conversation">
                    {
                        isLoading ? <Spinners setLoading={setLoading} />
                            :
                            <SimpleBar ref={chatRef} style={{ height: "100%" }}>
                                <ul className="list-unstyled chat-conversation-list" id="users-conversation">
                                    {
                                        (messages || []).map((message: UserMessagesType, index: number) => (
                                            message.usermessages.map((userChat: UserMessage, key: number) => (
                                                <li className={userChat.to_id === 1 ? "chat-list left" : "chat-list right"} key={key}>
                                                    <div className="conversation-list">
                                                        {message.sender === 'ChatBox_Username' && (
                                                            userChat.to_id === 1 &&
                                                            <div className="chat-avatar">
                                                                <img src={userDummayImage} alt="user-avatar" />
                                                            </div>
                                                        )}
                                                        <div className="user-chat-content">
                                                            <div className="ctext-wrap">
                                                                {
                                                                    userChat.isImages ? (
                                                                        <div className="message-img mb-0">
                                                                            {
                                                                                userChat.has_images && userChat.has_images.map((img, key) => (
                                                                                    <div className="message-img-list" key={key}>
                                                                                        <div>
                                                                                            <a className="popup-img d-inline-block" href={img.image}>
                                                                                                <img src={img.image} alt="Image" className="rounded border" />
                                                                                            </a>
                                                                                        </div>
                                                                                        <div className="message-img-link">
                                                                                            <ul className="list-inline mb-0">
                                                                                                <UncontrolledDropdown tag="li" className="list-inline-item">
                                                                                                    <DropdownToggle href="#" tag="a">
                                                                                                        <i className="ri-more-fill"></i>
                                                                                                    </DropdownToggle>
                                                                                                    <DropdownMenu>
                                                                                                        <DropdownItem href="#" onClick={() => setReply(userChat)}>
                                                                                                            <i className="ri-reply-line me-2 text-muted align-bottom"></i>Reply
                                                                                                        </DropdownItem>
                                                                                                        <DropdownItem href="#">
                                                                                                            <i className="ri-share-line me-2 text-muted align-bottom"></i>Forward
                                                                                                        </DropdownItem>
                                                                                                        <DropdownItem href="#">
                                                                                                            <i className="ri-file-copy-line me-2 text-muted align-bottom"></i>Copy
                                                                                                        </DropdownItem>
                                                                                                        <DropdownItem href="#">
                                                                                                            <i className="ri-bookmark-line me-2 text-muted align-bottom"></i>Bookmark
                                                                                                        </DropdownItem>
                                                                                                        <DropdownItem href="#">
                                                                                                            <i className="ri-delete-bin-5-line me-2 text-muted align-bottom"></i>Delete
                                                                                                        </DropdownItem>
                                                                                                    </DropdownMenu>
                                                                                                </UncontrolledDropdown>
                                                                                            </ul>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    ) : (
                                                                        <div className="ctext-wrap-content">
                                                                            {
                                                                                userChat.reply ? (
                                                                                    <>
                                                                                        <div className="replymessage-block mb-0 d-flex align-items-start">
                                                                                            <div className="flex-grow-1">
                                                                                                <h5 className="conversation-name">{userChat.reply.sender}</h5>
                                                                                                <p className="mb-0">{userChat.reply.msg}</p>
                                                                                            </div>
                                                                                            <div className="flex-shrink-0">
                                                                                                <button type="button" className="btn btn-sm btn-link mt-n2 me-n3 font-size-18">
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                        <p className="mb-0 ctext-content mt-1">{userChat.msg}</p>
                                                                                    </>
                                                                                ) : (
                                                                                    <p className="mb-0 ctext-content">{userChat.msg}</p>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="conversation-name">
                                                                <small className="text-muted time">
                                                                    {userChat.datetime}
                                                                </small>
                                                                <span className="text-success check-message-icon">
                                                                    <i className="ri-check-double-line align-bottom"></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        ))
                                    }
                                </ul>
                            </SimpleBar>
                    }
                </div>
                {/* <Alert color="warning" className="copyclipboard-alert px-4 fade" id="copyClipBoard" role="alert">Message copied</Alert>
                {emojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} width={250} height={382} />} */}
            </div>




            <div className="chat-input-section p-3 p-lg-4">
                <form id="chatinput-form">
                    <Row className="g-0 align-items-center">
                        <div className="col-auto">
                            <div className="chat-input-links me-2">
                                <div className="links-list-item">
                                    <button
                                        type="button"
                                        className="btn btn-link text-decoration-none emoji-btn"
                                        id="emoji-btn"
                                        onClick={() => setemojiPicker(!emojiPicker)}
                                    >
                                        <i className="bx bx-smile align-middle"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="chat-input-feedback">
                                Please Enter a Message
                            </div>
                            <input
                                type="text"
                                value={curMessage}
                                onKeyDown={onKeyPress}
                                onChange={e => setcurMessage(e.target.value)}
                                className="form-control chat-input bg-light border-light"
                                id="chat-input"
                                placeholder="Type your message..."
                            />
                        </div>
                        <div className="col-auto">
                            <div className="chat-input-links ms-2">
                                <div className="links-list-item">
                                    <button
                                        type="button"
                                        disabled={curMessage === ""}
                                        onClick={() => { addMessage(); setemojiPicker(false); setemojiArray(''); }}
                                        className="btn btn-success chat-send waves-effect waves-light disable"
                                    >
                                        <i className="ri-send-plane-2-fill align-bottom"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Row>
                </form>
            </div>

            <div className={reply ? "replyCard show" : "replyCard"}>
                <Card className="mb-0">
                    <CardBody className="py-3">
                        <div className="replymessage-block mb-0 d-flex align-items-start">
                            <div className="flex-grow-1">
                                <h5 className="conversation-name">{reply && reply.sender}</h5>
                                <p className="mb-0">{reply && reply.msg}</p>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    type="button"
                                    id="close_toggle"
                                    className="btn btn-sm btn-link mt-n2 me-n3 fs-18"
                                    onClick={() => setreply("")}
                                >
                                    <i className="bx bx-x align-middle"></i>
                                </button>
                            </div>
                        </div>
                    </CardBody>
                </Card>

            </div>

        </div>
    )
}

export default ChatSection
