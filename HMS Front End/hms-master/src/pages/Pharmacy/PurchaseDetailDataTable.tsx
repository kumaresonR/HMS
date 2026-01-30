import React, { useState } from "react"
import { Input, Table } from "reactstrap"

const PurchaseDetailDataTable = (props: any) => {

    return (
        <React.Fragment>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Medicine Category</th>
                            <th>Company Name</th>
                            <th>Medicine Name</th>
                            <th>Batch No</th>
                            <th>Expiry Date</th>
                            <th>MRP </th>
                            <th>Batch Amount (₹)</th>
                            <th>Sale Price </th>
                            <th>Packing Qty</th>
                            <th>Quantity</th>
                            <th>Tax </th>
                            <th>Purchase Price</th>
                            <th>Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data?.medicines?.map((data: any, idx: any) => (
                            <tr key={idx}>
                                <td>{data.medicineCategory} </td>
                                <td>{data?.companyDetails?.companyName} </td>
                                <td>{data.medicineName}</td>
                                <td>{data.batchNo}</td>
                                <td>{data.expiryDate} </td>
                                <td>{data.mrp}</td>
                                <td>{data.batchAmount} </td>
                                <td>{data.salePrice} </td>
                                {/* <td>
                                    <span>
                                        <Input
                                            id={`salePrice-${data.medicineId}`}
                                            name="salePrice"
                                            type="text"
                                            value={props.salePrices[data.medicineId] || ''}
                                            onChange={(e) =>
                                                props.onSalePriceChange(data.medicineId, e.target.value)
                                            }
                                        />
                                    </span>
                                </td> */}
                                <td>{data.packingQty}</td>
                                <td>{data.quantity}</td>
                                <td>{data.tax} </td>
                                <td>{data.purchasePrice}</td>
                                <td>{data.amount} </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </React.Fragment>
    )
}
export default PurchaseDetailDataTable