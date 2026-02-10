import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Anchor, Badge } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import styles from "./index.module.css";

// 质粒数据
const plasmidsData = [
  {
    id: 1,
    name: "CRISPR/Cas9",
    description: "The most widely used CRISPR system for genome editing. Cas9 creates double-strand breaks at specific genomic locations guided by sgRNA.",
    image: "https://via.placeholder.com/400x250/1890ff/ffffff?text=CRISPR/Cas9",
  },
  {
    id: 2,
    name: "CRISPR-Cas12a (Cpf1)",
    description: "An alternative CRISPR system with T-rich PAM recognition. Cas12a generates staggered cuts and processes its own crRNA array.",
    image: "https://via.placeholder.com/400x250/52c41a/ffffff?text=Cas12a",
  },
  {
    id: 3,
    name: "CRISPR-Cas12b (C2c1)",
    description: "A compact Cas12 variant suitable for AAV delivery. Recognizes T-rich PAM sequences and provides efficient genome editing.",
    image: "https://via.placeholder.com/400x250/faad14/ffffff?text=Cas12b",
  },
  {
    id: 4,
    name: "CRISPR Cas13",
    description: "RNA-targeting CRISPR system for RNA knockdown, editing, and detection. Does not require PAM sequences.",
    image: "https://via.placeholder.com/400x250/722ed1/ffffff?text=Cas13",
  },
  {
    id: 5,
    name: "CRISPR Knock-ins",
    description: "Precise insertion of DNA sequences at targeted genomic locations using homology-directed repair mechanisms.",
    image: "https://via.placeholder.com/400x250/eb2f96/ffffff?text=Knock-ins",
  },
  {
    id: 6,
    name: "GhCBE",
    description: "Cytosine Base Editor for cotton (Gossypium hirsutum). Enables C-to-T conversion without double-strand breaks.",
    image: "https://via.placeholder.com/400x250/13c2c2/ffffff?text=GhCBE",
  },
  {
    id: 7,
    name: "GhABE",
    description: "Adenine Base Editor for cotton. Facilitates A-to-G base conversion with high precision and efficiency.",
    image: "https://via.placeholder.com/400x250/fa8c16/ffffff?text=GhABE",
  },
  {
    id: 8,
    name: "GhCBE + GhABE",
    description: "Dual base editing system combining both cytosine and adenine base editors for versatile genome modification.",
    image: "https://via.placeholder.com/400x250/2f54eb/ffffff?text=CBE+ABE",
  },
  {
    id: 9,
    name: "Prime Editing",
    description: "Advanced genome editing technology enabling precise insertions, deletions, and base conversions without DSBs or donor DNA.",
    image: "https://via.placeholder.com/400x250/f5222d/ffffff?text=Prime+Editing",
  },
  {
    id: 10,
    name: "CRISPR activation",
    description: "CRISPRa system for transcriptional activation. Uses catalytically dead Cas9 fused with activation domains.",
    image: "https://via.placeholder.com/400x250/a0d911/ffffff?text=CRISPRa",
  },
  {
    id: 11,
    name: "CRISPR Epigenetics",
    description: "Epigenome editing tools for modulating DNA methylation and histone modifications without altering DNA sequence.",
    image: "https://via.placeholder.com/400x250/fa541c/ffffff?text=Epigenetics",
  },
];

const PlasmidsList = () => {
  const [activePlasmid, setActivePlasmid] = useState("");
  const cardRefs = useRef({});

  // 生成锚点链接
  const anchorItems = plasmidsData.map((plasmid) => ({
    key: plasmid.id,
    href: `#plasmid-${plasmid.id}`,
    title: plasmid.name,
  }));

  // 监听滚动,更新活动锚点
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const plasmid of plasmidsData) {
        const element = cardRefs.current[plasmid.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActivePlasmid(`plasmid-${plasmid.id}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleReadMore = (plasmid) => {
    console.log("Read more about:", plasmid.name);
    // 这里可以添加跳转到详情页的逻辑
  };

  return (
    <div className={styles.plasmidsContainer}>
      {/* 标题 */}
      <div className={styles.plasmidsHeader}>
        <h1>
          Plasmids Used in Our Labs
        </h1>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.plasmidsContent}>
        {/* 左侧目录 */}
        <div className={styles.plasmidsSidebar}>
          <div className={styles.sidebarSticky}>
            <h3>
              Plasmids Catalog
            </h3>
            <Anchor
              affix={false}
              getCurrentAnchor={() => `#${activePlasmid}`}
              items={anchorItems}
              offsetTop={100}
            />
          </div>
        </div>

        {/* 右侧卡片网格 */}
        <div className={styles.plasmidsGrid}>
          {plasmidsData.map((plasmid, index) => (
            <div
              key={plasmid.id}
              id={`plasmid-${plasmid.id}`}
              ref={(el) => (cardRefs.current[plasmid.id] = el)}
              style={{ 
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <Card
                className={styles.plasmidCard}
                hoverable
                cover={
                  <div className={styles.cardImageWrapper}>
                    <img
                      alt={plasmid.name}
                      src={plasmid.image}
                      className={styles.cardImage}
                    />
                  </div>
                }
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    <Badge 
                      count={plasmid.id} 
                      style={{ 
                        backgroundColor: "#52c41a",
                        marginRight: "8px"
                      }} 
                    />
                    {plasmid.name}
                  </h3>
                  <p className={styles.cardDescription}>{plasmid.description}</p>
                  <Button
                    type="primary"
                    className={styles.readMoreBtn}
                    onClick={() => handleReadMore(plasmid)}
                  >
                    Learn More
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlasmidsList;