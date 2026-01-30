import React from "react"
import { Table } from "reactstrap"

const BillTransaction = (props: any) => {
    return (
        <React.Fragment>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Transaction ID</th>
                            <th>Payment Date</th>
                            <th>Payment Mode</th>
                            <th>Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data?.map((data: any, idx: any) => (
                            <tr key={idx}>
                                <td>{data.transactionID} </td>
                                <td>{data.paymentDate}</td>
                                <td>{data.paymentMode}</td>
                                <td>{data.amount} </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </React.Fragment>
    )
}

export default BillTransaction