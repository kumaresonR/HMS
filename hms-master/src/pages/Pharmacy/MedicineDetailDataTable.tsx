import React from "react"
import { Table } from "reactstrap"

const MedicineDetailDataTable = (props: any) => {
    return (
        <React.Fragment>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Medicine Category</th>
                            <th>Medicine Name</th>
                            <th>Batch No</th>
                            <th>Unit</th>
                            <th>Expiry Date</th>
                            <th>Quantity</th>
                            <th>Tax</th>
                            <th>Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data?.map((data: any, idx: any) => (
                            <tr key={idx}>
                                <td>{data.medicineCategory} </td>
                                <td>{data.medicineName}</td>
                                <td>{data.batchNo}</td>
                                <td>{data.unit} </td>
                                <td>{data.expiryDate} </td>
                                <td>{data.qnt}</td>
                                <td>{data.tax}</td>
                                <td>{data.amount} </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </React.Fragment>
    )
}

export default MedicineDetailDataTable