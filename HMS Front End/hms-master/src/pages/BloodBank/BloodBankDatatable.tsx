import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import BloodDonorDetails from './BloodDonorDetails';
import AddComponents from './AddComponents';
import AddIssueBlood from './AddIssueBlood';
import AddIssueComponent from './AddIssueComponent';
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent';

const BloodBankDatatable = (props: any) => {

    const data = props.data;
    const componentData = props.componentData;
    const [addBloodDetails, setAddBloodDetails] = useState<boolean>(false);
    const [addComponentDetails, setAddComponentDetails] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState('');

    const handleAddComponentDetailsClose = () => {
        setAddComponentDetails(!addComponentDetails);
    }

    const [getIssueBlood, setAddIssueBlood] = useState<boolean>(false);
    const [getComponentBlood, setAddComponentBlood] = useState<boolean>(false);

    const handleBloodIssueColse = () => {
        setAddIssueBlood(!getIssueBlood);
    }


    const handleComponentIssueColse = () => {
        setAddComponentBlood(!getComponentBlood);
    }

    const componentIssueModal = (item: any) => {
        setSelectedItem(item)
        handleComponentIssueColse();
    };


    const bloodIssueModal = (item: any) => {
        handleBloodIssueColse();
    };

    const handleColse = () => {
        setAddBloodDetails(!addBloodDetails);
    }

    const bloodDetailsModal = () => {
        handleColse()
    };

    const componentDetailsModal = () => {
        handleAddComponentDetailsClose()
    }

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Card>
                        <div className="d-flex w-100 align-items-center mt-3 mb-2 justify-content-between">
                            <h3 className="box-title titlefix">Blood</h3>
                            <RoleBasedComponent allowedRoles={["SUPERADMIN","ADMIN","PATHOLOGIST"]}>
                                <div className="ms-auto">
                                    <Button
                                        size='sm'
                                        color="primary"
                                        className="btn btn-primary ms-2" onClick={() => bloodDetailsModal()}>
                                        + Add Blood
                                    </Button>
                                </div>
                            </RoleBasedComponent>
                        </div>
                        <CardBody>
                            <Col>
                                <Table hover bordered className="bloodtable" >
                                    <thead className="table-light">
                                        <tr className="active">
                                            <th>Bags</th>
                                            <th>Lot</th>
                                            <th>Institution</th>
                                            <RoleBasedComponent allowedRoles={["PATHOLOGIST", "SUPERADMIN","ADMIN"]}>
                                                <th className="text-right">Action</th>
                                            </RoleBasedComponent>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length > 0 ? (
                                            data.map((item: any, idx: any) => (
                                                <tr key={idx}>
                                                    <td>{item.bag}</td>
                                                    <td>{item.lot || 'NA'}</td>
                                                    <td>{item.institution || 'NA'}</td>
                                                    <RoleBasedComponent allowedRoles={["PATHOLOGIST", "SUPERADMIN","ADMIN"]}>
                                                        <td className="text-right" style={{ width: '10%' }}>
                                                            <Button
                                                                size="sm"
                                                                color="primary"
                                                                onClick={() => bloodIssueModal(item)}
                                                            >
                                                                Issue
                                                            </Button>
                                                        </td>
                                                    </RoleBasedComponent>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted">
                                                    No records available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </CardBody>
                    </Card>
                </Row>
                <Row>
                    <Card>
                        <CardHeader className="border-0 mb-2 align-items-center pb-0  d-flex justify-content-between">
                            <div className="d-flex w-100 align-items-center justify-content-between">
                                <h3 className="box-title titlefix">Components</h3>
                                <RoleBasedComponent allowedRoles={["PATHOLOGIST", "SUPERADMIN","ADMIN"]}>
                                    <div className="ms-auto">
                                        <Button
                                            size='sm'
                                            color="primary"
                                            className="btn btn-primary ms-2" onClick={() => componentDetailsModal()}>
                                            + Add Component
                                        </Button>
                                    </div>
                                </RoleBasedComponent>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <Col>
                                <Table hover bordered className="bloodtable">
                                    <thead className="table-light">
                                        <tr className="active">
                                            <th>Bags</th>
                                            <th>Lot</th>
                                            <th>Components</th>
                                            <RoleBasedComponent allowedRoles={["PATHOLOGIST", "SUPERADMIN","ADMIN"]}>
                                                <th className="text-right">Action</th>
                                            </RoleBasedComponent>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {componentData.length > 0 ? (
                                            componentData.map((item: any, idx: any) => (
                                                <tr key={idx}>
                                                    <td>
                                                        {item.componentBag} ({item.volume} {item.unit})
                                                    </td>
                                                    <td>{item.lot}</td>
                                                    <td>{item.institution}</td>
                                                    <RoleBasedComponent allowedRoles={["PATHOLOGIST", "SUPERADMIN","ADMIN"]}>
                                                        <td className="text-right" style={{ width: "10%" }}>
                                                            <Button
                                                                size="sm"
                                                                color="primary"
                                                                onClick={() => componentIssueModal(item)}
                                                            >
                                                                Issue
                                                            </Button>
                                                        </td>
                                                    </RoleBasedComponent>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted">
                                                    No records available.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </CardBody>
                    </Card>
                </Row>
            </Container>
            <Modal isOpen={addBloodDetails} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable>
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle model-container text-white">
                    Blood Donor Details
                </ModalHeader>
                <ModalBody>
                    <BloodDonorDetails refresh={props.refresh} handleClose={handleColse} />
                </ModalBody>
            </Modal>
            <Modal isOpen={addComponentDetails} toggle={handleAddComponentDetailsClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={handleAddComponentDetailsClose} className="p-3 bg-info-subtle modal-title">
                    Add Components
                </ModalHeader>
                <ModalBody>
                    <AddComponents refresh={props.refresh} handleClose={handleAddComponentDetailsClose} />
                </ModalBody>
            </Modal>
            <Modal isOpen={getIssueBlood} toggle={handleBloodIssueColse}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable>
                <ModalHeader toggle={handleBloodIssueColse} className="p-3 bg-info-subtle model-container text-white">
                    Add Blood Issue
                </ModalHeader>
                <ModalBody>
                    <AddIssueBlood handleClose={handleBloodIssueColse} />
                </ModalBody>
            </Modal>
            <Modal isOpen={getComponentBlood} toggle={handleComponentIssueColse}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable>
                <ModalHeader toggle={handleComponentIssueColse}
                    className="p-3 bg-info-subtle model-container text-white">
                    Add Issue Component Details
                </ModalHeader>
                <ModalBody>
                    <AddIssueComponent item={selectedItem} handleClose={handleComponentIssueColse} />
                </ModalBody>
            </Modal>
        </React.Fragment >
    )
}

export default BloodBankDatatable