import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { useModal } from "./ModalContext";

const GlobalModal = () => {
  const { modal, hideModal } = useModal();

  return (
    <Modal  backdrop={'static'}
      isOpen={modal.isOpen}
      toggle={hideModal}
      centered
      size={modal.size} 
      scrollable
    >
      <ModalHeader toggle={hideModal}>
        <h5>{modal.title}</h5>
      </ModalHeader>
      <ModalBody>
        {modal.content}
      </ModalBody>
    </Modal>
  );
};

export default GlobalModal;