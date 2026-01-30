import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import AddConsultantRegister from "./AddConsultantRegister"
import ConsultantRegisterDataTable from "./ConsultantRegisterDataTable"
import { useState } from "react";

const ConsultantRegister = (props: any) => {
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);

    function handleCloseAddModule() {
        setOpenAddModal(!openAddModal);
    }

    const addNew = () => {
        handleCloseAddModule()
    }
    return <>
        <Container fluid>
            <Card>
                <CardBody>
                    <Row>
                        <Col className="align-items-center d-flex justify-content-between">
                            <h5>Consultant Register</h5>
                            <Button data-bs-toggle="modal" color="primary" onClick={() => addNew()}>
                                <i className="ri-add-circle-line" />  Add Consultant Register
                            </Button>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <ConsultantRegisterDataTable refresh={props.refresh} data={props.data} />
                    </Row>
                  
                    </CardBody>
                    </Card>
                    <Modal isOpen={openAddModal} toggle={handleCloseAddModule}
                        backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
                    >
                        <ModalHeader toggle={handleCloseAddModule} className="p-3 bg-info-subtle modal-title">
                            Add Consultant Register
                        </ModalHeader>
                        <ModalBody>
                            <AddConsultantRegister refresh={props.refresh} data={props.data} handleClose={handleCloseAddModule} />
                        </ModalBody>
                    </Modal>

                </Container>
            </>
}
            export default ConsultantRegister