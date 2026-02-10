import { createViewState as createJBrowseViewState } from "@jbrowse/react-linear-genome-view";

let jbrowseState = null;

// 创建基础配置
const createBaseState = (jbrowseConfig) => ({
  assembly: {
    name: jbrowseConfig.assembly.name,
    sequence: {
      type: "ReferenceSequenceTrack",
      trackId: `${jbrowseConfig.assembly.name}-ReferenceSequenceTrack`,
      adapter: {
        type: "IndexedFastaAdapter",
        fastaLocation: {
          uri: jbrowseConfig.assembly.fasta,
          locationType: "UriLocation",
        },
        faiLocation: {
          uri: jbrowseConfig.assembly.fai,
          locationType: "UriLocation",
        },
      },
    },
  },
  tracks: [
    {
      type: "FeatureTrack",
      trackId: "file.gff3",
      name: jbrowseConfig.tracks.name,
      assemblyNames: [jbrowseConfig.assembly.name],
      adapter: {
        type: "Gff3TabixAdapter",
        gffGzLocation: {
          uri: jbrowseConfig.tracks.gff3_gz,
          locationType: "UriLocation",
        },
        index: {
          location: {
            uri: jbrowseConfig.tracks.gff3_tbi,
            locationType: "UriLocation",
          },
          indexType: "CSI",
        },
      },
    },
  ],
  location: jbrowseConfig.position,
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
      offsetPx: 0,
      bpPerPx: 2.613251087393094,
      displayedRegions: [
        {
          reversed: false,
          refName: jbrowseConfig.position.split(":")[0] || "2",
          start: 0,
          end: 108101717,
          assemblyName: jbrowseConfig.assembly.name,
        },
      ],
      tracks: [
        {
          id: "reference-track",
          type: "ReferenceSequenceTrack",
          configuration: `${jbrowseConfig.assembly.name}-ReferenceSequenceTrack`,
          minimized: false,
          displays: [
            {
              id: "reference-display",
              type: "LinearReferenceSequenceDisplay",
              heightPreConfig: 120,
              configuration: `${jbrowseConfig.assembly.name}-ReferenceSequenceTrack-LinearReferenceSequenceDisplay`,
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

// 初始化JBrowse状态
export const initJBrowseState = (jbrowseConfig) => {
  const baseState = createBaseState(jbrowseConfig);
  jbrowseState = createJBrowseViewState(baseState);
  return jbrowseState;
};

// 获取JBrowse状态
export const getJBrowseState = () => jbrowseState;

// 从结果数据创建状态
export const createJBrowseStateFromResult = (resultData) => {
  if (resultData?.JbrowseInfo) {
    return initJBrowseState(resultData.JbrowseInfo);
  }
  return null;
};

// 清除状态
export const clearJBrowseState = () => {
  jbrowseState = null;
};
