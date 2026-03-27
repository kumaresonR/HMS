import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import DeleteModal from "../../Components/Common/DeleteModal";
import ErrorHandler from "../../helpers/ErrorHandler";
import CertificateApiService from "../../helpers/services/certificate/certificate-api-service";
import TableContainer from "../../Components/Common/TableContainer";
import ViewStaffIdCardTemplate from "./ViewStaffIdTemplate";

const StaffIdTemplateDataTable = (props: any) => {
    const certificateApiService: CertificateApiService = new CertificateApiService();
    let navigate: any = useNavigate();

    const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);

    const [tpaData, setTpaData] = useState([]);
    const [selectedData, setSelectedData] = useState<any>();

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const templateColumns = [
        {
            header: 'Template Name',
            enableColumnFilter: false,
            accessorKey: 'StaffIdCardTitle'
        },
        {
            header: 'Action',
            cell: (cell: any) => (
                <ul className="list-inline hstack gap-2 mb-0">
                    <li className="list-inline-item">
                        <Link
                            className="edit-item-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                previewDetails(cell.row.original);
                            }}
                            to="#"
                            title="View"
                        >
                            <i className="ri-eye-fill align-bottom text-pink"></i>
                        </Link>
                    </li>
                    {/* <li className="list-inline-item">
                        <Link
                            className="edit-item-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                editTemplate(cell.row.original.StaffIdCardTemplateId);
                            }}
                            to="#"
                            title="Edit"
                        >
                            <i className="ri-pencil-fill align-bottom text-purple"></i>
                        </Link>
                    </li> */}
                    <li className="list-inline-item" title="Delete">
                        <Link
                            className="remove-item-btn"
                            data-bs-toggle="modal"
                            onClick={(e) => {
                                e.preventDefault();
                                deleteTemplate(cell.row.original.StaffIdCardTemplateId);
                            }}
                            to="#"
                        >
                            <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                        </Link>
                    </li>
                </ul>
            ),
        },
    ];

    const previewDetails = (data: any) => {
        setSelectedData(data);
        handleColse();
    }

    const handleColse = () => {
        setOpenPreviewModal(!openPreviewModal);
    }

    const editTemplate = (id: any) => {
        navigate('/main/editCertificateTemplate', { state: { id: id } })
    }

    const getAllCertificateTemplate = async () => {
        try {
            let result = await certificateApiService.getAllStaffIdTemplate();
            setTpaData(result.ResponseBody);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const deleteTemplate = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await certificateApiService.deleteStaffIdTemplate(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllCertificateTemplate();
                setDeleteModal(false);
                previewClose();
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
    }

    useEffect(() => {
        getAllCertificateTemplate();
    }, [props.refresh]);

    return (
        <React.Fragment>
            <div>
                <TableContainer
                    columns={templateColumns}
                    data={tpaData}
                    isGlobalFilter={true}
                    isCustomerFilter={true}
                    customPageSize={5}
                    tableClass="table table-bordered"
                    theadClass="thead-light"
                    divClass="table-responsive"
                />
            </div>

            <Modal isOpen={openPreviewModal} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                    View Details
                </ModalHeader>
                <ModalBody>
                    <ViewStaffIdCardTemplate data={selectedData} handleClose={handleColse} />
                </ModalBody>
            </Modal>

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment>
    )
}

export default StaffIdTemplateDataTable