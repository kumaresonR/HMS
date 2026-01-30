import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormHeader from "../../common/FormHeader/FormHeader";
import { IoArrowBack } from "react-icons/io5";
import ReferralApiService from "../../helpers/services/referral/referral-api-service";
import { toast } from "react-toastify";
import ErrorHandler from "../../helpers/ErrorHandler";
import DeleteModal from "../../Components/Common/DeleteModal";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const ReferralPersonList = () => {
    const referralApiService: ReferralApiService = new ReferralApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    
    const [referralData, setReferralData] = useState<any>([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await referralApiService.deleteReferralPerson(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllReferralPerson();
                setDeleteModal(false);
                previewClose();
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
    }

    const deleteReferralPerson = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const editReferralPerson = (id: any) => {
        navigate('/main/editReferralPerson', { state: { id: id } })
    }

    const getAllReferralPerson = async () => {
        try {
            let result = await referralApiService.getAllReferralPerson();
            setReferralData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllReferralPerson();
    }, []);

    const referralPersonColumns = [
        {
            header: 'Referrer Name',
            accessorKey: 'referrerName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-">
                    {info.getValue()}
                </div>
            ),
        },
        // {
        //     header: 'Category',
        //     accessorKey: 'category',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className="text-primary text-nowrap">
        //             {info.getValue()}
        //         </div>
        //     ),
        // },
        {
            header: 'Commission',
            accessorKey: 'commission',
            enableColumnFilter: false,
            cell: (info: any) => {
                const rowData = info.row.original;
                return (
                    <div>
                        <div><strong>OPD:</strong> {rowData.opdCommission} %</div>
                        <div><strong>IPD:</strong> {rowData.ipdCommission} %</div>
                        <div><strong>Pharmacy:</strong> {rowData.pharmacyCommission} %</div>
                        <div><strong>Pathology:</strong> {rowData.pathologyCommission} %</div>
                        <div><strong>Radiology:</strong> {rowData.radiologyCommission} %</div>
                        <div><strong>Blood Bank:</strong> {rowData.bloodBankCommission} %</div>
                        <div><strong>Ambulance:</strong> {rowData.ambulanceCommission} %</div>
                    </div>
                );
            },
        },

        {
            header: 'Referrer Contact',
            accessorKey: 'referrerContact',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-secondary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Contact Person Name',
            accessorKey: 'contactPersonName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-pink">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Contact Person Phone',
            accessorKey: 'contactPersonPhone',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-purple">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Address',
            accessorKey: 'address',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Action',
            accessorKey: 'action',
            enableColumnFilter: false,
            cell: (cell: any) => (
                <ul className="list-inline hstack gap-2 mb-0">
                    <li className="list-inline-item">
                        <Link
                            className="edit-item-btn"
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                editReferralPerson(cell.row.original.personId);
                            }}
                            title="Edit"
                        >
                            <i className="ri-pencil-fill align-bottom text-purple"></i>
                        </Link>
                    </li>

                    <li className="list-inline-item" title="Delete">
                        <Link
                            className="remove-item-btn" data-bs-toggle="modal"
                            onClick={(e) => {
                                e.preventDefault();
                                deleteReferralPerson(cell.row.original.personId);
                            }}
                            to="#"
                        >
                            <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                        </Link>
                    </li>
                </ul>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={referralData}
                />

                <Container fluid>
                    <FormHeader title="Referral Person List"
                        pageTitle="Human Resource"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Referral Person",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="referralPersonList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Referral Person List</h5>
                                            </div>
                                        </div>

                                        <div className="col-sm-auto">
                                            <div>
                                                <Link to='/main/addReferralPerson'>
                                                    <Button

                                                        color="primary"
                                                        className="btn btn-primary add-btn me-3"
                                                    >
                                                        <i className="ri-add-fill me-1 align-bottom"></i>  Add Referral Persons
                                                    </Button>
                                                </Link>
                                                <button type="button" className="btn btn-primary" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </button>

                                                <Link to="/main/referralPaymentList" className="ms-3">
                                                    <Button color="light" className="bg-gradient backBtn text-end">
                                                        <IoArrowBack />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>

                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={referralPersonColumns}
                                            data={referralData}
                                            isGlobalFilter={true}
                                            isCustomerFilter={true}
                                            customPageSize={5}
                                            tableClass="table table-bordered"
                                            theadClass="thead-light"
                                            divClass="table-responsive"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment>
    );
};

export default ReferralPersonList;
