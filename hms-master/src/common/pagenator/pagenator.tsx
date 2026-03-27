import React from "react";
import { Link } from "react-router-dom";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    handlePageSizeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handlePrevious: () => void;
    handleNext: () => void;
    disableNext: boolean;
}

const Paginator: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    pageSize,
    handlePageSizeChange,
    handlePrevious,
    handleNext,
    disableNext
}) => {
    return (
        <div className="align-items-center justify-content-between d-flex mt-4 g-3 text-center text-sm-start">
            <div className="d-flex w-auto align-items-center">
                <label className="mx-2 text-nowrap">Page Size :</label>
                <select className="form-control" value={pageSize} onChange={handlePageSizeChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>

            <div className="col-sm-auto">
                <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
                    {/* Previous Button */}
                    <li className={currentPage === 0 ? "page-item disabled" : "page-item"}>
                        <Link to="#" className="page-link" onClick={handlePrevious}>Previous</Link>
                    </li>

                    <li className="page-item">
                        <Link to="#" className={"page-link active"}>{currentPage + 1}</Link>
                    </li>

                    {/* Next Button */}
                    <li className={disableNext ? "page-item disabled" : "page-item"}>
                        <Link to="#" className="page-link" onClick={handleNext}>Next</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Paginator;