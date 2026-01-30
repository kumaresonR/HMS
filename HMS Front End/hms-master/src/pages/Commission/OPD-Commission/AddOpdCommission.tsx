import React, { useState } from 'react'
import PatientApiService from '../../../helpers/services/patient/patient-api-service';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import { Button, Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import AppointmentApiService from '../../../helpers/services/appointment/appointment-api-service';
import { useModal } from '../../../Components/Common/ModalContext';
import OPDApiService from '../../../helpers/services/opd/opd-api-service';
import moment from 'moment';

const AddOpdCommission = (props: any) => {
  const patientApiService: PatientApiService = new PatientApiService();
  const opdApiService: OPDApiService = new OPDApiService();
  const appointmentApiServic: AppointmentApiService = new AppointmentApiService();

  const { hideModal } = useModal();

  const [patientId, setPatientId] = useState<any>('');
  const [patientIdError, setPatientIdError] = useState<any>(false);
  const [ipdOrOpdId, setIpdOrOpdId] = useState<any>('');
  const [ipdOrOpdIdError, setIpdOrOpdIdError] = useState<any>(false);
  const [prescriptionNo, setPrescriptionNo] = useState<any>('');
  const [prescriptionNoError, setPrescriptionNoError] = useState<any>(false);
  const [doctorId, setDoctorId] = useState<any>('');
  const [doctorIdError, setDoctorIdError] = useState<any>(false);
  const [dateTime, setDateTime] = useState<any>('');
  const [commissionCategory, setCommissionCategory] = useState<any>('');
  const [commissionCategoryError, setCommissionCategoryError] = useState<any>(false);
  const [commissionPercentage, setCommissionPercentage] = useState<number>();
  const [commissionPercentageError, setCommissionPercentageError] = useState<any>(false);
  const [commissionAmount, setCommissionAmount] = useState<number>();
  const [commissionAmountError, setCommissionAmountError] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<[]>([]);
  const [isDoctorLoading, setIsDoctorLoading] = useState(false);
  const [staffData, setStaffData] = useState<[]>([]);
  const [doctorName, setDoctorName] = useState('');

  const onSearch = async (query: any) => {
    setIsLoading(true);
    try {
      let url = "getPatientData?searchTerm=" + query
      let result = await patientApiService.searchPatient(url);
      setOptions(result.data)
    } catch (error: any) {
      return ErrorHandler(error)
    } finally {
      setIsLoading(false);
    }
  }

  const onSelectedPatientId = (selectedItem: any) => {
    const patientId = selectedItem?.[0]?.['patientId'];
    setPatientId(patientId);
    setPatientIdError(false);
  }

  const onDoctorSearch = async (query: any) => {
    setIsDoctorLoading(true);
    try {
      let url = "role=DOCTOR&department=&searchTerm=" + query
      let result = await appointmentApiServic.searchAllEmployee(url);
      setStaffData(result)
    } catch (error: any) {
      return ErrorHandler(error)
    } finally {
      setIsDoctorLoading(false);
    }
  }

  const onSelectedDoctorId = (selectedItem: any) => {
    const doctorId = selectedItem?.[0]?.['employeeId'];
    setDoctorId(doctorId);
    setDoctorIdError(false);
  }

  const handleCategoryChange = (value: any) => {
    setCommissionCategory(value);
    setCommissionCategoryError(false);
  }

  const handleCommissionAmountChange = (value: any) => {
    setCommissionAmount(value);
    setCommissionAmountError(false);
  }

  const handleCommissionPercentageChange = (value: any) => {
    setCommissionPercentage(value);
    setCommissionPercentageError(false);
  }

  const validateForm = () => {
    let isFormValid = true;

    if (!patientId) {
      setPatientIdError(true);
      isFormValid = false;
    }

    if (!doctorId) {
      setDoctorIdError(true);
      isFormValid = false;
    }

    if (!commissionAmount) {
      setCommissionAmountError(true);
      isFormValid = false;
    }

    return isFormValid;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      addItems();
    }
  };

  const addItems = async () => {
    try {
      const payload = {
        patientId: patientId,
        // ipdOrOpdId: ipdOrOpdId,
        // prescriptionNo: prescriptionNo,
        doctorId: doctorId,
        dateTime: moment().format('YYYY-MM-DDTHH:mm:00'),
        commissionCategory: "OPD",
        commissionAmount: commissionAmount
      };
      await opdApiService.createCommission(payload);
      toast.success("Commission Added Successfully", { containerId: "TR" });
      props.refresh();
      hideModal();
    } catch (error: any) {
      return ErrorHandler(error);
    }
  };

  return (
    <Container fluid>
      <Row className='mb-2'>
        
        <Col sm={6}>
          <Label for="commissionCategory">Patient Name <span className="text-danger">*</span></Label>
          <AsyncTypeahead
            filterBy={() => true}
            id="patient-id"
            className={` ${patientIdError ? 'is-invalid' : ''}`}
            isLoading={isLoading}
            labelKey="name"
            minLength={1}
            options={options}
            onSearch={onSearch}
            onChange={onSelectedPatientId}
            placeholder="Search by Patient Name or Id"
          />
          {patientIdError && <div className="invalid-feedback">Patient Required.</div>}
        </Col>
        <Col sm={6}>
          <FormGroup>
            <label className="text-start mb-2"> Doctor <span className="text-danger">*</span></label>
            <AsyncTypeahead
              filterBy={() => true}
              id="doctor-id-search-box"
              className={` ${doctorIdError ? 'is-invalid' : ''}`}
              isLoading={isDoctorLoading}
              labelKey="fullName"
              minLength={1}
              options={staffData}
              onSearch={onDoctorSearch}
              onChange={onSelectedDoctorId}
              placeholder="Search by Doctor Name or Id"
            />
            {doctorIdError && <div className="invalid-feedback">Doctor Required.</div>}
          </FormGroup>
        </Col>

        {/* <Col sm={6}>
          <FormGroup>
            <Label for="commissionPercentage">Commission Percentage <span className="text-danger">*</span></Label>
            <Input
              type="number"
              id="commissionPercentage"
              value={commissionPercentage}
              onChange={(e) => handleCommissionPercentageChange(+e.target.value)}
              invalid={!!commissionPercentageError}
              onWheel={(e: any) => e.target.blur()}
              step="any"
            >
            </Input>
            {commissionPercentageError && <div className="invalid-feedback">Commission Percentage Required.</div>}
          </FormGroup>
        </Col> */}
        <Col sm={6}>
          <FormGroup>
            <Label for="commissionAmount">Commission Amount <span className="text-danger">*</span></Label>
            <Input
              type="number"
              id="commissionAmount"
              value={commissionAmount}
              onChange={(e) => handleCommissionAmountChange(+e.target.value)}
              invalid={!!commissionAmountError}
              onWheel={(e: any) => e.target.blur()}
              step="any"
            >
            </Input>
            {commissionAmountError && <div className="invalid-feedback">Commission Amount Required.</div>}
          </FormGroup>
        </Col>
      </Row>

      <Col className='text-center'>
        <Button onClick={handleSubmit}>Submit</Button>
      </Col>
    </Container >
  )
}

export default AddOpdCommission