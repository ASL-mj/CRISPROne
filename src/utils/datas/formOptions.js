// ========================================
// Cas9 表单选项数据配置文件
// ========================================

// PAM类型选项
export const PAM_TYPE_OPTIONS = [
  { value: "NGG", label: "SpCas9 from Streptococcus pyogenes: 5'-NGG-3'" },
  { value: "PAM", label: "Customized PAM: 5'-XXX-3'" },
  {
    value: "NG",
    label:
      "NG-Cas9 or xCas9 3.7 (TLlkDlV SpCas9) from Streptococcus pyogenes: 5'-NG-3'",
  },
  { value: "NNG", label: "20bp-NNG- Cas9 S. canis" },
  { value: "NGN", label: "20bp-NGN-SpG" },
  {
    value: "NNGT",
    label: "20bp-NNGT-Cas9 S. canis- high efficiency PAM, recommended",
  },
  {
    value: "NAA",
    label: "20bp-NAA-iSpyMacCas921bp-NNG(A/G)(A/G)T- Cas9 s. Aureus",
  },
  {
    value: "NNGRRT",
    label: "20bp-NNG(A/G)(A/G)T-Cas9 S. Aureus with 20bp-guides",
  },
  { value: "NGK", label: "20bp-NG(G/T)-xCas9, recommended PAM, see notes" },
  { value: "NNRRT", label: "21bp-NNN(A/G)(A/G)T-KKH SaCas9" },
  { value: "NNNRRT", label: "20bp-NNN(A/G)(A/G)T-KKH SaCas9 with 20bp-guides" },
  { value: "NGA", label: "20bp-NGA- Cas9 S. Pyogenes mutant VQR" },
  { value: "NNNNCC", label: "24bp-NNNNCC-Nme2Cas9" },
  { value: "NGCC", label: "20bp-NGCG-Cas9 S. Pyogenes mutant VRER" },
  { value: "NNAGAA", label: "20bp-NNAGAA-Cas9 S.Thermophilus" },
  { value: "NGGNG", label: "20bp-NGGNG-Cas9 S.Thermophilus" },
  { value: "NNNNGRTT", label: "20bp-NNNNG(A/C)TT-Cas9 N. Meningitidis" },
  {
    value: "NNNNACA",
    label: "20bp-NNNNACA- Cas9 Campylobacter jejuni, original PAM",
  },
  {
    value: "NNNNRYAC",
    label: "22bp-NNNNRYAC-Cas9 Campylobacter jejuni, revised PAM",
  },
  {
    value: "NNNVRYAC",
    label: "22bp-NNNVRYAC-Cas9 Campylobacter jejuni, opt. efficiency",
  },
  { value: "TTCN", label: "TTCN-20bp-CasX" },
  {
    value: "YTTV",
    label:
      "YTTV-20bp-MAD7 Nuclease, Lui, Schiel, Maksimova et al, CRISPR J 2020",
  },
  {
    value: "NNNNCNAA",
    label: "20bp-NNNNCNAA-Thermo Cas9 - Walker et al, Metab Eng Comm 2020",
  },
  { value: "NNN", label: "20bp-NNN-SpRY, Walton et al Science 2020" },
  { value: "NRN", label: "20bp-NRN-SpRY (high efficiency PAM)" },
  { value: "NYN", label: "20bp-NYN-SpRY (low efficiency PAM)" },
];

export const PAM_TYPE_OPTIONS_ISCB = [
  { value: "NWRRNA", label: "16bp-OgeuIscb from Oscillibacter sp: 5'-NWRRNA-3' (W=A/T, R=A/G)" },
];

export const PAM_TYPE_OPTIONS_FANZOR = [
  { value: "TTAAN", label: "30bp-GtFz from Gracilibacteria bacterium G1: 5’-TTAAN-3’" },
  { value: "TAG", label: "30bp-MmeFz from Methylobacterium mesophilicum: 5’-TAG-3’" },
  { value: "CATA", label: "30bp-SpuFz from Sphaerochaeta pleomorpha: 5’-CATA-3’" },
  { value: "CCG", label: "30bp-NiovFz from Nitratifractor salsuginis: 5’-CCG-3’" },
];
export const PAM_TYPE_OPTIONS_TNPB = [
  { value: "TTGAT", label: "20bp-ISDra2 from Deinococcus radiodurans: 5'-TTGAT-3'" },
  { value: "TGATC", label: "20bp-ISTfu1 from Thermobifida fusca: 5'-TGATC-3'" },
  { value: "TTTAA", label: "20bp-ISAam1 from Acetobacter aceti: 5'-TTTAA-3'" },
  { value: "TTGAT", label: "20bp-ISYmu1 from Bacillus sp. Y1: 5'-TTGAT-3'" },
]

