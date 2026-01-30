import { Button, Card, CardBody, Col, Container, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import AddCharges from "./AddCharges";
import { useState } from "react";
import ChargesDetailDataTable from "./ChargesDetailDataTable";
import PrintComponent from "../../../../../Components/Common/PrintComponent";

const Charges = (props: any) => {
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
                            <h5>Charges</h5>
                            <div>
                                <PrintComponent contentId="bill" />
                                <Button data-bs-toggle="modal" color="primary" onClick={() => addNew()}>
                                    <i className="ri-add-circle-line" />  Add Charges
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row className="py-3" id="bill">
                        <ChargesDetailDataTable title={props.title} refresh={props.refresh} data={props.data} />
                    </Row>
                </CardBody>

            </Card >
            <Modal isOpen={openAddModal} toggle={handleClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <AddCharges title={props.title} refresh={props.refresh} data={props.data} handleClose={handleClose} />
            </Modal>

        </Container >
    </>
}
export default Charges