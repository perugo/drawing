import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';

import {
  Box, FrontHeader, FrontHeaderInner, TitleWrapper, CustomH3, FrontBody,
  ColumnLayout, GridColumn, FrontHeaderLeft, SVGInner, StyledImg
} from './../../Components/StyledBoxComponents';

const FEEDPOINT_COLOR = [
  'rgb(255, 0, 0)',   // Lighter 赤色 (Red)
  'rgb(100, 255, 255)',   // Lighter シアン (Cyan)
  'rgb(255, 100, 255)',   // Lighter マゼンタ (Magenta)
  'rgb(200, 100, 200)',   // Lighter 紫色 (Purple)
  'rgb(255, 200, 100)',   // Lighter オレンジ色 (Orange)
  'rgb(200, 200, 100)',   // Lighter オリーブ色 (Olive)
  'rgb(100, 200, 200)',   // Lighter ティール色 (Teal)
  'rgb(200, 100, 100)'    // Lighter 濃紅色 (Deep Red)
];




const FeedButton = styled.span`
font-size:15px;
font-weight:500;
line-height:1.3;
font-size:15px;
color:rgb(40,40,40);
margin-bottom:2px;
line-height:1.3;
`

const FeedButtonContainer = styled.button`
background-color:rgb(255,255,255);
border-color:rgb(0,0,0);
border-style:solid;
border-width:1px;
border-radius:2px;
padding:0px 15px;
display:flex;
justify-content:center;
&:hover {
  border-color:rgb(100,100,100);
  background-color:rgb(240,240,240);
}
&:active{
  background-color:rgb(225,225,225);
}
cursor:pointer;
`

const ShiftButtonWrapper = styled.div`
background-color:rgb(230,230,230);
border-color:rgb(100,100,100);
border-style:solid;
border-width:1px;
display:flex;
justify-content:center;
&:hover {
  border-color:rgb(100,100,100);
  background-color:rgb(205,205,205);
}
&:active{
  background-color:rgb(170,170,170);
}
cursor:pointer;
`
const MediumColorIcon = styled.div`
  width:22px;
  height:20px;
  margin:2px 3px 1px 3px;
  border:1px solid black;
`

const Label = styled.div`
  margin-left:15px;
  padding-right:5px;
  text-align:left;
  font-size:18px;
`
const FeedPointGridArray = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3px;
  margin:auto;
`
const FeedPointItem = styled.div`
  display:flex;
  flex-direction:row;
  line-height:24px;
`
const SVGWrapper = styled.div`
  height: 20px;
  width: 26px;
  margin-top: 2px;
  margin-bottom: 2px;
  display: flex;
`;
const CoordinateShiftSVGWrapper = styled.div`
  height: 11px;
  width: 20px;
  display: flex;
`;
const InputText = styled.input`
  width:50px;
  text-align:right;
  box-sizing: border-box;
  font-size:16px;
  padding:2px;
  height:fit-content;
`
const Garbage_Inner = styled.div`
  position:relative;
  margin:1px 3px 1px 3px;
  height:19px;
  width:20px;
