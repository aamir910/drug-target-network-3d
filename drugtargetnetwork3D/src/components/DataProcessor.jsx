/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card } from "antd";
import { fetchGraphData } from "../app/features/data/dataThunks";
import { filterGraphData } from "./../app/features/data/dataSlice";
import {
  selectGraphData,
  selectDataStatus,
  selectDataError,
  selectlegendfilteration,
} from "../app/features/data/dataSelectors";
import ForceNetworkGraph from "./ForceNetworkGraph";
import Legend from "./Legend";
import CustomButton from "./CustomButton";
import DoubleSlider from "./doubleSIilder";
import SliderComponent from "./SliderSource";
import SingleFilteration from "./SingleFilteration";
import ExportChartModal from "./ExportChartModal";
import DarkModeEnabler from "./DarkModeEnabler";
import useColorShape from "./ColorShape";

const DataProcessor = () => {
  const dispatch = useDispatch();
  const [clonedGraphData, setClonedGraphData] = useState(null);
  const graphData = useSelector(selectGraphData);
  const dataStatus = useSelector(selectDataStatus);
  const dataError = useSelector(selectDataError);
  const legendData_filters = useSelector(selectlegendfilteration);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const { getNodeColor, getNodeShape, generateDataSet } = useColorShape();

  useEffect(() => {
    if (dataStatus === "idle") {
      dispatch(fetchGraphData());
    }
    if (graphData) {
      const clonedData = {
        nodes: graphData.nodes.map((node) => ({
          ...node,
          color: getNodeColor(node), // Add color property
        })),
        links: graphData.links.map((link) => ({
          ...link,
          color: generateDataSet(link),
        })),
      };
      setClonedGraphData(clonedData);
    } else {
      setClonedGraphData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStatus, graphData, dispatch]);

  if (dataStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (dataStatus === "failed") {
    return <div>Error: {dataError}</div>;
  }

  const handleApplyClick = () => {
    dispatch(filterGraphData());
  };
  const scrollbarStyle = {
    height: "600px",
    overflowY: "auto",
    scrollbarWidth: isDarkMode ? "thin" : "auto", // For Firefox
    scrollbarColor: isDarkMode ? "#555 #333" : "#ddd #f1f1f1", // For Firefox
  };
  return (
    <Row
      justify="center"
      gutter={[16, 16]}
      style={{ padding: "10px", marginTop: "1px" }}>
      <Col xs={24} sm={12} md={5}>
        <Card title="Legend" bordered>
          <DarkModeEnabler />
          <div style={scrollbarStyle}>
            <CustomButton onClick={handleApplyClick}>Apply</CustomButton>
            <SingleFilteration />
            <SliderComponent />
            <DoubleSlider />
            {legendData_filters ? (
              <Legend legendData={legendData_filters} />
            ) : null}
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={24} md={19}>
        <Card
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",

                alignItems: "center",
              }}>
              <span>3D Force Network Graph</span>
              <div>
                <ExportChartModal />
              </div>
            </div>
          }
          bordered>
          {clonedGraphData ? (
            <ForceNetworkGraph
              graphData={clonedGraphData}
              getNodeShape={getNodeShape}
              generateDataSet={generateDataSet}
            />
          ) : null}
        </Card>
      </Col>
    </Row>
  );
};

export default DataProcessor;
