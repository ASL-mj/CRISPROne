import React from "react";
import "./index.scss";
import { useState } from "react";

// Q&A
const helpItems = [
  {
    id: "crisprone",
    question: "What is CRISPRone?",
    answer:
      "CRISPRone is a comprehensive web-based tool for CRISPR-based genome editing design. It integrates various CRISPR systems including Cas9, Cas12, Cas13, Base Editors, Prime Editors, and more.",
  },
  {
    id: "characteristics",
    question: "What are the characteristics of CRISPRone?",
    answer:
      "CRISPRone features include: multi-system support, intuitive interface, comprehensive analysis tools, and real-time design validation. It supports various organisms and provides detailed guide RNA predictions.",
  },
  { id: "enzymes", question: "Notes on enzymes", answer: "answer" },
  { id: "genomes", question: "Notes on genomes", answer: "answer" },
  { id: "cas9", question: "How do you use Cas9 design?", answer: "answer" },
  {
    id: "cas12_cpf1",
    question: "How do you use Cas12 Cpf1 design?",
    answer: "answer",
  },
  {
    id: "cas12_c2c1",
    question: "How do you use Cas12 C2c1 design?",
    answer: "answer",
  },
  { id: "cas13", question: "How do you use Cas13 design?", answer: "answer" },
  {
    id: "base_editor",
    question: "How do you use Base Editor design?",
    answer: "answer",
  },
  {
    id: "prime_editor",
    question: "How do you use Prime Editor design?",
    answer: "answer",
  },
  {
    id: "prime_editing",
    question: "How prime editing works?",
    answer: "answer",
  },
  {
    id: "prime_editor_design",
    question: "Using the Prime Editor design tool in CRISPRone",
    answer: "answer",
  },
  {
    id: "crispr_knockin",
    question: "How do you use CIRSPRa design?",
    answer: "answer",
  },
  {
    id: "crispr_knockin2",
    question: "How do you use CIRSPR Knock-in design?",
    answer: "answer",
  },
  {
    id: "epigenome",
    question: "How do you use CIRSPR Epigenome design?",
    answer: "answer",
  },
  {
    id: "fragment_editor",
    question: "How do you use Fragment Editor design?",
    answer:
      "The Fragment Editor allows you to edit larger DNA sequences. Steps include: 1) Input your target sequence 2) Select modification type 3) Design and validate your editing strategy 4) Review predicted outcomes",
  },
];
const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter help items based on search query
  const filteredHelpItems = helpItems.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="help">
      <h1>Help</h1>
      <div className="divider"></div>
      <div className="help-content">
        <div className="help-sidebar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <h3>Contents</h3>
          <div className="help-sidebar-list">
            {filteredHelpItems.map((item) => (
              <div key={item.id} className="sidebar-item">
                <a href={`#${item.id}`}>{item.question}</a>
              </div>
            ))}
          </div>
        </div>
        <div className="help-main">
          {filteredHelpItems.map((item) => (
            <div key={item.id} id={item.id} className="help-item">
              <h2>{item.question}</h2>
              <hr />
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
