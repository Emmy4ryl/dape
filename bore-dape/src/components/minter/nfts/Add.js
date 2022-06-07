import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { uploadToIpfs } from "../../../utils/minter";

const FACE = ["Big", "Small", "Medium", "Large"];
const BACKGROUND = ["Green", "White", "Grey", "Black", "Red"];
const CLOTH = ["Cotton", "Wool", "Silk", "Leather"];

const AddNfts = ({ save, address }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [ipfsImage, setIpfsImage] = useState("");
    const [description, setDescription] = useState("");
    const [attributes, setAttributes] = useState([]);
    const [show, setShow] = useState(false);

    const isFormFilled = () =>
  name && ipfsImage && description && attributes.length > 2;

  // close the popup modal
  const handleClose = () => {
    setShow(false);
    setAttributes([]);
  };

  // display the popup modal
  const handleShow = () => setShow(true);

  // add an attribute to an NFT
  const setAttributesFunc = (e, trait_type) => {
    const { value } = e.target;
    const attributeObject = {
      trait_type,
      value,
    };
    const arr = attributes;

    // check if attribute already exists
    const index = arr.findIndex((el) => el.trait_type === trait_type);

    if (index >= 0) {
      // update the existing attribute
      arr[index] = {
        trait_type,
        value,
      };
      setAttributes(arr);
      return;
    }

    // add a new attribute
    setAttributes((oldArray) => [...oldArray, attributeObject]);
  };
  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i className="bi bi-plus"></i>
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mint Your Ape</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FloatingLabel
              controlId="inputLocation"
              label="Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name of NFT"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputPrice"
              label="Price"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="Price"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </FloatingLabel>

            <Form.Control
              type="file"
              className={"mb-3"}
              onChange={async (e) => {
                const imageUrl = await uploadToIpfs(e);
                if (!imageUrl) {
                  alert("failed to upload image");
                  return;
                }
                setIpfsImage(imageUrl);
              }}
              placeholder="Product name"
            ></Form.Control>
            <Form.Label>
              <h5>Properties</h5>
            </Form.Label>
            <Form.Control
              as="select"
              className={"mb-3"}
              onChange={async (e) => {
                setAttributesFunc(e, "background");
              }}
              placeholder="Background"
            >
              <option hidden>Background</option>
              {BACKGROUND.map((background) => (
                <option
                  key={`background-${background.toLowerCase()}`}
                  value={background.toLowerCase()}
                >
                  {background}
                </option>
              ))}
            </Form.Control>

            <Form.Control
              as="select"
              className={"mb-3"}
              onChange={async (e) => {
                setAttributesFunc(e, "face");
              }}
              placeholder="Face of Ape"
            >
              <option hidden>Face</option>
              {FACE.map((face) => (
                <option
                  key={`face-${face.toLowerCase()}`}
                  value={face.toLowerCase()}
                >
                  {face}
                </option>
              ))}
            </Form.Control>

            <Form.Control
              as="select"
              className={"mb-3"}
              onChange={async (e) => {
                setAttributesFunc(e, "cloth");
              }}
              placeholder="Cloth"
            >
              <option hidden>Cloth</option>
              {CLOTH.map((cloth) => (
                <option
                  key={`cloth-${cloth.toLowerCase()}`}
                  value={cloth.toLowerCase()}
                >
                  {cloth}
                </option>
              ))}
            </Form.Control>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                name,
                price,
                ipfsImage,
                description,
                ownerAddress: address,
                attributes,
              });
              handleClose();
            }}
          >
            Create NFT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddNfts.propTypes = {
    save: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
  };
  
  export default AddNfts;