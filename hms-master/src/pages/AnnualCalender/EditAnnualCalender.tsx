import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row, Spinner } from "reactstrap";
import FormHeader from "../../common/FormHeader/FormHeader";
import ErrorHandler from "../../helpers/ErrorHandler";
import AnualCalenderApiService from "../../helpers/services/annualCalendar/annual-calendar-api-service";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const EditAnualCalender = () => {
    const anualCalenderApiService: AnualCalenderApiService = new AnualCalenderApiService();
    const dispatch = useDispatch();
    const location = useLocation();

    let navigate: any = useNavigate();
    const { state } = useLocation();

    const id = state?.id || location?.state?.id;
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('');
    const [date, setDate] = useState<any>('');
    const [description, setDescription] = useState('');
    const [fromDateValidationError, setFromDateValidationError] = useState(false)
    const [toDateValidationError, setToDateValidationError] = useState(false);
    const [dateValidationError, setDateValidationError] = useState(false)
    const [descriptionValidationError, setDescriptionValidationError] = useState(false)
    const [typeValidationError, setTypeValidationError] = useState(false)
    const [titleValidationError, setTitleValidationError] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleTitleChange = (value: any) => {
        setTitle(value);
        setTitleValidationError(false);
    }

    const handleTypeChange = (value: any) => {
        setType(value);
        setTypeValidationError(false);
    }

    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    }

    const handleFromDateChange = (value: any) => {
        setFromDate(value);
        setFromDateValidationError(false);
    }

    const handleToDateChange = (value: any) => {
        setToDate(value);
        setToDateValidationError(false);
    }

    const handleDescriptionChange = (value: any) => {
        setDescription(value);
        setDescriptionValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!title) {
            setTitleValidationError(true);
            isFormValid = false;
        }

        if (!type) {
            setTypeValidationError(true);
            isFormValid = false;
        }

        if (type === 'Holiday' || type === 'Activity') {
            if (!date) {
                setDateValidationError(true);
                isFormValid = false;
            }
        }

        if (type === 'Vacation') {
            if (!fromDate) {
                setFromDateValidationError(true);
                isFormValid = false;
            }

            if (!toDate) {
                setToDateValidationError(true);
                isFormValid = false;
            }
        }

        if (!description) {
            setDescriptionValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            addAnualCalender();
        }
    }

    const addAnualCalender = async () => {
        try {
            const payload = {
                type: type,
                fromDate: fromDate,
                toDate: toDate,
                date: date,
                description: description,
                title: title
            };
            await anualCalenderApiService.editAnualCalender(id, payload);
            toast.success('Record Updated Successfully', { containerId: 'TR' });
            navigate('/main/annualCalender')
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getTpaById = async () => {
        try {
            let result = await anualCalenderApiService.getAnualCalenderById(id);
            setData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const setData = (data: any) => {
        setType(data.type);
        setFromDate(data.fromDate);
        setToDate(data.toDate);
        setDate(data.date);
        setDescription(data.description);
        if (data.title) {
            setTitle(data.title);
        }
    }

    useEffect(() => {
        getTpaById();
    }, []);

    useEffect(() => {
        // Restore data if available
        if (location?.state) {
            setType(location?.state?.type || "");
            setFromDate(location?.state?.fromDate);
            setTitle(location?.state?.title);
            setToDate(location?.state?.toDate);
            setDate(location?.state?.date);
            setDescription(location?.state?.description);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader
                        title="Edit Calendar"
                        pageTitle="Setup"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Edit Calendar",
                            data: { type, fromDate, toDate, date, description, title, id }
                        }))} />
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Edit Calender</h5>

                                <Button onClick={() => navigate('/main/annualCalender')}
                                    color="primary"
                                    className="btn btn-primary add-btn"
                                >
                                    <IoArrowBack /> Back
                                </Button>
                            </div>

                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Label for="title">Title <span className='text-danger'> * </span></Label>
                                            <Input
                                                type="text"
                                                id="title"
                                                value={title}
                                                onChange={e => handleTitleChange(e.target.value)}
                                                invalid={!!titleValidationError}
                                            />
                                            {titleValidationError && <div className="invalid-feedback">Title Required</div>}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="type">Type <span className='text-danger'> * </span></Label>
                                            <Input
                                                type="select"
                                                id="type"
                                                value={type}
                                                onChange={e => handleTypeChange(e.target.value)}
                                                invalid={!!typeValidationError}
                                            >
                                                <option value="">Select Type</option>
                                                <option value="Holiday">Holiday</option>
                                                <option value="Activity">Activity</option>
                                                <option value="Vacation">Vacation</option>
                                            </Input>
                                            {typeValidationError && <div className="invalid-feedback">Expense Head Required</div>}
                                        </FormGroup>

                                        {(type === 'Holiday' || type === 'Activity') && (
                                            <>
                                                <FormGroup>
                                                    <Label for="date">Date <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="date"
                                                        id="date"
                                                        value={date}
                                                        onChange={e => handleDateChange(e.target.value)}
                                                        invalid={!!dateValidationError}
                                                    />
                                                    {dateValidationError && <div className="invalid-feedback">Date Required</div>}
                                                </FormGroup>
                                            </>
                                        )}

                                        {type === 'Vacation' && (
                                            <>
                                                <FormGroup>
                                                    <Label for="fromDate">From Date <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="date"
                                                        id="fromDate"
                                                        value={fromDate}
                                                        onChange={e => handleFromDateChange(e.target.value)}
                                                        invalid={!!fromDateValidationError}
                                                    />
                                                    {fromDateValidationError && <div className="invalid-feedback">From Date Required</div>}
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="toDate">To Date <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="date"
                                                        id="toDate"
                                                        value={toDate}
                                                        onChange={e => handleToDateChange(e.target.value)}
                                                        invalid={!!toDateValidationError}
                                                    />
                                                    {toDateValidationError && <div className="invalid-feedback">To Date Required</div>}
                                                </FormGroup>
                                            </>
                                        )}

                                        <FormGroup>
                                            <Label for="description">Description <span className='text-danger'> * </span></Label>
                                            <Input
                                                type="textarea"
                                                id="description"
                                                value={description}
                                                onChange={e => handleDescriptionChange(e.target.value)}
                                                invalid={!!descriptionValidationError}
                                            />
                                            {descriptionValidationError && <div className="invalid-feedback">Description Required</div>}
                                        </FormGroup>
                                        {/* <FormGroup check className='mb-2'>
                                            <Label check>
                                                <Input type="checkbox" id="frontSite" checked={formData.frontSite} onChange={handleChange} />{' '}
                                                Front Site
                                            </Label>
                                        </FormGroup> */}
                                        {/* <Button type="submit" color="primary">Submit</Button> */}
                                        <Button color="primary" disabled={loading}>
                                            {loading ? <Spinner size='sm' className="me-2"/> : 'Submit' }
                                        </Button>
                                    </Form>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};
export default EditAnualCalender