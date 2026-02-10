import { useState, useEffect, useRef } from "react";
import {
  Table,
  Typography,
  Collapse,
  Button,
  Space,
  Input,
  message,
  Dropdown,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { executeCRISPRaDesign } from "@/utils/api/apis";
import {
  JBrowseLinearGenomeView,
  createViewState,
} from "@jbrowse/react-linear-genome-view";
import { useDownloadProgress } from "@/hooks/useDownloadProgress";
import LoadingProgress from "@/components/LoadingProgress";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./index.css";

const { Title } = Typography;
const { Panel } = Collapse;

// 计算位置工具函数
export const calculateLocus = (input, n = 20) => {
  if (!input || !input.includes(":")) {
    return input;
  }
  const numberPart = parseInt(input.split(":")[1]) - 5;
  const endNumber = numberPart + n;
  return `${input.split(":")[0]}:${numberPart}..${endNumber}`;
};

// URL处理工具函数：移除域名，只保留/api/后面的路径
export const processUrl = (url) => {
  if (!url) return url;
  // 如果URL包含域名，提取/api/后面的部分
  const apiIndex = url.indexOf("/api/");
  if (apiIndex !== -1) {
    return url.substring(apiIndex);
  }
  // 如果已经是/api/开头，直接返回
  if (url.startsWith("/api/")) {
    return url;
  }
  // 其他情况直接返回原URL
  return url;
};

// 处理MD和序列,高亮显示错误碱基
export const processMdAndSequence = (md, sequence) => {
  if (!md || !sequence) return sequence;

  let processedSeq = "";
  let seqIndex = 0;
  let i = 0;

  while (i < md.length && seqIndex < sequence.length) {
    let num = "";
    while (i < md.length && /\d/.test(md[i])) {
      num += md[i];
      i++;
    }
    if (num) {
      const segmentLength = parseInt(num, 10);
      processedSeq += sequence.slice(seqIndex, seqIndex + segmentLength);
      seqIndex += segmentLength;
    }
    if (i < md.length && /[A-Z]/.test(md[i])) {
      if (seqIndex < sequence.length) {
        processedSeq += `<span style="color:red;">${sequence[seqIndex]}</span>`;
        seqIndex++;
      }
      i++;
    }
  }
  return processedSeq;
};

const CRISPRaResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [jbrowseState, setJbrowseState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState(["Guide_0"]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [offTargetData, setOffTargetData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [userParameters, setUserParameters] = useState(null);
  const [initialPosition, setInitialPosition] = useState(null);
  
  // 使用下载进度 Hook
  const { progress, text, setText, createProgressHandler } = useDownloadProgress();

  // 搜索功能
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0] || "");
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      const fieldValue = record[dataIndex];
      return fieldValue
        ? fieldValue.toString().toLowerCase().includes(value.toLowerCase())
        : "";
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span
          style={{ backgroundColor: searchText ? "#ffc069" : "transparent" }}
        >
          {text ? text.toString() : ""}
        </span>
      ) : (
        text
      ),
  });

  // 主表格列定义
  const columns = [
    {
      title: "Id",
      dataIndex: "sgRNA_id",
      key: "sgRNA_id",
      width: "14%",
      ...getColumnSearchProps("sgRNA_id"),
      sorter: (a, b) => a.sgRNA_id.localeCompare(b.sgRNA_id),
    },
    {
      title: "Position",
      dataIndex: "sgRNA_position",
      key: "sgRNA_position",
      width: "23%",
    },
    {
      title: "Strand",
      dataIndex: "sgRNA_strand",
      key: "sgRNA_strand",
      width: "17%",
    },
    {
      title: "Sequence",
      dataIndex: "sgRNA_seq",
      key: "sgRNA_seq",
      width: "23%",
    },
    {
      title: "GC Content",
      dataIndex: "sgRNA_GC",
      key: "sgRNA_GC",
      width: "15%",
    },
  ];

  // Off-target表格列定义
  const offTargetColumns = [
    {
      title: "Family",
      dataIndex: "family",
      key: "family",
      width: "145px",
    },
    {
      title: "Seq_id",
      dataIndex: "seqid",
      key: "seqid",
      width: "100px",
    },
    {
      title: "Start",
      dataIndex: "sgRNA_start",
      key: "sgRNA_start",
      width: "80px",
    },
    {
      title: "End",
      dataIndex: "sgRNA_end",
      key: "sgRNA_end",
      width: "80px",
    },
    {
      title: "Position Start",
      dataIndex: "sgRNA_start",
      key: "sgRNA_start",
      width: "115px",
    },
    {
      title: "Position End",
      dataIndex: "sgRNA_end",
      key: "sgRNA_end",
      width: "115px",
    },
    {
      title: "Strand",
      dataIndex: "strand",
      key: "strand",
      width: "80px",
    },
    {
      title: "Sequence",
      dataIndex: "rseq",
      key: "rseq",
      width: "180px",
      render: (text, record) => {
        const processedHtml = processMdAndSequence(record.MD, record.rseq);
        return (
          <div
            className="sequence-cell"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        );
      },
    },
    {
      title: "Types",
      dataIndex: "types",
      key: "types",
      width: "100px",
    },
  ];

  // JBrowse导航功能
  const handleNavigate = (position) => {
    if (jbrowseState) {
      try {
        jbrowseState.session.view.navToLocString(position);
      } catch (error) {
        console.error("Navigation failed:", error);
        message.error("Genome view navigation failed");
      }
    }
  };

  const handleRestore = () => {
    if (jbrowseState) {
      handleNavigate(initialPosition);
    }
  };

  // 导出PDF
  const handleExportPDF = () => {
    try {
      const data = resultData?.TableData?.json_data?.rows || [];
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
        row.sgRNA_id || "",
        row.sgRNA_position || "",
        row.sgRNA_strand || "",
        row.sgRNA_seq || "",
        row.sgRNA_GC || "",
      ]);

      // 添加表格
      doc.autoTable({
        head: [["Id", "Position", "Strand", "Sequence", "GC Content"]],
        body: tableData,
        startY: 25,
        styles: { fontSize: 8 },
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
      const data = resultData?.TableData?.json_data?.rows || [];
      if (data.length === 0) {
        message.warning("No data to export");
        return;
      }

      // 动态导入 xlsx 库以避免构建时的问题
      const XLSX = await import("xlsx");

      // 准备Excel数据
      const excelData = data.map((row) => ({
        Id: row.sgRNA_id || "",
        Position: row.sgRNA_position || "",
        Strand: row.sgRNA_strand || "",
        Sequence: row.sgRNA_seq || "",
        "GC Content": row.sgRNA_GC || "",
      }));

      // 创建工作簿
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "sgRNA List");

      // 设置列宽
      const colWidths = [
        { wch: 15 }, // Id
        { wch: 25 }, // Position
        { wch: 10 }, // Strand
        { wch: 25 }, // Sequence
        { wch: 12 }, // GC Content
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

  // 行选择处理
  const onSelectedRowKeysChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (selectedRows && selectedRows.length > 0) {
      const newSelectedRow = selectedRows[0];
      setSelectedRow(newSelectedRow);
      setOffTargetData(
        newSelectedRow.offtarget_json?.rows?.length > 0 
          ? newSelectedRow.offtarget_json.rows 
          : []
      );

      // 导航到对应位置
      if (newSelectedRow.sgRNA_position) {
        const targetPosition = calculateLocus(
          newSelectedRow.sgRNA_position,
          20
        );
        handleNavigate(targetPosition);
      }
    }
  };

  const onRow = (record) => ({
    onClick: () => {
      const newSelectedKeys = [record.sgRNA_id];
      setSelectedRowKeys(newSelectedKeys);
      setSelectedRow(record);
      setOffTargetData(
        record.offtarget_json?.rows?.length > 0 
          ? record.offtarget_json.rows 
          : []
      );

      if (record.sgRNA_position) {
        const targetPosition = calculateLocus(record.sgRNA_position, 20);
        handleNavigate(targetPosition);
      }
    },
  });

  // 参数展示组件
  const renderParameterItem = (label, value) => {
    return (
      <div className="parameter-item" key={label}>
        <div className="parameter-label">{label}:</div>
        <div className="parameter-value">{value}</div>
      </div>
    );
  };

  // 初始化数据和JBrowse
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
            navigate("/crispra");
          }, 2000);
          return;
        }

        setUserParameters(apiParams);

        setText('Fetching data from server...');

        // 使用参数请求结果
        const response = await executeCRISPRaDesign(apiParams, createProgressHandler());

        if (response && response.data) {
          if (response.data.TableData && response.data.JbrowseInfo) {
            setText('Processing data...');
            const data = response.data;
            setResultData(data);

            const { assembly, tracks, position } = data.JbrowseInfo;
            setInitialPosition(position);

            setText('Loading genome information...');
            const indexResponse = await fetch(processUrl(tracks.gff3_tbi));
            const indexType = indexResponse.headers.get('Content-Disposition').split('.gff3.gz.')[1].split('"')[0] === 'tbi' ? 'TBI' : 'CSI';
    
            setText('Initializing genome browser...');
            const state = createViewState({
              assembly: {
                name: assembly.name,
                sequence: {
                  type: "ReferenceSequenceTrack",
                  trackId:
                    "Gossypium_hirsutum_T2T-Jin668_HZAU_genome-ReferenceSequenceTrack",
                  adapter: {
                    type: "IndexedFastaAdapter",
                    fastaLocation: {
                      uri: processUrl(assembly.fasta),
                      locationType: "UriLocation",
                    },
                    faiLocation: {
                      uri: processUrl(assembly.fai),
                      locationType: "UriLocation",
                    },
                  },
                },
              },
              tracks: [
                {
                  type: "FeatureTrack",
                  trackId: "file.gff3",
                  name: tracks.name,
                  assemblyNames: [assembly.name],
                  adapter: {
                    type: "Gff3TabixAdapter",
                    gffGzLocation: {
                      uri: processUrl(tracks.gff3_gz),
                      locationType: "UriLocation",
                    },
                    index: {
                      location: {
                        uri: processUrl(tracks.gff3_tbi),
                        locationType: "UriLocation",
                      },
                      indexType: indexType,
                    },
                  },
                },
              ],
              location: position,
              defaultSession: {
                id: "default-session",
                name: "default-session",
                margin: 0,
                drawerPosition: "right",
                drawerWidth: 384,
                widgets: {},
                activeWidgets: {},
                minimized: false,
                connectionInstances: [],
                sessionTracks: [],
                view: {
                  id: "linearGenomeView",
                  minimized: false,
                  type: "LinearGenomeView",
                  offsetPx: 574926,
                  bpPerPx: 2.613251087393094,
                  displayedRegions: [
                    {
                      reversed: false,
                      refName: "2",
                      start: 0,
                      end: 108101717,
                      assemblyName: assembly.name,
                    },
                  ],
                  tracks: [
                    {
                      id: "feature-track",
                      type: "FeatureTrack",
                      configuration: "file.gff3",
                      minimized: false,
                      displays: [
                        {
                          id: "feature-display",
                          type: "LinearBasicDisplay",
                          heightPreConfig: 200,
                          configuration: "file.gff3-LinearBasicDisplay",
                        },
                      ],
                    },
                  ],
                  hideHeader: false,
                  hideHeaderOverview: false,
                  hideNoTracksActive: false,
                  trackSelectorType: "hierarchical",
                  showCenterLine: false,
                  showCytobandsSetting: true,
                  trackLabels: "",
                  showGridlines: true,
                  highlight: [],
                  colorByCDS: false,
                  showTrackOutlines: true,
                },
              },
            });
            setJbrowseState(state);

            setText('Finalizing initialization...');
            // 设置初始选中行
            if (data.TableData?.json_data?.rows?.length > 0) {
              const firstRow = data.TableData.json_data.rows[0];
              setSelectedRow(firstRow);
              setOffTargetData(
                firstRow.offtarget_json?.rows?.length > 0 
                  ? firstRow.offtarget_json.rows 
                  : []
              );
            }

            setText('Initialization complete!');
            message.success("Data loaded successfully");
          } else {
            const errorMsg = response.data.error || response.data.msg || "Failed to get result data";
            message.error(errorMsg);
            setTimeout(() => {
              navigate("/crispra");
            }, 2000);
          }
        } else {
          message.error("Response format error, please redesign");
          setTimeout(() => {
            navigate("/crispra");
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
          navigate("/crispra");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [location, navigate]);

  if (loading) {
    return <LoadingProgress percent={progress} text={text} />;
  }

  if (!resultData) {
    return (
      <div className="error-container">
        <p>Failed to load result data</p>
      </div>
    );
  }

  return (
    <div className="crispra-result-container">
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
                      userParameters.inputSequences
                    )}
                    {renderParameterItem(
                      "Substitution module",
                      userParameters.sgRNAModule
                    )}
                    {renderParameterItem("Pam Type", userParameters.pamType)}
                    {renderParameterItem(
                      "Target Genome",
                      userParameters.targetGenome
                    )}
                    {renderParameterItem(
                      "Upstream Sequence Length",
                      userParameters.upstreamSequenceLength
                    )}
                    {renderParameterItem(
                      "Spacer Length",
                      userParameters.spacerLength
                    )}
                  </>
                ) : (
                  <div>No parameter data</div>
                )}
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>

      {/* JBrowse视图 */}
      {jbrowseState && (
        <div className="jbrowse-section">
          <Title level={3}>Genome View</Title>
          <div
            className="jbrowse-container"
            style={{ width: "100%", height: "auto" }}
          >
            <JBrowseLinearGenomeView viewState={jbrowseState} />
          </div>
        </div>
      )}

      {/* 表格部分 */}
      <div className="tables-container">
        <div className="table-section left-table">
          <div className="table-title">
            <Title level={4}>sgRNA List</Title>
            <Space>
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
                <Button icon={<DownloadOutlined />}>
                  Export
                </Button>
              </Dropdown>
              <Button onClick={handleRestore}>Restore to initial position</Button>
            </Space>
          </div>
          <div className="table-content">
            <Table
              columns={columns}
              dataSource={resultData?.TableData?.json_data?.rows || []}
              pagination={false}
              rowSelection={{
                type: "radio",
                selectedRowKeys,
                onChange: onSelectedRowKeysChange,
              }}
              onRow={onRow}
              rowKey="sgRNA_id"
              scroll={{ y: 700 }}
            />
          </div>
        </div>

        <div className="table-section right-table">
          <div className="table-title">
            <Title level={4}>
              Detailed information and off target sites of sgRNAs
            </Title>
          </div>
          <div className="table-content">
            {selectedRow ? (
              <>
                <div className="sgrna-details">
                  <div className="detail-item">
                    <div className="highlight">{selectedRow.sgRNA_id}</div>
                  </div>
                  <div className="detail-item">
                    <span className="label">Position:</span>
                    <span className="value">{selectedRow.sgRNA_position}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Strand:</span>
                    <span className="value">{selectedRow.sgRNA_strand}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">sgRNA_seq:</span>
                    <span className="value">{selectedRow.sgRNA_seq}</span>
                  </div>
                  <div className="detail-item">
                    <span className="type">{selectedRow.sgRNA_type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">offtarget_num:</span>
                    <span className="value">
                      {selectedRow.offtarget_json?.total ?? 0}
                    </span>
                  </div>
                </div>
                <Table
                  columns={offTargetColumns}
                  dataSource={offTargetData || []}
                  pagination={false}
                  scroll={{ y: 420, x: 1100 }}
                  rowKey={(record, index) => `${record.seqid}-${index}`}
                />
              </>
            ) : (
              <div className="no-selection">
                <p>Please select a sgRNA to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRISPRaResult;
