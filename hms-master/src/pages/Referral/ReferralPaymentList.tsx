import React, { useState } from "react";
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
import { Link } from "react-router-dom";
import FormHeader from "../../common/FormHeader/FormHeader";

const ReferralList = () => {

    const referralPaymentData = [
        { id: 1, payee: 'John Doe', patientName: 'Jane Smith', billNo: 'INV001', billAmount: 500, commissionPercentage: 10, commissionAmount: 50 },
        { id: 2, payee: 'Emily Davis', patientName: 'Alex Johnson', billNo: 'INV002', billAmount: 1000, commissionPercentage: 5, commissionAmount: 50 },
        { id: 3, payee: 'Michael Brown', patientName: 'John Doe', billNo: 'INV003', billAmount: 750, commissionPercentage: 8, commissionAmount: 60 },
        { id: 4, payee: 'Alex Johnson', patientName: 'Emily Davis', billNo: 'INV004', billAmount: 1200, commissionPercentage: 7, commissionAmount: 84 },
        { id: 5, payee: 'Jane Smith', patientName: 'Michael Brown', billNo: 'INV005', billAmount: 300, commissionPercentage: 12, commissionAmount: 36 },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    const referralPaymentColumns = [
        {
            header: 'Payee',
            accessorKey: 'payee',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Bill No',
            accessorKey: 'billNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Bill Amount (₹)',
            accessorKey: 'billAmount',
            enableColumnFilter: false,
          
        },
        {
            header: 'Commission Percentage (%)',
            accessorKey: 'commissionPercentage',
            enableColumnFilter: false,
         
        },
        {
            header: 'Commission Amount (₹)',
            accessorKey: 'commissionAmount',
            enableColumnFilter: false,
            
        },
        {
            header: 'Action',
            accessorKey: 'action',
            enableColumnFilter: false,
            cell: (info: any) => (
                <ul className="list-inline hstack gap-2 mb-0">


                    <li className="list-inline-item">
                        <Link
                            className="edit-item-btn"
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();

                            }}
                            title="Edit"
                        >
                            <i className="ri-pencil-fill align-bottom text-purple"></i>
                        </Link>
                    </li>

                    <li className="list-inline-item" title="Delete">
                        <Link
                            className="remove-item-btn" data-bs-toggle="modal"

                            to="#"
                        >
                            <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                        </Link>
                    </li><li className="list-inline-item" title="View">
                        <Link
                            className="view-item-btn"
                            to="#"
                        >
                            <i className="ri-eye-fill align-bottom text-pink"></i>
                        </Link>
                    </li>
                </ul>
            ),
        },
    ]



    // Action handler for the Action column (you can define this as needed)
    const handleActionClick = (rowData: any) => {
        console.log("View Details clicked for", rowData);
    };

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={referralPaymentData}
                />

                <Container fluid>
                    <FormHeader title="Referral Payment List" pageTitle="Billing" />
                    <Row>
                        <Col lg={12}>
                            <Card id="paymentList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Referral Payment List</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div className="col-sm-auto">
                                                <div>
                                                    <Link to='/main/referralPersonList'>
                                                        <Button

                                                            color="primary"
                                                            className="btn btn-primary add-btn me-3"
                                                        >
                                                            Referral Persons
                                                        </Button>
                                                    </Link>
                                                    {/* <Link to='/main/addReferralPayment'>
                                                        <Button

                                                            color="primary"
                                                            className="btn btn-primary add-btn me-3"
                                                        >
                                                            <i className="ri-add-fill me-1 align-bottom"></i> Add Referral Payment
                                                        </Button>
                                                    </Link> */}
                                                    <button type="button" className="btn btn-primary" onClick={() => setIsExportCSV(true)}>
                                                        <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                        Export
                                                    </button>





                                                </div>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>

                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={referralPaymentColumns}
                                            data={referralPaymentData}
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
        </React.Fragment>
    );
};

export default ReferralList;
