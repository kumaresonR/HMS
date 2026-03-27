import React, { useState } from 'react'
import PharmacyApiService from '../../helpers/services/pharmacy/pharmacy-api-service';
import { useModal } from '../../Components/Common/ModalContext';
import { toast } from 'react-toastify';
import ErrorHandler from '../../helpers/ErrorHandler';
import { Button } from 'reactstrap';

const AddMedicineUpload = (props: any) => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    const { hideModal } = useModal();

    const [selectedFile, setSelectedFile] = useState<any>();
    const [documentValidationError, setDocumentValidationError] = useState<boolean>(false);

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setDocumentValidationError(false);
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
            await pharmacyApiService.uploadedMedicines(formData);
            hideModal();
            props.refresh();
            toast.success('Document uploaded Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit}>
                <div className='row align-items-center'>
                    <div className="col-md-6 mb-2">
                        <div className="form-group mb-2">
                            <label htmlFor="document_file">Document</label>
                            <small className="req"> *</small>
                            <input
                                id="document_file"
                                name="document_file"
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className={`form-control ${documentValidationError ? 'is-invalid' : ''}`}
                            />
                            {documentValidationError && (
                                <span className="text-danger">Document Required</span>
                            )}
                        </div>
                    </div>
                    <div className='col-auto'>
                        <Button color="primary" type="submit" >
                            Submit
                        </Button>
                    </div>
                </div>

            </form>
        </React.Fragment>
    )
}

export default AddMedicineUpload