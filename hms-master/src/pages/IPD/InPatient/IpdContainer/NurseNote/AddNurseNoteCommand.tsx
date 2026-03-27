import { useState } from "react";
import { Button, Col, Container, Form, FormGroup, Row } from "reactstrap"
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";

const AddNurseNoteCommand = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();

    const [comment, setComment] = useState('');
    const [commentValidationError, setCommentValidationError] = useState(false);

    const handleCommentChange = (value: any) => {
        setComment(value);
        setCommentValidationError(false);
    };

    const validateForm = () => {
        let isFormValid = true;

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
                comment: comment
            }
            await iPDApiService.createNurseNoteComment(props.id,payload);
            toast.success('Nurse Note Comment Added Successfully', { containerId: 'TR' });
            props.handleColse();
            props.refresh();
        } catch (error: any) {
            return ErrorHandler(error);
        }
    }

    return <>
        <Container fluid>
            <Form>
                <Row>
                    <Col sm={12}>
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
                    <Button  color="primary" onClick={handleSubmit}>Save</Button>
                </Col>
            </Form>
        </Container>
    </>
}
export default AddNurseNoteCommand