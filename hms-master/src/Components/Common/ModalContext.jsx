import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState({
        isOpen: false,
        content: null,
        title: "",
        size: "md"
    });

    const showModal = ({ content, title = "Dialog", size = "md" }) => {
        setModal({ isOpen: true, content, title, size });
    };

    const hideModal = () => setModal({ isOpen: false, content: null, title: "", size: "md" });

    return (
        <ModalContext.Provider value={{ modal, showModal, hideModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
