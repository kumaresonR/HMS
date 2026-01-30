import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import { minimizePage } from '../../../slices/pageResizer/uiSlice';
import { IoArrowBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorHandler from '../../../helpers/ErrorHandler';
import FinanceApiService from '../../../helpers/services/finance/finance-api-service';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';

const EditShift = () => {
  const financeApiService: FinanceApiService = new FinanceApiService();
  const setupApiService: SetupApiService = new SetupApiService();

  let navigate: any = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [shiftStart, setShiftStart] = useState('');
  const [name, setName] = useState('')
  const [shiftEnd, setShiftEnd] = useState('');
  const [shiftEndValidationError, setShiftEndValidationError] = useState(false)
  const [nameValidationError, setNameValidationError] = useState(false);
  const [shiftStartValidationError, setShiftStartValidationError] = useState(false)
  const data = { name, shiftEnd,shiftStart }

  const handleShiftEndChange = (value: any) => {
    setShiftEnd(value);
    setShiftEndValidationError(false);
  }

  const handleShiftStartChange = (value: any) => {
    setShiftStart(value);
    setShiftStartValidationError(false);
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

    if (!shiftStart) {
      setShiftStartValidationError(true);
      isFormValid = false;
    }
    
    if (!shiftEnd) {
      setShiftEndValidationError(true);
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
      const payload:any = {
        shiftEnd: shiftEnd,
        name: name,
        shiftStart: shiftStart,
      };
      await financeApiService.createExpenceRecord(payload);
      toast.success('Expence Added Successfully', { containerId: 'TR' });
      navigate('/main/expense')
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  useEffect(() => {
    if (location?.state) {
      setShiftStart(location?.state?.shiftStart);
      setName(location?.state?.name);
      setShiftEnd(location?.state?.shiftEnd);
    }
  }, [location?.state]);

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader title="Add Expense"
            pageTitle="Finance"
            onMinimize={() => dispatch(minimizePage({
              route: location.pathname,
              pageName: "Add Expense",
              data
            }))} />
          <Card>
            <CardBody>
              <Row className="d-flex justify-content-center">
                <Col xl={12}>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Add Expense Details</h5>

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
                          <Label for="name">Shift Name</Label>
                          <Input type="text"
                            id="shiftName"
                            value={name}
                            onChange={e => handleNameChange(e.target.value)}
                            invalid={!!nameValidationError}
                          />
                          {nameValidationError && <div className="invalid-feedback">Shift Name Required</div>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="shiftStart">Shift Start</Label>
                          <Input type="time"
                            id="shiftStart"
                            value={shiftStart}
                            onChange={e => handleShiftStartChange(e.target.value)}
                            invalid={!!shiftStartValidationError}
                          />
                          {shiftStartValidationError && <div className="invalid-feedback">Shift Start Required</div>}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="shiftEnd">Shift End</Label>
                          <Input type="time"
                            id="shiftEnd"
                            value={shiftEnd}
                            onChange={e => handleShiftEndChange(e.target.value)}
                            invalid={!!shiftEndValidationError}
                          />
                          {shiftEndValidationError && <div className="invalid-feedback">Shift End Required</div>}
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

export default EditShift