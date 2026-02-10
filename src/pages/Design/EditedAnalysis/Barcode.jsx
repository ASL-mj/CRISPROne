import React, { useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import barcodeImage from "@/assets/images/design/edited_analy/barcode_design.png";
import styles from "./index.module.css";

const Barcode = () => {
  const [formValues, setFormValues] = useState({
    projectName: "",
    forwardPrimer: "",
    reversePrimer: "",
    barcodeLength: "",
    barcodeNumber: "",
    minDistance: "",
    minGC: "",
    maxGC: "",
    attempts: "",
    prepareForCompany: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    // 输出到控制台
    console.log("表单提交的值：", formValues);

    // 可以添加提交成功的提示
    alert("表单已提交");
  };

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={styles.editingAnalysisContainer}>
      {/* 上部分：左图右文 */}
      <div className={styles.editingAnalysisHeader}>
        <div className={styles.editingAnalysisImage}>
          <img src={barcodeImage} alt="Barcode Design" />
        </div>
        <div className={styles.editingAnalysisIntro}>
          <h1>What is editing analysis?</h1>
          <p>
            When CRISPR plasmids is delivered to infected plants through
            agrobacterium tumefaciens to complete genetic transformation, we
            need to know whether the target gene in transgenic offspring is
            mutated and the type of mutation. There are generally two detection
            methods: 1) traditional Sanger sequencing, which is usually
            time-consuming and laborious. 2) Illumina high throughput
            sequencing.
            <InfoCircleOutlined
              onClick={() => {
                alert("info");
              }}
            />
          </p>
          <h2>How to do?</h2>
          <ol>
            <li>Primrt and Barcode design;</li>
            <li>PCR amplification and product mixing;</li>
            <li>Illumina sequence;</li>
            <li>Analysis and plot;</li>
          </ol>
        </div>
      </div>

      {/* 表单部分 */}
      <div style={{ textAlign: "center", margin: "40px 0 20px 0"}}>
        <button className={styles.sectionButton}>Barcode Primers Design</button>
      </div>
      
      <div className={styles.barcodeFormContent}>
        <h3>
          This program generates barcodes of a desired length, distance, and
          GC content. First, your need the base primer paired end primers.
        </h3>
      </div>

      <div className={styles.barcodeFormContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.barcodeFormRow}>
            {/* 左列 - Required */}
            <div className={styles.barcodeFormColumn}>
              <div className={styles.barcodeColumnHeader}>
                <span className={styles.barcodeRequiredText}>Required</span>
              </div>

              <div className={styles.barcodeFormGroup}>
                <input
                  type="text"
                  className={styles.barcodeFormControl}
                  id="projectName"
                  placeholder="GhPEBP"
                  value={formValues.projectName}
                  onChange={(e) =>
                    handleInputChange("projectName", e.target.value)
                  }
                  required
                />
                <label
                  htmlFor="projectName"
                  className={styles.barcodeFormLabel}
                  title="1. What is the project name? Usually is gene id"
                >
                  1. What is the project name? Usually is gene id
                </label>
              </div>

              <div className={styles.barcodeFormGroup}>
                <input
                  type="text"
                  className={styles.barcodeFormControl}
                  id="forwardPrimer"
                  placeholder="AATTTTTTTCCATCTGCAGTTACT"
                  value={formValues.forwardPrimer}
                  onChange={(e) =>
                    handleInputChange("forwardPrimer", e.target.value)
                  }
                  required
                />
                <label
                  htmlFor="forwardPrimer"
                  className={styles.barcodeFormLabel}
                >
                  2. The base primer of Forward from 5' to 3'
                </label>
              </div>

              <div className={styles.barcodeFormGroup}>
                <input
                  type="text"
                  className={styles.barcodeFormControl}
                  id="reversePrimer"
                  placeholder="CTGTCACTATCCAGTGTAAGTGC"
                  value={formValues.reversePrimer}
                  onChange={(e) =>
                    handleInputChange("reversePrimer", e.target.value)
                  }
                  required
                />
                <label
                  htmlFor="reversePrimer"
                  className={styles.barcodeFormLabel}
                >
                  3. The base primer of Reverse from 5' to 3'
                </label>
              </div>

              <div className={styles.barcodeFormGroup}>
                <input
                  type="text"
                  className={styles.barcodeFormControl}
                  id="barcodeLength"
                  placeholder="LENGTH"
                  value={formValues.barcodeLength}
                  onChange={(e) =>
                    handleInputChange("barcodeLength", e.target.value)
                  }
                  required
                />
                <label
                  htmlFor="barcodeLength"
                  className={styles.barcodeFormLabel}
                  title="4. Barcode length; Enter LENGTH as an integer (i.e. 4)"
                >
                  4. Barcode length; Enter LENGTH as an integer (i.e. 4)
                </label>
              </div>

              <div className={styles.barcodeFormGroup}>
                <input
                  type="text"
                  className={styles.barcodeFormControl}
                  id="barcodeNumber"
                  placeholder="LENGTH x 5"
                  value={formValues.barcodeNumber}
                  onChange={(e) =>
                    handleInputChange("barcodeNumber", e.target.value)
                  }
                  required
                />
                <label
                  htmlFor="barcodeNumber"
                  className={styles.barcodeFormLabel}
                  title="5. Total number of barcodes (Primer Pairs) (default is LENGTH x 5)"
                >
                  5. Total number of barcodes (Primer Pairs) (default is LENGTH
                  x 5)
                </label>
              </div>
            </div>

            {/* 右列 - Optional */}
            <div className={styles.barcodeFormColumn}>
              <div className={styles.barcodeColumnHeader}>
                <span>Optional:</span>
              </div>

              <div className={styles.barcodeFormGroup}>
                <input
                  type="text"
                  className={styles.barcodeFormControl}
                  id="minDistance"
                  placeholder="LENGTH/2, i.e. 7->3, 4->2"
                  value={formValues.minDistance}
                  onChange={(e) =>
                    handleInputChange("minDistance", e.target.value)
                  }
                />
                <label
                  htmlFor="minDistance"
                  className={styles.barcodeFormLabel}
                  title="6. The minimum number of different bases between barcodes (default is LENGTH/2, i.e. 7->3, 4->2)"
                >
                  6. The minimum number of different bases between barcodes
                  (default is LENGTH/2, i.e. 7→3, 4→2)
                </label>
              </div>

              <div className={styles.barcodeFormGroup}>
                <input
                  type="text"
                  className={styles.barcodeFormControl}
                  id="minGC"
                  placeholder="0"
                  value={formValues.minGC}
                  onChange={(e) => handleInputChange("minGC", e.target.value)}
                />
                <label htmlFor="minGC" className={styles.barcodeFormLabel} title="7. Desired GC content minimum range in percentages (i.e. 50 ->50%) (default is 0)">
                  7. Desired GC content minimum range in percentages (i.e. 50
                  →50%) (default is 0)
                </label>
              </div>

              <div className={styles.barcodeFormGroup}>
                <input
                  type="text"
                  className={styles.barcodeFormControl}
                  id="maxGC"
                  placeholder="100"
                  value={formValues.maxGC}
                  onChange={(e) => handleInputChange("maxGC", e.target.value)}
                />
                <label htmlFor="maxGC" className={styles.barcodeFormLabel} title="8. Desired GC content maximum range in percentages (i.e. 50 ->50%) (default is 100)">
                  8. Desired GC content maximum range in percentages (i.e. 50
                  →50%) (default is 100)
                </label>
              </div>

              <div className={styles.barcodeFormGroup}>
                <input
                  type="text"
                  className={styles.barcodeFormControl}
                  id="attempts"
                  placeholder="10000"
                  value={formValues.attempts}
                  onChange={(e) =>
                    handleInputChange("attempts", e.target.value)
                  }
                />
                <label
                  htmlFor="attempts"
                  className={styles.barcodeFormLabel}
                  title="9. How many attempts? The default number of random codes to test is 10000"
                >
                  9. How many attempts? The default number of random codes to
                  test is 10000.
                </label>
              </div>

              <div className={styles.barcodeCheckboxGroup}>
                <input
                  type="checkbox"
                  id="prepareForCompany"
                  className={styles.barcodeFormCheckbox}
                  checked={formValues.prepareForCompany}
                  onChange={(e) =>
                    handleInputChange("prepareForCompany", e.target.checked)
                  }
                />
                <label htmlFor="prepareForCompany">
                  10. Prepare for sent to company?
                </label>
              </div>
            </div>
          </div>

          <div className={styles.barcodeSubmitGroup}>
            <button type="submit" className={styles.barcodeSubmitButton}>
              Barcode Generator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Barcode;