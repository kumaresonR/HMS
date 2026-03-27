import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import AddPreviousObstetricHistory from "./AddPreviousObstetricHistory";
import PreviousObstetricHistoryDataTable from "./PreviousObstetricHistoryDataTable";
import { useState } from "react";

const PreviousObstetricHistory = (props: any) => {
    const [openAnteenatalModal, setOpenAnteenatalModal] = useState<boolean>(false);

    function handleClose() {
        setOpenAnteenatalModal(!openAnteenatalModal);
    }

    const addNew = () => {
        handleClose()
    }
    return <>
        <Container fluid>

            <Card >
                <CardBody>

                    <Row>
                        <Col className="align-items-center d-flex justify-content-between">
                            <h5>Previous Obstetric History </h5>
                            <Button data-bs-toggle="modal" color="primary"  onClick={() => addNew()}>
                                <i className="ri-add-circle-line" />  Add Previous Obstetric History
                            </Button>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <PreviousObstetricHistoryDataTable refresh={props.refresh} data={props.data} />
                    </Row>

                </CardBody>
            </Card >
            <Modal isOpen={openAnteenatalModal} toggle={handleClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                    Add Previous Obstetric History
                </ModalHeader>
                <ModalBody>
                    <AddPreviousObstetricHistory refresh={props.refresh} data={props.data} handleClose={handleClose} />
                </ModalBody>
            </Modal>

        </Container>
    </>
}

export default PreviousObstetricHistory