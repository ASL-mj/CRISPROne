import translocationImage from "@/assets/images/design/fragment/translocation.png"
import { InfoCircleOutlined, MailOutlined } from "@ant-design/icons";
import { Input, Select, InputNumber, Slider } from "antd";
import { useState, useEffect } from "react";
import {
  PAM_TYPE_OPTIONS,
  TARGET_GENOME_OPTIONS,
  SGRNA_MODULE_OPTIONS,
} from "@/utils/datas/formOptions";
import styles from "./index.module.css";


const { TextArea } = Input;
const { Option } = Select;
const Translocation = () => {
  const [selectedExample, setSelectedExample] = useState("geneId");
  const [inputRightFlankingSequence, setInputRightFlankingSequence] = useState("");
  const [inputLeftFlankingSequence, setInputLeftFlankingSequence] = useState("");
  const [inputPostTranslocationSequence, setInputPostTranslocationSequence] = useState("");
  const [pamType, setPamType] = useState("NGG");
  const [targetGenome, setTargetGenome] = useState(
    "Gossypium_hirsutum_T2T-Jin668_HZAU"
  );
  const [customizedPAM, setCustomizedPAM] = useState("");
  const [sgrnaModule, setSgrnaModule] = useState("spacerpam");
  const [spacerLength, setSpacerLength] = useState();
  const [FlankTempSeqLength, setFlankTempSeqLength] = useState([14, 16]);


  // 处理表单提交
  const handleSubmit = () => {
    alert("Submitting is disabled in demo version.");
  };

  const handleExampleClick = (type) => {
    switch (type) {
      case "position":
        setInputLeftFlankingSequence("Ghir_A01:80323913-80324566");
        setInputRightFlankingSequence("Ghir_A01:80923900-80924588");
        setInputPostTranslocationSequence("Ghir_A01:80323913-80924588");
        setSelectedExample("position");
        break;
      case "sequence":
        setInputLeftFlankingSequence("ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA");
        setInputRightFlankingSequence("ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA");
        setInputPostTranslocationSequence("ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA");
        setSelectedExample("sequence");
        break;
      default:
        setInputLeftFlankingSequence('');
        setInputRightFlankingSequence('');
        setInputPostTranslocationSequence('');
        setSelectedExample('');
        break;
    }
  };


  // 从PAM类型的label中提取spacer length
  const extractSpacerLength = (pamValue) => {
    const option = PAM_TYPE_OPTIONS.find(opt => opt.value === pamValue);
    if (!option || !option.label) return 20; // 默认20

    // 匹配 "xxbp-" 或 "-xxbp-" 格式
    const match = option.label.match(/(\d+)bp/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }

    return 20; // 没有匹配到，默认20
  };

  // 处理PAM类型改变
  const handlePamTypeChange = (value) => {
    setPamType(value);
    // 自动设置spacer length
    const length = extractSpacerLength(value);
    setSpacerLength(length);
  };

  // 组件加载时根据默认的pamType自动设置spacerLength
  useEffect(() => {
    const length = extractSpacerLength(pamType);
    setSpacerLength(length);
  }, []); // 只在组件加载时执行一次

  return (
    <div className={styles.deletionContainer}>
      <div className={styles.deletionHeader}>
        <div className={styles.deletionImage}>
          <img src={translocationImage} alt="translocation" />
        </div>
        <div className={styles.deletionIntro}>
          <h1>Design of Fragment Translocation Editing guide RNAs</h1>
          <p>
            Base editors (BE) have two principal components that are fused together to form a single protein: (i) a CRISPR protein, bound to a guide RNA, and (ii) a base editing enzyme, such as a deaminase, which carries out the desired chemical modification of the target DNA base.
            <InfoCircleOutlined
              onClick={() => {
                alert("info");
              }}
            />
          </p>
          <h2>Advantages:</h2>
          <ul>
            <li>The creation of precise, predictable and efficient genetic outcomes at a targeted sequence</li>
            <li>High efficiency editing without need for template-based homology directed repair, and</li>
            <li>Avoidance of the unwanted consequences of double-stranded DNA breaks.</li>
          </ul>
        </div>
      </div>

      {/* 下部分：表单 */}
      <div className={styles.deletionForm}>
        <form onSubmit={handleSubmit}>

          <div className={styles.formGroup}>
            <div className={styles.noteSection}>
              <span className={styles.noteIcon}>
                <MailOutlined />
              </span>
              <span className={styles.noteText}>
                Note: N bp (500bp is recommended) sequence on the left and right of translocation site in the direction of 5'-3'.
              </span>
            </div>
            <label htmlFor="inputLeftFlankingSequence">
              <span className={styles.required}>*</span>
              Input Left Flanking Sequence of Translocation Site
            </label>
            <TextArea
              id="inputLeftFlankingSequence"
              value={inputLeftFlankingSequence}
              onChange={(e) => setInputLeftFlankingSequence(e.target.value)}
              rows={4}
              placeholder="Input Your DNA Sequence or See a DEMO as show in example"
              size="large"
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.noteSection}>
              <span className={styles.noteIcon}>
                <MailOutlined />
              </span>
              <span className={styles.noteText}>
                Note: N bp (500bp is recommended) sequence on the left and right of translocation site in the direction of 5'-3'.Can only input Left or Right of Pre-translocation Chromosome sequence.
              </span>
            </div>
            <label htmlFor="inputRightFlankingSequence">
              <span className={styles.required}>*</span>
              Input Right Flanking Sequence of Translocation Site
            </label>
            <TextArea
              id="inputRightFlankingSequence"
              value={inputRightFlankingSequence}
              onChange={(e) => setInputRightFlankingSequence(e.target.value)}
              rows={4}
              placeholder="Input Your DNA Sequence or See a DEMO as show in example"
              size="large"
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.noteSection}>
              <span className={styles.noteIcon}>
                <MailOutlined />
              </span>
              <span className={styles.noteText}>
                Note: N bp (500bp is recommended) sequence on the left and right of translocation site in the direction of 5'-3'.
              </span>
            </div>
            <label htmlFor="inputPostTranslocationSequence">
              <span className={styles.required}>*</span>
              Input Flanking Sequence of Translocation Site (Post-translocation Chromosome)
            </label>
            <TextArea
              id="inputPostTranslocationSequence"
              value={inputPostTranslocationSequence}
              onChange={(e) => setInputPostTranslocationSequence(e.target.value)}
              rows={4}
              placeholder="Input Your DNA Sequence or See a DEMO as show in example"
              size="large"
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
              required
            />
          </div>

          <div className={styles.exampleSection + " " + styles.exampleButtons}>
            <span className={styles.exampleLabel}>Example of »</span>
            <button
              type="button"
              className={styles.exampleBtn + " " + styles.positionBtn}
              onClick={() => handleExampleClick("position")}
            >
              {selectedExample === "position" ? "✓ " : ""}Genome Position
            </button>
            <button
              type="button"
              className={styles.exampleBtn + " " + styles.SequenceBtn}
              onClick={() => handleExampleClick("sequence")}
            >
              {selectedExample === "sequence" ? "✓ " : ""}Genome Sequence
            </button>
            <button
              type="button"
              className={styles.exampleBtn + " " + styles.clear}
              onClick={() => handleExampleClick("")}
            >
              Clear
            </button>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup + " " + styles.half}>
              <label htmlFor="pamType">
                PAM Type
                <a href="#" className={styles.helpLink}>
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

            <div className={styles.formGroup + " " + styles.half}>
              <label htmlFor="targetGenome">
                Target Genome
                <a href="#" className={styles.helpLink}>
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
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
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

          <div className={styles.noteSection}>
            <span className={styles.noteIcon}>
              <MailOutlined />
            </span>
            <span className={styles.noteText}>

              Note: For a Customized PAM select Customized PAM: 5'-XXX-3' in PAM
              Type and then set sgRNA module and Spacer length.
            </span>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup + " " + styles.third}>
              <label htmlFor="customizedPAM">
                Customized PAM (Need to select Customized PAM in PAM Type )
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

            <div className={styles.formGroup + " " + styles.third}>
              <label htmlFor="sgrnaModule">
                sgRNA module of Customized PAM
              </label>
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

            <div className={styles.formGroup + " " + styles.third}>
              <label htmlFor="spacerLength">
                Spacer length of Customized PAM
              </label>
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
          </div>

          <div className={styles.formGroup} style={{ width: "50%" }}>
            <label htmlFor="sliderRange">
              Flanking Template Sequence Length (bp):
            </label>
            <Slider
              id="FlankTempSeqLength"
              range
              min={10}
              max={20}
              value={FlankTempSeqLength}
              onChange={setFlankTempSeqLength}
              marks={{
                10: '10',
                14: '14',
                16: '16',
                20: '20'
              }}
              style={{ width: "100%" }}
            />
          </div>

          <div className={styles.formSubmit}>
            <div className={styles.submitContainer}>
              <button
                type="submit"
                className={styles.submitBtn}
              >
                Design Translocation sgRNAs 》
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Translocation;