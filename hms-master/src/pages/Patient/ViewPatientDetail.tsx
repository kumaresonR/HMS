import React, { useEffect, useState } from "react";
import PatientApiService from "../../helpers/services/patient/patient-api-service";
import { Row, Col, Table, Button } from "reactstrap";
import moment from "moment";
import './patientStyle.css'
import UploadOldPrescription from "./UploadOldPrescription";
import { useModal } from "../../Components/Common/ModalContext";
const ViewPatientDetails = (props: any) => {
    const patientApiService: PatientApiService = new PatientApiService();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState<any>('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [allergies, setAllergies] = useState('');
    const [pincode, setPincode] = useState('');
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [emergencyContacts, setEmergencyContacts] = useState<any>([]);
    const [insuranceId, setInsuranceId] = useState('');
    const [idProof, setIdProof] = useState('');
    const[id,setId]= useState('');
    const [idNumber, setIDNumber] = useState('');
    const { hideModal } = useModal();
    const { showModal } = useModal();
    const [oldPrescription, setOldPrescription] = useState('');

    const openPDF = () => {
        const pdfWindow: any = window.open();
        pdfWindow.document.write(
            `<iframe width='100%' height='100%' src='data:application/pdf;base64,${oldPrescription}'></iframe>`
        );
    };
    const getPatientDataById = async () => {
        try {
            let data = await patientApiService.getPatientById(props.id);
            setData(data);
            console.log('category data', data);
        } catch (error) {
            console.log(error);
        }
    }

    const setData = (data: any) => {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setDob(data.dateOfBirth);
        setId(data.id);
        setGender(data.gender);
        setPhoneNumber(data.contactNumber);
        setEmail(data.email);
        setAddress(data.address);
        setPincode(data.pinCode);
        setRegion(data.state);
        setCountry(data.nationality);
        setBloodType(data.bloodType);
        setAllergies(data.allergies);
        if (data.insuranceProviders) {
            setInsuranceId(data.insuranceProviders.providerName);
        }
        setIdProof(data.idProof);
        setIDNumber(data.idNumber)
        if (data.emergencyContacts) {
            setEmergencyContacts(data.emergencyContacts);
        }
        setOldPrescription(data.oldPrescription)

    }

    useEffect(() => {
        getPatientDataById();
    }, []);


    return (
        <React.Fragment>
            <div className="text-end mb-2">
            <Button
                onClick={() =>
                    showModal({
                        content: (
                            <UploadOldPrescription id={id} />
                        ),
                        title: "Add Old Prescription",
                        size: "lg",
                    })
                }
                color="primary"
                className="btn btn-primary add-btn ms-3"

            >
                <i className="ri-add-fill me-1 align-bottom"></i> Add Old Prescription
            </Button>
            </div>
            
            <Table responsive hover className="table-centered align-middle table-nowrap mb-0">
                {/* <thead>
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                </thead> */}
                <tbody>
                    <tr>
                        <td>First Name</td>
                        <td>{firstName}</td>
                    </tr>
                    <tr>
                        <td>Last Name</td>
                        <td>{lastName}</td>
                    </tr>
                    <tr>
                        <td>Date Of Birth</td>
                        <td>{moment(dob).format('DD/MM/YYYY')}</td>
                    </tr>
                    <tr>
                        <td>Gender</td>
                        <td>{gender}</td>
                    </tr>
                    <tr>
                        <td>Contact Number</td>
                        <td>{phoneNumber}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{email || '-'}</td>
                    </tr>
                    <tr>
                        <td>Country</td>
                        <td>{country || '-'}</td>
                    </tr>
                    <tr>
                        <td>State</td>
                        <td>{region || '-'}</td>
                    </tr>
                    <tr>
                        <td>Address</td>
                        <td>{address || '-'}</td>
                    </tr>
                    <tr>
                        <td>Pincode</td>
                        <td>{pincode || '-'}</td>
                    </tr>
                    <tr>
                        <td>Blood Group</td>
                        <td>{bloodType || '-'}</td>
                    </tr>
                    <tr>
                        <td>Allergies</td>
                        <td>{allergies || '-'}</td>
                    </tr>
                    <tr>
                        <td>Insurance</td>
                        <td>{insuranceId || '-'}</td>
                    </tr>
                    <tr>
                        <td>National Identification</td>
                        <td>{idProof || '-'}</td>
                    </tr>
                    <tr>
                        <td>National Identification Number</td>
                        <td>{idNumber || '-'}</td>
                    </tr>
                </tbody>
            </Table>

            {/* Check if emergency contacts are available */}
            {emergencyContacts && emergencyContacts.length > 0 ? (
                <div className="table-responsive">
                    <h4 className="mt-4">Emergency Contacts:</h4>
                    <Table hover className="table-centered align-middle table-nowrap mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Relationship</th>
                                <th>Contact Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emergencyContacts.map((contact: any, idx: any) => (
                                <tr key={contact.emergencyContactId || idx}>
                                    <td>{contact.contactName}</td>
                                    <td>{contact.relationShip}</td>
                                    <td>{contact.contactNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <div className="table-responsive">
                    <h4 className="mt-4">Emergency Contacts:</h4>
                    <Table hover className="table-centered align-middle table-nowrap mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Relationship</th>
                                <th>Contact Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td>No emergency contacts available.</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            )}
            {oldPrescription && (
                            <Row className='my-2 hide-print'>
                                {/* <Col sm={6}>Other Document</Col> */}
                                <Col className="text-center">
                                    <Button onClick={openPDF}>View Old Prescription</Button>
                                </Col>
                            </Row>
                        )}

        </React.Fragment>

    );
}

export default ViewPatientDetails;
