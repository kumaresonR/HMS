import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import moment from "moment"
import React from "react"
import { Button, Table } from "reactstrap"

const StockDataTable = (props: any) => {
    return (
        <React.Fragment>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Inward Date</th>
                            <th>Batch No</th>
                            <th>Pharmacy Purchase No</th>
                            <th>Expiry Date</th>
                            <th>Purchase Rate</th>
                            <th>Amount (₹)</th>
                            <th>Quantity</th>
                            <th>MRP</th>
                            <th>Sale Price</th>
                            {/* <th>Action</th> */}
                        </tr>
                    </thead>
                    {props.data?.length > 0 && props.data.some((item:any) => item.medicines?.length > 0) ? (
                        <tbody>
                            {props.data?.map((item:any, parentIdx:any) =>
                                item.medicines?.map((medicine:any, childIdx:any) => (
                                    <tr key={`${parentIdx}-${childIdx}`}>
                                        <td>{moment(medicine.purchaseDate).format('DD/MM/YYYY hh:mm A')}</td>
                                        <td>{medicine.batchNo}</td>
                                        <td>{medicine.purchaseBillId}</td>
                                        <td>{medicine.expiryDate}</td>
                                        <td>{medicine.purchasePrice}</td>
                                        <td>{medicine.amount}</td>
                                        <td>{medicine.quantity}</td>
                                        <td>{medicine.mrp}</td>
                                        <td>{medicine.salePrice}</td>
                                        {/* <td>
                                            <Button
                                                data-bs-toggle="modal"
                                                className="btn btn-sm btn-soft-danger edit-list mx-1"
                                                title="Delete"
                                            >
                                                <FontAwesomeIcon icon={faTrash} size="lg" />
                                            </Button>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan={10} className="text-center">
                                    No records found.
                                </td>
                            </tr>
                        </tbody>
                    )}
                </Table>
            </div>
        </React.Fragment>
    )
}

export default StockDataTable