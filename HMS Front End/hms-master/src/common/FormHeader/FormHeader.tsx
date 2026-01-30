import { faMinimize } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { Row, Col,} from "reactstrap"

const FormHeader = (props: any) => {
    return (
        <React.Fragment>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 className="mb-sm-0">{props.title}</h4>
                        <div className="page-title-right">
                            <ol className="breadcrumb m-0 align-items-center">
                                <li className="breadcrumb-item"><Link to="#">{props.pageTitle}</Link></li>
                                <li className="breadcrumb-item active">{props.title}</li>
                                <li className="mx-2">
                                    {props.onMinimize && (
                                        <button title="Click to minimize" onClick={props.onMinimize} className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                                            <FontAwesomeIcon icon={faMinimize} />
                                        </button>
                                    )}
                                </li>
                            </ol>
                        </div>

                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
}
export default FormHeader