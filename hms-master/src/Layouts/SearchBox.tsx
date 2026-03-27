import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead"
import { InputGroup, InputGroupText } from "reactstrap";

const SearchBox = () => {
    const [isLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);

    const handleSearch = async (query: string) => { }
    return <>
        <div className="search-box-container mx-3">
            <FontAwesomeIcon icon={faSearch} className="px-2" />
            <div className="search">
                <AsyncTypeahead
                    filterBy={() => true}
                    id="product-search-box"
                    isLoading={isLoading}
                    labelKey="name"
                    minLength={3}
                    onSearch={handleSearch}
                    options={options}
                    placeholder="Search..."
                />
            </div>
        </div>
    </>
}
export default SearchBox