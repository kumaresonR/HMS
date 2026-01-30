import React from "react"
import { Table } from "reactstrap"

const IpdCharges = (props: any) => {
    return (
        <React.Fragment>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Service</th>
                            <th>Charge</th>
                            <th>Qty</th>
                            <th>Discount</th>
                            <th>Tax</th>
                            <th>Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data?.map((data: any, idx: any) => (
                            <tr key={idx}>
                                <td>{data.service} </td>
                                <td>{data.charge}</td>
                                <td>{data.qty}</td>
                                <td>{data.discount} </td>
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

export default IpdCharges