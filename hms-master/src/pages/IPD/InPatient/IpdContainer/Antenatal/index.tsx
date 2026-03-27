import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import AntenatalDataTable from "./AntenatalDataTable"
import { useState } from "react";
import AddAntenatal from "./AddAntenatal";

const Antenatal = (props: any) => {
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
                            <h5>Antenatal</h5>
                            <Button data-bs-toggle="modal"  color="primary" onClick={() => addNew()}>
                                <i className="ri-add-circle-line" />   Add Antenatal
                            </Button>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <AntenatalDataTable refresh={props.refresh} data={props.data} />
                    </Row>
                </CardBody>
            </Card >
            <Modal isOpen={openAnteenatalModal} toggle={handleClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                    Add Antenatal Finding
                </ModalHeader>
                <ModalBody>
                    <AddAntenatal refresh={props.refresh} data={props.data} handleClose={handleClose} />
                </ModalBody>
            </Modal>

        </Container>
    </>
}
export default Antenatal