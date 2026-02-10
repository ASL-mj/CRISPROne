import { useState, useEffect, useMemo } from "react";
import { Typography, Collapse, message, Card, Tag, Table, Select, Space, Button, Dropdown } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { executeBEDesign } from "@/utils/api/BE";
import { useDownloadProgress } from "@/hooks/useDownloadProgress";
import LoadingProgress from "@/components/LoadingProgress";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./index.css";
// 使用真实路由 state 中的 responseData 作为数据源

const { Title } = Typography;
const { Panel } = Collapse;

// 序列渲染辅助函数
function text(v) {
  return v === undefined || v === null ? "" : String(v);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseAminoChange(v) {
  const s = text(v).trim();
  if (!s) return null;
  const sep = s.includes("→") ? "→" : (s.includes("->") ? "->" : null);
  if (!sep) return null;
  const parts = s.split(sep);
  if (parts.length < 2) return null;
  const before = parts[0].trim();
  const after = parts.slice(1).join(sep).trim();
  if (!before || !after) return null;
  return { before, after };
}


// 简化版 MD/rseq：仅将高亮位点设为红色加粗
function renderMdRseqCellSimple(md, rseq) {
  const mdStr = text(md).trim();
  const seq = text(rseq);
  if (!mdStr) return escapeHtml(seq);
  let i = 0;
  let out = "";
  const tokens = mdStr.match(/(\d+|[A-Za-z]+)/g) || [];
  for (const tk of tokens) {
    if (/^\d+$/.test(tk)) {
      const n = parseInt(tk, 10) || 0;
      if (n > 0) {
        const slice = seq.slice(i, i + n);
        out += escapeHtml(slice);
        i += slice.length;
      }
    } else {
      for (let k = 0; k < tk.length; k++) {
        const ch = seq[i] ?? "";
        if (ch) {
          out += '<span style="color:#ff0000;font-weight:700;">' + escapeHtml(ch) + "</span>";
          i += 1;
        }
      }
    }
  }
  if (i < seq.length) {
    out += escapeHtml(seq.slice(i));
  }
  return out;
}

// 简化版高亮：仅将差异碱基设为红色（用于“AA change / Edited sequence”列）
function highlightEditedDiffSimple(originalSeq, editedSeq) {
  const o = text(originalSeq);
  const e = text(editedSeq);
  if (!o && !e) return "";
  const maxLen = Math.max(o.length, e.length);
  let out = "";
  for (let i = 0; i < maxLen; i++) {
    const oc = o[i] ?? "";
    const ec = e[i] ?? "";
    const diff = oc !== ec;
    const safe = escapeHtml(ec);
    out += diff && ec !== "" ? '<span style="color:#ff0000;">' + safe + '</span>' : safe;
  }
  return out;
}

function buildEditedBaseSpans(originalSeq, editedSeq) {
  const o = text(originalSeq);
  const e = text(editedSeq);
  const spans = [];
  for (let i = 0; i < e.length; i++) {
    const oc = o[i] ?? "";
    const ec = e[i] ?? "";
    const diff = oc !== ec;
    const safe = escapeHtml(ec);
    spans.push(diff && ec !== "" ? '<span class="be-nt be-diff">' + safe + '</span>' : '<span class="be-nt">' + safe + '</span>');
  }
  return spans;
}

// 简化版碱基 span：仅变异设红色
function buildEditedBaseSpansSimple(originalSeq, editedSeq) {
  const o = text(originalSeq);
  const e = text(editedSeq);
  const spans = [];
  for (let i = 0; i < e.length; i++) {
    const oc = o[i] ?? "";
    const ec = e[i] ?? "";
    const diff = oc !== ec;
    const safe = escapeHtml(ec);
    spans.push(diff && ec !== "" ? '<span class="be-nt" style="color:#ff0000;">' + safe + '</span>' : '<span class="be-nt">' + safe + '</span>');
  }
  return spans;
}


// 简化版密码子对齐：仅变异碱基为红色
function renderCodonStackSimple(originalSeq, editedSeq, aaBefore, aaAfter) {
  const baseSpans = buildEditedBaseSpansSimple(originalSeq, editedSeq);
  const codonCount = Math.ceil(baseSpans.length / 3) || 1;
  const aaBeforeArr = text(aaBefore).split("");
  const aaAfterArr = text(aaAfter).split("");

  const padTo = (arr, n) => {
    const res = arr.slice(0, n);
    while (res.length < n) res.push("");
    return res;
  };
  const aaTop = padTo(aaBeforeArr, codonCount);
  const aaBottom = padTo(aaAfterArr, codonCount);

  let topHtml = '<div class="be-codon-row be-seq">';
  for (let i = 0; i < codonCount; i++) {
    topHtml += '<span class="be-codon-block">' + escapeHtml(aaTop[i]) + "</span>";
  }
  topHtml += "</div>";

  let midHtml = '<div class="be-codon-row">';
  for (let i = 0; i < codonCount; i++) {
    const start = i * 3;
    const codonSpans = [
      baseSpans[start] || '<span class="be-nt"></span>',
      baseSpans[start + 1] || '<span class="be-nt"></span>',
      baseSpans[start + 2] || '<span class="be-nt"></span>'
    ].join("");
    midHtml += '<span class="be-codon-block">' + codonSpans + "</span>";
  }
  midHtml += "</div>";

  let bottomHtml = '<div class="be-codon-row be-seq">';
  for (let i = 0; i < codonCount; i++) {
    bottomHtml += '<span class="be-codon-block">' + escapeHtml(aaBottom[i]) + "</span>";
  }
  bottomHtml += "</div>";

  return '<div>' + topHtml + midHtml + bottomHtml + "</div>";
}

// 处理多种变化的情况（用 | 分隔）
function renderMultipleChanges(originalSeq, aminoAcidChanges, editedSeqs) {
  const original = text(originalSeq);
  
  // 如果没有变化信息，直接显示原始序列
  if (!aminoAcidChanges && !editedSeqs) {
    return '<div class="be-seq">' + escapeHtml(original) + '</div>';
  }

  // 分割变化（按 | 分隔）
  const aaChangeParts = aminoAcidChanges ? text(aminoAcidChanges).split('|').map(s => s.trim()).filter(s => s) : [];
  const editedSeqParts = editedSeqs ? text(editedSeqs).split('|').map(s => s.trim()).filter(s => s) : [];
  
  // 确定变化数量（取两者的最大值）
  const changeCount = Math.max(aaChangeParts.length, editedSeqParts.length);
  
  if (changeCount === 0) {
    // 无变化
    return '<div class="be-seq">' + escapeHtml(original) + '</div>';
  }

  const results = [];
  
  // 处理每个变化
  for (let i = 0; i < changeCount; i++) {
    const aaChange = aaChangeParts[i] || "";
    const editedSeq = editedSeqParts[i] || "";
    
    // 如果既没有氨基酸变化也没有编辑序列，跳过
    if (!aaChange && !editedSeq) {
      continue;
    }
    
    // 解析单个氨基酸变化
    const change = parseAminoChange(aaChange);
    
    if (change && change.before && change.after) {
      // 有氨基酸变化，显示密码子堆叠（3行）
      results.push(renderCodonStackSimple(original, editedSeq, change.before, change.after));
    } else if (editedSeq) {
      // 没有氨基酸变化，只显示编辑后的序列（高亮差异碱基）
      results.push('<div class="be-seq">' + highlightEditedDiffSimple(original, editedSeq) + '</div>');
    } else if (aaChange) {
      // 只有氨基酸变化文本，没有编辑序列，显示原始序列
      results.push('<div class="be-seq">' + escapeHtml(original) + '</div>');
    }
  }
  
  // 根据结果数量返回不同的格式
  if (results.length === 0) {
    // 无有效结果，显示原始序列
    return '<div class="be-seq">' + escapeHtml(original) + '</div>';
  } else if (results.length === 1) {
    // 单个结果，直接返回
    return results[0];
  } else {
    // 多个结果，用左右结构展示，用灰色竖线分隔
    return '<div style="display: flex; flex-direction: row; gap: 0; align-items: stretch;">' + 
           results.map((result, index) => {
             if (index === 0) {
               return '<div style="flex: 0 0 auto;">' + result + '</div>';
             }
             return '<div style="border-left: 2px solid #ccc; margin: 0 12px; flex-shrink: 0; align-self: stretch;"></div>' + 
                    '<div style="flex: 0 0 auto;">' + result + '</div>';
           }).join('') + 
           '</div>';
  }
}

function renderMdRseqCell(md, rseq) {
  const mdStr = text(md).trim();
  const seq = text(rseq);
  if (!mdStr) return escapeHtml(seq);
  let i = 0;
  let out = "";
  const tokens = mdStr.match(/(\d+|[A-Za-z]+)/g) || [];
  for (const tk of tokens) {
    if (/^\d+$/.test(tk)) {
      const n = parseInt(tk, 10) || 0;
      if (n > 0) {
        const slice = seq.slice(i, i + n);
        out += escapeHtml(slice);
        i += slice.length;
      }
    } else {
      for (let k = 0; k < tk.length; k++) {
        const ch = seq[i] ?? "";
        if (ch) {
          out += '<span class="be-diff">' + escapeHtml(ch) + "</span>";
          i += 1;
        }
      }
    }
  }
  if (i < seq.length) {
    out += escapeHtml(seq.slice(i));
  }
  return out;
}

// 参数展示组件
const renderParameterItem = (label, value) => {
  return (
    <div className="parameter-item" key={label}>
      <div className="parameter-label">{label}:</div>
      <div className="parameter-value">{value}</div>
    </div>
  );
};
const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userParameters, setUserParameters] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [beRows, setBeRows] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // 使用下载进度 Hook
  const { progress, text: loadingText, setText: setLoadingText, createProgressHandler } = useDownloadProgress();
  
  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        // 从 router state 读取参数
        const { apiParams } = location.state || {};

        if (!apiParams) {
          message.error("Design result data not found, please redesign");
          setLoading(false);
          setTimeout(() => {
            navigate("/base-editor");
          }, 2000);
          return;
        }

        setUserParameters(apiParams);

        setLoadingText('Fetching data from server...');

        // 使用参数请求结果
        const response = await executeBEDesign(apiParams, createProgressHandler());

        if (response && response.data) {
          // BaseEditor只需要TableData，不需要JBrowse
          setLoadingText('Processing data...');
          const data = response.data;
          setResultData(data);

          // 规范化提取行数据作为主表数据源
          const extractRowsFromResponse = (rd) => {
            if (Array.isArray(rd)) return rd;
            if (rd?.TableData?.base_editing_info?.rows) return rd.TableData.base_editing_info.rows;
            if (Array.isArray(rd?.rows)) return rd.rows;
            if (Array.isArray(rd?.data?.rows)) return rd.data.rows;
            return [];
          };
          const rows = extractRowsFromResponse(data);
          setBeRows(rows || []);
          if ((rows || []).length > 0) setSelectedIndex(0);
          
          setLoadingText('Initialization complete!');
          message.success("Data loaded successfully");
        } else {
          message.error("Response format exception, please redesign");
          setTimeout(() => {
            navigate("/base-editor");
          }, 2000);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
        let errorMsg = "";
        if (error.response) {
          if (typeof error.response.data === 'string') {
            errorMsg = error.response.data;
          } else {
            errorMsg = error.response.data?.error || error.response.data?.msg || error.response.data?.message || `Request failed: ${error.response.status}`;
          }
        } else if (error.request) {
          errorMsg = "Network error, please check your network connection";
        } else {
          errorMsg = error?.message || "Request failed, please try again later";
        }
        message.error(errorMsg);
        setTimeout(() => {
          navigate("/base-editor");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, [location, navigate]);

  const masterVisible = beRows;
  const selected = masterVisible[selectedIndex] || null;
  const detailRows = Array.isArray(selected?.offtarget_json?.rows)
    ? selected.offtarget_json.rows.slice(0, 500)
    : [];

  // sgRNA_id 过滤选项
  const idOptions = useMemo(() => {
    const s = new Set();
    for (const r of beRows || []) {
      const v = text(r?.sgRNA_id).trim();
      if (v) s.add(v);
    }
    return Array.from(s).sort().map((v) => ({ label: v, value: v }));
  }, [beRows]);

  // Antd 表格列定义（主表）
  const masterColumns = [
    {
      width: 140,
      title: "sgRNA ID",
      dataIndex: "sgRNA_id",
      key: "sgRNA_id",
      sorter: (a, b) => text(a?.sgRNA_id).localeCompare(text(b?.sgRNA_id)),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, width: 260 }}>
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="Filter sgRNA ID"
            style={{ width: "100%" }}
            value={selectedKeys}
            onChange={(vals) => setSelectedKeys(vals)}
            options={idOptions}
            optionFilterProp="label"
            maxTagCount="responsive"
          />
          <Space style={{ marginTop: 8 }}>
            <Button type="primary" size="small" onClick={() => confirm()}>Apply</Button>
            <Button size="small" onClick={() => { clearFilters?.(); confirm(); }}>Reset</Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => text(record?.sgRNA_id).includes(text(value)),
      filterIcon: (filtered) => <span style={{ color: filtered ? "#1677ff" : undefined }}>🔎</span>,
    },
    { width:200,title: "sgRNA sequence", dataIndex: "sgRNA_seq", key: "sgRNA_seq" },
    { width:100,title: "sgRNA position", dataIndex: "sgRNA_position", key: "sgRNA_position" },
    { width:100,title: "Original sequence", dataIndex: "original_window_seq", key: "original_window_seq", render: (v) => (<span className="be-seq">{text(v)}</span>) },
    { width:200,title: "Amino acid change / Edited sequence", key: "combined_cell", render: (_, r) => {
        const originalSeq = r?.original_window_seq || "";
        const aminoAcidChange = r?.amino_acid_change || "";
        const editedSeq = r?.edited_window_seq || "";
        
        // 使用新的处理函数，支持多种变化
        const combinedHtml = renderMultipleChanges(originalSeq, aminoAcidChange, editedSeq);
        return (<span dangerouslySetInnerHTML={{ __html: combinedHtml }} />);
      }
    },
    { width:150,title: "Property change", dataIndex: "property_change", key: "property_change" },
    { width:100,title: "GC content", dataIndex: "sgRNA_GC", key: "sgRNA_GC" },
  ];

  // Antd 表格列定义（子表）
  const detailColumns = [
    { width:110,title: "family", dataIndex: "family", key: "family" },
    { width:80,title: "seqid", dataIndex: "seqid", key: "seqid" },
    { width:50,title: "start", dataIndex: "start", key: "start" },
    { width:50,title: "end", dataIndex: "end", key: "end" },
    { width:50,title: "sgRNA_start", dataIndex: "sgRNA_start", key: "sgRNA_start" },
    { width:50,title: "sgRNA_end", dataIndex: "sgRNA_end", key: "sgRNA_end" },
    { width:50,title: "strand", dataIndex: "strand", key: "strand" },
    { width:200,title: "MD/rseq", key: "md_rseq", render: (_, r) => (<span className="be-seq" dangerouslySetInnerHTML={{ __html: renderMdRseqCellSimple(r?.MD, r?.rseq) }} />) },
    { width:50,title: "type", dataIndex: "type", key: "type" },
    { width:50,title: "types", dataIndex: "types", key: "types" },
    { width:80,title: "types_list", dataIndex: "types_list", key: "types_list" },
  ];

  // 导出PDF
  const handleExportPDF = () => {
    try {
      const data = masterVisible || [];
      if (data.length === 0) {
        message.warning("No data to export");
        return;
      }

      const doc = new jsPDF();
      
      // 添加标题
      doc.setFontSize(16);
      doc.text("sgRNA List", 14, 15);
      
      // 准备表格数据
      const tableData = data.map((row) => [
        text(row?.sgRNA_id),
        text(row?.sgRNA_seq),
        text(row?.sgRNA_position),
        text(row?.original_window_seq),
        text(row?.amino_acid_change || row?.edited_window_seq || ""),
        text(row?.property_change),
        text(row?.sgRNA_GC),
      ]);

      // 添加表格
      doc.autoTable({
        head: [["sgRNA ID", "sgRNA sequence", "sgRNA position", "Original sequence", "Amino acid change / Edited sequence", "Property change", "GC content"]],
        body: tableData,
        startY: 25,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [66, 139, 202] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 25 },
      });

      // 保存文件
      doc.save("sgRNA_List.pdf");
      message.success("PDF exported successfully");
    } catch (error) {
      console.error("PDF export failed:", error);
      message.error("Failed to export PDF");
    }
  };

  // 导出Excel
  const handleExportExcel = async () => {
    try {
      const data = masterVisible || [];
      if (data.length === 0) {
        message.warning("No data to export");
        return;
      }

      // 动态导入 xlsx 库以避免构建时的问题
      const XLSX = await import("xlsx");

      // 准备Excel数据
      const excelData = data.map((row) => ({
        "sgRNA ID": text(row?.sgRNA_id),
        "sgRNA sequence": text(row?.sgRNA_seq),
        "sgRNA position": text(row?.sgRNA_position),
        "Original sequence": text(row?.original_window_seq),
        "Amino acid change / Edited sequence": text(row?.amino_acid_change || row?.edited_window_seq || ""),
        "Property change": text(row?.property_change),
        "GC content": text(row?.sgRNA_GC),
      }));

      // 创建工作簿
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "sgRNA List");

      // 设置列宽
      const colWidths = [
        { wch: 15 }, // sgRNA ID
        { wch: 25 }, // sgRNA sequence
        { wch: 20 }, // sgRNA position
        { wch: 30 }, // Original sequence
        { wch: 40 }, // Amino acid change / Edited sequence
        { wch: 20 }, // Property change
        { wch: 12 }, // GC content
      ];
      ws["!cols"] = colWidths;

      // 保存文件
      XLSX.writeFile(wb, "sgRNA_List.xlsx");
      message.success("Excel exported successfully");
    } catch (error) {
      console.error("Excel export failed:", error);
      message.error("Failed to export Excel");
    }
  };

  if (loading) {
    return <LoadingProgress percent={progress} text={loadingText} />;
  }

  return (
    <div className="cas9-result-container">
      {/* 参数部分 */}
      <div className="result-section">
        <Title level={3}>Set Parameters</Title>
        <Collapse defaultActiveKey={[]}>
          <Panel header="User Seted Parameters" key="1">
            <div className="parameters-card">
              <div className="parameters-header">
                <div className="parameters-header-cell">Parameters</div>
                <div className="parameters-header-cell">Set Values</div>
              </div>
              <div className="parameters-group">
                {userParameters ? (
                  <>
                    {renderParameterItem(
                      "Input Sequence",
                      userParameters.inputSequence
                    )}
                    {renderParameterItem(
                      "Substitution module",
                      userParameters.sgRNAModule
                    )}
                    {renderParameterItem("Pam Type", userParameters.pam)}
                    {renderParameterItem(
                      "Target Genome",
                      userParameters.name_db
                    )}
                    {renderParameterItem(
                      "Customized PAM",
                      userParameters.customizedPAM
                    )}
                    {renderParameterItem(
                      "Spacer Length",
                      userParameters.spacerLength
                    )}
                    {renderParameterItem(
                      "Base editing Window",
                      userParameters.BE_windows
                    )}
                    {renderParameterItem("Edit Type", userParameters.editType)}
                  </>
                ) : (
                  <div>No parameter data</div>
                )}
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>

      {/* 表格展示部分 */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: 16, boxSizing: "border-box" }}>
        {/* 左侧主表 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Card 
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>sgRNA list</span>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "pdf",
                        label: "Export as PDF",
                        onClick: handleExportPDF,
                      },
                      {
                        key: "excel",
                        label: "Export as Excel",
                        onClick: handleExportExcel,
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <Button icon={<DownloadOutlined />} size="small">
                    Export
                  </Button>
                </Dropdown>
              </div>
            }
            bordered 
            style={{ borderRadius: 8 }} 
            bodyStyle={{ padding: 10 }}
          >
            <Table
              columns={masterColumns}
              dataSource={masterVisible}
              pagination={false}
              size="small"
              scroll={{ y: 663, x: 1000 }}
              rowKey={(r, idx) => r?.sgRNA_id ?? idx}
              onRow={(_, idx) => ({ onClick: () => setSelectedIndex(idx ?? 0), style: { cursor: 'pointer' } })}
              rowClassName={(_, idx) => (idx === selectedIndex ? 'be-row-selected' : '')}
            />
            <div className="be-stats">Total {beRows.length} records</div>
          </Card>
        </div>

        {/* 右侧子表 + 元信息 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Card title="Detailed information and off-target sites of sgRNAs" bordered style={{ borderRadius: 8 }} bodyStyle={{ padding: 10 }}>
            {/* 元信息区（英文 & 美化） */}
            <div className="be-meta">
              <div className="be-meta-id">
                {text(selected?.sgRNA_id ?? selected?.sgRNA_family?.sgRNA_id)}
              </div>
              <div className="be-meta-item">
                <span className="be-meta-label">sgRNA type</span>
                <span>:</span>
                <span className="be-meta-value">{
                  (() => {
                    const t = text(selected?.sgRNA_type ?? selected?.sgRNA_family?.sgRNA_type);
                    return t ? <Tag color="gold" style={{ marginInlineStart: 0, whiteSpace: "normal" }}>{t}</Tag> : "-";
                  })()
                }</span>
              </div>
              <div className="be-meta-item">
                <span className="be-meta-label">sgRNA sequence</span><span>:</span>
                <span className="be-meta-value be-seq">{text(selected?.sgRNA_seq ?? selected?.sgRNA_family?.sgRNA_seq)}</span>
              </div>
              <div className="be-meta-item"><span className="be-meta-label">Position</span><span>:</span><span className="be-meta-value">{text(selected?.sgRNA_position ?? selected?.sgRNA_family?.sgRNA_position)}</span></div>
              <div className="be-meta-item"><span className="be-meta-label">Strand</span><span>:</span><span className="be-meta-value">{
                (() => {
                  const s = text(selected?.sgRNA_strand ?? selected?.sgRNA_family?.sgRNA_strand);
                  const color = s === "+" ? "green" : s === "-" ? "magenta" : "default";
                  return <Tag color={color} style={{ marginInlineStart: 0 }}>{s || "-"}</Tag>;
                })()
              }</span></div>
              <div className="be-meta-item"><span className="be-meta-label">Edit type</span><span>:</span><span className="be-meta-value">{
                (() => {
                  const e = text(selected?.edit_type ?? selected?.sgRNA_family?.edit_type);
                  return e ? <Tag color="geekblue" style={{ marginInlineStart: 0 }}>{e}</Tag> : "-";
                })()
              }</span></div>
              <div className="be-meta-item"><span className="be-meta-label">Editing window</span><span>:</span><span className="be-meta-value">{text(selected?.editing_window ?? selected?.sgRNA_family?.editing_window)}</span></div>
              <div className="be-meta-item"><span className="be-meta-label">Off-target count</span><span>:</span><span className="be-meta-value">{
                (() => {
                  const n = text(selected?.offtarget_num ?? selected?.sgRNA_family?.offtarget_num);
                  return n ? <Tag color="volcano" style={{ marginInlineStart: 0 }}>{n}</Tag> : "-";
                })()
              }</span></div>
            </div>

            {/* 子表 */}
            <Table
              columns={detailColumns}
              dataSource={detailRows}
              pagination={false}
              size="small"
              scroll={{ y: 520, x: 1000 }}
              rowKey={(_, idx) => idx ?? 0}
            />
            <div className="be-stats">Total {detailRows.length} records</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Result;
