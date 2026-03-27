import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import { billingData } from "../../common/data/billingData";

const SingleModuleBilling = () => {
    let navigate: any = useNavigate();

    const goTo = (path: any) => {
        navigate(path);
    }
    return <>
        <Card>
            <CardHeader>
                <h5 className="mb-0">Single Module Billing</h5>
            </CardHeader>
            <CardBody>
                <Row>
                    {billingData.map((item: any, idx: any) => (
                        <Col md={4} className="my-2" key={idx}>
                            <Card className="h-100 pointer billing-card text-center" onClick={() => goTo(item.path)}>
                                <CardHeader className="bg-dark-subtle" style={{
                                    borderTopLeftRadius: '10px',
                                    borderTopRightRadius: '10px',
                                    backgroundColor: '#F4F4F5' 
                                }}>
<b>                                 {item.name}</b>
                                </CardHeader>

                                <CardBody className="text-center py-4 ">
                                    <i className="display-5 text-primary">
                                        {item.icon}
                                    </i>

                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </CardBody>
        </Card>
    </>
}

export default SingleModuleBilling