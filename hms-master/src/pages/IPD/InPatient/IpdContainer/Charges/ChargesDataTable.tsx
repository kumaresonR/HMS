import moment from "moment";
import { Col, Table } from "reactstrap"

const ChargesDataTable = (props: any) => {
    const charges =
        (props?.data?.ipdCharges && props?.data?.ipdCharges?.length > 0)
            ? props?.data?.ipdCharges
            : (props?.data?.opdCharges && props?.data?.opdCharges.length > 0)
                ? props?.data?.opdCharges
                : [];

    return <>
        <Col>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Charge Type</th>
                            <th>Charge Category</th>
                            <th>Qty</th>
                            <th>Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {charges.length > 0 ? (
                            charges.map((item: any, idx: any) => (
                                <tr key={idx}>
                                    <td>
                                        {moment(item.date).format('DD/MM/YYYY hh:mm A')}
                                    </td>
                                    <td className="text-primary">{item?.combinedCharges?.chargeName || 'NA'}</td>
                                    <td className="text-primary">{item.combinedCharges?.chargeType?.chargeType || 'NA'}</td>
                                    <td>{item.combinedCharges?.chargeCategory?.name || 'NA'}</td>
                                    <td>{item.qty}</td>
                                    <td className="text-primary">{item.netAmount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center">No charges available</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Col>
    </>
}
export default ChargesDataTable