import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

import { Link } from "react-router-dom";

const PaymentDetailsTable = (props:any) => {
  const data = props.data;
  // Dummy payment details data
  const paymentData = [
    { id: 1, transactionId: 'TXN123456', date: '2024-11-01', paymentType: 'Credit', mode: 'Online', note: 'Payment for Order #1234', amount: '2000', action: 'View' },
    { id: 2, transactionId: 'TXN123457', date: '2024-11-02', paymentType: 'Debit', mode: 'Offline', note: 'Payment for Order #1235', amount: '1500', action: 'View' },
    { id: 3, transactionId: 'TXN123458', date: '2024-11-03', paymentType: 'Cash', mode: 'Offline', note: 'Payment for Order #1236', amount: '1000', action: 'View' },
    { id: 4, transactionId: 'TXN123459', date: '2024-11-04', paymentType: 'Credit', mode: 'Online', note: 'Payment for Order #1237', amount: '2500', action: 'View' },
    { id: 5, transactionId: 'TXN123460', date: '2024-11-05', paymentType: 'Debit', mode: 'Offline', note: 'Payment for Order #1238', amount: '3000', action: 'View' },
    { id: 6, transactionId: 'TXN123461', date: '2024-11-06', paymentType: 'Credit', mode: 'Online', note: 'Payment for Order #1239', amount: '1800', action: 'View' },
    { id: 7, transactionId: 'TXN123462', date: '2024-11-07', paymentType: 'Debit', mode: 'Offline', note: 'Payment for Order #1240', amount: '2200', action: 'View' },
    { id: 8, transactionId: 'TXN123463', date: '2024-11-08', paymentType: 'Cash', mode: 'Offline', note: 'Payment for Order #1241', amount: '1200', action: 'View' },
  ];

  const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

  // Updated payment details columns
  const paymentColumns = [
    {
      header: 'Transaction ID',
      accessorKey: 'transactionId',
      enableColumnFilter: false,
    },
    {
      header: 'Date',
      accessorKey: 'date',
      enableColumnFilter: false,
    },
    {
      header: 'Payment Type',
      accessorKey: 'paymentType',
      enableColumnFilter: false,
    },
    {
      header: 'Mode',
      accessorKey: 'mode',
      enableColumnFilter: false,
    },
    {
      header: 'Note',
      accessorKey: 'note',
      enableColumnFilter: false,
    },
    {
      header: 'Amount ₹',
      accessorKey: 'amount',
      enableColumnFilter: false,
    },
    {
      header: "Action",
      cell: (cell: any) => {
        return (
          <ul className="list-inline hstack gap-2 mb-0">
            <li className="list-inline-item" title="View">
              <Link className="view-item-btn" to="#">
                <i className="ri-eye-fill align-bottom text-muted"></i>
              </Link>
            </li>
            <li className="list-inline-item" title="Delete">
              <Link className="remove-item-btn" to="#">
                <i className="ri-delete-bin-fill align-bottom text-muted"></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <div>

       
          <Row className="d-flex justify-content-center">
            <Col xl={12}>
              <Card>
                <ExportCSVModal
                  show={isExportCSV}
                  onCloseClick={() => setIsExportCSV(false)}
                  data={paymentData}
                />

                <Row className="mt-3">
                  <Col lg={12}>
               
                      <CardHeader className="border-0">
                        <Row className="g-4 align-items-center">
                          <div className="col-sm">
                            <div>
                              <h5 className="card-title mb-0">Payment Details List</h5>
                            </div>
                          </div>
                        </Row>
                      </CardHeader>

                        <div className="p-3">
                          <TableContainer
                            columns={paymentColumns}
                            data={paymentData}
                            isGlobalFilter={true}
                            isCustomerFilter={true}
                            customPageSize={5}
                            tableClass="table table-bordered"
                            theadClass="thead-light"
                            divClass="table-responsive"
                          />
                        </div>


                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
      </div>
    </React.Fragment>
  );
};

export default PaymentDetailsTable;
