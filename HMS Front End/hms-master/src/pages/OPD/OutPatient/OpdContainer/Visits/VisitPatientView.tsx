import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import AddCheckup from "./AddCheckup";
import VisitDataTable from "./VisitDatatable";
import { useState } from "react";

const VisitPatientView = (props: any) => {
    const [openCreateCheckUpModal, setOpenCreateCheckUpModal] = useState<boolean>(false);
    // const title = props.title || '';
    console.log('title====>', props.title || '')
    function handleColse() {
        setOpenCreateCheckUpModal(!openCreateCheckUpModal);
    }

    const addNewVital = () => {
        handleColse()
    }

    return <>
        <Container fluid>
            <Card>
                <CardBody>
                    <Row>
                        <Col className="align-items-center d-flex justify-content-between">
                            <h5>Visits</h5>
                            {/* <Button data-bs-toggle="modal" onClick={() => addNewVital()}>
                        <i className="ri-add-circle-line" />   New Visit
                    </Button> */}
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <VisitDataTable data={props.data} visitData={props.visitData} title={props?.title || ''} handleIpdClick={props.handleIpdClick} />
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
                    <AddCheckup handleClose={handleColse} data={props.data} />
                </ModalBody>
            </Modal>

        </Container>
    </>
}
export default VisitPatientView