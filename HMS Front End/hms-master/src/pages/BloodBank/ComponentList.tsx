import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import FormHeader from '../../common/FormHeader/FormHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import AddComponents from './AddComponents'
import ErrorHandler from '../../helpers/ErrorHandler'
import BloodBankApiService from '../../helpers/services/bloodBank/BloodBankApiService'
import DeleteModal from '../../Components/Common/DeleteModal'
import { toast } from 'react-toastify'
import { Link, useLocation } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent'
import TableContainer from '../../Components/Common/TableContainer'
import { minimizePage } from '../../slices/pageResizer/uiSlice'
import { useDispatch } from 'react-redux'

const ComponentList = () => {
    const bloodBankApiService: BloodBankApiService = new BloodBankApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    
    const [componentData, setComponentData] = useState([]);
    const [addComponentDetails, setAddComponentDetails] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const componentColumns = [
        {
            header: 'Name',
            accessorKey: 'componentName',
            enableColumnFilter: false,
        },
        {
            header: 'Blood Group',
            accessorFn: (row: any) => row.bloodGroup || 'N/A',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Bags',
            enableColumnFilter: false,
            cell: (info: any) => {
                const data = info.row.original;
                return (
                    <div>
                        {data.componentBag} ({data.volume} {data.unit})
                    </div>
                );
            },
        },
        {
            header: 'Lot',
            accessorKey: 'lot',
            enableColumnFilter: false,

        },
        {
            header: 'Institution',
            accessorKey: 'institution',
            enableColumnFilter: false,
        },

        {
            header: 'Action',
            cell: (cell: any) => (
                <ul className="list-inline hstack gap-2 mb-0">
                    <li className="list-inline-item">
                        <Link
                            className="edit-item-btn text-danger"
                            onClick={(e) => {
                                e.preventDefault();
                                deleteComponent(cell.row.original.componentId);
                            }}
                            to="#"
                            title="Delete"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </Link>
                    </li>
                </ul>
            ),
        },
    ];

    const handleAddComponentDetailsClose = () => {
        setAddComponentDetails(!addComponentDetails);
        getAllComponents()
    }

    const addComponent = () => {
        handleAddComponentDetailsClose()
    }

    const getAllComponents = async () => {
        try {
            let result = await bloodBankApiService.getAllComponents();
            console.log("getAllComponents", result);
            setComponentData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await bloodBankApiService.deleteComponent(selectedId);
                toast.success('Component Deleted Successfully', { containerId: 'TR' });
                await getAllComponents();
                setDeleteModal(false);
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const deleteComponent = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    useEffect(() => {
        getAllComponents();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="Components List"
                    pageTitle="Components List"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Components List",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <div className="ms-auto">
                                    <Link to="/main/component-issue-details" className="ms-3">
                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>
                                    <RoleBasedComponent allowedRoles={["PATHOLOGIST", "SUPERADMIN"]}>
                                        <Button className="mx-2" onClick={() => addComponent()}>
                                            <FontAwesomeIcon icon={faPlus} /> Add Components
                                        </Button>
                                    </RoleBasedComponent>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <TableContainer
                                    columns={componentColumns}
                                    data={componentData}
                                    isGlobalFilter={true}
                                    isCustomerFilter={true}
                                    customPageSize={5}
                                    tableClass="table table-bordered"
                                    theadClass="thead-light"
                                    divClass="table-responsive"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modal isOpen={addComponentDetails} toggle={handleAddComponentDetailsClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={handleAddComponentDetailsClose} className="p-3 bg-info-subtle modal-title">
                    Add Components
                </ModalHeader>
                <ModalBody>
                    <AddComponents handleClose={handleAddComponentDetailsClose} />
                </ModalBody>
            </Modal>

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment >
    )
}

export default ComponentList