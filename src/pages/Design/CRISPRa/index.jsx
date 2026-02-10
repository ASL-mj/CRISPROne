import React, { useState, useRef, useEffect } from "react";
import CrisprAImage from "@/assets/images/design/crisper_a.png";
import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Select, Input, InputNumber, notification } from "antd";
import "./index.css";
import {
  PAM_TYPE_OPTIONS,
  TARGET_GENOME_OPTIONS,
  SGRNA_MODULE_OPTIONS,
  EXAMPLE_DATA,
} from "@/utils/datas/formOptions";
import { executeCRISPRaDesign } from "@/utils/api/apis";
import PollingLoader from "@/components/PollingLoader";

const { Option } = Select;
const { TextArea } = Input;

const CRISPRa = () => {
  const [inputValue, setInputValue] = useState("Ghjin_A01g000010");
  const [pamType, setPamType] = useState("NGG");
  const [targetGenome, setTargetGenome] = useState(
    "Gossypium_hirsutum_T2T-Jin668_HZAU"
  );
  const [customizedPAM, setCustomizedPAM] = useState("");
  const [sgrnaModule, setSgrnaModule] = useState("spacerpam");
  const [spacerLength, setSpacerLength] = useState();
  const [upstreamSequenceLength, setUpstreamSequenceLength] = useState(2000);
  const [inputType, setInputType] = useState("geneId");
  const [selectedExample, setSelectedExample] = useState("");
  const pollingLoaderRef = useRef(null);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, errorMsg) => {
    api[type]({
      message: "Response Message",
      description: errorMsg,
    });
  };

  // 检测输入类型的函数
  const detectInputType = (input) => {
    if (!input || typeof input !== "string") {
      return "unknown";
    }

    // 基因ID格式: XXX.XXX001 (例如 Ghjin_A01.g00001)
    if (/^[A-Za-z0-9_]+\.[A-Za-z0-9]+\d+$/.test(input.trim())) {
      return "geneId";
    }

    // 位置格式: XXX:0001-0002
    if (/^[A-Za-z0-9]+:\d+-\d+$/.test(input.trim())) {
      return "position";
    }

    // 序列格式: >ID\n序列
    if (input.trim().startsWith(">") && input.includes("\n")) {
      return "sequence";
    }

    return "unknown";
  };

  // 当输入值改变时更新输入类型
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setInputType(detectInputType(value));
  };

  // 获取表单数据
  const getFormData = () => {
    return {
      inputSequences: inputValue,
      pamType: pamType === "PAM" ? customizedPAM : pamType,
      targetGenome: targetGenome,
      sgRNAModule: sgrnaModule,
      spacerLength: spacerLength,
      // 仅在基因ID格式时包含upstreamSequenceLength参数
      ...(inputType === "geneId" ? { upstreamSequenceLength: upstreamSequenceLength } : {})
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 表单验证
    if (!inputValue.trim()) {
      openNotificationWithIcon("warning", "Please enter sequence information");
      return;
    }

    // 如果是自定义PAM，检查是否填写了自定义PAM值
    if (pamType === "PAM" && !customizedPAM.trim()) {
      openNotificationWithIcon(
        "warning",
        "Please enter customized PAM sequence"
      );
      return;
    }

    // 收集表单数据
    const formData = getFormData();
    console.log("API Parameters:", formData);
    
    // 调用轮询加载组件的submit方法
    if (pollingLoaderRef.current) {
      pollingLoaderRef.current.submit(formData);
    }
  };

  const handleExampleClick = (type) => {
    // 根据当前选中的 targetGenome 获取对应的选项
    const selectedOption = TARGET_GENOME_OPTIONS.find(
      (option) => option.value === targetGenome
    );
    
    let fillValue = "";
    switch (type) {
      case "geneId":
        fillValue = selectedOption?.geneId || EXAMPLE_DATA.geneId;
        setInputValue(fillValue);
        setSelectedExample("geneId");
        setInputType("geneId");
        break;
      case "position":
        fillValue = selectedOption?.position || EXAMPLE_DATA.position;
        setInputValue(fillValue);
        setSelectedExample("position");
        setInputType("position");
        break;
      case "sequence":
        fillValue = selectedOption?.sequence || EXAMPLE_DATA.sequence;
        setInputValue(fillValue);
        setSelectedExample("sequence");
        setInputType("sequence");
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSelectedExample("");
    setInputType("unknown");
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
    <div className="crispra-container">
      {contextHolder}
      {/* 轮询加载组件 */}
      <PollingLoader
        ref={pollingLoaderRef}
        apiFunction={executeCRISPRaDesign}
        resultPath="/crispra/result"
        getFormData={getFormData}
      />
      <div className="crispra-header">
        <div className="crispra-image">
          <img src={CrisprAImage} alt="CrisprA" />
        </div>
        <div className="crispra-intro">
          <h1>Design of CRISPR activation guide RNAs</h1>
          <p>
            CRISPR activation (CRISPRa) is an optimized method for specific gene
            overexpression. CRISPRa uses an inactivated CRISPR-Cas9 system
            (dCas9) to upregulate target genes within their native context. This
            method offers many advantages over more traditional gene
            overexpression techniques, such as cDNA and ORF.
            <InfoCircleOutlined
              onClick={() => {
                alert("info");
              }}
            />
          </p>
          <h2>Advantages:</h2>
          <ul>
            <li>Temporary or sustained overexpression options</li>
            <li>CRISPR-based gene targeting specificity</li>
            <li>Upregulation within the gene's native context</li>
            <li>Natural cellular post-transcriptional processing</li>
            <li>Highly biologically relevant overexpression models</li>
          </ul>
        </div>
      </div>

      {/* 下部分：表单 */}
      <div className="crispra-form">
        {contextHolder}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="inputSequences">
              <span className="required">*</span> Input Sequences (Only
              Id/Position/Sequence required; Design speed: Id = Position &gt;
              Fasta Sequence)
              <QuestionCircleOutlined className="help-icon" />
            </label>
            <TextArea
              id="inputSequences"
              value={inputValue}
              onChange={handleInputChange}
              rows={4}
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
              className="example-btn gene-id"
              onClick={() => handleExampleClick("geneId")}
            >
              {selectedExample === "geneId" ? "✓ " : ""}Gene ID (Recommended)
            </button>
            <button
              type="button"
              className="example-btn genome-position"
              onClick={() => handleExampleClick("position")}
            >
              {selectedExample === "position" ? "✓ " : ""}Genome Position
              (Recommended)
            </button>
            <button
              type="button"
              className="example-btn genome-sequence"
              onClick={() => handleExampleClick("sequence")}
            >
              {selectedExample === "sequence" ? "✓ " : ""}Genome Sequence (fasta
              format)
            </button>
            <button
              type="button"
              className="example-btn clear"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>

          <div className="substitution-module-section">
            <div className="substitution-info">
              <p className="substitution-text">
                When inputting the gene ID, the 2000bp sequence upstream of the
                gene is selected by default for sgRNA design.
              </p>
              <p className="substitution-text">
                Or you can modify the parameter 5' flanking sequence length
                (upstream) to specify the length.
              </p>
            </div>
          </div>

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
                onChange={(value) => {
                  setTargetGenome(value);
                  // 查找对应的选项并自动填充 geneId
                  const selectedOption = TARGET_GENOME_OPTIONS.find(
                    (option) => option.value === value
                  );
                  if (selectedOption) {
                    // 清除示例勾选状态，自动选择 geneId 并回填
                    setSelectedExample("geneId");
                    setInputType("geneId");
                    // 优先使用 geneId，如果不存在则使用 InputSequence
                    const fillValue = selectedOption.geneId || selectedOption.InputSequence || "";
                    if (fillValue) {
                      setInputValue(fillValue);
                    }
                  }
                }}
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
          <div className="note-section">
            <span className="note-icon">
              <MailOutlined />
            </span>
            <span className="note-text">
              Note: For a Customized PAM select Customized PAM: 5'-XXX-3' in PAM
              Type and then set sgRNA module and Spacer length.
            </span>
          </div>

          <div className="form-row">
            <div className="form-group third">
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

            <div className="form-group third">
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

            <div className="form-group third">
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

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="upstreamSequenceLength">
                5' flanking sequence length (upstream)
                <a href="#" className="help-link">
                  More information about flanking sequence
                  <InfoCircleOutlined />
                </a>
                {inputType !== "geneId" && (
                  <span style={{ color: "#ff4d4f", marginLeft: "10px", fontSize: "12px" }}>
                    (Only available for Gene ID format)
                  </span>
                )}
              </label>
              <InputNumber
                id="upstreamSequenceLength"
                value={upstreamSequenceLength}
                onChange={setUpstreamSequenceLength}
                min={100}
                max={2000}
                step={100}
                placeholder="500"
                size="large"
                style={{ width: "100%" }}
                disabled={inputType !== "geneId"}
              />
            </div>

            <div className="form-group half"></div>
          </div>

          <div className="form-submit">
            <div className="submit-container">
              <button type="submit" className="submit-btn">
                Design CRISPRa sgRNAs ⟩
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CRISPRa;
