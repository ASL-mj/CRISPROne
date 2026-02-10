export const navItems = [
  { path: "/", label: "Home" },
  { path: "/cas9", label: "Cas 9" },
  {
    path: "/cas12",
    label: "Cas 12",
    children: [
      { path: "/cas12/cpf1", label: "cas12a/cpf1", icon: "ApiOutlined" },
      { path: "/cas12/c2c1", label: "cas12b/c2c1", icon: "ApiOutlined" },
    ],
  },
  { path: "/cas13", label: "Cas 13" },
  { path: "/IscB", label: "IscB" },
  { path: "/TnpB", label: "TnpB" },
  { path: "/base-editor", label: "Base Editor" },
  { path: "/FanZor", label: "FanZor" },
  { path: "/primer-editor", label: "Primer Editor" },
  { path: "/crispra", label: "CRISPRa" },
  { path: "/crispr-knockin", label: "CRISPR Knock-in" },
  { path: "/crispr-epigenome", label: "CRISPR Epigenome" },
  {
    path: "/fragment-editor",
    label: "Fragment Editor",
    children: [
      { path: "/fragment-editor/deletion", label: "Deletion" },
      { path: "/fragment-editor/inversion", label: "Inversion" },
      { path: "/fragment-editor/translocation", label: "Translocation" },
    ],
  },
  {
    path: "/edited-analysis",
    label: "Edited Analysis",
    children: [
      { path: "/edited-analysis/barcode", label: "Barcode" },
      { path: "/edited-analysis/editing-analysis", label: "Editing Analysis" },
      { path: "/edited-analysis/off-target", label: "Off-Target Analysis" },
    ],
  },
  {
    path: "/protocol",
    label: "Protocol",
    children: [
      { path: "/protocol/plasmids-list", label: "Plasmids List" },
      { path: "/protocol/get-plasmids", label: "Get Plasmids" },
    ],
  },
  { path: "/chat-crispr", label: "ChatCRISPR" },
  {
    path: "/help-about",
    label: "Help&About",
    children: [
      { path: "/help-about/help", label: "Help" },
      { path: "/help-about/news", label: "News" },
      { path: "/help-about/contact-us", label: "Contact Us" },
    ],
  },
];
