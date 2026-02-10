import React, { useState } from "react";
import cas13Image from "@/assets/images/design/cas/cas13.png";
import { InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Input, Select, InputNumber } from "antd";
import { TARGET_GENOME_OPTIONS } from "@/utils/datas/formOptions";
import "./index.css";

const { TextArea } = Input;
const { Option } = Select;

const Cas13 = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedExample, setSelectedExample] = useState(false);
  const [targetGenome, setTargetGenome] = useState("Gossypium_hirsutum_T2T-Jin668_HZAU");
  const [spacerLength, setSpacerLength] = useState(20);

  // Example sequence
  const EXAMPLE_SEQUENCE = `>Ghjin_A01g000010
ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`;

  const handleExampleClick = () => {
    setSelectedExample(true);
    setInputValue(EXAMPLE_SEQUENCE);
  };

  const handleClear = () => {
    setInputValue("");
    setSelectedExample(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="cas13-container">
      {/* 上部分：左图右文 */}
      <div className="cas13-header">
        <div className="cas13-image">
          <img src={cas13Image} alt="cas13" />
        </div>
        <div className="cas13-intro">
          <h1>Design of CRISPR Cas13 guide RNAs</h1>
          <p>
            The RNA-targeting endonuclease Cas13 (Type VI CRISPR) ability to
            selectively target cellular RNAs and influence gene expression
            without making permanent genetic changes.
            <InfoCircleOutlined
              style={{ marginLeft: '8px', cursor: 'pointer' }}
              onClick={() => {
                alert("Cas13 information");
              }}
            />
          </p>
          <h2>Advantages:</h2>
          <ul>
            <li>
              RNA editing doesn&apos;t require homology-directed repair (HDR)
              machinery.
            </li>
            <li>
              Cas13 enzymes also don&apos;t require a PAM sequence at the target
              locus.
            </li>
            <li>
              Cas13 enzymes do not contain the RuvC and HNH domains responsible
              for DNA cleavage, so they cannot directly edit the genome.
            </li>
          </ul>
        </div>
      </div>

      {/* 下部分：表单 */}
      <div className="cas13-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="inputSequences">
              <span className="required">*</span> Input Sequences
              <QuestionCircleOutlined className="help-icon" />
            </label>
            <TextArea
              id="inputSequences"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={5}
              placeholder="Input Your Gene ID / DNA Sequence or See a DEMO as shown in the example"
              size="large"
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
              required
            />
          </div>

          <div className="example-section">
            <span className="example-label">Example of »</span>
            <button
              type="button"
              className={`example-btn ${selectedExample ? 'selected' : ''}`}
              onClick={handleExampleClick}
            >
              {selectedExample ? "✓ " : ""} Genome Sequence (fasta format)
            </button>
            <button
              type="button"
              className="example-btn clear"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="targetGenome">
                <span className="required">*</span> Target Genome
                <a href="#" className="help-link">
                  More Information of Genomes Metadata
                  <InfoCircleOutlined />
                </a>
              </label>
              <Select
                id="targetGenome"
                value={targetGenome}
                onChange={setTargetGenome}
                size="large"
                style={{ width: "100%" }}
                showSearch
                placeholder="Search for a genome"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                }
              >
                {TARGET_GENOME_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="form-group half">
              <label htmlFor="spacerLength">
                <span className="required">*</span> Spacer Length (bp)
              </label>
              <InputNumber
                id="spacerLength"
                value={spacerLength}
                onChange={setSpacerLength}
                min={20}
                max={30}
                size="large"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="form-submit">
            <div className="submit-container">
              <button type="submit" className="submit-btn">
                Design Cas13 guide RNAs 》
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cas13;