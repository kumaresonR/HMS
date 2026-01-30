import React, { useState } from 'react'
import BillingApiService from '../../helpers/services/billing/billing-api-service';
import TableContainer from '../../Components/Common/TableContainer';
import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import AddSampleCollection from './AddSampleCollection';
import RadiologyReport from './RadiologyReport';
import { useDispatch } from 'react-redux';
import { minimizePage } from '../../slices/pageResizer/uiSlice';

const ViewRadiologyReport = () => {
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [data, setData] = useState([]);
    const [addSampleCollectionOpen, setAddSampleCollectionOpen] = useState<boolean>(false);
    const [addReportOpen, setAddReportOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState('');
    const [selectedPreviewData, setSelectedPreviewData] = useState('');

    const testColumns = [
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary text-nowrap">
                        {info.getValue() ? info.getValue() : 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Doctor Name',
            accessorKey: 'doctorName',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Test Name',
            accessorKey: 'testName',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Sample Collected',
            accessorKey: 'subCategory',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Result',
            accessorKey: 'method',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Action',
            enableColumnFilter: false,
            cell: (cell: any) => (
                <span>
                    <Link to="#" onClick={() => addSampleCollection(cell.original.testId)} className="btn btn-sm btn-soft-dark edit-list mx-1" title="Add/ Edit Collection Person">
                        <FontAwesomeIcon icon={faUserPlus} />
                    </Link>
                    <Link to="#" onClick={() => addReport(cell.original)} className="btn btn-sm btn-soft-secondary edit-list mx-1" title="Add/ Edit Report">
                        <FontAwesomeIcon icon={faFlask} />
                    </Link>
                </span>
            ),
        },
    ];

    const addSampleCollection = (data: any) => {
        setPreviewData(data);
        addSampleCollectionClose();
    }

    const addSampleCollectionClose = () => {
        setAddSampleCollectionOpen(!addSampleCollectionOpen);
    }

    const addReport = (data: any) => {
        setSelectedPreviewData(data);
        addReportClose();
    }

    const addReportClose = () => {
        setAddReportOpen(!addReportOpen);
    }

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Patient Lab Reports"
                    pageTitle="Radiology"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Radiology Report",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <div className='text-end'>
                                    <Button
                                        color="primary"
                                        onClick={() => navigate(-1)}
                                        className="btn btn-primary add-btn mb-2"
                                    >
                                        <IoArrowBack /> Back
                                    </Button>
                                </div>
                                <div>
                                    <TableContainer
                                        columns={testColumns}
                                        data={data}
                                        isGlobalFilter={true}
                                        isCustomerFilter={true}
                                        customPageSize={5}
                                        tableClass="table table-bordered"
                                        theadClass="thead-light"
                                        divClass="table-responsive"
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal isOpen={addSampleCollectionOpen} toggle={addSampleCollectionClose}
                backdrop={'static'} id="staticBackdrop" centered scrollable
            >
                <ModalHeader toggle={addSampleCollectionClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Sample Collection
                </ModalHeader>
                <ModalBody>
                    <AddSampleCollection data={previewData} handleClose={addSampleCollectionClose} />
                </ModalBody>
            </Modal>
            <Modal isOpen={addReportOpen} toggle={addReportClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={addReportClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Add/ Edit Report
                </ModalHeader>
                <ModalBody>
                    <RadiologyReport data={selectedPreviewData} handleClose={addReportClose} />
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default ViewRadiologyReport