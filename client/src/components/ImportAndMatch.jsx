import React, { useState } from "react";
import axios from "axios";
import { BASE_URL, HEADERS, TITLE, STEPS } from "./Constants";

import CustomDropdown from "./CustomDropdown";
import DownloadTemplate from "./DownloadTemplate";
import CustomAlert from "./CustomAlert";

import { readString } from "react-papaparse";

import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faRocket } from "@fortawesome/free-solid-svg-icons";

const ImportAndMatch = () => {
  // Import constants
  const headers = HEADERS;
  const title = TITLE;

  const step2 = STEPS[1];
  const step3 = STEPS[2];
  let DEFAULT_VALUE = "None";

  // Create choices object
  let headersStarter = {};
  headers.map((header) => {
    return headersStarter[header] = DEFAULT_VALUE;
  });

  // The file the user uploads, should be a csv
  const [file, setFile] = useState("");

  // The headers of the csv--selected and unselected, i.e., the options the user has to select from
  const [choiceState, setChoiceState] = useState({
    options: [DEFAULT_VALUE],
  });

  // The options the user has selected
  const [headerValues, setHeaderValues] = useState(headersStarter);

  const [uploadMessage, setUploadMessage] = useState({
    visible: true,
    color: "info",
    text: "Upload your csv file before proceeding.",
  });

  const [submitMessage, setSubmitMessage] = useState({
    visible: true,
    color: "info",
    text: "Then, upload your matches to our servers.",
  });

  // Sets file on file upload
  const chooseFile = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit file to Flask backend and receive back JSONified CSV data; only take out headers (that's all that is needed)
  const submitFile = () => {
    const data = new FormData();
    data.append("file", file);
    axios
      .post(`${BASE_URL}/upload`, data)
      .then((res) => {
        console.log(res);
        setChoiceState({
          options: res.data[0],
        });
        setUploadMessage({
          visible: true,
          color: "success",
          text:
            "Your upload has succeeded. You match proceed to match our fields to yours.",
        });
      })
      .catch((err) => {
        console.warn("Error on the post request..." + err);
        setUploadMessage({
          visible: true,
          color: "danger",
          text:
            "Your upload has failed. There appears to be an internal server error. Please try again later.",
        });
      });
  };

  const onDropdownChange = (e) => {
    // Deal with drop down values
    headerValues[e.target.getAttribute("id")] = e.target.value;
    setHeaderValues(headerValues);

    // Otherwise dropdowns won't update... strange bug
    setChoiceState({
      options: choiceState.options,
    });
  };

  const csvToJSON = async (headers) => {
    let ourHeaders = Object.keys(headers);
    let theirHeaders = Object.values(headers);

    const text = await file.text();
    const jsonResult = await readString(text, {
      header: true,
    });

    let newHeadersResult = [];
    let jsonData = jsonResult.data;

    for (let i = 0; i < jsonData.length; i++) {
      let obj = jsonData[i];
      for (let j = 0; j < ourHeaders.length; j++) {
        // Get new, old key names from headers, new headerValues
        let newKey = ourHeaders[j];
        let oldKey = theirHeaders[j];
        // Replace old key with new key
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
      }
      newHeadersResult.push(obj);
    }
    const db = JSON.stringify({ ...jsonData });
    return db;
  };

  const onSubmitMatches = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    let matchSelections = Object.values(headerValues);
    if (hasDuplicates(matchSelections)) {
      setSubmitMessage({
        visible: true,
        color: "danger",
        text: "Your upload has failed. Check you have no duplicate matchings.",
      });
    } else {
			const data = await csvToJSON(headerValues);
			console.log(JSON.stringify(data));
      axios
        .post(`${BASE_URL}/submit`, data, config)
        .then((res) => {
          console.log(res);
          setSubmitMessage({
            visible: true,
            color: "success",
            text: "Your upload has succeeded. Thank you for using our form.",
          });
        })
        .catch((err) => {
          console.warn("Error on the post request..." + err);
          setSubmitMessage({
            visible: true,
            color: "danger",
            text:
              "Your upload has failed. There appears to be an internal server error. Please try again later.",
          });
        });
    }
  };

  // O(n) way of determining an array has duplicates
  const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
  };

  return (
    <Container className="import">
      <Row>
        <Col>
          <h3>{title}</h3>
        </Col>
      </Row>

      <DownloadTemplate />

      <div class="spacer25"></div>

      <Row>
        <Col>
          <div className="ordered-list-icon">2</div>&emsp;{step2}
          <div class="input-group">
            <div class="input-group-prepend">
              <span
                onClick={submitFile}
                class="input-group-text"
                id="inputGroupFileAddon01"
              >
                Upload&nbsp;&nbsp;
                <FontAwesomeIcon icon={faUpload} />
              </span>
            </div>
            <div class="custom-file">
              <input
                type="file"
                accept=".xls,.xlsx,.csv"
                class="custom-file-input"
                id="inputGroupFile01"
                aria-describedby="inputGroupFileAddon01"
                onChange={chooseFile}
              />
              <label class="custom-file-label" for="inputGroupFile01">
                {file === ""
                  ? "Choose file"
                  : file.name.split(/[\\/]/g).pop().split(".")[0]}
              </label>
            </div>
          </div>
        </Col>
      </Row>

      <div class="spacer5"></div>

      <Row>
        <Col>
          <CustomAlert
            visible={uploadMessage.visible}
            color={uploadMessage.color}
            text={uploadMessage.text}
          />
        </Col>
      </Row>

      <div class="spacer25"></div>

      <Row>
        <Col>
          <div className="ordered-list-icon">3</div>&emsp;{step3}
        </Col>
      </Row>

      <div class="spacer25"></div>
      <hr />

      <Row xs="2">
        <Col xs="6">
          <h4>Match our fields to yours</h4>
          {headers.map((header) => (
            <>
              <Row xs="2">
                <Col xs="3">{header}</Col>
                <Col xs="3">
                  <CustomDropdown
                    id={header}
                    value={headerValues[header]}
                    options={choiceState.options}
                    onChange={onDropdownChange}
                  />
                </Col>
              </Row>
              <div class="spacer10"></div>
            </>
          ))}
        </Col>

        <Col xs="6">
          <Row>
            <Col>
              <h4>Uploaded fields</h4>
              <ListGroup>
                {choiceState.options.map((option) => (
                  <ListGroupItem>{option}</ListGroupItem>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Col>
      </Row>

      <div class="spacer25"></div>

      <Row>
        <Col>
          <Button color="primary" onClick={onSubmitMatches}>
            Submit matches&nbsp;&nbsp;
            <FontAwesomeIcon icon={faRocket} />
          </Button>
        </Col>
      </Row>

      <div class="spacer5"></div>

      <Row>
        <Col>
          <CustomAlert
            visible={submitMessage.visible}
            color={submitMessage.color}
            text={submitMessage.text}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ImportAndMatch;