`
const FeedButtonItem = styled.div`
display: flex;
flex-direction: column;
gap:5px;
justify-content: center;  // Add this line to center horizontally
align-items: center;      // Add this line to center vertically (optional if you also want vertical centering)
width: 100%;              // This ensures it takes full width available
`;

const CoordinateShiftButtonWrapper = styled.div`
padding-left:3px;
height:100%;
display:flex;
flex-direction:column;
`


var xnum;
var ynum;
export const BoxFeedPoint = ({ setting, feedPoint, setFeedPoint }) => {
  const [strFeedPoint, setStrFeedPoint] = useState([]);
  const [hoveredItemId, setHoveredItemId] = useState(-1);
  const timeoutIdRef = useRef();
  const looptimeoutIdRef = useRef(null);
  const reserveIdRef = useRef(null);

  const [pressTimer, setPressTimer] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (!feedPoint || feedPoint.length === 0) return;
    const stringFeedPoint = feedPoint.map(item => ({
      x: item.x.toString(),
      y: item.y.toString(),
      color: item.color,
      phase: item.phase.toString()
    }));
    setStrFeedPoint(stringFeedPoint);
  }, [feedPoint])

  useEffect(() => {
    if (!checker_SETTING) return;
    xnum = setting.split;
    ynum = Math.ceil(setting.fieldY / (setting.fieldX / setting.split));
  }, [setting])
  const addFeedPoint = () => {
    const obj = maker_NEWFEEDPOINT(setting, feedPoint);
    setFeedPoint([...feedPoint, obj]);
    const strcombinedPoint = {
      x: obj.x.toString(),
      y: obj.y.toString(),
      color: obj.color,
      phase: obj.phase.toString()
    }
    setStrFeedPoint([...strFeedPoint, strcombinedPoint]);
    setHoveredItemId(-1);
  }
  const handleInputChange = (columnIndex, field, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    clearTimeout(timeoutIdRef.current);
    const newStrFeedPoint = [...strFeedPoint];
    newStrFeedPoint[columnIndex][field] = value;
    setStrFeedPoint(newStrFeedPoint);
    startSetFeedPointTimer();
  };
  const handleSetFeedPointTimeout = () => {
    const finalFeedPoint = [];
    strFeedPoint.forEach((sfP, i) => {
      const Xvalue = isvalid(sfP.x, xnum) !== false ? parseInt(sfP.x) : feedPoint[i].x;
      const Yvalue = isvalid(sfP.y, ynum) !== false ? parseInt(sfP.y) : feedPoint[i].y;
      const Phasevalue = isvalid(sfP.phase, 360) !== false ? parseInt(sfP.phase) : feedPoint[i].phase;
      const combinedPoint = {
        x: Xvalue,
        y: Yvalue,
        color: feedPoint[i].color,
        phase: Phasevalue
      }
      finalFeedPoint.push(combinedPoint);
    });
    setFeedPoint(finalFeedPoint);
  };
  const startSetFeedPointTimer = () => {
    timeoutIdRef.current = setTimeout(handleSetFeedPointTimeout, 1200);
  };

  const handleKeyDown = (e) => {
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Tab" && e.key !== "Delete") {
      e.preventDefault();
    }
  }
  function handleHover(index) {
    setHoveredItemId(index)
  }
  function delete_Onclick(index) {
    const newFeedPoint = [...feedPoint];
    newFeedPoint.splice(index, 1);
    setFeedPoint(newFeedPoint);
  }
  function handleLeave() {
    setHoveredItemId(-1);
  }
  const onClickFormLine = () => {
    const newFeedPoint = generateAlignedFeedPoints(feedPoint, xnum, ynum);
    setFeedPoint(newFeedPoint); // Update the state with the new feed points
  }
  const onClickShiftButton = (columnIndex, field, shift) => {
    const newStrFeedPoint = [...strFeedPoint];
    let value = parseInt(newStrFeedPoint[columnIndex][field]);
    value += shift;
    newStrFeedPoint[columnIndex][field] = value.toString();
    setStrFeedPoint(newStrFeedPoint);

    if (reserveIdRef.current) {
      clearTimeout(reserveIdRef.current);
    }
    reserveIdRef.current = setTimeout(() => {
      handleSetFeedPointTimeout();
      reserveIdRef.current = null;
    }, 600);

    if (looptimeoutIdRef.current) return;
    handleSetFeedPointTimeout();
    looptimeoutIdRef.current = setTimeout(() => {
      looptimeoutIdRef.current = null;
    }, 200);

    return () => {
      if (reserveIdRef.current) {
        clearTimeout(reserveIdRef.current)
      }
    };
  }
  const handleMouseDown = (index, field, shiftDir) => {
    let shift;
    if (shiftDir === 'increment') {
      shift = 1;
    } else { shift = -1; }
    onClickShiftButton(index, field, shift); // すぐにonClickを実行

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (field === 'phase') {
          if (shiftDir === 'increment') { shift = 4; } else { shift = -4; }
        }
        onClickShiftButton(index, field, shift);
      }, 100);
      setIntervalId(interval);
    }, 1000);
    setPressTimer(timer);
  }
  const handleMouseUp = () => {
    clearTimeout(pressTimer);
    clearInterval(intervalId);
    setPressTimer(null);
    setIntervalId(null);
  }
  useEffect(() => {
    // コンポーネントのアンマウント時にタイマーをクリア
    return () => {
      clearTimeout(pressTimer);
      clearInterval(intervalId);
    };
  }, [pressTimer, intervalId]);

  const CoordinateShiftButton = ({ index, coordinateType, handleMouseDown, handleMouseUp }) => {
    return (
      <CoordinateShiftButtonWrapper>
        <ShiftButtonWrapper style={{ borderBottom: 'none' }}
          onMouseDown={() => handleMouseDown(index, coordinateType, 'increment')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}>
          <CoordinateShiftSVGWrapper>
            <SVGInner>
              <StyledImg
                src={`${process.env.PUBLIC_URL}/IncrementButton.svg`}
                alt="Increment"
              />
            </SVGInner>
          </CoordinateShiftSVGWrapper>
        </ShiftButtonWrapper>
        <ShiftButtonWrapper
          onMouseDown={() => handleMouseDown(index, coordinateType, 'decrement')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}>
          <CoordinateShiftSVGWrapper>
            <SVGInner>
              <StyledImg
                src={`${process.env.PUBLIC_URL}/DecrementButton.svg`}
                alt="Decrement"
              />
            </SVGInner>
          </CoordinateShiftSVGWrapper>
        </ShiftButtonWrapper>
      </CoordinateShiftButtonWrapper>
    );
  };
  return (
    <Box>
      <FrontHeader>
        <FrontHeaderInner>
          <FrontHeaderLeft>
            <TitleWrapper>
              <CustomH3>波源の追加</CustomH3>
            </TitleWrapper>
          </FrontHeaderLeft>
        </FrontHeaderInner>
      </FrontHeader>

      <FrontBody>
        <ColumnLayout>
          <GridColumn>
            <FeedPointGridArray>
              {Array.isArray(strFeedPoint) && (strFeedPoint.map((column, index) => (
                <FeedPointItem key={index}>
                  {index === 0 && (
                    <Garbage_Inner></Garbage_Inner>
                  )}
                  {index !== 0 && (
                    <Garbage_Inner
                      onMouseEnter={() => handleHover(index)}
                      onMouseLeave={handleLeave}
                      onClick={() => delete_Onclick(index)}
                      onChange={(e) => handleInputChange(index, 'DielectricConstant', e.target.value)}
                    >
                      <SVGWrapper style={{ borderRadius: "5px", width: "100%", height: "100%", backgroundColor: hoveredItemId === index ? "gray" : "white" }}>
                        <SVGInner>
                          <StyledImg
                            src={`${process.env.PUBLIC_URL}/svgtrash.svg`}
                            alt="Trash Icon"
                          />
                        </SVGInner>
                      </SVGWrapper>
                    </Garbage_Inner>
                  )}

                  <MediumColorIcon style={{ backgroundColor: column.color }}></MediumColorIcon>
                  <Label>x: </Label>
                  <InputText
                    tabIndex={(0) + index + 1} // Set tabIndex based on the index
                    maxLength="3"
                    type="text"
                    value={column.x}
                    onChange={(e) => handleInputChange(index, 'x', e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown(e);
                    }}
                  />
                  <CoordinateShiftButton
                    index={index}
                    coordinateType="x"
                    handleMouseDown={handleMouseDown}
                    handleMouseUp={handleMouseUp}
                  />
                  <Label>y: </Label>
                  <InputText
                    tabIndex={strFeedPoint.length + index + 1} // Set tabIndex based on the index
                    maxLength="3"
                    type="text"
                    value={column.y}
                    onChange={(e) => handleInputChange(index, 'y', e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown(e);
                    }}
                  />
                  <CoordinateShiftButton
                    index={index}
                    coordinateType="y"
                    handleMouseDown={handleMouseDown}
                    handleMouseUp={handleMouseUp}
                  />
                  <Label style={{ paddingTop: "2px" }}>θ[deg]: </Label>
                  <InputText
                    tabIndex={(strFeedPoint.length * 2) + index + 1} // Set tabIndex based on the index
                    maxLength="3"
                    type="text"
                    value={column.phase}
                    onChange={(e) => handleInputChange(index, 'phase', e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown(e);
                    }}
                  />
                  <CoordinateShiftButton
                    index={index}
                    coordinateType="phase"
                    handleMouseDown={handleMouseDown}
                    handleMouseUp={handleMouseUp}
                  />
                </FeedPointItem>
              )))}
              <FeedButtonItem>

                {strFeedPoint.length !== 8 && (
                  <FeedButtonContainer onClick={addFeedPoint}>
                    <FeedButton >追加</FeedButton>
                  </FeedButtonContainer>
                )}
                {strFeedPoint.length >= 3 && (
                  <FeedButtonContainer style={{ marginLeft: "10px" }} onClick={() => onClickFormLine()}>
                    <MediumColorIcon style={{ backgroundColor: "red", height: "17px", width: "19px" }} />
                    <FeedButton style={{marginTop:"2px"}}> と </FeedButton>
                    <MediumColorIcon style={{ backgroundColor: strFeedPoint[1].color, height: "17px", width: "19px" }}></MediumColorIcon>
                    <FeedButton style={{marginTop:"2px"}}>のように並べる</FeedButton>

                  </FeedButtonContainer>
                )}
              </FeedButtonItem>

            </FeedPointGridArray>
          </GridColumn>
        </ColumnLayout>
      </FrontBody>
    </Box>
  )
};
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function generateAlignedFeedPoints(feedPoints, xnum, ynum) {
  if (feedPoints.length <= 2) return feedPoints;

  const [firstPoint, secondPoint] = feedPoints;
  const deltaX = secondPoint.x - firstPoint.x;
  const deltaY = secondPoint.y - firstPoint.y;
  const deltaPhase = secondPoint.phase - firstPoint.phase;

  return feedPoints.map((point, index) => {
    if (index < 2) {
      // Keep the first two points as they are, but ensure they are within bounds
      return {
        ...point,
        x: clamp(point.x, 0, xnum - 1),
        y: clamp(point.y, 0, ynum - 1),
      };
    } else {
      // Calculate new x and y, and clamp them within the valid range
      const newX = clamp(firstPoint.x + deltaX * (index), 0, xnum - 1);
      const newY = clamp(firstPoint.y + deltaY * (index), 0, ynum - 1);
      const newPhase = (firstPoint.phase + deltaPhase * index) % 360;
      return {
        ...point,
        x: newX,
        y: newY,
        phase: newPhase
      };
    }
  });
}
function checker_SETTING(obj1) {
  if (!obj1) return false;

  const sameFields = ['fieldX', 'fieldY', 'split', 'lambda'];
  const settingMatch = sameFields.every(field => obj1.setting[field] !== undefined);
  return settingMatch;
}

function isvalid(str, max) {
  if (!str.length) return false;
  if (/e/i.test(str)) return false;
  if (/[^0-9]/.test(str)) return false;
  if (str.startsWith('0') && str.length > 1) return false;
  if (str.length > 3) return false;
  var v = parseInt(str);
  if (isNaN(v)) return false;
  if (v >= max) return false;
  return v;
}

function maker_NEWFEEDPOINT(set, fP) {
  const xCIE = fP[0].x;
  const yCIE = fP[0].y;
  const ynum = Math.ceil(set.fieldY / (set.fieldX / set.split));
  const INCREMENT = 10;

  const uniqueY = findUniqueY(yCIE);

  const uniqueColor = FEEDPOINT_COLOR.find(color => !existsInExistColor(color));

  return {
    x: xCIE,
    y: uniqueY,
    color: uniqueColor,
    phase: 0
  };

  function existsInExistColor(color) {
    return fP.some(existPoint => existPoint.color === color);
  }
  function existsInFeedPoint(x, y) {
    return fP.some(existPoint => existPoint.x === x && existPoint.y === y);
  }
  function findUniqueY(startY) {
    for (let tester = startY; tester < ynum; tester += INCREMENT) {
      if (!existsInFeedPoint(xCIE, tester)) {
        return tester;
      }
      if (tester >= ynum) return ynum - 1;
    }
    return ynum - 1;
  }
}
