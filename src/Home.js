import styled from "styled-components";
import { useState, useEffect } from 'react';

import { Link } from './Link';
import { DrawCanvas } from './Components_Home/DrawCanvas';
import { SimulationCanvas } from './Components_Home/SimulationCanvas';
import { RightBar } from './Components_Home/RightBar';
import { Home as SettingMedium } from './SettingPage_Medium/Home';
import { Home as SettingInputWave } from './SettingPage_InputWave/Home';
import { Home as SettingDomainGrid } from './SettingPage_DomainGrid/Home';

import { DEFAULT, BREAD } from './constants';
import { maker_RECT, updateLinkBread } from './helpers';

const Container = styled.div`
  margin-left:10px;
  position:relative;
  display:flex;
  flex-direction:column;
`
const Body = styled.div`
  position:relative;
`
const ContainerHome = styled.div`
  position:relative;
  display: inline-block;
  display:flex;
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  opacity: ${props => props.$show ? 1 : 0};
  flex-direction:row;
  @media screen and (max-width: 950px) {
    flex-direction: column;
  }
`
const Wrapper = styled.div`
  position: absolute;
  width:100%; height:100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  opacity: ${props => props.$show ? 1 : 0};
`;
const LeftBar = styled.div`
  position:relative;
`

export const Home = () => {
  const { SETTING, MEDIUM, BITMAP, FEEDPOINT, AMPLITUDESCALER,COLOR} = DEFAULT;
  const [setting, setSetting] = useState(SETTING);
  const [medium, setMedium] = useState(MEDIUM);
  const [bitmap, setBitmap] = useState(BITMAP);
  const [feedPoint, setFeedPoint] = useState(FEEDPOINT);
  const [amplitudeScaler, setAmplitudeScaler] = useState(AMPLITUDESCALER);
  const [drawData, setDrawData] = useState({});
  const [simulationData, setSimulationData] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSimulation, setShowSimulation] = useState(false);
  const [rectDrawData, setRectDrawData] = useState({ width: 0, height: 0 });
  const [showWindow, setShowWindow] = useState("home");
  const [LinkBread, setLinkBread] = useState([]);
  const [moveVideo, setMoveVideo] = useState(false);
  const [color,setColor]=useState(COLOR);
  const drawCanvasProps = {
    drawData,
    setBitmap,
    selectedIndex,
    setFeedPoint,
    rect:rectDrawData
  }
  const settingDomainGridProps = {
    drawData, setDrawData,
    setShowWindow,
    setHomeRectDrawData : setRectDrawData,
    setSetting,
    setFeedPoint
  }
  
  const rightBarProps = {
    setting, setSetting,
    setShowWindow,
    selectedIndex, setSelectedIndex,
    feedPoint, setFeedPoint,
    medium,
    amplitudeScaler, setAmplitudeScaler,
    color, setColor,
    showSimulation, setShowSimulation,
    moveVideo, setMoveVideo,
  };
  const simulationCanvasProps = {
    simulationData,
    showSimulation, setShowSimulation,
    moveVideo, setMoveVideo,
    rect:rectDrawData
  };
  const settingInputWaveProps = {
    setting, setSetting,
    amplitudeScaler, setAmplitudeScaler,
    defaultSetting: SETTING,
    defaultAmplitudeScaler: AMPLITUDESCALER,
    setShowWindow
  }
  const settingMediumProps = {
    medium, setMedium,
    setShowWindow
  }

  useEffect(() => {
    setDrawData({ bitmap: bitmap, setting: setting, feedPoint: feedPoint, medium: medium, clearBitmap: false });
    setShowSimulation(false);
  }, [setting, medium, feedPoint])

  const clearBitmap = () => {
    setDrawData({ bitmap: bitmap, setting: setting, feedPoint: feedPoint, medium: medium, clearBitmap: true });
    setShowSimulation(false);
  }
  useEffect(() => {
    setShowSimulation(false);
  }, [selectedIndex, color, amplitudeScaler])
  useEffect(() => {
    updateLinkBread(showWindow, BREAD, setLinkBread);
  }, [showWindow]);
  useEffect(()=>{
    setRectDrawData(maker_RECT(SETTING));
  },[])

  const push = () => {
    const obj = {
      setting: setting,
      bitmap: bitmap,
      feedPoint: feedPoint,
      medium: medium,
      color: color,
      amplitudeScaler: amplitudeScaler
    }
    setShowSimulation(true);
    setSimulationData(obj);
  }
  const reset = () => {
    setRectDrawData(maker_RECT(SETTING));
    setSetting(SETTING);
    setBitmap(BITMAP);
    setAmplitudeScaler(AMPLITUDESCALER);
    setColor(COLOR);
    setFeedPoint(FEEDPOINT);
    setMedium(MEDIUM);
    setSelectedIndex(0);
    setDrawData({ ...drawData, clearBitmap: true });
  }
  const componentMap = {
    settingMedium: <SettingMedium {...settingMediumProps} />,
    settingDomainGrid: <SettingDomainGrid {...settingDomainGridProps} />,
    settingInputWave: <SettingInputWave {...settingInputWaveProps} />
  };

  return (
    <Container>

      <Link setShowWindow={setShowWindow} linkobject={LinkBread} />
      <Body>
        <ContainerHome $show={showWindow === "home"}>
            <LeftBar style={{ width: rectDrawData.width + "px", height: rectDrawData.height + "px" }}>
              <Wrapper $show={!showSimulation}>
                <DrawCanvas {...drawCanvasProps} />
              </Wrapper>
              <Wrapper $show={showSimulation}>
                <SimulationCanvas {...simulationCanvasProps} />
              </Wrapper>
            </LeftBar>

          <RightBar {...rightBarProps} push={push} clearBitmap={clearBitmap} reset={reset} />
        </ContainerHome>

        <Wrapper $show={showWindow !== "home"}>
          {componentMap[showWindow]}
        </Wrapper>

      </Body>
    </Container>
  )
};