export const PAM_TYPE_OPTIONS_CAS12A = [
  { value: 'TTTV', label: "TTT(A/C/G)-23bp-Cas12a(Cpf1)-recommended, 23bp guides" },
  { value: 'PAM', label: "Customized PAM: 5'-XXX-3'" },
  { value: 'TTR', label: "TT(A/C/G)-23bp-Cas12a (Cpf1)-recommended, 23bp guides" },
  { value: 'TTTRIDT', label: "TTT(A/C/G)-21bp-Cas12a (Cpf1)-21bp guides recommended by IDT" },
  { value: 'TTTN', label: "TTTN-23bp-Cas12a(Cpf1)-low efficiency" },
  { value: 'NGTN', label: "NGTN-23bp-ShCAST/AcCAST, Strecker et al, Science 2019" },
  { value: 'TRCR', label: "T(C/T)C(A/C/G)-23bp-TYCV As-Cpf1 K607R" },
  { value: 'TATR', label: "TAT(A/C/G)-23bp-TATV AS-Cpf1 K548V" },
  { value: 'TTTA', label: "TTTA-23bp-TTTA LbCpf1" },
  { value: 'TCTA', label: "TCTA-23bp-TCTA LbCpf1" },
  { value: 'TCCA', label: "TCCA-23bp-TCCA LbCpf1" },
  { value: 'CCCA', label: "CCCA-23bp-CCCA LbCpf1" },
  { value: 'GGTT', label: "GGTT-23bp-CCCA LbCpf1" },
  { value: 'TTYN', label: "TTYN- Or VTTV- orTRTV-23bp -enCas12aE174R/S542R/K548R -Kleinstiver et al Nat Biot 2019" },
];

export const PAM_TYPE_OPTIONS_CAS12B = [
  { value: 'TTN', label: "TTN-20bp-Ghcas12b" },
  { value: 'PAM', label: "Customized PAM: 5'-XXX-3'" },
  { value: 'ATTN', label: "ATTN-23bp-BhCas12b v4" },
];

