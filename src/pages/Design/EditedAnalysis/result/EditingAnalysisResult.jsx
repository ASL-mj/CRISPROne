import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Spin, message, Card, Table, Tabs, Progress, Row, Col, Tag } from "antd";
import { ArrowLeftOutlined, BarChartOutlined, PieChartOutlined } from "@ant-design/icons";
import { getResult } from "@/utils/api/editedAnalysis";
import "./index.css";

const { TabPane } = Tabs;

const EditingAnalysisResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const taskId = searchParams.get("taskId");
  const fileName = searchParams.get("fileName");
  
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // 如果没有任务ID或文件名，返回到分析页面
    if (!taskId || !fileName) {
      message.error("Missing task ID or file name");
      navigate("/edited-analysis/editing-analysis");
      return;
    }
    
    // Load result data
    const fetchResultData = async () => {
      try {
        setLoading(true);
        const response = await getResult({ task_id: taskId, fileName });
        
        // Check API response data
        if (response.data && response.data.data) {
          setResultData(response.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Failed to fetch result data:", error);
        setError("Failed to load result data");
        message.error("Failed to load result data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchResultData();
  }, [taskId, fileName, navigate]);
  
  // 返回分析页面
  const handleBack = () => {
    navigate("/edited-analysis/editing-analysis");
  };
  
  // 计算突变统计数据
  const calculateStats = (data) => {
    if (!data || !data.length) return null;
    
    const totalReads = data.reduce((sum, item) => sum + parseInt(item["支持reads数目"] || 0), 0);
    const wtCount = data.filter(item => item["变异类型"] === "WT").length;
    const snpCount = data.filter(item => item["变异类型"] === "SNP").length;
    const indelCount = data.filter(item => item["变异类型"] !== "WT" && item["变异类型"] !== "SNP").length;
    
    return {
      totalReads,
      wtCount,
      snpCount,
      indelCount,
      totalVariants: data.length
    };
  };
  
  // 渲染突变统计
  const renderMutationStats = () => {
    if (!resultData || !resultData.data || !resultData.data.length) return null;
    
    const stats = calculateStats(resultData.data);
    if (!stats) return null;
    
    // 计算各类型变异的比例
    const wtPercent = (stats.wtCount / stats.totalVariants * 100).toFixed(1);
    const snpPercent = (stats.snpCount / stats.totalVariants * 100).toFixed(1);
    const indelPercent = (stats.indelCount / stats.totalVariants * 100).toFixed(1);
    
    return (
      <Card className="result-section-card" title="Variant Statistics">
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <div className="stats-title">Variant Type Distribution</div>
            <Row gutter={16}>
              <Col span={8}>
                <div className="stats-item">
                  <div className="stats-label">Wild Type (WT)</div>
                  <Progress 
                    percent={parseFloat(wtPercent)} 
                    status="normal" 
                    strokeColor="#52c41a"
                    format={() => `${stats.wtCount} (${wtPercent}%)`}
                  />
                </div>
              </Col>
              <Col span={8}>
                <div className="stats-item">
                  <div className="stats-label">Single Nucleotide Polymorphism (SNP)</div>
                  <Progress 
                    percent={parseFloat(snpPercent)} 
                    status="normal" 
                    strokeColor="#1890ff"
                    format={() => `${stats.snpCount} (${snpPercent}%)`}
                  />
                </div>
              </Col>
              <Col span={8}>
                <div className="stats-item">
                  <div className="stats-label">Insertion/Deletion (Indel)</div>
                  <Progress 
                    percent={parseFloat(indelPercent)} 
                    status="normal" 
                    strokeColor="#faad14"
                    format={() => `${stats.indelCount} (${indelPercent}%)`}
                  />
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <div className="stats-summary">
              <div className="stats-summary-item">
                <div className="stats-summary-value">{stats.totalVariants}</div>
                <div className="stats-summary-label">Total Variants</div>
              </div>
              <div className="stats-summary-item">
                <div className="stats-summary-value">{stats.totalReads}</div>
                <div className="stats-summary-label">Total Supporting Reads</div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };
  
  // Render mutation details table
  const renderMutationDetails = () => {
    if (!resultData || !resultData.data || !resultData.data.length) return null;
    
    const columns = [
      {
        title: 'Variant ID',
        dataIndex: '变异编号',
        key: '变异编号',
        sorter: (a, b) => parseInt(a['变异编号']) - parseInt(b['变异编号']),
      },
      {
        title: 'Variant Type',
        dataIndex: '变异类型',
        key: '变异类型',
        filters: [
          { text: 'SNP', value: 'SNP' },
          { text: 'WT', value: 'WT' },
          { text: 'Indel', value: 'Indel' },
        ],
        onFilter: (value, record) => record['变异类型'] === value,
        render: (text) => {
          let color = 'default';
          if (text === 'SNP') color = 'blue';
          else if (text === 'WT') color = 'green';
          else color = 'orange';
          
          return <Tag color={color}>{text}</Tag>;
        }
      },
      {
        title: 'Variant Sequence',
        dataIndex: '变异序列',
        key: '变异序列',
      },
      {
        title: 'Supporting Reads',
        dataIndex: '支持reads数目',
        key: '支持reads数目',
        sorter: (a, b) => parseInt(a['支持reads数目']) - parseInt(b['支持reads数目']),
      },
      {
        title: 'Variant Ratio',
        dataIndex: '变异比例',
        key: '变异比例',
        sorter: (a, b) => {
          const percentA = parseFloat(a['变异比例'].replace('%', ''));
          const percentB = parseFloat(b['变异比例'].replace('%', ''));
          return percentA - percentB;
        },
      },
    ];
    
    return (
      <Card className="result-section-card" title="Variant Details">
        <Table 
          dataSource={resultData.data.map((item, index) => ({...item, key: index}))} 
          columns={columns} 
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="expanded-sequence">
                <div className="expanded-sequence-title">Amplified Fragment Sequence:</div>
                <div className="expanded-sequence-content">{record['扩增片段序列']}</div>
              </div>
            ),
          }}
        />
      </Card>
    );
  };
  
  // Render sequence alignment
  const renderSequenceAlignment = () => {
    if (!resultData || !resultData.data || !resultData.data.length) return null;
    
    // Find wild type sequence as reference
    const wtRecord = resultData.data.find(item => item['变异类型'] === 'WT');
    const wtSequence = wtRecord ? wtRecord['扩增片段序列'] : '';
    
    return (
      <Card className="result-section-card" title="Sequence Alignment">
        <div className="sequence-alignment">
          {resultData.data.map((item, index) => (
            <div key={index} className="sequence-comparison">
              <div className="sequence-header">
                <div className="sequence-variant-id">Variant #{item['变异编号']}</div>
                <div className="sequence-variant-type">
                  <Tag color={item['变异类型'] === 'SNP' ? 'blue' : item['变异类型'] === 'WT' ? 'green' : 'orange'}>
                    {item['变异类型']}
                  </Tag>
                </div>
                <div className="sequence-variant-reads">Supporting reads: {item['支持reads数目']}</div>
                <div className="sequence-variant-percent">Ratio: {item['变异比例']}</div>
              </div>
              <div className="sequence-content">
                {item['扩增片段序列']}
              </div>
              {item['变异类型'] !== 'WT' && wtSequence && (
                <div className="sequence-diff-info">
                  <span className="sequence-diff-label">Variant:</span> {item['变异序列']}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  };
  
  // Render result content
  const renderContent = () => {
    if (loading) {
      return (
        <div className="result-loading">
          <Spin size="large" />
          <p>Loading result data...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="result-error">
          <p>{error}</p>
        </div>
      );
    }
    
    if (!resultData || !resultData.data || !resultData.data.length) {
      return (
        <div className="result-empty">
          <p>No result data available</p>
        </div>
      );
    }
    
    return (
      <Tabs defaultActiveKey="overview" className="result-tabs">
        <TabPane tab="Overview" key="overview">
          {renderMutationStats()}
        </TabPane>
        <TabPane tab="Variant Details" key="details">
          {renderMutationDetails()}
        </TabPane>
        <TabPane tab="Sequence Alignment" key="alignment">
          {renderSequenceAlignment()}
        </TabPane>
        <TabPane tab="Raw Data" key="raw">
          <Card className="result-section-card">
            <pre className="raw-data">{JSON.stringify(resultData, null, 2)}</pre>
          </Card>
        </TabPane>
      </Tabs>
    );
  };
  
  return (
    <div className="editing-analysis-result-container">
      <div className="result-header">
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
        >
          Back to Analysis Page
        </Button>
        <div className="result-title">
          <h2>{resultData?.filename || fileName} Analysis Result</h2>
          <div className="result-task-id">Task ID: {taskId}</div>
        </div>
      </div>
      
      <div className="result-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default EditingAnalysisResult;