import { Modal, ModalBody } from "reactstrap";

interface LogoutModalProps {
    show ?: boolean;
    onDeleteClick ?: () => void;
    onCloseClick ?: () => void;
    recordId ?: string;
  }
  
  const LogoutModal: React.FC<LogoutModalProps> = ({ show, onDeleteClick, onCloseClick }) => {
    return (
      <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}>
        <ModalBody className="py-3 px-5">
          <div className="mt-2 text-center">
            <i className="ri-logout-circle-r-line display-5 text-success"></i>
            <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
              <h4 className="text-muted mx-4 mb-0">Are you sure you want to Logout ?</h4>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
            <button
              type="button"
              className="btn w-sm btn-light material-shadow-none"
              data-bs-dismiss="modal"
              onClick={onCloseClick}
            >
              Close
            </button>
            <button
              type="button"
              className="btn w-sm btn-success material-shadow-none"
              id="delete-record"
              onClick={onDeleteClick}
            >
              Logout
            </button>
          </div>
        </ModalBody>
      </Modal>
    ) as unknown as JSX.Element;
  };
  
  export default LogoutModal;