import PrimerImage from "@/assets/images/design/primer_editor.png";
import React, { useState, useEffect } from "react";
import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Select, Input, Slider, Checkbox, Row, Col, InputNumber } from "antd";
import "./index.css";
import {
  PAM_TYPE_OPTIONS,
  TARGET_GENOME_OPTIONS,
  SGRNA_MODULE_OPTIONS,
} from "@/utils/datas/formOptions";

const { Option } = Select;
const { TextArea } = Input;

const test = () => { }

const PrimerEditor = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedExample, setSelectedExample] = useState("");
  const [pamType, setPamType] = useState("NGG");
  const [targetGenome, setTargetGenome] = useState("Gossypium_hirsutum_T2T-Jin668_HZAU");
  const [customizedPAM, setCustomizedPAM] = useState("");
  const [sgrnaModule, setSgrnaModule] = useState("spacerpam");
  const [cutDistanceToPAM, setCutDistanceToPAM] = useState("3");
  const [spacerLength, setSpacerLength] = useState(20);
  const [showMandatoryParams, setShowMandatoryParams] = useState(true);
  const [showOptionalParams, setShowOptionalParams] = useState(false);

  // Example data
  const EXAMPLES = {
    substitution: "CACACCTACACTGCTCGAAGTAAATATGCGAAGCGCGCGGCCTGGCCGGAGGCGTTCCGCGCCGCCACGTGTTCGTTAACTGTTGATTGGTGGCACATAAGCAATCGTAGTCCGTCAAATTCAGCTCTGTTATCCCGGGCGTTATGTGTCAAATGGCGTAGAACGGGATTGACTGTTTGACGGTAGCTGCTGAGGCGG(G/T)AGAGACCCTCCGTCGGGCTATGTCACTAATACTTTCCAAACGCCCCGTACCGATGCTGAACAAGTCGATGCAGGCTCCCGTCTTTGAAAAGGGGTAAACATACAAGTGGATAGATGATGGGTAGGGGCCTCCAATACATCCAACACTCTACGCCCTCTCCAAGAGCTAGAAGGGCACCCTGCAGTTGGAAAGGG",
    insertion: "CACACCTACACTGCTCGAAGTAAATATGCGAAGCGCGCGGCCTGGCCGGAGGCGTTCCGCGCCGCCACGTGTTCGTTAACTGTTGATTGGTGGCACATAAGCAATCGTAGTCCGTCAAATTCAGCTCTGTTATCCCGGGCGTTATGTGTCAAATGGCGTAGAACGGGATTGACTGTTTGACGGTAGCTGCTGAGGCGGGA(+GTAA)GAGACCCTCCGTCGGGCTATGTCACTAATACTTTCCAAACGCCCCGTACCGATGCTGAACAAGTCGATGCAGGCTCCCGTCTTTGAAAAGGGGTAAACATACAAGTGGATAGATGATGGGTAGGGGCCTCCAATACATCCAACACTCTACGCCCTCTCCAAGAGCTAGAAGGGCACCCTGCAGTTGGAAAGGG",
    deletion: "CACACCTACACTGCTCGAAGTAAATATGCGAAGCGCGCGGCCTGGCCGGAGGCGTTCCGCGCCGCCACGTGTTCGTTAACTGTTGATTGGTGGCACATAAGCAATCGTAGTCCGTCAAATTCAGCTCTGTTATCCCGGGCGTTATGTGTCAAATGGCGTAGAACGGGATTGACTGTTTGACGGTAGCTGCTGAGGCGGGAG(-AGAC)CCTCCGTCGGGCTATGTCACTAATACTTTCCAAACGCCCCGTACCGATGCTGAACAAGTCGATGCAGGCTCCCGTCTTTGAAAAGGGGTAAACATACAAGTGGATAGATGATGGGTAGGGGCCTCCAATACATCCAACACTCTACGCCCTCTCCAAGAGCTAGAAGGGCACCCTGCAGTTGGAAAGGG",
    all: "CACACCTACACTGCTCGAAGTAAATATGCGAAGCGCGCGGCCTGGCCGGAGGCGTTCCGCGCCGCCACGTGTTCGTTAACTGTTGATTGGTGGCACATAAGCAATCGTAGTCCGTCAAATTCAGCTCTGTTATCCCGGGCGTTATGTGTCAAATGGCGTAGAACGGGATTGACTGTTTGACGGTAGCTGCTGAGGCGG(G/T)A(+GTAA)G(-AGAC)CCTCCGTCGGGCTATGTCACTAATACTTTCCAAACGCCCCGTACCGATGCTGAACAAGTCGATGCAGGCTCCCGTCTTTGAAAAGGGGTAAACATACAAGTGGATAGATGATGGGTAGGGGCCTCCAATACATCCAACACTCTACGCCCTCTCCAAGAGCTAGAAGGGCACCCTGCAGTTGGAAAGGG",
  };

  const handleExampleClick = (type) => {
    setSelectedExample(type);
    setInputValue(EXAMPLES[type] || "");
  };

  const handleClear = () => {
    setInputValue("");
    setSelectedExample("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  // Extract spacer length from PAM type label (like Cas9)
  const extractSpacerLength = (pamValue) => {
    const option = PAM_TYPE_OPTIONS.find(opt => opt.value === pamValue);
    if (!option || !option.label) return 20;

    const match = option.label.match(/(\d+)bp/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }

    return 20;
  };

  // Handle PAM type change
  const handlePamTypeChange = (value) => {
    setPamType(value);
    const length = extractSpacerLength(value);
    setSpacerLength(length);
  };

  // Component load时根据默认的pamType自动设置spacerLength
  useEffect(() => {
    const length = extractSpacerLength(pamType);
    setSpacerLength(length);
  }, []); // 只在组件加载时执行一次

  return (
    <div className="primer-container">

      {/* 上部分：左图右文 */}
      <div className="primer-header">
        <div className="primer-image">
          <img src={PrimerImage} alt="Prime Editor" />
        </div>
        <div className="primer-intro">
          <h1>Design of Prime Editing guide RNAs</h1>
          <p>
            Prime editing (PE) tools that consist of a reverse transcriptase
            linked with Cas9 nickase are capable of generating targeted insertions,
            deletions, and base conversions without producing DNA double strand
            breaks or requiring any donor DNA.
            <InfoCircleOutlined
              style={{ marginLeft: '8px', cursor: 'pointer' }}
              onClick={() => {
                alert("Prime editing information");
              }}
            />
          </p>
          <h2>Advantages:</h2>
          <ul>
            <li>Relatively less restricted by PAM</li>
            <li>Universal and easy</li>
            <li>Precise and flexible</li>
          </ul>
          <h2>Note:</h2>
          <p>
            The designed mutations or corrections are marked as "Substitution (a/b),
            Insertion (+c), Deletion (-c)". "a" is the original sequence and "b" is
            the designed mutation sequence, "c" is the deletion (-) or insertion (+)
            sequence.
          </p>
        </div>
      </div>

      {/* 下部分：表单 */}
      <div className="primer-form">
        <form onSubmit={test}>
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

          <div className="example-section example-buttons">
            <span className="example-label">Example of »</span>
            <button
              type="button"
              className="example-btn substitution"
              onClick={() => handleExampleClick("substitution")}
            >
              {selectedExample === "substitution" ? "✓ " : ""}Substitution (a/b)
            </button>
            <button
              type="button"
              className="example-btn insertion"
              onClick={() => handleExampleClick("insertion")}
            >
              {selectedExample === "insertion" ? "✓ " : ""}Insertion (+ATCG)
            </button>
            <button
              type="button"
              className="example-btn deletion"
              onClick={() => handleExampleClick("deletion")}
            >
              {selectedExample === "deletion" ? "✓ " : ""}Deletion (-ATCG)
            </button>
            <button
              type="button"
              className="example-btn all"
              onClick={() => handleExampleClick("all")}
            >
              {selectedExample === "all" ? "✓ " : ""}Substitution + Insertion + Deletion
            </button>
            <button
              type="button"
              className="example-btn clear"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>


          <div
            className="section-header mandatory-header"
            onClick={() => setShowMandatoryParams(!showMandatoryParams)}
          >
            <h3>Mandatory Parameters</h3>
            <span className={`toggle-icon ${showMandatoryParams ? 'expanded' : ''}`}>▼</span>
          </div>

          {showMandatoryParams && (
            <>
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="pamType">
                    PAM Type
                    <a href="#" className="help-link">
                      See notes on enzymes in the help
                      <InfoCircleOutlined />
                    </a>
                  </label>
                  <Select
                    id="pamType"
                    value={pamType}
                    onChange={handlePamTypeChange}
                    size="large"
                    style={{ width: "100%" }}
                  >
                    {PAM_TYPE_OPTIONS.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="form-group half">
                  <label htmlFor="targetGenome">
                    Target Genome
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
              </div>

              <div className="note-section">
                <span className="note-icon">
                  <MailOutlined />
                </span>
                <span className="note-text">
                  Note: For a Customized PAM select Customized PAM: 5'-XXX-3' in PAM Type and then set sgRNA module, Cut distance to PAM and Spacer length.
                </span>
              </div>

              <div className="form-group third">
                <label htmlFor="customizedPAM">
                  Customized PAM (Need to select Customized PAM in PAM Type)
                </label>
                <Input
                  id="customizedPAM"
                  value={customizedPAM}
                  onChange={(e) => setCustomizedPAM(e.target.value)}
                  placeholder="Enter customized PAM"
                  size="large"
                  disabled={pamType !== "PAM"}
                />
              </div>
              <div className="form-row">

                <div className="form-group third">
                  <label htmlFor="sgrnaModule">sgRNA module of Customized PAM</label>
                  <Select
                    id="sgrnaModule"
                    value={sgrnaModule}
                    onChange={setSgrnaModule}
                    size="large"
                    style={{ width: "100%" }}
                    disabled={pamType !== "PAM"}
                  >
                    {SGRNA_MODULE_OPTIONS.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>


                <div className="form-group third">
                  <label htmlFor="spacerLength">Spacer length of Customized PAM</label>
                  <InputNumber
                    id="spacerLength"
                    value={spacerLength}
                    onChange={setSpacerLength}
                    min={15}
                    max={25}
                    placeholder="20"
                    size="large"
                    style={{ width: "100%" }}
                    disabled={pamType !== "PAM"}
                  />
                </div>
                <div className="form-group third">
                  <label htmlFor="cutDistanceToPAM">Cut distance to PAM</label>
                  <Input
                    id="cutDistanceToPAM"
                    value={cutDistanceToPAM}
                    onChange={(e) => setCutDistanceToPAM(e.target.value)}
                    placeholder="Cut distance to PAM"
                    size="large"
                    disabled={pamType !== "PAM"}
                  />
                </div>
              </div>

            </>
          )}

          <div
            className="section-header optional-header"
            onClick={() => setShowOptionalParams(!showOptionalParams)}
          >
            <h3>Optional Parameters</h3>
            <span className={`toggle-icon ${showOptionalParams ? 'expanded' : ''}`}>▼</span>
          </div>

          {showOptionalParams && (
            <div className="optional-params">
              <Row gutter={24}>
                <Col span={6}>
                  <div className="form-group">
                    <label>pegRNA Spacer GC content (%)</label>
                    <Slider
                      range
                      defaultValue={[40, 60]}
                      onChange={test}
                      min={1}
                      max={100}
                      marks={{ 1: '1', 100: '100' }}
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="form-group">
                    <label>PBS length (bp)</label>
                    <Slider
                      range
                      defaultValue={[7, 16]}
                      onChange={test}
                      min={1}
                      max={50}
                      marks={{ 1: '1', 50: '50' }}
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="form-group">
                    <label>PBS GC content (%)</label>
                    <Slider
                      range
                      defaultValue={[40, 60]}
                      onChange={test}
                      min={1}
                      max={100}
                      marks={{ 1: '1', 100: '100' }}
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="form-group">
                    <label>Recommended Tm of PBS sequence (℃)</label>
                    <Slider
                      range
                      defaultValue={[20, 40]}
                      onChange={test}
                      min={1}
                      max={100}
                      marks={{ 1: '1', 100: '100' }}
                    />
                  </div>
                </Col>
              </Row>

              <div className="form-group">
                <label>Homologous RT template length (bp)</label>
                <Slider
                  range
                  defaultValue={[7, 16]}
                  onChange={test}
                  min={1}
                  max={50}
                  marks={{ 1: '1', 50: '50' }}
                  style={{ width: '48%' }}
                />
              </div>

              <Row gutter={24}>
                <Col span={12}>
                  <Checkbox
                    defaultChecked
                    onChange={test}
                  >
                    Exclude first C in RT template
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    defaultChecked
                    onChange={test}
                  >
                    Dual-pegRNA model
                  </Checkbox>
                </Col>
              </Row>

              <div style={{ margin: '20px 0', borderTop: '1px solid #d9d9d9' }}></div>

              <Checkbox
                defaultChecked
                onChange={test}
              >
                ngRNA spacers (same PAM with pegRNA)
              </Checkbox>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Distance of secondary nicking sgRNAs to pegRNA (bp)</label>
                <Slider
                  range
                  defaultValue={[40, 150]}
                  onChange={test}
                  min={1}
                  max={200}
                  marks={{ 1: '1', 200: '200' }}
                  style={{ width: '48%' }}
                />
              </div>

              <div style={{ margin: '20px 0', borderTop: '1px solid #d9d9d9' }}></div>

              <Checkbox
                defaultChecked
                onChange={test}
              >
                pegLIT <InfoCircleOutlined style={{ marginLeft: '4px' }} />
              </Checkbox>

              <Row gutter={24} style={{ marginTop: '16px' }}>
                <Col span={8}>
                  <div className="form-group">
                    <label>
                      Linker Pattern <InfoCircleOutlined />
                    </label>
                    <Input
                      onChange={test}
                      placeholder="Enter linker pattern"
                      size="large"
                    />
                  </div>
                </Col>
                <Col span={16}>
                  <div className="form-group">
                    <label>
                      Incorporated structured RNA motifs <InfoCircleOutlined /> (Read of article <a href="#" target="_blank">🔗</a> or Help <a href="#" target="_blank">🔗</a> in this site.)
                    </label>
                    <Select
                      defaultValue="tevopreQ1"
                      onChange={test}
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Select"
                    >
                      <Option value="tevopreQ1">
                        tevopreQ1 (Trimmed evopreQ1): a modified prequeosine1-1 riboswitch aptamer (Recommend)
                      </Option>
                      <Option value="mpknot">
                        mpknot: frameshifting pseudoknot from Moloney murine leukemia virus (MMLV)
                      </Option>
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          <div className="form-submit">
            <div className="submit-container">
              <button type="submit" className="submit-btn">
                Design Prime Editor pegRNAs 》
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrimerEditor;
