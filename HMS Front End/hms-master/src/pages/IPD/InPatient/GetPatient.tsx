import React, { useEffect, useState } from "react"
import PatientApiService from "../../../helpers/services/patient/patient-api-service";
import { Button, Col, Modal, ModalBody, ModalHeader } from "reactstrap";
import ViewPatientDetails from "../../Patient/ViewPatientDetail";
import CreatePatient from "../../Patient/CreatePatient";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

const GetPatient = (props: any) => {
    const patientApiService: PatientApiService = new PatientApiService();
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [modal_backdrop, setmodal_backdrop] = useState<boolean>(false);
    const [id, setId] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [openNewPatientModal, setOpenNewPatientModal] = useState<boolean>(false);

    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop);
    }

    function handleClose() {
        setOpenNewPatientModal(!openNewPatientModal);
    }

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "getPatientData?searchTerm=" + query
            let result = await patientApiService.searchPatient(url);
            console.log("search result", result);
            setOptions(result.data)
        } catch (error) {
            console.log("Patient search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedPatientId = (selectedItem: any) => {
        const patientId = selectedItem?.[0]?.['patientId'];
        setSelectedPatientId(patientId);
        props.onSelectPatientId(patientId)
    }

    const createNewPatient = () => {
        handleClose();
    }

    useEffect(() => {
        setSelectedPatientId(props.selectedPatientId);
        if (props.selectedPatientId) {
            onSearch(props.selectedPatientId)
        }
    }, [props.selectedPatientId]);

    return (
        <React.Fragment>

            <div className="border-0 d-flex align-items-center gap-3 mb-3">
                <Col sm={6}>
                    <AsyncTypeahead
                        filterBy={() => true}
                        id="patient-id-search-box"
                        isLoading={isLoading}
                        labelKey="name"
                        minLength={1}
                        options={options}
                        onSearch={onSearch}
                        onChange={onSelectedPatientId}
                        placeholder="Search by Patient Name or Id"
                        selected={options.filter((patient: any) => patient.patientId === selectedPatientId)}
                    />
                </Col>

                <Button
                    color="primary"
                    className="btn btn-primary add-btn ms-3"
                    data-bs-toggle="modal"
                    onClick={() => createNewPatient()}
                >
                    <i className="ri-add-circle-line" /> New Patient
                </Button>
            </div>


            <Modal isOpen={modal_backdrop} toggle={() => { tog_backdrop() }}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={() => { tog_backdrop() }} className="p-3 bg-info-subtle modal-title">
                    View Patient Details
                </ModalHeader>
                <ModalBody>
                    <ViewPatientDetails id={id} />
                </ModalBody>
            </Modal>

            <Modal isOpen={openNewPatientModal} toggle={handleClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                    Add Patient
                </ModalHeader>
                <ModalBody>
                    <CreatePatient handleClose={handleClose} />
                </ModalBody>
            </Modal>

        </React.Fragment>
    )
}

export default GetPatient