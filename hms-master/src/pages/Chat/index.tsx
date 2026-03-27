import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Button,
  UncontrolledTooltip,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert,
  Card,
  CardBody
} from "reactstrap";
import classnames from "classnames";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import ChatSection from "./ChatSection";
import ChatTopBar from "./ChatTopBar";
import ChatContacts from "./ChatContacts";
import ChatUsers from "./ChatUsers";

interface DirectContact {
  id: number,
  roomId: number,
  status: string,
  name: string,
  image: string,
  number: string,
  email: string,
  bgColor: string,
  badge: string | number,
  location: string
}
interface channelsListType {
  id: number,
  name: string,
  unReadMessage?: number,
  image: string,
}
interface chatContactType {
  direactContact?: DirectContact[];
  channelsList?: channelsListType[];
}
interface contact {
  id: number,
  name: string,
  status: string,
  roomId: number,
  image?: string
}
interface chatContactDataTye {
  id: number,
  title: string,
  contacts?: contact[],
}
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

const Chat = () => {
  const userChatShow: any = useRef();
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab: any) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const [isInfoDetails, setIsInfoDetails] = useState<boolean>(false);
  const [Chat_Box_Username, setChat_Box_Username] = useState<any>("Lisa Parker");
  const [user_Status, setUser_Status] = useState<string | null>("online");
  const [Chat_Box_Image, setChat_Box_Image] = useState<any>(avatar2);
  const [currentRoomId, setCurrentRoomId] = useState<any>(1);
  const [curMessage, setcurMessage] = useState<string>("");
  const [search_Menu, setsearch_Menu] = useState<boolean>(false);
  const [settings_Menu, setsettings_Menu] = useState<boolean>(false);
  const [reply, setreply] = useState<any>("");

  // Dummy Data for Chat and Messages
  const dummyContacts: DirectContact[] = [
    {
      id: 1,
      roomId: 1,
      status: "online",
      name: "John Doe",
      image: avatar2,
      number: "1234567890",
      email: "john@example.com",
      bgColor: "bg-primary",
      badge: 3,
      location: "New York"
    },
    {
      id: 2,
      roomId: 2,
      status: "offline",
      name: "Jane Smith",
      image: avatar2,
      number: "0987654321",
      email: "jane@example.com",
      bgColor: "bg-warning",
      badge: 0,
      location: "California"
    }
  ];

  const dummyMessages: UserMessage[] = [
    {
      id: 1,
      from_id: 1,
      to_id: 2,
      msg: "Hello, how are you?",
      reply: { sender: "Jane", msg: "I'm good, thank you!", id: 2 },
      isImages: false,
      has_images: [],
      datetime: "10:30 am"
    },
    {
      id: 2,
      from_id: 2,
      to_id: 1,
      msg: "Hi John! I'm fine.",
      reply: { sender: "John", msg: "Great to hear!", id: 1 },
      isImages: false,
      has_images: [],
      datetime: "10:35 am"
    }
  ];

  const [messages, setMessages] = useState(dummyMessages);
  const [chats, setChats] = useState(dummyContacts);

  // add message
  const addMessage = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    if (curMessage !== '') {
      const message: UserMessage = {
        id: Math.floor(Math.random() * 100),
        from_id: 1,
        to_id: 2,
        msg: curMessage,
        reply: reply,
        isImages: false,
        has_images: [],
        datetime: `${hours}:${minutes} ${ampm}`
      };
      setMessages([...messages, message]); // Add new message to the list
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

  const userChatOpen = (chat: DirectContact) => {
    setChat_Box_Username(chat.name);
    setCurrentRoomId(chat.roomId);
    setChat_Box_Image(chat.image);
    setUser_Status(chat.status);
    setMessages(dummyMessages); // Set dummy messages when opening chat
    if (window.innerWidth < 892) {
      userChatShow.current.classList.add("user-chat-show");
    }
  };

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

  return (
    <React.Fragment>

        <Container fluid>
          <Card className="p-4">
            <CardBody>


              <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
                <div className="chat-leftsidebar minimal-border">
                  <div className="px-4 pt-4 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="flex-grow-1">
                        <h5 className="mb-4">Chats</h5>
                      </div>
                      <div className="flex-shrink-0">
                        <UncontrolledTooltip placement="bottom" target="addcontact">
                          Add Contact
                        </UncontrolledTooltip>

                        <Button
                          color=""
                          id="addcontact"
                          className="btn btn-soft-success btn-sm shadow-none material-shadow-none"
                        >
                          <i className="ri-add-line align-bottom"></i>
                        </Button>
                      </div>
                    </div>
                    <div className="search-box">
                      <input
                        onKeyUp={searchUsers}
                        id="search-user"
                        type="text"
                        className="form-control bg-light border-light"
                        placeholder="Search here..."
                      />
                      <i className="ri-search-2-line search-icon"></i>
                    </div>
                  </div>

                  <Nav tabs className="nav nav-tabs nav-tabs-custom nav-success nav-justified mb-3">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "1",
                        })}
                        onClick={() => {
                          toggleCustom("1");
                        }}
                      >
                        Chats
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "2",
                        })}
                        onClick={() => {
                          toggleCustom("2");
                        }}
                      >
                        Contacts
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={customActiveTab} className="text-muted">
                    <TabPane tabId="1" id="chats">

                      <ChatUsers />

                    </TabPane>
                    <TabPane tabId="2" id="contacts">
                      <ChatContacts />
                    </TabPane>

                  </TabContent>
                </div>

                <div className="user-chat w-100 overflow-hidden minimal-border" ref={userChatShow}>
                  <div className="chat-content d-lg-flex">
                    <div className="w-100 overflow-hidden position-relative">
                      <div className="position-relative">
                        <div className="p-3 user-chat-topbar">
                          <ChatTopBar />
                        </div>
                        <ChatSection />


                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </CardBody>
          </Card>
        </Container>
 
    </React.Fragment >
  );
};

export default Chat;
