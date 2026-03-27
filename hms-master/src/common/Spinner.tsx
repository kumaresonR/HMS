import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../slices/loader/store';
import { Container, Row } from 'reactstrap';

const Spinner = () => {
    const loading = useSelector((state: RootState) => state.loader.loading);

    if (!loading) return null;
    return (
        <React.Fragment>
            <div className="loading" style={{ position: "fixed", zIndex: "1", top: "45%", width: "80%" }}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </React.Fragment >
    )
}

export default Spinner