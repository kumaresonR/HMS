import { useState } from "react";
import { Button, Col, Container, Form, FormGroup, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import NurseNote from "./NurseNote";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import AppointmentApiService from "../../../../../helpers/services/appointment/appointment-api-service";
import RoleBasedComponent from "../../../../../common/RolePermission/RoleBasedComponent";

const AddNurseNote = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [note, setNote] = useState('');
    const [noteValidationError, setNoteValidationError] = useState(false);
    const [comment, setComment] = useState('');
    const [commentValidationError, setCommentValidationError] = useState(false);
    const [nurse, setNurse] = useState('');
    const [nurseValidationError, setNurseValidationError] = useState(false);
    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);

    function handleColse() {
        setOpenModal(!openModal);
        setNurse('');
        setComment('');
        setNote('');
        setDate('')
    }

    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    };

    const handleNoteChange = (value: any) => {
        setNote(value);
        setNoteValidationError(false);
    };

    const handleCommentChange = (value: any) => {
        setComment(value);
        setCommentValidationError(false);
    };

    const handleNurseChange = (value: any) => {
        setNurse(value);
        setNurseValidationError(false);
    };

    const addNew = () => {
        handleColse()
    }

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "role=NURSE&department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            console.log("search result", result);
            setOptions(result)
        } catch (error) {
            console.log("Patient search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedNurseId = (selectedItem: any) => {
        const nurseId = selectedItem?.[0]?.['employeeId'];
        setNurse(nurseId);
        setNurseValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!nurse) {
            setNurseValidationError(true);
            isFormValid = false;
        }

        if (!date) {
            setDateValidationError(true);
            isFormValid = false;
        }

        if (!note) {
            setNoteValidationError(true);
            isFormValid = false;
        }

        if (!comment) {
            setCommentValidationError(true);
            isFormValid = false;
        }

        return isFormValid;

    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            let payload: any = {
                note: note,
                ipdId: props?.data?.admissions.ipdId,
                nurseId: nurse,
                date: date,
                comments: [
                    {
                        comment: comment
                    }
                ]
            }
            await iPDApiService.createNurseNote(payload);
            toast.success('Nurse Note Created Successfully', { containerId: 'TR' });
            handleColse();
            props.refresh();
        } catch (error: any) {
            return ErrorHandler(error);
        }
    }
    return <>
        <Container fluid>
            <RoleBasedComponent allowedRoles={["SUPERADMIN",'NURSE']}>
                <Row>
                    <Col className="align-items-center d-flex justify-content-between">
                        <h5>Nurse Notes </h5>
                        <Button data-bs-toggle="modal" color="primary" onClick={() => addNew()}>
                            <i className="ri-add-circle-line" />   Add Nurse Note
                        </Button>
                    </Col>
                </Row>
            </RoleBasedComponent>
            <Row className="py-3">
                <NurseNote refresh={props.refresh} data={props.data} />
            </Row>

            <Modal isOpen={openModal} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                    Add Nurse Note
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Form>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Date <span className="text-danger">*</span></label>
                                        <Input
                                            id="date"
                                            name="date"
                                            type="datetime-local"
                                            value={date}
                                            className={`${dateValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleDateChange(e.target.value)}
                                        />
                                        {dateValidationError && <div className="invalid-feedback">Date Required.</div>}
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Nurse  <span className="text-danger">*</span></label>
                                        <AsyncTypeahead
                                            filterBy={() => true}
                                            id="patient-id-search-box"
                                            className={` ${nurseValidationError ? 'is-invalid' : ''}`}
                                            isLoading={isLoading}
                                            labelKey="fullName"
                                            minLength={1}
                                            options={options}
                                            onSearch={onSearch}
                                            onChange={onSelectedNurseId}
                                            placeholder="Search by Nurse Name or Id"
                                        />
                                        {nurseValidationError && <div className="invalid-feedback">Nurse Required.</div>}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Note <span className="text-danger">*</span></label>
                                        <textarea
                                            id="note"
                                            name="note"
                                            value={note}
                                            className={`${noteValidationError ? 'is-invalid' : ''} form-control`}
                                            onChange={e => handleNoteChange(e.target.value)}
                                        />
                                        {noteValidationError && <div className="invalid-feedback">Note Required.</div>}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Comment  <span className="text-danger">*</span></label>
                                        <textarea
                                            id="comment"
                                            name="comment"
                                            value={comment}
                                            className={`${commentValidationError ? 'is-invalid' : ''} form-control`}
                                            onChange={e => handleCommentChange(e.target.value)}
                                        />
                                        {commentValidationError && <div className="invalid-feedback">Comment Required.</div>}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Col className='text-end'>
                                <Button color="primary" onClick={handleSubmit}>Save</Button>
                            </Col>
                        </Form>
                    </Row>
                </ModalBody>
            </Modal>
        </Container>
    </>
}
export default AddNurseNote