// 目标基因组选项 - 按类别分组
export const TARGET_GENOME_OPTIONS = [
  // { value: "Beta_vulgaris", label: "Beta vulgaris" },
  // { value: "Brassica_napus", label: "Brassica napus" },
  // { value: "Camelina_sativa", label: "Camelina sativa" },
  // { value: "Phaseolus_vulgaris", label: "Phaseolus vulgaris" },
  // {
  //   value: "Gossypium_hirsutum_T2T-Jin668_HZAU_genome",
  //   label: "Gossypium hirsutum Jin668 HZAU",
  // },
  {
    value: "Ghirsutum_genome_HAU_v1.1",
    label: "Ghirsutum genome HAU v1.1",
    InputSequence: "Ghir_A01G013050",
    geneId: "Ghir_A01G013050",
    position: "Ghir_A01:80323000-80325000",
    sequence: `>Ghir_A01G000040.1
ATGTTGGTCATTGCATGGAATGAAGTCATAATTTGTATTGGTTGCCCCATGGAAGACCACACTTTTGCTG`
  },
  {
    value: "Gossypium_hirsutum_T2T-Jin668_HZAU",
    label: "Gossypium hirsutum T2T-Jin668 HZAU",
    InputSequence: "Ghjin_A01g000010",
    geneId: "Ghjin_A01g000010",
    position: "Ghjin_A01:18200-20900",
    sequence: ``
  },
  {
    value: "Gossypium_hirsutum_TM-1v.3.1",
    label: "Gossypium hirsutum TM-1v.3.1",
    InputSequence: "Gohir.A01G000050.v3.1",
    geneId: "Gohir.A01G000050.v3.1",
    position: "GhTM_A01:21500-21800",
    sequence: ``
  },
  {
    value: "Gossypium_hirsutum_YZ1_HZAU",
    label: "Gossypium hirsutum YZ1 HZAU",
    InputSequence: "Ghyz_A01g026180",
    geneId: "Ghyz_A01g026180",
    position: "Ghyz_A01:119036000-119041000",
    sequence: ``
  },
  {
    value: "GCF_019175385.1_ASM1917538v2_Red_genomic",
    label: "GCF_019175385.1_ASM1917538v2_Red_genomic",
    InputSequence: "gene-LOC132627389",
    geneId: "gene-LOC132627389",
    position: "",
    sequence: ``
  },
  {
    value: "lycium_ruthenicum_black_genome",
    label: "lycium_ruthenicum_black_genome",
    InputSequence: "evm.TU.chr04.1",
    geneId: "evm.TU.chr04.1",
    position: "",
    sequence: ``
  },
  {
    value: "PRJCA010231_LyBarV2",
    label: "PRJCA010231_LyBarV2",
    InputSequence: "Ly01G000010",
    geneId: "Ly01G000010",
    position: "",
    sequence: ``
  }
  // { value: "Actinidia_chinensis", label: "Actinidia chinensis" },
  // { value: "Aegilops_tauschii", label: "Aegilops tauschii" },
  // { value: "Aegle_marmelos", label: "Aegle marmelos" },
  // { value: "Arabidopsis_thaliana", label: "Arabidopsis thaliana" },
  // { value: "Asparagus_officinalis", label: "Asparagus officinalis" },
  // { value: "Avena_sativa", label: "Avena sativa" },
  // { value: "Capsicum_annuum", label: "Capsicum annum" },
  // { value: "Chenopodium_quinoa", label: "Chenopodium quinoa" },
  // { value: "Citrus_australasica", label: "Citrus australasica" },
  // { value: "Citrus_clementina", label: "Citrus clementina" },
  // { value: "Citrus_hongheensis", label: "Citrus hongheensis" },
  // { value: "Citrus_ichangensis", label: "Citrus ichangensis" },
  // { value: "Citrus_mangshanensis", label: "Citrus mangshanensis" },
  // { value: "Citrus_medica", label: "Citrus medica" },
  // { value: "Citrus_reticulata", label: "Citrus reticulata" },
  // { value: "Citrus_sinensis", label: "Citrus sinensis" },
  // { value: "Clausena_lansium", label: "Clausena lansium" },
  // { value: "Coffea_canephora", label: "Coffea canephora" },
  // { value: "Cucumis_melo", label: "Cucumis melo" },
  // { value: "Cucumis_sativus", label: "Cucumis sativus" },
  // { value: "Daucus_carota", label: "Daucus carota" },
  // { value: "Ficus_carica", label: "Ficus carica" },
  // { value: "Fortunella_hindsii", label: "Fortunella hindsii" },
  // { value: "Glycine_max", label: "Glycine max" },
  // { value: "Helianthus_annuus", label: "Helianthus annuus" },
  // { value: "Hordeum_vulgare", label: "Hordeum vulgare" },
  // { value: "Manihot_esculenta", label: "Manihot esculenta" },
  // { value: "Oryza_nivara", label: "Oryza nivara" },
  // { value: "Oryza_sativa", label: "Oryza sativa" },
  // { value: "Oryza_sativa_japnase", label: "Oryza sativa japnase" },
  // { value: "Papaver_somniferum", label: "Papaver somniferum" },
  // { value: "Physcomitrium_patens", label: "Physcomitrium patens" },
  // { value: "Pistacia_vera", label: "Pistacia vera" },
  // { value: "Rosa_chinensis", label: "Rosa chinensis" },
  // { value: "Saccharum_spontaneum", label: "Saccharum spontaneum" },
  // { value: "Sesamum_indicum", label: "Sesamum indicum" },
  // { value: "Solanum_lycopersicum", label: "Solanum lycopersicum" },
  // { value: "Sorghum_bicolor", label: "Sorghum bicolor" },
  // { value: "Theobroma_cacao", label: "Theobroma cacao" },
  // { value: "Triticum_aestivum", label: "Triticum aestivum" },
  // { value: "Vigna_radiata", label: "Vigna radiata" },
  // { value: "Vitis_vinifera", label: "Vitis vinifera" },
  // { value: "Zea_mays", label: "Zea mays" },
  // { value: "Gossypium_hirsutum_Jin668_V1", label: "Gossypium hirsutum Jin668 V1" },
  // { value: "Pisum_sativum", label: "Pisum sativum" },
];

// sgRNA模块选项
export const SGRNA_MODULE_OPTIONS = [
  { value: "spacerpam", label: "5'-Spacer+ PAM-3'" },
  { value: "pam_spacer", label: "5'-PAM + Spacer-3'" },
];

