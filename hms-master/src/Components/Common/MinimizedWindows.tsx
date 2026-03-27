import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../slices/loader/store";
import { removeMinimizedPage, restorePage } from "../../slices/pageResizer/uiSlice";
import { Badge, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMaximize } from "@fortawesome/free-solid-svg-icons";


const MinimizedPages: React.FC = () => {
    const minimizedPages = useSelector((state: RootState) => state.ui.minimizedPages);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRestore = (route: string) => {
        const restoredPage = minimizedPages.find((p) => p.route === route);
        dispatch(restorePage(route));

        // Navigate and pass the stored data via React Router state
        navigate(route, { state: restoredPage?.data });
    };

    return (
        <div className="bg-light minimized-pages-container position-absolute z-1">
            {minimizedPages.map((page) => (
                <Badge key={page.route} className="m-1">
                    <span onClick={() => handleRestore(page.route)} style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faMaximize} className="mx-2" />
                        {page.pageName}
                    </span>
                    <Button color="transparent" onClick={() => dispatch(removeMinimizedPage(page.route))} className="close-btn p-1">
                        ❌
                    </Button>
                </Badge>
            ))}
        </div>
    );
};

export default MinimizedPages;

