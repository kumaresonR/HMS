import { Card, CardBody } from "reactstrap"
import OPDTreatmentHistoryDataTable from "./OpdTreatmentHistoryDataTable"

const OpdTreatmentHistory = (props: any) => {
    return <>
        <Card>
            <CardBody>
                <OPDTreatmentHistoryDataTable refresh={props.refresh} data={props.data} />
            </CardBody>
        </Card>
    </>
}
export default OpdTreatmentHistory