// 示例数据配置
export const EXAMPLE_DATA = {
  geneId: "Ghjin_A01.g00001",
  position: "Ghjin_A01:20000-21000",
  sequence: `>Ghjin_A01.g00001
ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGGTAACAAATTAGAAACAAGTTATCCTATCTTGTTCAAGCAGTTTTTCTTTTAAAGCATCATGAGCTTTGCTTGTAATATGCAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGACATTCGCAAGGAAGTGTTCCTTGAAAAAAGTATAACTTTGCAATCAATTCAAACACTTAGTTTTCGTCCTACTATTATGATTGATTCTTAGCTATGACACATTCCTGAGTATTCTGTATTATTACATCTTCAGTTGATTTAGCAAATAAAGTGTGAATGACTAATGATTCTGTATTATTACATCTTCAGTTGAACTTTTAAATCAACTAAACCTGTAAATCTTATATGAGATTATCTGTATTTGTTATTTTTAAAATATGCTACTCACCCTTTTGGTGGTTGTTAGTATTTCTATGGGCCAAACCAATGGGTCATGGAGTTTGCTACTAAATTGAGCAGTGAGAGGTTATTGATTATAATAAGTTAGAAGATAAACTGTCACTGTTGATTCTTGTAATTGTATATCTCTGTTTGGTATTAAACCAGCTAAAAACATTGTAATTTGTATAAATGTTCTTATTATACAGAATCTGCTACTCTGGTTGGTGGTTCTTTGGTTTTTTTCAACCTGATCAATGGGCTGAGGAGTTTACTACTGTATGAGAGCAACTAGGGTCTTTTGATTTGTTTATTCAGGATACAAAGTGCGACTAATGATTCTGCGTGTTATGTATTATTTTGAGACTCTTAAACCGTGCGAAGCTCTTATTCTTATTTGAAATATTCTAATTTTCTTCATTTCATTAAATGTTCTTGACTTGATGGTTAATAGGTTTTCCGTGGACCTGACCATTGGGCCAATGAATTTGGTGCTGAAAGATTGCAACAAGAGTCTGTCGATGATCAATGGGTCAATGAATTCTCAAAGTTGCATGTTGATGACGGGCAGAAGAATTTGGTCGTCAAGTTGGTGAGGGGGCTTTGGGATAAGCTTGTCTGATAACTGGGCAAATTCATATGATGAGTAAGTCTGGTAGCCTTGAAGAAGTTCACTTTATAACCTCTTTTAATTCTACATGAATGTTTCGGTTGTGAAAACTTGTAGGTTCCTCAGCGGTCGGACGCTTCCAGGGGTGTCTATGTATTTTCTGATATGAATCCATATGTTGGTCATCAAAATCCTTTAAAAGAAGGTCAAGAGCTATTCAGGAAAGGACTTTTGAGTGAAGCAGTGCTTGCCCTAGAGGCTGAAGTTATGAAAAATCCTGAGAAAGCTGAAGGTTGGAGATTGCTAGGAATAACCCATGCTGAAAATGATGATGACCAGCAGGTAATCCACTTTGCCCTAGTTTGTCAGAGTTGGATAGTTCATGTGTATTCTTACACCAAAAGACATTGTTTTTGTGTTCTTTAATACTACAAGAATTTCTATTAAGAGATGTGACTGCTTGTCTAGTTCAGCCATCTGTTCAGCATCTTTGATTATGATTCTTTGCCTGGCAAGGTTGACCATTTACCTTTCTATTCTACCTAAATCTAAATCATTTTTAATCTTGTCTAATGCCCTGTGAATACCATCATATCTTAGGAAACAGAACAACCTATTGATTAAGCAAGCAAGAAAACCTTTTGAACACAAAGGATCTATTATCTTGTACCGCTACATTTTGTTTTTTATTTGCTGGCTTGATATAGCCATGGTGGTGTACCATGCAATGTTCATTTCTTGTATATGAACACTTCTACTGGAAAGGGATGGAAGGAGCTATTTTTCGTTTAAACATTGAAGTTTGCAATATGATTGGTATTACGTTTATCTTAGTGGCCTGAGGCTTCAGTCAGAGTAGCAGATCTAAGGCCGCAGTCTTTGCCTGGCTGCTAATGTTCTGCATCTAACCTATTATTGTTTGTTGTCACATGAACTAGTAGTGCATTACATTTCACTTATCATCCGCTTCTATTTATTCTTGAACCATGTCAAAACCTTTTTGGCCTAATTGAAATTAATTTGAATGGATAAGGTTCCATCTTAAACTATGTCTATATCAAGCCTATGAAGTGTAATGTTTCACATTTATTGCAAATTGTTTTGGATGATTAATGTGTCTGCTTGTCATTATCTTGAGACTTACATGGATGATGCTAGACCTTTTTATACTTCTGTTATTCTTGATTAATGCATCTGCAGTTTTATGTGGTTTTTACTGGGGTCCATATATTTGACTTTGTAGAAAAAATGTAGTTCACTGATTAGATATCTCTGTACAGGCTATTGCAGCAATGATGCGTGCTCAGAAGGCCGATCCTACCAATCTGGAAATACTTCTTGCTCTTGGTGTGAGTCATACAAATG`,
};
