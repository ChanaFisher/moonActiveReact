import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { actions } from '../Redux/Store/actions';
import { compose } from "redux";
import { Dropdown, ButtonGroup, Button, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { FaUserEdit } from 'react-icons/fa'

const mapDispatchToProps = (dispatch) => ({
    setDataTable: (data) => dispatch(actions.setDataTable(data)),
})


function mapStateToProps(state) {
    return {
        dataTable: state.tableReducer.dataTable
    }
}
export default compose(connect(mapStateToProps, mapDispatchToProps))(function TableDynamic(props) {
    const { dataTable, setDataTable } = props;
    const [arrField, setarrField] = useState([])
    const [skip, setSkip] = useState(0)
    const [limit, setLimit] = useState(0)
    const [show, setShow] = useState(false);
    const [objectEdit, setObjectEdit] = useState({})
    const handleClose = () => setShow(false);
    const scrollUp = 873;
    const scrollDown = 3622;
    const handleShow = (id) => {
        setObjectEdit(dataTable.filter(x => x._id == id)[0]);
        setShow(true)
    };

    function saveChange(data, keySend) {
        let objectEditTemp = {};
        arrField.forEach(key => {
            if (keySend == key)
                objectEditTemp[key] = data;
            else
                objectEditTemp[key] = objectEdit[key]
        });
        objectEditTemp["_id"] = objectEdit["_id"];
        console.log(objectEditTemp)
        setObjectEdit(objectEditTemp)

    }
    function updateField() {
        let newDataTable = []
        handleClose();
        fetch("http://localhost:3001/updateField", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newItem: objectEdit })
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                newDataTable = dataTable.map(x => x._id == objectEdit._id ? objectEdit : x);
                setDataTable(newDataTable)
            })
            .catch(err => console.log(err))
    }

    function deleteField(id) {
        fetch("http://localhost:3001/deleteField", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id })
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                let arrData = dataTable.filter(x => x._id != id);
                setDataTable(arrData)
            })
            .catch(err => console.log(err))
    }
    function duplicateField(item) {
        fetch("http://localhost:3001/duplicateField", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newItem: item })
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data.duplicateField)
                let newList = dataTable.concat(data.duplicateField);
                newList.sort((a, b) => a[arrField[0]].localeCompare(b[arrField[0]]))
                setDataTable(newList);
            })
            .catch(err => console.log(err))

    }

    const handleScroll = () => {
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        const top = Math.ceil(window.scrollY) == 0;
        if (window.scrollY == scrollUp && skip > 0)
            getAllData("up")
        if (window.scrollY == scrollDown)
            getAllData("down");
        if (bottom)
            window.scrollTo(0, scrollDown)
        if (top && skip > 0)
            window.scrollTo(0, scrollUp);

    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, {
            passive: true
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });


    function getKeys() {

        fetch("http://localhost:3001/getAllKeys", {
            method: "get",
            headers: { "Content-Type": "application/json" },

        })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                setarrField(data)

            })
            .catch(err => console.log(err))


    }
    useEffect(() => {
        if (limit > 0) {
            fetch("http://localhost:3001/getAllData", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ limit: limit, skip: skip })
            })
                .then(res => res.json())
                .then((data) => {
                    setDataTable(data);

                })
                .catch(err => console.log(err))
        }
    }, [skip, limit])


    function getAllData(status) {

        switch (status) {
            case "up": {
                setSkip(skip - 15)
                setLimit(80)
                break;
            }
            case "down": {
                setSkip(skip + 15)
                setLimit(80)
                break;
            }

            default:
                {
                    getKeys();
                    setSkip(0);
                    setLimit(80)
                }
        }

    }
    return (

        <>
            {limit == 0 ? <button type="button" className="btn btn-outline-primary" onClick={() => { getAllData(); }}>View Table</button> : ""}

            <div>
                <table className="table table-striped table-hover">
                    <thead className="thead-primary">
                        <tr>
                            {arrField.map((key) => (
                                <th className="text-primary" scope="col">{key}</th>
                            ))}
                            {arrField.length > 0 ? <th className="text-primary">Options</th> : ""}
                            {arrField.length > 0 ? <th className="text-primary">Select</th> : ""}
                        </tr>
                    </thead>
                    <tbody>
                        {dataTable.map((objectData, k) => (
                            <tr>
                                {arrField.map((key) => (
                                    <td scope="col">{objectData[key]}</td>))}
                                {arrField.length > 0 ? <td>
                                    <Dropdown as={ButtonGroup}>
                                        <Button variant="primary"><FaUserEdit /></Button>

                                        <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleShow(objectData._id)}>Edit</Dropdown.Item>
                                            <Dropdown.Item onClick={() => deleteField(objectData._id)} >Delete</Dropdown.Item>
                                            <Dropdown.Item onClick={() => duplicateField(objectData)}>Duplicate</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td> : ""}
                                {arrField.length > 0 ? <td><input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" /></td> : ""}
                            </tr>))}

                    </tbody>
                </table>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit field</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {arrField.map((key) => (
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5">
                                {key}:
                            </Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    value={objectEdit[key]}
                                    onChange={(e) => saveChange(e.target.value, key)}
                                />
                                {/* <Form.Select  onChange={(e) => saveChange(e.target.value, key)}>
                                        <option value="Basic">  Basic  </option>
                                        <option value="Common">  Common  </option>
                                       <option value="Epic">  Epic </option>
                                     </Form.Select>  */}
                            </Col>
                        </Form.Group>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateField}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
})