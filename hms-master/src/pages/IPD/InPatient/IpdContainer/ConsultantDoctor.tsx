import { Button, Col, Form, FormGroup, Input, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useState } from 'react';

const ConsultantDoctor = (props: any) => {
    const [openAddDoctorModal, setOpenAddDoctorModal] = useState<boolean>(false);
    const [doctorName, setDoctorName] = useState('');

    const addDoctor = () => {
        handleColse()
    }

    function handleColse() {
        setOpenAddDoctorModal(!openAddDoctorModal);
    }

    const createDoctor = () => {
        handleColse();
    }
    const generateRandomColor = (name: any) => {
        if (name) {
            const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];
            const index = name.charCodeAt(0) % colors.length;
            return colors[index];
        }

    };
    return <>
        <div className='d-flex justify-content-between'>
            <h5>Consultant Doctor</h5>
        </div>
        <div className="d-flex justify-content-between px-3">
            <div className="d-flex align-items-center py-3">
                <div
                    className="avatar-xxs me-3 material-shadow d-flex justify-content-center align-items-center"
                    style={{
                        backgroundColor: generateRandomColor(props?.data?.admissions?.doctor?.firstName),
                        color: 'white',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                    }}
                >
                    {props?.data?.admissions?.doctor?.firstName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h5 className="fs-14 mb-1">{props?.data?.admissions?.doctor?.firstName} {props?.data?.admissions?.doctor?.lastName} ({props?.data?.admissions?.doctor?.staffId})</h5>
                </div>
            </div>
        </div>

        <Modal isOpen={openAddDoctorModal} toggle={handleColse}
            backdrop={'static'} id="staticBackdrop" centered scrollable
        >
            <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                Add Doctor
            </ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <label className="text-start mb-2">Doctor Name <span className="text-danger">*</span></label>
                        <Input
                            id="bedGroupName"
                            name="bedGroupName"
                            type="text"
                            value={doctorName}
                            onChange={e => setDoctorName(e.target.value)}
                        />
                    </FormGroup>
                    <Col className='text-end'>
                        <Button onClick={createDoctor} color="primary" >Add</Button>
                    </Col>
                </Form>
            </ModalBody>
        </Modal>
    </>
}
export default ConsultantDoctor