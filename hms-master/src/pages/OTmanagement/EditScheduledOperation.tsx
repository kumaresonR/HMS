import React, { useEffect, useState } from 'react'
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Button, Col, Container, Form, FormGroup, Input, Row } from 'reactstrap';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import AppointmentApiService from '../../helpers/services/appointment/appointment-api-service';
import OTManagementApiService from '../../helpers/services/otManagement/ot-management-api-service';

const EditScheduledOperation = (props: any) => {
  const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
  const otManagementApiService: OTManagementApiService = new OTManagementApiService();

  const [operationCategory, setOperationCategory] = useState(props?.data?.operationCategory);
  const [operationCategoryValidationError, setOperationCategoryValidationError] = useState(false);
  const [operationName, setOperationName] = useState(props?.data?.operationName);
  const [consultantDoctorValidationError, setConsultantDoctorValidationError] = useState(false);
  const [operationDate, setOperationDate] = useState(props?.data?.operationDate);
  const [operationNameValidationError, setOperationNameValidationError] = useState(false);
  const [consultantDoctor, setConsultantDoctor] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any[]>([]);
  const [operationDateValidationError, setOperationDateValidationError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<any[]>([]);

  const handleOperationCategoryChange = (value: any) => {
    setOperationCategory(value);
    setOperationCategoryValidationError(false);
  }

  const handleOperationNameChange = (value: any) => {
    setOperationName(value);
    setOperationNameValidationError(false);
  }

  const handleOperationDateChange = (value: any) => {
    setOperationDate(value);
    setOperationDateValidationError(false);
  }

  const onSearch = async (query: any) => {
    setIsLoading(true);
    try {
      let url = "role=DOCTOR&department=&searchTerm=" + query
      let result = await appointmentApiServic.searchAllEmployee(url);
      setOptions(result)
    } catch (error: any) {
      return ErrorHandler(error)
    } finally {
      setIsLoading(false);
    }
  }

  const validateForm = () => {
    let isFormValid = true;

    if (!operationCategory) {
      setOperationCategoryValidationError(true);
      isFormValid = false;
    }

    if (!operationName) {
      setOperationNameValidationError(true);
      isFormValid = false;
    }

    if (!operationDate) {
      setOperationDateValidationError(true);
      isFormValid = false;
    }

    if (!consultantDoctor) {
      setConsultantDoctorValidationError(true);
      isFormValid = false;
    }

    return isFormValid;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      doCreateOperation();
    }
  }

  const doCreateOperation = async () => {
    try {
      let baseUrl = props.tabId === "1" ? "update-ipd-operation" : "update-opd-operation";
      let url = `${baseUrl}/${props?.data?.operationId}`;
      let payload: any = {
        doctorId: consultantDoctor,
        operationCategory: operationCategory,
        operationName: operationName,
        operationDate: operationDate
      }
      await otManagementApiService.updateOperation(url, payload);
      toast.success('Operation Updated Successfully', { containerId: 'TR' });
      props.handleClose();
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  useEffect(() => {
    if (props?.data?.doctor) {
      const doctor = {
        employeeId: props?.data?.doctorId,
        fullName: `${props?.data?.doctor.firstName} ${props?.data?.doctor.lastName}`,
      };
      setOptions([doctor]);
      setSelectedDoctor([doctor]);
      setConsultantDoctor(props?.data?.doctorId);
    } else {
      setSelectedDoctor([]);
      setConsultantDoctor('');
    }
  }, []);

  return (
    <React.Fragment>
      <Container fluid>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <label className="text-start mb-2">Operation Category <span className="text-danger">*</span></label>
                <Input className={` ${operationCategoryValidationError ? 'is-invalid' : ''}`}
                  id="OperationCategory"
                  name="Operation Category"
                  type="text"
                  value={operationCategory}
                  onChange={e => handleOperationCategoryChange(e.target.value)}
                />
                {operationCategoryValidationError && <div className="invalid-feedback">Operation Category Required.</div>}
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <label className="text-start mb-2">Operation Name <span className="text-danger">*</span></label>
                <Input className={` ${operationNameValidationError ? 'is-invalid' : ''}`}
                  id="operationName"
                  name="operationName"
                  type="text"
                  value={operationName}
                  onChange={e => handleOperationNameChange(e.target.value)}
                />
                {operationNameValidationError && <div className="invalid-feedback">Operation Name Required.</div>}
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <label className="text-start mb-2">Operation Date <span className="text-danger">*</span></label>
                <Input className={` ${operationDateValidationError ? 'is-invalid' : ''}`}
                  id="OperationDate"
                  name="Operation Date"
                  type="datetime-local"
                  value={operationDate}
                  onChange={e => handleOperationDateChange(e.target.value)}
                />
                {operationDateValidationError && <div className="invalid-feedback">Operation Date Required.</div>}
              </FormGroup>
            </Col>

            <Col md={6}>
              <label className="text-start mb-2">Consultant Doctor<span className="text-danger">*</span></label>
              <AsyncTypeahead
                filterBy={() => true}
                id="patient-id-search-box"
                className={` ${consultantDoctorValidationError ? 'is-invalid' : ''}`}
                isLoading={isLoading}
                labelKey="fullName"
                minLength={1}
                options={options}
                onSearch={onSearch}
                onChange={(selectedItem: any) => {
                  if (selectedItem.length > 0) {
                    const doctorId = selectedItem[0].employeeId;
                    setConsultantDoctor(doctorId);
                    setSelectedDoctor(selectedItem);
                    setConsultantDoctorValidationError(false);
                  } else {
                    setConsultantDoctor('');
                    setSelectedDoctor([]);
                    setConsultantDoctorValidationError(true);
                  }
                }}
                placeholder="Search by Doctor Name or Id"
                selected={selectedDoctor}
              />
              {consultantDoctorValidationError && <div className="invalid-feedback">Consultant Doctor Required.</div>}
            </Col>

            <Col className="text-end my-2">
              <Button color="primary">Save</Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </React.Fragment>
  )
}

export default EditScheduledOperation