import { useState } from "react";
import { Button, Col, Container, Form, FormGroup, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import PostnatalHistoryDataTable from "./PostnatalHistoryDataTable";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";

const AddPostnatalHistory = (props: any) => {
    const ipdApiService: IPDApiService = new IPDApiService();

    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [laborTime, setLaborTime] = useState('');
    const [laborTimeValidationError, setLaborTimeValidationError] = useState(false);
    const [deliveryTime, setDeliveryTime] = useState('');
    const [deliveryTimeValidationError, setDeliveryTimeValidationError] = useState(false);
    const [routineQuestion, setRoutineQuestion] = useState('');
    const [generalRemark, setGeneralRemark] = useState('');

    function handleClose() {
        reset();
        setOpenAddModal(!openAddModal);
    }

    const addNew = () => {
        handleClose()
    }

    const handleLaborTimeChange = (value: any) => {
        setLaborTime(value);
        setLaborTimeValidationError(false);
    }

    const handleDeliveryTimeChange = (value: any) => {
        setDeliveryTime(value);
        setDeliveryTimeValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!laborTime) {
            setLaborTimeValidationError(true);
            isFormValid = false;
        }

        if (!deliveryTime) {
            setDeliveryTimeValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreate();
        }
    }

    const doCreate = async () => {
        try {
            let payload: any = {
                ipdId: props?.data?.admissions?.ipdId,
                laborTime: laborTime,
                deliveryTime: deliveryTime,
                routineQuestion: routineQuestion || 'NA',
                generalRemark: generalRemark || 'NA'
            }
            await ipdApiService.createPostnatalHistory(payload);
            toast.success('Postnatal History Added Successfully', { containerId: 'TR' });
            handleClose();
            props.refresh();
        } catch (error: any) {
            console.log("Postnatal History Failed", error);
            return ErrorHandler(error)
        }
    }

    const reset = () => {
        setLaborTime('');
        setDeliveryTime('');
        setRoutineQuestion('');
        setGeneralRemark('');
    }

    return <>
        <Container fluid>
            <Row>
                <Col className="align-items-center d-flex justify-content-between">
                    <h5>Postnatal History</h5>
                    <Button data-bs-toggle="modal" color="primary" onClick={() => addNew()}>
                        <i className="ri-add-circle-line" />   Add Postnatal History
                    </Button>
                </Col>
            </Row>
            <Row className="py-3">
                <PostnatalHistoryDataTable refresh={props.refresh} data={props.data} />
            </Row>

            <Modal isOpen={openAddModal} toggle={handleClose}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                    Add Postnatal History
                </ModalHeader>

                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Labor Time <span className="text-danger">*</span></label>
                                <Input className={` ${laborTimeValidationError ? 'is-invalid' : ''}`}
                                    id="laborTime"
                                    name="laborTime"
                                    type="datetime-local"
                                    value={laborTime}
                                    onChange={e => handleLaborTimeChange(e.target.value)}
                                />
                                {laborTimeValidationError && <div className="invalid-feedback">Labor Time Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Delivery time <span className="text-danger">*</span></label>
                                <Input className={` ${deliveryTimeValidationError ? 'is-invalid' : ''}`}
                                    id="DeliveryTime"
                                    name="DeliveryTime"
                                    type="datetime-local"
                                    value={deliveryTime}
                                    onChange={e => handleDeliveryTimeChange(e.target.value)}
                                />
                                {deliveryTimeValidationError && <div className="invalid-feedback">Delivery Time Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col md={12}>
                            <FormGroup>
                                <label className="text-start mb-2">Routine Question</label>
                                <textarea className="form-control"
                                    id="RoutineQuestion"
                                    name="RoutineQuestion"
                                    value={routineQuestion}
                                    onChange={e => setRoutineQuestion(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={12}>
                            <FormGroup>
                                <label className="text-start mb-2">General Remark</label>
                                <textarea className="form-control"
                                    id="GeneralRemark"
                                    name="GeneralRemark"
                                    value={generalRemark}
                                    onChange={e => setGeneralRemark(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col className="text-end">
                            <Button color="primary">Save</Button>
                        </Col>
                    </Form>
                </ModalBody>
            </Modal>
        </Container>
    </>
}
export default AddPostnatalHistory