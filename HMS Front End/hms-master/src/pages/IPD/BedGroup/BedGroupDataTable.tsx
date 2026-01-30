import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, Col, Container, Modal, ModalBody, ModalHeader, Row, Table, Tooltip } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { faHospital } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditBedGroup from "./EditBedGroup";
import IPDApiService from "../../../helpers/services/ipd/ipd-api-service";
import FormHeader from "../../../common/FormHeader/FormHeader";
import AddBedGroup from "./AddBedGroup";

const BedGroupDataTable = () => {
    const iPDApiService: IPDApiService = new IPDApiService();
    let navigate: any = useNavigate();
    const [tooltipOpen, setTooltipOpen] = useState<number | null>(null);

    const toggleTooltip = (idx: number) => {
        setTooltipOpen(tooltipOpen === idx ? null : idx);
    };
    const [bedGroupData, setBedGroupData] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [openCreateBedGroupModal, setOpenCreateBedGroupModal] = useState<boolean>(false);
    const [openEditBedGroupModal,setOpenEditBedGroupModal] = useState<boolean>(false);
    const [bedGroupId, setBedGroupId] = useState('');
    const [modal_backdrop, setmodal_backdrop] = useState<boolean>(false);
    const [roomData, setRoomData] = useState<any>([]);
    
    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop);
    }
    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    function handleColse() {
        setOpenCreateBedGroupModal(!openCreateBedGroupModal);
        getAllBedGroupData()
    }

    function handleEditColse() {
        setOpenEditBedGroupModal(!openEditBedGroupModal);
        getAllBedGroupData();
    }
    const getAllBedGroupData = async () => {
        try {
            let result = await iPDApiService.getBedData();
            console.log("getAllBedGroupData", result);
            setBedGroupData(result);
        } catch (error: any) {
            console.log("getAllBedGroupData Error");
            console.log(error);
        }
    }

    const editBedGroup = (id: any) => {
        setBedGroupId(id);
        handleEditColse();
    }

    const viewAvaiilableRoom = (data: any) => {
        setRoomData(data);
        tog_backdrop();
    }
  
    const createBedGroup = () => {
        handleColse()
    }

    useEffect(() => {
        getAllBedGroupData();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Room Details" pageTitle="Setup" />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <h4 className="card-title mb-0">View Room Details</h4>
                                <Button data-bs-toggle="modal" onClick={() => createBedGroup()}>
                                    <i className="ri-add-circle-line" />  Add Room Details
                                </Button>
                            </CardHeader>
                            <CardBody>
                                <div className="table-responsive">
                                    <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Bed Name </th>
                                                <th>Available Rooms</th>
                                                <th>Action </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bedGroupData?.map((data: any, idx: any) => (
                                                <tr key={idx}>
                                                    <td>{data.bedGroupName} </td>
                                                    <td>
                                                        <Button onClick={() => viewAvaiilableRoom(data.rooms)}
                                                            title="Available Rooms" id={`availableRoomsTooltip-${idx}`}
                                                            className="btn btn-sm btn-soft-info edit-list">
                                                            <FontAwesomeIcon icon={faHospital} />
                                                        </Button>
                                                        <Tooltip
                                                            placement="top"
                                                            isOpen={tooltipOpen === idx}
                                                            target={`availableRoomsTooltip-${idx}`}
                                                            toggle={() => toggleTooltip(idx)}
                                                        >
                                                            Available Rooms
                                                        </Tooltip>
                                                    </td>
                                                    <td>
                                                        <div className="hstack gap-3 fs-15">
                                                            <Button onClick={() => editBedGroup(data.bedGroupId)}
                                                                id={`editTooltip-${idx}`}
                                                                className="btn btn-sm btn-soft-info edit-list">
                                                                <i className="ri-pencil-line"></i>
                                                            </Button>
                                                            <Tooltip
                                                                placement="top"
                                                                isOpen={tooltipOpen === idx + bedGroupData.length}
                                                                target={`editTooltip-${idx}`}
                                                                toggle={() => toggleTooltip(idx + bedGroupData.length)}
                                                            >
                                                                Edit
                                                            </Tooltip>
                                                            {/* <Button data-bs-toggle="modal" id={`deleteTooltip-${idx}`}
                                                                className="btn btn-sm btn-soft-danger remove-list">
                                                                <i className="ri-delete-bin-5-line"></i>
                                                            </Button>
                                                            <Tooltip
                                                                placement="top" 
                                                                isOpen={tooltipOpen === idx + bedGroupData.length * 2}
                                                                target={`deleteTooltip-${idx}`}
                                                                toggle={() => toggleTooltip(idx + bedGroupData.length * 2)}
                                                            >
                                                                Delete
                                                            </Tooltip> */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            /> */}

            <Modal isOpen={openCreateBedGroupModal} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                    Add Room Details
                </ModalHeader>
                <ModalBody>
                    <AddBedGroup handleClose={handleColse} />
                </ModalBody>
            </Modal>

            <Modal isOpen={openEditBedGroupModal} toggle={handleEditColse}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleEditColse} className="p-3 bg-info-subtle modal-title">
                    Edit Room Details
                </ModalHeader>
                <ModalBody>
                    <EditBedGroup id={bedGroupId} handleClose={handleEditColse} />
                </ModalBody>
            </Modal>

            <Modal
                isOpen={modal_backdrop}
                toggle={() => {
                    tog_backdrop();
                }}
                backdrop={'static'}
                id="staticBackdrop"
                centered
            >
                <ModalHeader toggle={() => setmodal_backdrop(false)}
                    className="p-3 bg-info-subtle modal-title">
                    <h5 className="modal-title" id="staticBackdropLabel">Available Rooms</h5>
                </ModalHeader>
                <ModalBody>
                    <div className="table-responsive">
                        <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Room Number </th>
                                    <th>Room Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomData?.length > 0 ? (
                                    roomData.map((data: any, idx: any) => (
                                        <tr key={idx}>
                                            <td>{data.roomNumber}</td>
                                            <td>{data.roomType}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="text-center">
                                            No Record Found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}
export default BedGroupDataTable