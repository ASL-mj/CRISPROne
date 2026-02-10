// 计算位置工具函数
export const calculateLocus = (input, n = 20) => {
  if (!input || !input.includes(":")) {
    return input;
  }

  const numberPart = parseInt(input.split(":")[1]) - 5;
  const formattedStartNumber = numberPart.toLocaleString("en-US");
  const endNumber = numberPart + n;
  const formattedEndNumber = endNumber.toLocaleString("en-US");
  return `${
    input.split(":")[0]
  }:${formattedStartNumber}..${formattedEndNumber}`;
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
