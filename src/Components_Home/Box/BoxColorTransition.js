import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import './../../Components/SliderOverride.css';

const BoxWrapper = styled.div`
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
padding:10px 10px 6px 10px;
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
  color:#16191f;
  font-weight:500;
  font-family:times new roman,serif;
`
const GridColumn = styled.div`
padding:5px 20px 5px 20px;
box-sizing:border-box;
display:flex;
position:relative;
flex-direction:column;
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
padding:0px;
padding-bottom:2px;
line-height:20px;
cursor:grab;
`
const Label = styled.div`
  margin-left:5px;
  text-align:left;
  font-size:18px;
`

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
const TextRow = styled.div`
display:flex;
flex-direction:row;
`
const Text = styled.div`
font-size:18px;
margin:0;
padding:0;
`



const TransitionsWrapper = styled.div`
padding-top:2px;
display:flex;
flex-direction:column;
gap:2px;
`
const Transition = styled.div`
display:flex;
flex-direction:row;
`
const SVGWrapper = styled.div`
  height: 15px;
  flex-grow:1;
  margin-top: 2px;
  margin-bottom: 2px;
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
const RadioButton = styled.label`
  font-size: 15px;
  display:flex;
  position:relative;
`
const TransitionText = styled.div`
margin-top:-1px;
padding-right:3px;
width:auto;
white-space: nowrap;
font-size:14px;
`
export const BoxColorTransition = ({ color, setColor }) => {
  const timeoutIdRef = useRef();
  const [dispThreshold, setDispThreshold] = useState(0);//rc-sliderが少数点の値を扱えないため、colorThreshold*100したもの
  const [marks, setMarks] = useState({});
  const [thresholdMax, setThresholdMax] = useState(0);
  const [thresholdMin, setThresholdMin] = useState(0);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (color.colorTransitionIndex === undefined || color.colorThreshold === undefined) return;
    const { colorThreshold, colorTransitionIndex } = color;
    setDispThreshold(colorThreshold * 100);
    setSelectedIndex(colorTransitionIndex);
  }, [color])

  useEffect(() => {
    const obj=setInitialMarks(setThresholdMin,setThresholdMax);
    setMarks(obj);
  }, [])
  useEffect(() => {
    clearTimeout(timeoutIdRef.current);
    startTimer();
  }, [dispThreshold])

  const handleTimeout = () => {
    setColor({ ...color, colorThreshold: dispThreshold / 100 });
  };
  const handleSliderChanged = (newValue) => {
    setDispThreshold(newValue);
  };
  const startTimer = () => {
    timeoutIdRef.current = setTimeout(handleTimeout, 400);
  };

  const changeObjectIndex = (index) => {
    if (index === 0) setColor({ ...color, colorTransitionIndex: 0 });
    if (index === 1) setColor({ ...color, colorTransitionIndex: 1 });
  }
  const TransitionObject = [
    { label: "color transition1", imageSrc: `${process.env.PUBLIC_URL}/colorTransition1.png` },
    { label: "color transition2", imageSrc: `${process.env.PUBLIC_URL}/colorTransition2.png` }
  ];

  return (
    <BoxWrapper>
      <Front>
        <FrontHeader>
          <FrontHeaderInner>
            <FrontHeaderLeft>
              <TitleWrapper>
                <CustomH3>Color Threshold</CustomH3>
              </TitleWrapper>
            </FrontHeaderLeft>
          </FrontHeaderInner>
        </FrontHeader>

        <FrontBody>
          <ColumnLayout>
            <GridColumn>
              <TextRow>
                <Text style={{ fontSize: "13px", padding: "1px 7px 0px 0px" }}>threshold value: </Text>
                <Text>{dispThreshold / 100}</Text>
              </TextRow>
              <SliderWrapper>
                <Slider
                  value={dispThreshold}
                  min={thresholdMin}
                  max={thresholdMax}
                  step={null}
                  marks={marks}
                  onChange={handleSliderChanged}
                  railStyle={{ backgroundColor: '#ddd', borderRadius: "5px", height: "8px" }}
                  trackStyle={{ backgroundColor: 'rgb(60,60,235)', borderRadius: "5px", height: "8px" }}
                  handleStyle={{ fontSize: '18px' }}
                />
              </SliderWrapper>
              <TransitionsWrapper>
                {TransitionObject.map((item, index) => (
                  <Transition key={index} onClick={() => changeObjectIndex(index)}>
                    <RadioButton>
                      <input
                        type="radio"
                        checked={index === selectedIndex}
                        readOnly
                      />
                    </RadioButton>
                    <TransitionText>{item.label}</TransitionText>
                    <SVGWrapper>
                      <SVGInner>
                        <StyledImg
                          src={item.imageSrc}
                          alt="Decrement"
                        />
                      </SVGInner>
                    </SVGWrapper>
                  </Transition>
                ))}
              </TransitionsWrapper>
            </GridColumn>
          </ColumnLayout>
        </FrontBody>
      </Front>
    </BoxWrapper>
  )
};

const setInitialMarks = (setThresholdMin, setThresholdMax) => {
  const initialMarks = {};
  let i = 1;
  initialMarks[i] = '';
  setThresholdMin(i);
  for (i = 2.0; i <= 10; i += 2.0) {
    initialMarks[i] = ' ';
  }
  for (i = 10; i <= 50; i += 2.5) {
    if (i % 10 === 0) {
      initialMarks[i] = (i / 100).toString();
    } else {
      initialMarks[i] = ' ';
    }
  }
  setThresholdMax(i - 2.5);
  return initialMarks;
}