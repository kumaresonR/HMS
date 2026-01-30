import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import AddVital from "./AddVital";
import VitalDataTable from "./VitalDataTable";
import { useEffect, useState } from "react";

const Vital = (props: any) => {
    const [openCreateBedGroupModal, setOpenCreateBedGroupModal] = useState<boolean>(false);

    function handleColse() {
        setOpenCreateBedGroupModal(!openCreateBedGroupModal);
    }

    const addNewVital = () => {
        handleColse()
    }

    return <>
        <Container fluid>
            <Card >
                <CardBody>
                    <Row>
                        <Col className="align-items-center d-flex justify-content-between">
                            <h5>Vitals</h5>
                            <Button data-bs-toggle="modal" onClick={() => addNewVital()}>
                                <i className="ri-add-circle-line" />   Add Vital
                            </Button>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <VitalDataTable title={props.title} refresh={props.refresh} data={props.data} />
                    </Row>

                </CardBody>
            </Card >
            <Modal isOpen={openCreateBedGroupModal} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                    Add Vital
                </ModalHeader>
                <ModalBody>
                    <AddVital title={props.title} refresh={props.refresh} data={props.data} handleClose={handleColse} />
                </ModalBody>
            </Modal>

        </Container>
    </>
}
export default Vital