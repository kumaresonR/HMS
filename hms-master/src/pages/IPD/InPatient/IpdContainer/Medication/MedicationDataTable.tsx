import { Table } from "reactstrap";

const MedicationDataTable = (props: any) => {

    return <>
        <div className="table-responsive">
            <Table hover className="table-centered align-middle table-nowrap mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Date</th>
                        <th>Medicine Name</th>
                        <th>Dose</th>
                        <th>Time</th>
                        <th>Remark</th>
                    </tr>
                </thead>
                <tbody>
                    {props?.data?.medicationsDetails?.map((item: any, idx: any) => (
                        <tr key={idx}>
                            <td>
                                {item.date}
                            </td>
                            <td className="text-primary">{item.medicineName}</td>
                            <td>{item?.dosage[0]?.dosage || '-'}</td>
                            <td>{item.time}</td>
                            <td>{item?.dosage[0]?.remarks || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    </>
}
export default MedicationDataTable