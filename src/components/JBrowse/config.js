import { createViewState as createJBrowseViewState } from "@jbrowse/react-linear-genome-view";

// 默认配置URLs
export let URLS = {
  fasta: "",
  fai: "",
  gff3_gz: "",
  gff3_tbi: "",
  json: "",
  position: "",
  assembly_name: "Gossypium_hirsutum_T2T-Jin668_HZAU_genome",
  tracks_name: "file.gff3",
};

// 更新URLs的函数
export const updateConfigUrls = (newUrls) => {
  URLS = { ...URLS, ...newUrls };
  // 保存到 localStorage
  localStorage.setItem("jbrowse_urls", JSON.stringify(URLS));
  // 重新创建state
  state = createViewState();
};

// 从localStorage获取保存的URLs
export const getSavedUrls = () => {
  const savedUrls = localStorage.getItem("jbrowse_urls");
  return savedUrls ? JSON.parse(savedUrls) : null;
};

// 创建基础配置
const createBaseState = (config = URLS) => ({
  assembly: {
    name: config.assembly_name,
    sequence: {
      type: "ReferenceSequenceTrack",
      trackId: `${config.assembly_name}-ReferenceSequenceTrack`,
      adapter: {
        type: "IndexedFastaAdapter",
        fastaLocation: {
          uri: config.fasta,
          locationType: "UriLocation",
        },
        faiLocation: {
          uri: config.fai,
          locationType: "UriLocation",
        },
      },
    },
  },
  tracks: [
    {
      type: "FeatureTrack",
      trackId: "file.gff3",
      name: config.tracks_name,
      assemblyNames: [config.assembly_name],
      adapter: {
        type: "Gff3TabixAdapter",
        gffGzLocation: {
          uri: config.gff3_gz,
          locationType: "UriLocation",
        },
        index: {
          location: {
            uri: config.gff3_tbi,
            locationType: "UriLocation",
          },
          indexType: "CSI",
        },
      },
    },
  ],
  location: config.position,
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
          assemblyName: config.assembly_name,
        },
      ],
      tracks: [
        {
          id: "reference-track",
          type: "ReferenceSequenceTrack",
          configuration: `${config.assembly_name}-ReferenceSequenceTrack`,
          minimized: false,
          displays: [
            {
              id: "reference-display",
              type: "LinearReferenceSequenceDisplay",
              heightPreConfig: 120,
              configuration: `${config.assembly_name}-ReferenceSequenceTrack-LinearReferenceSequenceDisplay`,
              showForward: true,
              showReverse: true,
              showTranslation: true,
            },
          ],
        },
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

// 创建视图状态
const createViewState = (config) => {
  const baseState = createBaseState(config);
  return createJBrowseViewState(baseState);
};

// 导出当前state（让它可变）
export let state = null;

// 初始化状态
export const initializeJBrowseState = (config) => {
  // 更新配置
  if (config) {
    updateConfigUrls(config);
  }

  // 创建状态
  state = createViewState(config || URLS);
  return state;
};
