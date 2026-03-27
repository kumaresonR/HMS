import { faBars, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Col, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import PreviewLabInvestigation from "./PreviewLabInvestigation";
import PrintComponent from "../../../../../Components/Common/PrintComponent";
import moment from "moment";
import { Link } from "react-router-dom";

const LabInvestigationDataTable = (props: any) => {
    const [data, setData] = useState(props.data || []);
    const patientData = props.patientData;
    const [previewModelOpen, setPreviewModelOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState('');

    const combinedTests = (data || []).flatMap((prescription: any) => [
        ...(prescription.radiologyTestDetails || []).map((test: any) => ({
            ...test,
            type: 'Radiology',
        })),
        ...(prescription.pathologyTestDetails || []).map((test: any) => ({
            ...test,
            type: 'Pathology',
        }))
    ]);

    const uniqueTests = combinedTests.filter(
        (test: any, index: any, self: any) =>
            index ===
            self.findIndex(
                (t: any) =>
                    t.pathologyTestId === test.pathologyTestId &&
                    t.radiologyTestId === test.radiologyTestId
            )
    );

    console.log(uniqueTests);


    const preview = (data: any) => {
        setPreviewData(data);
        handlePreviewClose();
    }

    const handlePreviewClose = () => {
        setPreviewModelOpen(!previewModelOpen)
    }

    useEffect(() => {
        setData(props.data);
    }, [props.data]);


    return <>
        <Col>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Test Name	</th>
                            <th>Lab</th>
                            <th>Sample Collected</th>
                            <th>Expected Date</th>
                            <th>Approved By</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uniqueTests && uniqueTests.length > 0 ? (
                            uniqueTests.map((item: any, idx: any) => (
                                <tr key={idx}>
                                    <td className="text-primary">
                                        {item.testName}
                                    </td>
                                    <td>{item.type || 'NA'}</td>
                                    <td>
                                        <span>
                                            <label>{item.sampleCollected || 'Pending'}</label><br />
                                            <b>{item.type} Center : </b>{item.radiologyCenter || item.pathologyCenter || 'Pending'}
                                            <br />
                                            <label>{item.collectedDate ? moment(item.collectedDate).format('DD/MM/YYYY') : 'NA'}</label><br />
                                        </span>
                                    </td>
                                    <td>{item.reportDate ? moment(item.reportDate).format('DD/MM/YYYY hh:mm A') : 'Pending'}</td>
                                    <td>
                                        <span>
                                            <label>{item.approvedBy || 'Pending'}</label><br />
                                            <label>{item.approvedDate ? moment(item.approvedDate).format('DD/MM/YYYY') : 'Pending'}</label>
                                        </span>
                                    </td>
                                    <td>
                                        <span>
                                            <Link to="#" data-bs-toggle="modal" onClick={() => preview(item)}
                                                className="btn btn-sm btn-soft-warning edit-list mx-1" title="View">
                                                <FontAwesomeIcon icon={faBars} />
                                            </Link>
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center text-muted">
                                    No lab investigation  available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Col>

        <Modal isOpen={previewModelOpen} toggle={handlePreviewClose}
            backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
        >
            <ModalHeader toggle={handlePreviewClose} className="p-3 bg-info-subtle model-header-container modal-title">
                Lab Investigation Details
                <PrintComponent contentId="labInvestigation" />
            </ModalHeader>

            <ModalBody id="labInvestigation">
                <PreviewLabInvestigation data={previewData} patientData={patientData} handleClose={handlePreviewClose} />
            </ModalBody>
        </Modal>

    </>
}
export default LabInvestigationDataTable