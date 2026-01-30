import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import AddCheckup from "./AddCheckup";
import CheckupDatatable from "./CheckupDatatable";
import { useState } from "react";

const Visits = (props: any) => {
    const [openCreateCheckUpModal, setOpenCreateCheckUpModal] = useState<boolean>(false);

    function handleColse() {
        setOpenCreateCheckUpModal(!openCreateCheckUpModal);
    }

    return <>
        <Container fluid>
            <Card>
                <CardBody>


                    <Row>
                        <Col className="align-items-center d-flex justify-content-between">
                            <h5>Checkups</h5>
                            {/* <Button data-bs-toggle="modal" onClick={() => addNewVital()}>
                                <i className="ri-add-circle-line" />   New Checkups
                            </Button> */}
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <CheckupDatatable refresh={props.refresh} data={props.data} />
                    </Row>
                </CardBody>
            </Card>
            <Modal isOpen={openCreateCheckUpModal} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                    Patient Details 
                </ModalHeader>
                <ModalBody>
                    <AddCheckup refresh={props.refresh} data={props.data} handleClose={handleColse} />
                </ModalBody>
            </Modal>

        </Container>
    </>
}

export default Visits