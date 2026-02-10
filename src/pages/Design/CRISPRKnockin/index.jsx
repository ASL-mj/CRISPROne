import React, { useState, useRef, useEffect } from "react";
import CrisprKnockinImage from "@/assets/images/design/knock_in.png";
import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  MailOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { Select, Input, InputNumber, notification } from "antd";
import "./index.css";
import {
  PAM_TYPE_OPTIONS,
  TARGET_GENOME_OPTIONS,
  SGRNA_MODULE_OPTIONS,
  EXAMPLE_DATA,
} from "@/utils/datas/formOptions";
import { executeKnockinDesign } from "@/utils/api/apis";
import PollingLoader from "@/components/PollingLoader";

const { Option } = Select;
const { TextArea } = Input;

const CRISPRKnockin = () => {
  const [inputValue, setInputValue] = useState("Ghjin_A01g000010");
  const [pamType, setPamType] = useState("NGG");
  const [targetGenome, setTargetGenome] = useState(
    "Gossypium_hirsutum_T2T-Jin668_HZAU"
  );
  const [customizedPAM, setCustomizedPAM] = useState("");
  const [sgrnaModule, setSgrnaModule] = useState("spacerpam");
  const [spacerLength, setSpacerLength] = useState();
  const [selectedExample, setSelectedExample] = useState("");
  const pollingLoaderRef = useRef(null);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, errorMsg) => {
    api[type]({
      message: "Response Message",
      description: errorMsg,
    });
  };

  // 获取表单数据
  const getFormData = () => {
    return {
      inputSequences: inputValue,
      pamType: pamType === "PAM" ? customizedPAM : pamType,
      targetGenome: targetGenome,
      sgRNAModule: sgrnaModule,
      spacerLength: spacerLength,
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
        break;
      case "position":
        fillValue = selectedOption?.position || EXAMPLE_DATA.position;
        setInputValue(fillValue);
        setSelectedExample("position");
        break;
      case "sequence":
        fillValue = selectedOption?.sequence || EXAMPLE_DATA.sequence;
        setInputValue(fillValue);
        setSelectedExample("sequence");
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSelectedExample("");
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
    <div className="knockin-container">
      {contextHolder}
      {/* 轮询加载组件 */}
      <PollingLoader
        ref={pollingLoaderRef}
        apiFunction={executeKnockinDesign}
        resultPath="/crispr-knockin/result"
        getFormData={getFormData}
      />
      <div className="knockin-header">
        <div className="knockin-image">
          <img src={CrisprKnockinImage} alt="CrisprKnockin" />
        </div>
        <div className="knockin-intro">
          <h1>Design of CRISPR Knock-ins guide RNAs</h1>
          <p>
            CRISPR Knock-in experiments, wherein researchers insert a gene of
            interest at the specific site, rely on HDR. This mechanism uses a
            homologous template to repair DSBs and is therefore highly accurate.
            The precision of the HDR repair pathway can be coupled with the
            specificity of CRISPR-Cas to introduce the desired sequence into the
            target genomic region.
            <InfoCircleOutlined
              onClick={() => {
                alert("info");
              }}
            />
          </p>
          <h2>Optimizing Success With CRISPR Knock-in Experiments:</h2>
          <ul>
            <li>Choose the Right Guide RNA</li>
            <li>Pick the Right DNA Donor Template</li>
            <li>Single-stranded DNA (ssDNA)</li>
            <li>Avoid Re-cutting by Cas9</li>
            <li>Optimizing HDR efficiency over NHEJ</li>
          </ul>
        </div>
      </div>

      {/* 下部分：表单 */}
      <div className="knockin-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="inputSequences">
              <span className="required">*</span> Input Sequences (Only Id/Position/Sequence required; Design speed: Id = Position &gt; Fasta Sequence)
              <QuestionCircleOutlined className="help-icon" />
            </label>
            <TextArea
              id="inputSequences"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
              {selectedExample === "position" ? "✓ " : ""}Genome Position (Recommended)
            </button>
            <button
              type="button"
              className="example-btn genome-sequence"
              onClick={() => handleExampleClick("sequence")}
            >
              {selectedExample === "sequence" ? "✓ " : ""}Genome Sequence (fasta format)
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
              <CheckCircleOutlined style={{ fontSize: '18px', color: '#000' }} />
              <span className="substitution-text">An Substitution module is input for pegRNAs Design</span>
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
              Note: For a Customized PAM select Customized PAM: 5'-XXX-3' in PAM Type and then set sgRNA module and Spacer length.
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

          <div className="form-submit">
            <div className="submit-container">
              <button type="submit" className="submit-btn">
                Design Knock-in sgRNAs ⟩
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CRISPRKnockin;