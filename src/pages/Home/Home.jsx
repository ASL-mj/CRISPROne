import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import bannerImg from "../../assets/images/home/banner.png";
import homeImg from "../../assets/images/home/home.png";
import home01Img from "../../assets/images/home/home01.png";
import home02Img from "../../assets/images/home/home02.png";
import home03Img from "../../assets/images/home/home03.png";

const Home = () => {
  const navigate = useNavigate();

  // 定义交互式定位点的数据
  const points = [
    { id: "1", left: "91%", top: "54%", href: "/cas9", title: "Cas9" },
    { id: "2", left: "90%", top: "71%", href: "/cas12/cpf1", title: "Cas12" },
    { id: "3", left: "50%", top: "59%", href: "/cas13", title: "Cas13" },
    {
      id: "4",
      left: "49%",
      top: "18.5%",
      href: "/base-editor",
      title: "Base Editor",
    },
    {
      id: "5",
      left: "88%",
      top: "22%",
      href: "/primer-editor",
      title: "Primer Editor",
    },
    { id: "6", left: "42%", top: "88%", href: "/crispra", title: "CRISPRa" },
    {
      id: "7",
      left: "10%",
      top: "60%",
      href: "/edited-analysis",
      title: "Edited Analysis",
    },
    {
      id: "8",
      left: "62%",
      top: "52%",
      href: "/chat-crispr",
      title: "ChatCRISPR",
    },
    {
      id: "9",
      left: "36%",
      top: "12%",
      href: "/fragment-editor",
      title: "Fragment Editor",
    },
    {
      id: "10",
      left: "4%",
      top: "92%",
      href: "/crispr-knockin",
      title: "CRISPR Knock-in",
    },
    {
      id: "11",
      left: "65%",
      top: "12%",
      href: "/crispr-epigenome",
      title: "CRISPR Epigenome",
    },
  ];

  // 背景图片模块样式 - 改为相对定位支持定位点
  const heroStyle = {
    height: "100%",
    position: "relative",
    marginBottom: "60px",
    borderRadius: "8px",
    overflow: "hidden",
  };

  // 背景图片样式
  const backgroundImageStyle = {
    width: "100vw",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none", // 防止图片本身被点击
  };

  // 左图右文模块样式
  const introStyle = {
    width: "90%",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  };

  const introImageStyle = {
    width: "35vw",
    height: "auto",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const introTextStyle = {
    backgroundColor: "#f7fcfb",
    width: "35vw",
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#333",
    boxShadow: "0px 2px 6px 0px rgba(0, 0, 0, .4)",
    padding: "20px",
    borderRadius: "8px",
  };

  // 卡片模块样式
  const cardsStyle = {
    display: "flex",
    gap: "30px",
    padding: "0 20px",
    justifyContent: "center",
  };

  const cardStyle = {
    width: "25vw",
    height: "500px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: "15px",
    textAlign: "center",
    position: "relative",
  };

  const cardImageStyle = {
    width: "100%",
    height: "auto",
    marginBottom: "10px",
    objectFit: "cover",
  };

  const buttonStyle = {
    backgroundColor: "#67ad5b",
    color: "white",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "16px",
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
  };

  return (
    <div>
      {/* 第一个模块：交互式背景图片 */}
      <div className="hero-section" style={heroStyle}>
        <img
          src={bannerImg}
          alt="CRISPR Tools Interactive Map"
          style={backgroundImageStyle}
        />

        {/* 交互式定位点 */}
        {points.map((point) => (
          <div
            key={point.id}
            className="point"
            style={{
              position: "absolute",
              left: point.left,
              top: point.top,
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
            }}
            onClick={() => navigate(point.href)}
            title={point.title} // 添加悬停提示
          >
            {/* 脉冲圆点 */}
            <div className="circle"></div>

            {/* 标签文字 */}
            <div className="point-label">{point.title}</div>
          </div>
        ))}

        {/* 标题文字覆盖层 */}
        <div className="banner-text">
          <h1 className="main-title">CRISPRone</h1>
          <h2 className="sub-title">
            Comprehensive gene editing tools provide convenience for gene
            editing work, and ChatCRISPR intelligently answers questions
          </h2>
        </div>
      </div>

      {/* 第二个模块：左图右文 */}
      <div className="intro-section" style={introStyle}>
        <div className="intro-image" style={introImageStyle}>
          <img
            src={homeImg}
            alt="CRISPRone Features"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={introTextStyle} className="intro-text">
          <h2 style={{ marginBottom: "20px", color: "#2c3e50" }}>
            Why Use CRISPRone?
          </h2>
          <p style={{ marginBottom: "20px" }}>
            CRISPRone is a comprehensive tool set that can meet any demand
            related to CRISPR. It includes sgRNA design of different CRISPR
            variants and the edited analysis of transgenic plants.
          </p>
          <h3
            style={{ marginBottom: "15px", color: "#2c3e50", fontSize: "18px" }}
          >
            Doloremque vero ex debitis veritatis?
          </h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod
            itaque voluptate nesciunt laborum incidunt. Officia, quam
            consectetur. Earum eligendi aliquam illum alias, unde optio
            accusantium soluta, iusto molestiae adipisci et?
          </p>
        </div>
      </div>

      {/* 第三个模块：三张卡片 */}
      <div className="cards-section" style={cardsStyle}>
        <div className="card" style={cardStyle}>
          <img
            src={home01Img}
            alt="Gene conserved domain"
            style={cardImageStyle}
          />
          <h2
            style={{ marginBottom: "10px", color: "#000", textAlign: "left" }}
          >
            Gene conserved domain
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              lineHeight: "1.8",
              marginBottom: "15px",
              textAlign: "left",
            }}
          >
            The optimal editing regions are marked according to the conservative
            domain information from Pfam, NCBI and InterPro.
          </p>
          <button style={buttonStyle} onClick={() => navigate("/help-about")}>
            More
          </button>
        </div>

        <div className="card" style={cardStyle}>
          <img
            src={home02Img}
            alt="Genome Variation Information"
            style={cardImageStyle}
          />
          <h2
            style={{ marginBottom: "10px", color: "#000", textAlign: "left" }}
          >
            Genome Variation Information
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              lineHeight: "1.8",
              marginBottom: "15px",
              textAlign: "left",
            }}
          >
            Display genomic variation information of a given gene, including
            SNP, InDel and SV, to help select the best sgRNA.
          </p>
          <button style={buttonStyle} onClick={() => navigate("/help-about")}>
            More
          </button>
        </div>

        <div className="card" style={cardStyle}>
          <img
            src={home03Img}
            alt="Genome Spatial Structure"
            style={cardImageStyle}
          />
          <h2
            style={{ marginBottom: "10px", color: "#000", textAlign: "left" }}
          >
            Genome Spatial Structure
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              lineHeight: "1.8",
              marginBottom: "15px",
              textAlign: "left",
            }}
          >
            Display the chromosome 3D genome information (Compartment, TAD, Loop
            et.al) of a given gene to help select the best CRISPR knock in site.
          </p>
          <button style={buttonStyle} onClick={() => navigate("/help-about")}>
            More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
