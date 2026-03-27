import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import IpdPaymentDataTable from "./IpdPaymentDataTable";
import { useState } from "react";
import AddIpdPayment from "./AddIpdPayment";
import PrintComponent from "../../../../../Components/Common/PrintComponent";

const IpdPayment = (props: any) => {
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    function handleClose() {
        setOpenAddModal(!openAddModal);
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
                            <h5>Payment </h5>
                            <div>
                                <PrintComponent contentId="payment-bill" />
                                <Button data-bs-toggle="modal" color="primary" onClick={() => addNew()}>
                                    <i className="ri-add-circle-line" />  Add Payment
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row className="py-3" id="payment-bill">
                        <IpdPaymentDataTable title={props.title} refresh={props.refresh} data={props.data} />
                    </Row>

                </CardBody>
            </Card >
            <Modal isOpen={openAddModal} toggle={handleClose}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                    Add Payment
                </ModalHeader>
                <ModalBody>
                    <AddIpdPayment title={props.title} refresh={props.refresh} data={props.data} handleClose={handleClose} />
                </ModalBody>
            </Modal>

        </Container>
    </>
}
export default IpdPayment