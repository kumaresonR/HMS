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
import AppointmentApiService from '../../../helpers/services/appointment/appointment-api-service';
import EmployeeApiService from '../../../helpers/services/employee/EmployeeApiService';

const AssignRoster = () => {
  const financeApiService: FinanceApiService = new FinanceApiService();
  const setupApiService: SetupApiService = new SetupApiService();
  const appointmentApiService: AppointmentApiService = new AppointmentApiService();
  const employeeApiService: EmployeeApiService = new EmployeeApiService();

  let navigate: any = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [shiftDate, setShiftDate] = useState('');
  const [name, setName] = useState('')
  const [endDate, setEndDate] = useState('');
  const [endDateValidationError, setEndDateValidationError] = useState(false)
  const [nameValidationError, setNameValidationError] = useState(false);
  const [shiftDateValidationError, setShiftDateValidationError] = useState(false)
  const [shiftData, setShiftData] = useState([]);
  const [options, setOptions] = useState<[]>([]);
  const [doctorId, setDoctorId] = useState('');
  const [doctorValidationError, setDoctorValidationError] = useState(false);
  const [department, setDepartment] = useState('');
  const [departmentValidationError, setDepartmentValidationError] = useState(false);
  const [departmentData, setDepartmentData] = useState<any>([]);
  const [floorData, setFloorData] = useState([]);
  const [floorId, setFloorId] = useState('');
  const [floorIdValidationError, setFloorIdValidationError] = useState(false);

  const data = { name, endDate, shiftDate }

  const handleEndDateChange = (value: any) => {
    setEndDate(value);
    setEndDateValidationError(false);
  }

  const handleShiftDateChange = (value: any) => {
    setShiftDate(value);
    setShiftDateValidationError(false);
  }

  const onSelectedDoctorId = (selectedItem: any) => {
    setDoctorId(selectedItem);
    setDoctorValidationError(false);
  }

  const handleNameChange = (value: any) => {
    setName(value);
    setNameValidationError(false);
  }

  const handleFloorChange = (value: any) => {
    setFloorId(value);
    setFloorIdValidationError(false);
  }

  const handleDepartmentChange = (value: any) => {
    setDepartment(value);
    setDepartmentValidationError(false);
  }

  const validateForm = () => {
    let isFormValid = true;

    if (!name) {
      setNameValidationError(true);
      isFormValid = false;
    }

    if (!shiftDate) {
      setShiftDateValidationError(true);
      isFormValid = false;
    }

    if (!floorId) {
      setFloorIdValidationError(true);
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
        ShiftDate: shiftDate,
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

  const getAllDepartment = async () => {
    try {
      let result = await employeeApiService.getAllDepartment();
      setDepartmentData(result);
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  const getAllFloor = async () => {
    try {
      let result = await setupApiService.getAllMasterFloor();
      setFloorData(result);
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  const onSearch = async () => {
    try {
      let url = "role="
      let result = await appointmentApiService.searchAllEmployee(url);
      setOptions(result)
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  useEffect(() => {
    getAllShiftData();
    onSearch();
    getAllDepartment();
    getAllFloor();
  }, []);

  useEffect(() => {
    if (location?.state) {
      setShiftDate(location?.state?.shiftDate);
      setName(location?.state?.name);
      setEndDate(location?.state?.endDate);
    }
  }, [location?.state]);

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader title="Assign Roster"
            pageTitle="Add Assign Roster"
            onMinimize={() => dispatch(minimizePage({
              route: location.pathname,
              pageName: "Add Assign Roster",
              data
            }))} />
          <Card>
            <CardBody>
              <Row className="d-flex justify-content-center">
                <Col xl={12}>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Add Assign Roster</h5>
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
                          <Label for="shiftDate"> Shift Date</Label>
                          <Input type="date"
                            id="shiftDate"
                            value={shiftDate}
                            onChange={e => handleShiftDateChange(e.target.value)}
                            invalid={!!shiftDateValidationError}
                          />
                          {shiftDateValidationError && <div className="invalid-feedback"> Start Date Required</div>}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <label className="text-start mb-2">Staff <span className="text-danger">*</span></label>
                          <select
                            className={`form-control  ${doctorValidationError ? 'is-invalid' : ''}`}
                            value={doctorId} onChange={(e) => { onSelectedDoctorId(e.target.value) }}
                          >
                            <option value="">--Select Staff--</option>
                            {options.map((data: any, idx: any) => (
                              <option key={idx} value={data.employeeId}>{data.fullName}</option>
                            ))}
                          </select>
                          {doctorValidationError && <div className="invalid-feedback">Staff Required.</div>}
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label for="floor">Floor <span className='text-danger'> * </span></Label>
                          <select
                            className={`form-control ${floorIdValidationError ? 'is-invalid' : ''}`}
                            value={floorId} onChange={(e) => { handleFloorChange(e.target.value) }}
                          >
                            <option value="">--Select Floor--</option>
                            {floorData.map((data: any, idx: any) => (
                              <option key={idx} value={data.floorId}>{data.floorName}</option>
                            ))}
                          </select>
                          {floorIdValidationError && <div className="invalid-feedback">Floor Required</div>}
                        </FormGroup>
                      </Col>

                      <div className="col-md-6 col-lg-3 mb-2">
                        <FormGroup>
                          <Label for="Department">Department <span className='text-danger'>*</span></Label>
                          <Input type="select"
                            id="Department"
                            value={department}
                            onChange={e => handleDepartmentChange(e.target.value)}
                            invalid={!!departmentValidationError}
                          >
                            <option value="">Select Department</option>
                            {departmentData.map((item: any, idx: any) => (
                              <option key={idx} value={item.departmentId}>{item.name}</option>
                            ))}
                          </Input>
                          {departmentValidationError && <div className="invalid-feedback">Department Required</div>}
                        </FormGroup>
                      </div>
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

export default AssignRoster