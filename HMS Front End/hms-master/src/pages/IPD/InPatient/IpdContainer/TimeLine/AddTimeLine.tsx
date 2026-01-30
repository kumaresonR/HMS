import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import TimeLine from "./TimeLine";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";

const AddTimeLine = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [data, setData] = useState(props.data);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [description, setDescription] = useState('');
    const [comment, setComment] = useState('');
    const [title, setTitle] = useState('');
    const [titleValidationError, setTitleValidationError] = useState(false);
    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [documentFile, setDocument] = useState<any>();

    function handleColse() {
        setOpenModal(!openModal);
        setTitle('');
        setDate('');
        setDescription('');
        setDocument('')
    }

    const addNew = () => {
        handleColse()
    }
    const onFileUploadListener = (event: any) => {
        const file = event.target.files[0];
        setDocument(file);
    }
    const validateForm = () => {
        let isFormValid = true;

        if (!title) {
            setTitleValidationError(true);
            isFormValid = false;
        }

        if (!date) {
            setDateValidationError(true);
            isFormValid = false;
        }

        return isFormValid;

    }
    const handleTitleChange = (value: any) => {
        setTitle(value);
        setTitleValidationError(false);
    }

    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            let formData: FormData = new FormData();
            const payload: any = {
                date: date,
                description: description,
                title: title
            };
            if (props.title === 'ipd') {
                payload.ipdId = data.admissions?.ipdId;
            } else {
                payload.opdId = data.admissions?.opdId;
            }
            // Convert JSON payload to Blob with application/json type
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            formData.append('timeLine', jsonBlob);
            formData.append('attachment', documentFile);
            if (props.title === 'ipd') {
                await iPDApiService.createTimeline(formData);
            } else {
                await opdApiService.createTimeline(formData);
            }

            toast.success('Timeline Saved Successfully', { containerId: 'TR' });
            props.refresh();
            handleColse()
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        setData(props.data);
    }, [props.data]);
    
    return <>
        <Container fluid>
            <Card>
                <CardBody>
                    <Row>
                        <Col className="align-items-center d-flex justify-content-between">
                            <h5>Add Timeline</h5>
                            <Button data-bs-toggle="modal" color="primary" onClick={() => addNew()}>
                                <i className="ri-add-circle-line" />   Add Timeline</Button>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <TimeLine data={props.data} title={props.title} refresh={props.refresh} />
                    </Row>
                </CardBody>
            </Card>

            <Modal isOpen={openModal} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                    Add Timeline
                </ModalHeader>
                <ModalBody>
                    <Container fluid>
                        <Row>
                            <Form>
                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <label className="text-start mb-2">Title  <span className="text-danger">*</span></label>
                                            <Input
                                                id="Title"
                                                name="Title"
                                                type="text"
                                                value={title}
                                                className={`${titleValidationError ? 'is-invalid' : ''}`}
                                                onChange={e => handleTitleChange(e.target.value)}
                                            />
                                            {titleValidationError && <div className="invalid-feedback">Title Required.</div>}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <label className="text-start mb-2">Date <span className="text-danger">*</span></label>
                                            <Input
                                                id="date"
                                                name="date"
                                                type="datetime-local"
                                                className={`${dateValidationError ? 'is-invalid' : ''}`}
                                                onChange={e => handleDateChange(e.target.value)}
                                                value={date}
                                            />
                                            {dateValidationError && <div className="invalid-feedback">Date Required.</div>}
                                        </FormGroup>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <label className="text-start mb-2">Description</label>
                                            <textarea
                                                className={`form-control`}
                                                id="Description"
                                                name="Description"
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Label>Attach Document</Label>
                                        <Input
                                            type="file"
                                            className="form-control"
                                            id="attachment"
                                            onChange={onFileUploadListener}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-check form-check-right">
                                            <Input className="form-check-input" defaultChecked
                                                type="checkbox" id="visible" />
                                            <Label className="form-check-label">Visible to this person</Label>
                                        </div>
                                    </Col>
                                </Row>
                                <Col className='text-end'>
                                    <Button onClick={handleSubmit} color="primary">Save</Button>
                                </Col>
                            </Form>
                        </Row>
                    </Container>
                </ModalBody>
            </Modal>
        </Container>
    </>
}
export default AddTimeLine