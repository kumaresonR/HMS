import React, { useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import FinanceApiService from '../../../helpers/services/finance/finance-api-service';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { minimizePage } from '../../../slices/pageResizer/uiSlice';

const AddRoster = () => {
  const financeApiService: FinanceApiService = new FinanceApiService();
  const setupApiService: SetupApiService = new SetupApiService();

  let navigate: any = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [startDate, setStartDate] = useState('');
  const [name, setName] = useState('')
  const [endDate, setEndDate] = useState('');
  const [endDateValidationError, setEndDateValidationError] = useState(false)
  const [nameValidationError, setNameValidationError] = useState(false);
  const [startDateValidationError, setstartDateValidationError] = useState(false)
  const [shiftData, setShiftData] = useState([]);

  const data = { name, endDate, startDate }

  const handleEndDateChange = (value: any) => {
    setEndDate(value);
    setEndDateValidationError(false);
  }

  const handleStartDateChange = (value: any) => {
    setStartDate(value);
    setstartDateValidationError(false);
  }

  const handleNameChange = (value: any) => {
    setName(value);
    setNameValidationError(false);
  }

  const validateForm = () => {
    let isFormValid = true;

    if (!name) {
      setNameValidationError(true);
      isFormValid = false;
    }

    if (!startDate) {
      setstartDateValidationError(true);
      isFormValid = false;
    }

    if (!endDate) {
      setEndDateValidationError(true);
      isFormValid = false;
    }

    return isFormValid;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      addExpenseRecord();
    }
  }

  const addExpenseRecord = async () => {
    try {
      const payload: any = {
        endDate: endDate,
        name: name,
        StartDate: startDate,
      };
      await financeApiService.createExpenceRecord(payload);
      toast.success('Roster Added Successfully', { containerId: 'TR' });
      navigate('/main/expense')
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  const getAllShiftData = async () => {
    try {
      let result = await setupApiService.getAllExpenseHeads();
      setShiftData(result);
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  useEffect(() => {
    getAllShiftData();
  }, []);

  useEffect(() => {
    if (location?.state) {
      setStartDate(location?.state?.startDate);
      setName(location?.state?.name);
      setEndDate(location?.state?.endDate);
    }
  }, [location?.state]);

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader title="Add Roster"
            pageTitle="Roster"
            onMinimize={() => dispatch(minimizePage({
              route: location.pathname,
              pageName: "Add Roster",
              data
            }))} />
          <Card>
            <CardBody>
              <Row className="d-flex justify-content-center">
                <Col xl={12}>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Add Roster Details</h5>

                    <Link to="/main/expense" className="text-end">
                      <Button
                        color="primary"
                        className="btn btn-primary add-btn"
                      >
                        <IoArrowBack /> Back
                      </Button>
                    </Link>


                  </div>
                  <Form onSubmit={handleSubmit}>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="shiftName">Shift Name</Label>
                          <Input type="select" id="shiftName" value={name}
                            onChange={e => handleNameChange(e.target.value)}
                            invalid={!!nameValidationError}
                          >
                            <option value="">Select Shift Name</option>
                            {shiftData.map((item: any, idx: any) => (
                              <option value={item.shiftName} key={idx}>{item.shiftName}</option>
                            ))}
                          </Input>
                          {nameValidationError && <div className="invalid-feedback">Shift Name Required</div>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="startDate"> Start Date</Label>
                          <Input type="date"
                            id="startDate"
                            value={startDate}
                            onChange={e => handleStartDateChange(e.target.value)}
                            invalid={!!startDateValidationError}
                          />
                          {startDateValidationError && <div className="invalid-feedback"> Start Date Required</div>}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="endDate">End Date</Label>
                          <Input type="time"
                            id="endDate"
                            value={endDate}
                            onChange={e => handleEndDateChange(e.target.value)}
                            invalid={!!endDateValidationError}
                          />
                          {endDateValidationError && <div className="invalid-feedback">End Date Required</div>}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button type="submit" color="primary">Save</Button>
                  </Form>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default AddRoster