import { useState } from "react";
import AddMedication from "./AddMedication";
import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import MedicationList from "./MedicationList";

const Medication = (props: any) => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    function handleColse() {
        setOpenModal(!openModal);
    }

    const addNew = () => {
        handleColse()
    }

    return <>
        <Container fluid>
            <Card>
                <CardBody>
                    <Row>
                        <Col className="align-items-center d-flex justify-content-between">
                            <h5>Medication</h5>
                            <Button data-bs-toggle="modal" onClick={() => addNew()}>
                                <i className="ri-add-circle-line" />   Add Medication Dose
                            </Button>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <Col>
                            <MedicationList title={props.title} refresh={props.refresh} data={props.data} />
                        </Col>
                    </Row>

                </CardBody>
            </Card>
            <Modal isOpen={openModal} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                    Add Medication Dose
                </ModalHeader>
                <ModalBody>
                    <AddMedication title={props.title} data={props.data} refresh={props.refresh} handleClose={handleColse} />
                </ModalBody>
            </Modal>
        </Container>
    </>
}

export default Medication