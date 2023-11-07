import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import 'rc-slider/assets/index.css';
const MainContentWrapper = styled.div`
`
const Content = styled.div`
flex-direction:column;
display:flex;
`

const Front = styled.div`
border-radius: 5px;
overflow: hidden;
  box-sizing:border-box;
  background-color: rgb(255,255,255);
  border-spacing:0;
  cursor:auto;
  direction 1tr;
  empty-cells:show;
  hyphens:none;
  tab-size:8;
  text-align:left;
  text-indent:0;
  text-transform:none;
  widows:2;
  word-spacing:normal;
  font-weight:400;
  -webkit-font-smoothing:auto;
  word-break:bread-word;
  display:block;
  position:relative;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  &::before{
    content:"";
    position:absolute;
    left:0px;
    width:100%;
    height:100%;
    pointer-events:none;
    box-sizing:border-box;
    border-top: 1px solid #eaeded;
    z-index:1;
  }
  &::after{
    content:"";
    position:absolute;
    left:0px;
    top:0px;
    width:100%;
    height:100%;
    pointer-events:none;
    box-sizing:border-box;
    box-shadow:0 1px 1px 0 rgba(0,28,36,0,3) 1px 1px 1px 1px 0 rgba(0,28,36,0.15), -1px 1px 1px 0 rgba(0,28,36,0.15);
    mix-blend-mode:multiply;
  }

`



const FrontHeader = styled.div`
  border-bottom:1px solid #eaeded;
`
const FrontHeaderInner = styled.div`
 width:100%;
 background-color: rgb(246,246,246);
 display:flex;
 padding:3px 20px 2px 20px;
 box-sizing:border-box;
 border:none;
 line-height 22px;
 tex-align:left;
 justify-content:space-between;
`
const TitleWrapper = styled.div`
flex-wrap:wrap;
justify-content:space-between;
display:flex;
align-content:center;
font-size:18px;
min-width:0;
color:#16191f;
margin-right:30px;
`
const CustomH3 = styled.span`
 font-size:18px;
 font-weight:500;
 font-family:Arial,sans-serif, Helvetica,Circular;
 -webkit-font-smoothing:auto;
 display:inline;
 margin-right:8px;
 margin:0px;
 color:rgb(40,40,40);
`


const FrontBody = styled.div`
position:relative;
padding:10px 10px 12px 10px;

`
const FrontBodyInner = styled.div`
position:relative;
  cursor:pointer;
  display:flex;
  padding: 12px 20px 12px 20px;
  border:none;
  line-height:22px;
  text-align:left;
  background-color:#ddd;
`

const ColumnLayout = styled.div`
  margin:-10px;
  display:flex;
  flex-wrap:wrap;
  color::#16191f;
  box-sizing:border-box;
  border-collapse:separete;
  direction:1tr;
  flex-direction:column;


  cursor:auto;
  direction:1tr;
  text-align:left;
  font-size:18px;
  line-height:20px;
  color:#16191f;
  font-weight:500;
  font-family:times new roman,serif;
`
const GridColumn = styled.div`
  padding:10px 10px 5px 10px;
  box-sizing:border-box;
  display:flex;
  position:relative;
  flex-direction:column;
`
const ColumnTitle = styled.div`
  font-size:16px;
  font-weight:500;
  line-height:1.2;
  color:rgb(100,100,100);
  margin-bottom:2px;
  font-family:times new roman,serif;
  font-family:"times new roman", serif;
`
//,"Helvetica Neue",Roboto,Arial,sans-serif
const SpanText = styled.span`
font-size:15px;
font-weight:500;
line-height:22px;
color:rgb(40,40,40);
margin-bottom:2px;
`
const ButtonWrapperRight = styled.div`
display: flex;
`
const Button = styled.button`
background-color:rgb(255,255,255);
border-color:rgb(0,0,0);
border-style:solid;
border-width:1px;
border-radius:3px;
padding:0px 15px;
line-height:1.5;
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
const MediumColorIcon = styled.div`
  width:20px;
  height:18px;
  margin:2px 3px 1px 3px;
  border:1px solid black;
