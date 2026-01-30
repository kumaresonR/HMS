import { useEffect, useState } from "react";
import {
  DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown
} from "reactstrap";
import SimpleBar from "simplebar-react";
// import Spinners from "Components/Common/Spinner";
import Spinners from "../../Components/Common/Spinner";

const colors = [
  "#FF5733", // Red
  "#33FF57", // Green
  "#3357FF", // Blue
  "#F5A623", // Orange
  "#9B59B6", // Purple
  "#1ABC9C", // Teal
  "#E74C3C", // Coral
  "#F1C40F", // Yellow
  "#2ECC71", // Emerald
  "#3498DB", // Sky Blue
];


type ChatContactType = {
  title: string;
  contacts: {
    name: string;
    image?: string;
  }[];
};

const ChatContacts = () => {
  const [isLoading, setLoading] = useState(true);
  const [chatContactData, setChatContactData] = useState<ChatContactType[]>([]);
  const [Chat_Box_Username, setChatBoxUsername] = useState("John Doe");

  useEffect(() => {
    setTimeout(() => {
      const dummyData: ChatContactType[] = [
        {
          title: "Friends",
          contacts: [
            {
              name: "John Doe",
              //  
            },
            { name: "Jane Smith", },
            { name: "Alice Johnson", },
            { name: "Bob Lee", },
          ]
        },
        {
          title: "Work",
          contacts: [
            {
              name: "Mike Johnson",
            },
            { name: "Sarah Williams", },
            { name: "David Brown", },
          ]
        },
        {
          title: "Family",
          contacts: [
            { name: "Michael Smith", },
            { name: "Laura Black", },
          ]
        },
        {
          title: "Others",
          contacts: [
            { name: "Chris Evans", },
            { name: "Emma Watson", },
            { name: "Tom Hiddleston", },
            { name: "Natalie Portman", },
          ]
        }
      ];
      setChatContactData(dummyData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      <SimpleBar className="chat-room-list pt-3" style={{ margin: "-16px 0px 0px" }}>
        {isLoading ? (
          <Spinners setLoading={setLoading} />
        ) : (
          <div className="sort-contact">
            {chatContactData.map((contact, key) => (
              <div className="mt-3" key={key}>
                <div className="contact-list-title">{contact.title}</div>
                <ul id={"contact-sort-" + contact.title} className="list-unstyled contact-list">
                  {contact.contacts.map((item, key) => (
                    <li key={key} className={Chat_Box_Username === item.name ? "active" : ""}>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-2">
                          <div className="avatar-xxs">
                            {item.image ? (
                              // Show the image if it exists
                              <img src={item.image} className="img-fluid rounded-circle" alt={item.name} />
                            ) : (
                              // Show initials if image does not exist
                              <span className="avatar-title rounded-circle bg-primary fs-10 text-white">
                                {item.name
                                  .split(" ") // Split the name into parts
                                  .map(part => part[0]) // Get the first letter of each part
                                  .join("") // Join the initials
                                  .toUpperCase()} {/* Convert to uppercase */}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <p className="text-truncate contactlist-name mb-0">{item.name}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <UncontrolledDropdown>
                            <DropdownToggle tag="a" className="text-muted">
                              <i className="ri-more-2-fill" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                              <DropdownItem><i className="ri-pencil-line text-muted me-2 align-bottom" />Edit</DropdownItem>
                              <DropdownItem><i className="ri-forbid-2-line text-muted me-2 align-bottom" />Block</DropdownItem>
                              <DropdownItem><i className="ri-delete-bin-6-line text-muted me-2 align-bottom" /> Remove</DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      </div>
                    </li>


                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </SimpleBar>
    </div>
  );
};

export default ChatContacts;
