import React, { useState } from 'react';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import PatientApiService from '../../helpers/services/patient/patient-api-service';
import { Button } from 'reactstrap';
import { useModal } from '../../Components/Common/ModalContext';

const UploadOldPrescription = (props: any) => {
  const patientApiService: PatientApiService = new PatientApiService();

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [documentValidationError, setDocumentValidationError] = useState<boolean>(false);
  const { hideModal } = useModal();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentValidationError(false);
    }
  };

  const validateForm = () => {
    let isFormValid = true;

    if (!selectedFile) {
      setDocumentValidationError(true);
      isFormValid = false;
    }
    return isFormValid;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      addOldPrescription();
    }
  }

  const addOldPrescription = async () => {
    try {
      let formData: FormData = new FormData();
      formData.append('file', selectedFile);
      await patientApiService.uploadOldPrescription(props.id, formData);
      hideModal();
      toast.success('Document uploaded Successfully', { containerId: 'TR' });
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="col-md-6 mb-2">
          <div className="form-group mb-2">
            <label htmlFor="document_file">Document</label>
            <small className="req"> *</small>
            <input
              id="document_file"
              name="document_file"
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className={`form-control ${documentValidationError ? 'is-invalid' : ''}`}
            />
            {documentValidationError && (
              <span className="text-danger">Document Required</span>
            )}
          </div>
        </div>
      </div>
      <Button color="primary" type="submit" >
        Submit
      </Button>
    </form>
  );
};

export default UploadOldPrescription;
