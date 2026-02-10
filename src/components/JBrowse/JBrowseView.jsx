import { JBrowseLinearGenomeView } from "@jbrowse/react-linear-genome-view";
import PropTypes from "prop-types";

/**
 * JBrowseView 组件用于渲染线性基因组视图。
 * @param {Object} props - 组件的属性。
 * @param {Object} props.state - 基因组视图的状态。
 */
function JBrowseView({ state }) {
  return (
    <div
      className="jbrowse-container"
      style={{ width: "100%", minHeight: "400px" }}
    >
      <JBrowseLinearGenomeView viewState={state} />
    </div>
  );
}

// 定义 PropTypes
JBrowseView.propTypes = {
  state: PropTypes.object.isRequired,
};

export default JBrowseView;
