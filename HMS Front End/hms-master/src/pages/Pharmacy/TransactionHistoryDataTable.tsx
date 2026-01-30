import moment from "moment"
import React from "react"
import { RiPrinterFill } from "react-icons/ri"
import { Link } from "react-router-dom"
import { Table } from "reactstrap"

const TransactionHistoryDataTable = (props: any) => {
    return (
        <React.Fragment>
            <div className="table-responsive ">
                <Table hover className="table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Mode</th>
                            <th>Note</th>
                            <th>Amount (₹)</th>
                            {/* <th>Action</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {props.data?.map((data: any, idx: any) => (
                            <tr key={idx}>
                                <td>{data.paymentId} </td>
                                <td>{moment(data.date).format('DD-MM-YYYY  h:ss A')}</td>
                                <td>{data.paymentMode}</td>
                                <td>{data.note || 'NA'}</td>
                                <td>{data.paymentAmount} </td>
                                {/* <td>
                                    <li className="list-inline-item">
                                        <Link
                                            className="remove-item-btn text-dark" data-bs-toggle="modal" 
                                            to="#"
                                            title="Print"
                                        >
                                            <RiPrinterFill />
                                        </Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link
                                            className="remove-item-btn" data-bs-toggle="modal" 
                                            to="#"
                                            title="Delete"
                                        >
                                            <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                                        </Link>
                                    </li>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </React.Fragment>
    )
}

export default TransactionHistoryDataTable