`
const ContentBodyRow = styled.div`
  margin-bottom:7px;
  position:relative;
  display: inline-block;
  display:flex;
`
const FrontHeaderLeft = styled.div`
line-height:none;
display:flex;
flex-direction:row;
`
const SliderWrapper = styled.div`
padding:10px 0px 10px 0px;
margin-bottom:20px;
`
const Label = styled.div`
  margin-left:15px;
  text-align:left;
  font-size:18px;
`
const RadioButton = styled.label`
  font-size: 15px;
  display:flex;
  position:relative;
`
const FeedPointGridArray = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  margin:auto;
`
const FeedPointItem = styled.div`
  display:flex;
  flex-direction:row;
`
const SVGWrapper = styled.div`
  height: 20px;
  width: 26px;
  margin-top: 2px;
  margin-bottom: 2px;
  display: flex;
`;
const SVGInner = styled.div`
  position: relative;
  width: inherit;
  height: inherit;
  margin: auto;
`;
const StyledImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2; // Ensure the image is always on top
`;
const ButtonDownloadWrapper = styled.div`
text-align: center;
`
const ButtonDownload = styled.div`
backface-visibility: hidden;
background-color:rgb(255,153,0);
border: 0;
box-sizing: border-box;
color:rgb(0,0,0);
cursor: pointer;
display: inline-block;
font-family: Circular,Helvetica,sans-serif;
font-weight: 500;
line-height: 1.6;
padding:0px 15px;
border-radius:3px;
margin:0px 0px 0px 0px;
position: relative;
text-align: left;
text-decoration: none;
transition: transform .2s;
user-select: none;
-webkit-user-select: none;
touch-action: manipulation;

&:hover{
  background-color:rgb(236,114,17);
}
&:active{
  background-color:#EB5F07;
}
`
const InputText = styled.input`
  width:50px;
  text-align:right;
  box-sizing: border-box;
  font-size:16px;
  padding:2px;
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
var xnum;
var ynum;
export const BoxFeedPoint = ({ setting, feedPoint, setFeedPoint }) => {
  const [strFeedPoint, setStrFeedPoint] = useState([]);
  const [hoveredItemId, setHoveredItemId] = useState(-1);
  const timeoutIdRef = useRef();

  useEffect(() => {
    if (!feedPoint || feedPoint.length === 0) return;
    const stringFeedPoint = feedPoint.map(item => ({
      x: item.x.toString(),
      y: item.y.toString(),
      color: item.color,
      phase: item.phase.toString()
    }));
    setStrFeedPoint(stringFeedPoint);
    //console.log(feedPoint);
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
    timeoutIdRef.current = setTimeout(handleSetFeedPointTimeout, 1500);
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
  return (
    <div>
      <MainContentWrapper>
        <Content>
          <Front>
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
                        <Label>x : </Label>
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
                        <Label>y : </Label>
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
                        <Label style={{ paddingTop: "2px" }}>θ[deg] : </Label>
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
                      </FeedPointItem>
                    )))}
                    <FeedButtonItem>

                      {strFeedPoint.length !== 8 && (
                        <Button onClick={addFeedPoint}>
                          <SpanText >波源の追加</SpanText>
                        </Button>
                      )}
                      {strFeedPoint.length >= 3 && (
                        <Button style={{ marginLeft: "10px" }} onClick={() => onClickFormLine()}>
                          <MediumColorIcon style={{ backgroundColor: "red" }} />
                          <SpanText>と</SpanText>
                          <MediumColorIcon style={{ backgroundColor: strFeedPoint[1].color }}></MediumColorIcon>
                          <SpanText >のように整列する</SpanText>
                        </Button>
                      )}
                    </FeedButtonItem>

                  </FeedPointGridArray>
                </GridColumn>
              </ColumnLayout>
            </FrontBody>
          </Front>
        </Content>
      </MainContentWrapper>
    </div>
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
  const deltaPhase=secondPoint.phase-firstPoint.phase;

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
      const newPhase=(firstPoint.phase+deltaPhase*index)%360;
      return {
        ...point,
        x: newX,
        y: newY,
        phase:newPhase
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