import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Row, Col, FormGroup, Input, Button, Form } from "reactstrap"
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import { toast } from "react-toastify";
import AppointmentApiService from "../../../../../helpers/services/appointment/appointment-api-service";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import moment from "moment";

const EditNurseNote = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();

    const [noteId, setNoteId] = useState('');
    const [commentId, setCommentId] = useState('');
    const [note, setNote] = useState('');
    const [noteValidationError, setNoteValidationError] = useState(false);
    const [comment, setComment] = useState('');
    const [commentValidationError, setCommentValidationError] = useState(false);
    const [nurse, setNurse] = useState('');
    const [nurseValidationError, setNurseValidationError] = useState(false);
    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [ipdId, setIPDId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<any[]>([]);
    const [selectedNurse, setSelectedNurse] = useState<any[]>([]); 

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
                ipdId: ipdId,
                nurseId: nurse,
                date: date,
                comments: [
                    {
                        comment: comment
                    }
                ]
            }
            await iPDApiService.editNurseNote(noteId,commentId, payload);
            toast.success('Nurse Note Updated Successfully', { containerId: 'TR' });
            props.handleColse();
            props.refresh();
        } catch (error: any) {
            return ErrorHandler(error);
        }
    }

    const getNurseNote = async () => {
        try {
            let data = await iPDApiService.getAllNurseNote(props.id);
            setData(data);
            console.log('getNurseNote data', data);
        } catch (error) {
            console.log(error);
        }
    }

    const setData = (data: any) => {
        setIPDId(data.ipdId)
        setNote(data.note);
        setNoteId(data.notesId)
        setComment(data.comments[0].comment);
        const formattedDate = data.date ? moment(data.date).format('YYYY-MM-DDTHH:mm') : '';
        setDate(formattedDate);
        setNurse(data.nurseId);
        setCommentId(data.comments[0].commentId)
        if (data.nurseId) {
            // Trigger a search for the nurse by ID or name
            const nurse:any = {
                employeeId: data.nurseId,
                fullName: `${data.doctor.firstName} ${data.doctor.lastName}`,
            };
            setOptions([nurse]); 
            setSelectedNurse([nurse]); 
            setNurse(data.nurseId); 
        } else {
            setSelectedNurse([]);
            setNurse('');
        }
    }

    useEffect(() => {
        // getNurseNote();
        setData(props.id);
    }, []);

    return <>
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
                                // onChange={onSelectedNurseId}
                                onChange={(selectedItem: any) => {
                                    if (selectedItem.length > 0) {
                                        const doctorId = selectedItem[0].employeeId;
                                        setNurse(doctorId);
                                        setSelectedNurse(selectedItem);
                                        setNurseValidationError(false);
                                    } else {
                                        setNurse('');
                                        setSelectedNurse([]);
                                        setNurseValidationError(true);
                                    }
                                }}
                                placeholder="Search by Nurse Name or Id"
                                selected={selectedNurse}
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
                    <Button onClick={handleSubmit} color="primary">Save</Button>
                </Col>
            </Form>
        </Row>
    </>
}
export default EditNurseNote