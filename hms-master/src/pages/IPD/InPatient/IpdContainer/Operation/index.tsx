import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import AddOperation from "./AddOperation";
import OperationDataTable from "./OperationDataTable";
import { useState } from "react";
import RoleBasedComponent from "../../../../../common/RolePermission/RoleBasedComponent";

const Operation = (props: any) => {
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
                            <h5>Operations </h5>
                            <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR"]}>
                                <Button color="primary" data-bs-toggle="modal" onClick={() => addNew()}>
                                    <i className="ri-add-circle-line" />  Add Operation
                                </Button>
                            </RoleBasedComponent>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <OperationDataTable refresh={props.refresh} title={props.title} data={props.data} />
                    </Row>



                </CardBody>

            </Card>
            <Modal isOpen={openAddModal} toggle={handleClose}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                    Add Operation
                </ModalHeader>
                <ModalBody>
                    <AddOperation refresh={props.refresh} title={props.title} data={props.data} handleClose={handleClose} />
                </ModalBody>
            </Modal>

        </Container>
    </>
}
export default Operation