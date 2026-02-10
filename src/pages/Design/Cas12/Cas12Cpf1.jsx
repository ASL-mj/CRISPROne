import React, { useState, useRef, useEffect } from "react";
import cpf1Image from "@/assets/images/design/cas/cpf1.png";
import {
  InfoCircleOutlined,
  MailOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Input, Select, InputNumber, notification } from "antd";
import {
  EXAMPLE_DATA,
  PAM_TYPE_OPTIONS_CAS12A,
  TARGET_GENOME_OPTIONS,
  SGRNA_MODULE_OPTIONS,
} from "@/utils/datas/formOptions";
import { executeCas12Design } from "@/utils/api/cas12";
import PollingLoader from "@/components/PollingLoader";
import "./index.css";

const { TextArea } = Input;
const { Option } = Select;
const Cas12Cpf1 = () => {
  const [formData, setFormData] = useState({
    inputSequences: "Ghjin_A01g000010",
    pamType: "TTTN",
    targetGenome: "Gossypium_hirsutum_T2T-Jin668_HZAU",
    spacerLength: undefined,
    sgRNAModule: "spacerpam",
    cas_type: "cas12a",
  });
  const [selectedExample, setSelectedExample] = useState("");
  const [customizedPAM, setCustomizedPAM] = useState("");
  const pollingLoaderRef = useRef(null);
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, errorMsg) => {
    api[type]({
      message: "Response Message",
      description: errorMsg,
    });
  };
  const handleExampleClick = (type) => {
    // 根据当前选中的 targetGenome 获取对应的选项
    const selectedOption = TARGET_GENOME_OPTIONS.find(
      (option) => option.value === formData.targetGenome
    );
    
    let fillValue = "";
    switch (type) {
      case "geneId":
        fillValue = selectedOption?.geneId || EXAMPLE_DATA.geneId;
        setFormData({ ...formData, inputSequences: fillValue });
        setSelectedExample("geneId");
        break;
      case "position":
        fillValue = selectedOption?.position || EXAMPLE_DATA.position;
        setFormData({ ...formData, inputSequences: fillValue });
        setSelectedExample("position");
        break;
      case "sequence":
        fillValue = selectedOption?.sequence || EXAMPLE_DATA.sequence;
        setFormData({ ...formData, inputSequences: fillValue });
        setSelectedExample("sequence");
        break;
      case "clear":
        setFormData({ ...formData, inputSequences: "" });
        setSelectedExample("clear");
        break;
      default:
        break;
    }
  };
  // 获取表单数据
  const getFormData = () => {
    return {
      inputSequences: formData.inputSequences,
      pamType: formData.pamType === "PAM" ? customizedPAM : formData.pamType,
      targetGenome: formData.targetGenome,
      spacerLength: formData.spacerLength,
      sgRNAModule: formData.sgRNAModule,
      cas_type: formData.cas_type,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 表单验证
    if (!formData.inputSequences.trim()) {
      openNotificationWithIcon("warning", "Please enter sequence information");
      return;
    }
    // 如果是自定义PAM，检查是否填写了自定义PAM值
    if (formData.pamType === "PAM" && !customizedPAM.trim()) {
      openNotificationWithIcon(
        "warning",
        "Please enter customized PAM sequence"
      );
      return;
    }
    
    // 收集表单数据
    const submitData = getFormData();
    console.log("API Parameters:", submitData);
    
    // 调用轮询加载组件的submit方法
    if (pollingLoaderRef.current) {
      pollingLoaderRef.current.submit(submitData);
    }
  };

  // 从PAM类型的label中提取spacer length
  const extractSpacerLength = (pamValue) => {
    const option = PAM_TYPE_OPTIONS_CAS12A.find(opt => opt.value === pamValue);
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
    setFormData({ ...formData, pamType: value });
    // 自动设置spacer length
    const length = extractSpacerLength(value);
    setFormData(prev => ({ ...prev, spacerLength: length }));
  };

  // 组件加载时根据默认的pamType自动设置spacerLength
  useEffect(() => {
    const length = extractSpacerLength(formData.pamType);
    setFormData(prev => ({ ...prev, spacerLength: length }));
  }, []); // 只在组件加载时执行一次

  return (
    <div className="cas12-container">
      {contextHolder}
      {/* 轮询加载组件 */}
      <PollingLoader
        ref={pollingLoaderRef}
        apiFunction={executeCas12Design}
        resultPath="/cas12/result"
        getFormData={getFormData}
      />
      <div className="cas12-header">
        <div className="cas12-image">
          <img src={cpf1Image} alt="cpf1" />
        </div>
        <div className="cas12-intro">
          <h1>Design of CRISPR-Cas12a (Cpf1) guide RNAs</h1>
          <p>
            The CRISPR-Cas12a (TTTN + 23bp) System allows targeting of
            alternative sites that are not available to the CRISPR-Cas9 System
            and produces a staggered cut with a 5′ overhang.
            <InfoCircleOutlined
              onClick={() => {
                alert("info");
              }}
            />
          </p>
          <h2>Advantages:</h2>
          <ul>
            <li>Enables genome editing in organisms with AT-rich genomes</li>
            <li>
              Allows interrogation of additional genomic regions compared to
              Cas9
            </li>
          </ul>
        </div>
      </div>

      <div className="cas12-form">
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
              value={formData.inputSequences}
              onChange={(e) =>
                setFormData({ ...formData, inputSequences: e.target.value })
              }
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
              onClick={() => handleExampleClick("clear")}
            >
              Clear
            </button>
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
                value={formData.pamType}
                onChange={handlePamTypeChange}
                size="large"
                style={{ width: "100%" }}
              >
                {PAM_TYPE_OPTIONS_CAS12A.map((option) => (
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
                value={formData.targetGenome}
                onChange={(value) => {
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
                      setFormData({ ...formData, targetGenome: value, inputSequences: fillValue });
                    } else {
                      setFormData({ ...formData, targetGenome: value });
                    }
                  } else {
                    setFormData({ ...formData, targetGenome: value });
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
              Type and then set sgRNA module and Spacer length .
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
                disabled={formData.pamType !== "PAM"}
              />
            </div>

            <div className="form-group third">
              <label htmlFor="sgrnaModule">
                sgRNA module of Customized PAM
              </label>
              <Select
                id="sgrnaModule"
                value={formData.sgRNAModule}
                onChange={(e) => setFormData({ ...formData, sgRNAModule: e })}
                size="large"
                style={{ width: "100%" }}
                disabled={formData.pamType !== "PAM"}
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
                value={formData.spacerLength}
                onChange={(e) => setFormData({ ...formData, spacerLength: e })}
                min={15}
                max={25}
                placeholder="20"
                size="large"
                style={{ width: "100%" }}
                disabled={formData.pamType !== "PAM"}
              />
            </div>
          </div>

          <div className="form-submit">
            <div className="submit-container">
              <button type="submit" className="submit-btn">
                Design Cas12a/Cpf1 sgRNAs 》
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cas12Cpf1;
