import { useState } from "react";
import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import PrescriptionDataTable from "./PrescriptionDataTable";
import AddPrescription from "./AddPrescription";
import RoleBasedComponent from "../../../../../common/RolePermission/RoleBasedComponent";

const Prescription = (props: any) => {
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);

    function handleClose() {
        setOpenAddModal(!openAddModal);
    }

    const addNew = () => {
        handleClose()
    }

    return <>
        <Container fluid>
            <Card>
                <CardBody>
                    <Row>
                        <Col className="align-items-center d-flex justify-content-between">
                            <h5>Prescription </h5>
                            <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR"]}>
                                <Button data-bs-toggle="modal" color="primary" onClick={() => addNew()}>
                                    <i className="ri-add-circle-line" />  Add Prescription
                                </Button>
                            </RoleBasedComponent>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <PrescriptionDataTable title={props.title} refresh={props.refresh} data={props.data} />
                    </Row>
                </CardBody>
            </Card>
            <Modal isOpen={openAddModal} toggle={handleClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                    Add Prescription
                </ModalHeader>
                <ModalBody>
                    <AddPrescription title={props.title} refresh={props.refresh} data={props.data} handleClose={handleClose} />
                </ModalBody>
            </Modal>

        </Container>
    </>
}
export default Prescription