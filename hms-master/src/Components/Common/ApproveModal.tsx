import { Modal, ModalBody, Spinner } from "reactstrap";

interface ApproveModalProps {
    show?: boolean;
    onApproveClick?: () => void;
    onCloseClick?: () => void;
    status?: string;
    isLoading?: boolean;
}

const ApproveModal: React.FC<ApproveModalProps> = ({ show, onApproveClick, onCloseClick,isLoading, status }) => {
    const isUnauthorized = status === "UnAuthorized" || status === "UNAUTHORIZED";
    const textColorClass = isUnauthorized ? "text-danger" : "text-success";
    const buttonColorClass = isUnauthorized ? "btn-danger" : "btn-success";

    return (
        <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}>
            <ModalBody className="py-3 px-5">
                <div className="mt-2 text-center">
                    <i className={`ri-information-line display-5 ${textColorClass}`}></i>
                    <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                        <h4 className={`mx-4 mb-0 ${textColorClass}`}>
                            Are you sure you want to {status} this record?
                        </h4>
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
                        className={`btn w-sm ${buttonColorClass} material-shadow-none`}
                        id="approve-record"
                        onClick={onApproveClick}
                        disabled={isLoading}
                    >
                         {isLoading ? <Spinner size="sm" className="me-2" /> : `Yes, ${status} It!`}
                    </button>
                </div>
            </ModalBody>
        </Modal>
    ) as unknown as JSX.Element;
};

export default ApproveModal;