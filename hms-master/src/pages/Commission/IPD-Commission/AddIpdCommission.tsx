import React, { useState } from 'react'
import PatientApiService from '../../../helpers/services/patient/patient-api-service';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import { Button, Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import PharmacyApiService from '../../../helpers/services/pharmacy/pharmacy-api-service';
import IPDApiService from '../../../helpers/services/ipd/ipd-api-service';
import AppointmentApiService from '../../../helpers/services/appointment/appointment-api-service';
import { useModal } from '../../../Components/Common/ModalContext';
import moment from 'moment';

const AddIpdCommission = (props:any) => {
  const patientApiService: PatientApiService = new PatientApiService();
  const pharmacyApiService: PharmacyApiService = new PharmacyApiService();
  const ipdApiService: IPDApiService = new IPDApiService();
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
  const [commissionPercentage, setCommissionPercentage] = useState<any>('');
  const [commissionPercentageError, setCommissionPercentageError] = useState<any>(false);
  const [commissionAmount, setCommissionAmount] = useState<any>('');
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
    } catch (error) {
      console.log("Patient search Error");
    } finally {
      setIsLoading(false);
    }
  }

  const onSelectedPatientId = (selectedItem: any) => {
    const patientId = selectedItem?.[0]?.['patientId'];
    setPatientId(patientId);
    // if (patientId) {
    //   getAllPrescriptions(patientId);
    // }
    setPatientIdError(false);
  }

  // const getAllPrescriptions = async (id: any) => {
  //   try {
  //     const ipdDataPromise = pharmacyApiService.getAllPrescriptionByIpdId(id);
  //     const opdDataPromise = pharmacyApiService.getAllPrescriptionByOpdId(id);
  //     const [ipdData, opdData] = await Promise.all([ipdDataPromise, opdDataPromise]);
  //     // const combinedData = [...ipdData, ...opdData];
  //     const combinedData = [...ipdData, ...opdData].filter(item => !item.pharmacyPaid);
  //     setPatientData(combinedData);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const searchByPrescriptionId = async () => {
  //   try {
  //     if (prescriptionNo) {
  //       let prescriptionDetails = [];
  //       if (prescriptionNo.startsWith("IPDP")) {
  //         const ipdData = await pharmacyApiService.getAllPharmacyByIpdPrescription(prescriptionNo);
  //         prescriptionDetails = ipdData?.[0]?.prescriptionDetails || [];
  //         setIpdOrOpdId(ipdData?.[0]?.ipdId);
  //         if (ipdData?.[0]?.doctor) {
  //           const name = `${ipdData?.[0]?.doctor.firstName} ${ipdData?.[0]?.doctor.lastName}`
  //           const firstName = name.split(" ")[0];
  //           setDoctorName(firstName);
  //           setDoctorId(ipdData?.[0]?.doctor.staffId)
  //         }
  //       } else {
  //         const opdData = await pharmacyApiService.getAllPharmacyByOpdPrescription(prescriptionNo);
  //         prescriptionDetails = opdData?.[0]?.prescriptionDetails || [];
  //         setIpdOrOpdId(opdData?.[0]?.opdId)
  //         if (opdData?.[0]?.doctor) {
  //           const name = `${opdData?.[0]?.doctor.firstName} ${opdData?.[0]?.doctor.lastName}`
  //           const firstName = name.split(" ")[0];
  //           setDoctorName(firstName);
  //           setDoctorId(opdData?.[0]?.doctor.staffId)
  //         }
  //       }
  //     } else {
  //       toast.warning("Please enter a prescription number.", { containerId: 'TR' });
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while fetching prescription data. Please try again.", { containerId: 'TR' });
  //   }
  // };

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

    // if (!ipdOrOpdId) {
    //   setIpdOrOpdIdError(true);
    //   isFormValid = false;
    // }

    // if (!prescriptionNo) {
    //   setPrescriptionNoError(true);
    //   isFormValid = false;
    // }

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
        commissionCategory: "IPD",
        commissionAmount: commissionAmount
      };
      await ipdApiService.createCommission(payload);
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
              <Label for="commissionCategory">Patient Name</Label>
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
            {/* <Col sm={6} className='d-flex align-items-center justify-content-end gap-2'>
              <select
                className={`form-control`}
                value={prescriptionNo} onChange={(e) => { setPrescriptionNo(e.target.value) }}
              >
                <option value="">--Select Prescription Number--</option>
                {patientData.map((data: any, idx: any) => (
                  <option key={idx} value={data.prescriptionNo}>{data.prescriptionNo}</option>
                ))}
              </select>
              <div>
                <Button color='primary' onClick={searchByPrescriptionId}>Search</Button>
              </div>
            </Col> */}
            {/* <Col>
            <FormGroup>
              <Label for="DoctorName">Doctor Name</Label>
              <Input
                type="text"
                id="doctorName"
                disabled
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              >
              </Input>
            </FormGroup>
          </Col> */}
            {/* <Col>
            <FormGroup>
              <Label for="commissionCategory">Commission Category</Label>
              <Input
                type="text"
                id="commissionCategory"
                value={commissionCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                invalid={!!commissionCategoryError}
              >
              </Input>
              {commissionCategoryError && <div className="invalid-feedback">Commission Category Required.</div>}
            </FormGroup>
          </Col> */}
            {/* <Col sm={6}>
              <FormGroup>
                <Label for="commissionPercentage">Commission Percentage</Label>
                <Input
                  type="number"
                  id="commissionPercentage"
                  value={commissionPercentage}
                  onChange={(e) => handleCommissionPercentageChange(e.target.value)}
                  invalid={!!commissionPercentageError}
                  onWheel={(e: any) => e.target.blur()}
                  step="any"
                >
                </Input>
                {commissionPercentage && <div className="invalid-feedback">Commission Percentage Required.</div>}
              </FormGroup>
            </Col> */}
            <Col sm={6}>
              <FormGroup>
                <Label for="commissionAmount">Commission Amount</Label>
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

export default AddIpdCommission