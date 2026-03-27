import { faFlask, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import { Button, Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import AddSampleCollection from "./AddSampleCollection"
import AddPathologyLabReport from "../Pathology/AddPathologyLabReport"
import RadiologyReport from "./RadiologyReport"
import { Link } from "react-router-dom"
import moment from "moment"

const SampleCollectionDataTable = (props: any) => {
    const [addSampleCollectionOpen, setAddSampleCollectionOpen] = useState<boolean>(false);
    const [addReportOpen, setAddReportOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState('');
    const [selectedPreviewData, setSelectedPreviewData] = useState('');

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
            <div className="table-responsive">
                <Table hover bordered className="table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Test Name</th>
                            <th>Sample Collected</th>
                            <th>Expected Date</th>
                            <th>Approved By / Approve Date</th>
                            <th>Tax (%)</th>
                            <th>Amount (₹)</th>
                            <th className="hide-print">Action</th>
                        </tr>
                </thead>
                    <tbody>
                        {props.data?.map((data: any, idx: any) => (
                            <tr key={idx}>
                                <td>{idx + 1} </td>
                                <td>{data?.pathologyDetails?.testName || data?.radiologyDetails?.testName}</td>
                                <td><span>
                                    {data.sampleCollected}<br />
                                    <b>Center : </b>{data.radiologyCenter || data.pathologyCenter || 'Pending'}<br />
                                    {data.collectedDate}
                                </span>
                                </td>
                                <td>{data.reportDate ? moment(data.reportDate).format('DD/MM/YYYY hh:mm A') : 'N/A'}</td>
                                <td>{data.approvedBy && data.approvedDate
                                    ? `${data.approvedBy} / ${data.approvedDate}`
                                    : 'Pending'}
                                </td>
                                <td>{data.tax}</td>
                                <td>{data.amount}</td>
                                <td className="hide-print">
                                    <span>
                                        <Link to="#" onClick={() => addSampleCollection(data.testId)} className="btn btn-sm btn-soft-dark edit-list mx-1" title="Add/ Edit Collection Person">
                                            <FontAwesomeIcon icon={faUserPlus} />
                                        </Link>
                                        <Link to="#" onClick={() => addReport(data)} className="btn btn-sm btn-soft-secondary edit-list mx-1" title="Add/ Edit Report">
                                            <FontAwesomeIcon icon={faFlask} />
                                        </Link>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal isOpen={addSampleCollectionOpen} toggle={addSampleCollectionClose}
                backdrop={'static'} id="staticBackdrop" centered scrollable
            >
                <ModalHeader toggle={addSampleCollectionClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Sample Collection
                </ModalHeader>
                <ModalBody>
                    <AddSampleCollection close={props.handleClose} title={props.title} data={previewData} handleClose={addSampleCollectionClose} />
                </ModalBody>
            </Modal>
            <Modal isOpen={addReportOpen} toggle={addReportClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={addReportClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Add/ Edit Report
                </ModalHeader>
                <ModalBody>
                    {
                        props.title === "radiology" ? (
                            <RadiologyReport data={selectedPreviewData} close={props.handleClose} handleClose={addReportClose} />
                        ) : (
                            <AddPathologyLabReport title={props.title} close={props.handleClose} data={selectedPreviewData} handleClose={addReportClose} />
                        )
                    }
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}
export default SampleCollectionDataTable