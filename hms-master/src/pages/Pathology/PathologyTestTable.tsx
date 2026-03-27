import { faBars, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader, Table } from 'reactstrap'
import PreviewTestDetails from './PreviewTestDetails'
import EditTestDetails from './EditTestDetails'
import DeleteModal from '../../Components/Common/DeleteModal'
import { toast } from 'react-toastify'
import ErrorHandler from '../../helpers/ErrorHandler'
import EditRadiologyTestDetails from '../Radiology/EditRadiologyTestDetails'
import BillingApiService from '../../helpers/services/billing/billing-api-service'
import { Link } from 'react-router-dom'
import TableContainer from '../../Components/Common/TableContainer'
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent'

const PathologyTestTable = (props: any) => {
    const billingApiService: BillingApiService = new BillingApiService();

    const [previewModelOpen, setPreviewModelOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState<any>('');
    const [editModel, setEditModel] = useState<boolean>(false);
    const [testId, setTestId] = useState('');
    const [testCategory, setTestCategory] = useState('');

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const preview = (data: any, testCategory: any) => {
        setPreviewData(data);
        setTestCategory(testCategory);
        handlePreviewClose();
    }

    const handlePreviewClose = () => {
        setPreviewModelOpen(!previewModelOpen)
    }

    const editTestDetails = () => {
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
        props.refresh();
    }

    // Delete Data
    const handleDelete = async () => {
        if (testId) {
            try {
                if (previewData.pathologyTestId) {
                    await billingApiService.deletePathologyTest(testId);
                    toast.success('Pathology Test Deleted Successfully', { containerId: 'TR' });
                } else if (previewData.radiologyTestId) {
                    await billingApiService.deleteRadiologyTest(testId);
                    toast.success('Radiology Test Deleted Successfully', { containerId: 'TR' });
                }
                setDeleteModal(false);
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deletePathologyTest = () => {
        let id = previewData.pathologyTestId || previewData.radiologyTestId;
        setTestId(id);
        setDeleteModal(true);
    }

    const testColumns = [
        {
            header: 'Test Name',
            accessorKey: 'testName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary text-nowrap">
                        {info.getValue() ? info.getValue() : 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Short Name',
            accessorKey: 'shortName',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Test Type',
            accessorKey: 'testType',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Category',
            accessorKey: 'categoryName',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Sub Category',
            accessorKey: 'subCategory',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        // {
        //     header: 'Method',
        //     accessorKey: 'method',
        //     enableColumnFilter: false,
        //     cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        // },
        {
            header: 'Report Days',
            accessorKey: 'reportDays',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Tax (%)',
            accessorKey: 'taxPercentage',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Charge(₹)',
            accessorKey: 'standardCharge',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Amount(₹)',
            accessorKey: 'amount',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Action',
            enableColumnFilter: false,
            cell: (cell: any) => (
                <RoleBasedComponent allowedRoles={["SUPERADMIN","RADIOLOGIST","PATHOLOGIST"]}>
                    <ul className="list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item" title="View">
                            <Link
                                className="view-item-btn"
                                to="#" data-bs-toggle="modal" onClick={() => preview(cell.row.original, props.testCategory)}
                            >
                                <i className="ri-eye-fill align-bottom text-pink"></i>
                            </Link>
                        </li>
                    </ul>
                </RoleBasedComponent>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div>
                <TableContainer
                    columns={testColumns}
                    data={props?.data}
                    isGlobalFilter={true}
                    isCustomerFilter={true}
                    customPageSize={5}
                    tableClass="table table-bordered"
                    theadClass="thead-light"
                    divClass="table-responsive"
                />
            </div>

            <Modal isOpen={previewModelOpen} toggle={handlePreviewClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={handlePreviewClose} className="p-3 bg-info-subtle model-header-container modal-title">
                    Test Details
                    <div>
                        <Button data-bs-toggle="modal" onClick={() => editTestDetails()}
                            className="btn btn-sm btn-soft-secondary edit-list mx-1" title="Edit">
                            <FontAwesomeIcon icon={faPen} />
                        </Button>
                        <Button data-bs-toggle="modal" onClick={() => deletePathologyTest()}
                            className="btn btn-sm btn-soft-danger edit-list mx-1" title="Delete">
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <PreviewTestDetails data={previewData} testCategory={testCategory} handleClose={handlePreviewClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={editModel} toggle={handleEditClose}
                backdrop={'static'} id="staticBackdrop" centered size='xl' scrollable
            >
                <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                    Edit Test Details
                </ModalHeader>
                <ModalBody>
                    {props.testCategory === "Pathology Test" ? (
                        <EditTestDetails data={previewData} handleClose={handleEditClose} />
                    ) : props.testCategory === "Radilology Test" ? (
                        <EditRadiologyTestDetails refresh={props.refresh} data={previewData} handleClose={handleEditClose} />
                    ) : null}
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

export default PathologyTestTable