import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import './../../Components/SliderOverride.css';
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
padding-top:16px;
padding:10px 20px 8px 20px;

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

const Button = styled.button`
background-color:rgb(255,255,255);
border-color:rgb(0,0,0);
border-style:solid;
border-width:1px;
border-radius:2px;
padding:0px 15px;
line-height:1.5;
display:flex;
justify-content:center;
&:hover {
  border-color:rgb(100,100,100);
  background-color:rgb(240,240,240);
}
cursor:pointer;
`
const ContentBodyRow = styled.div`
  margin-bottom:7px;
  position:relative;
  display: inline-block;
  display:flex;
  cursor:pointer;
`
const FrontHeaderLeft = styled.div`
line-height:none;
display:flex;
flex-direction:row;
`
const SliderWrapper = styled.div`
padding:4px 0px 5px 0px;
margin-bottom:20px;
`
const Label = styled.div`
  margin-left:5px;
  text-align:left;
  font-size:16px;
`
const RadioButton = styled.label`
  font-size: 15px;
  display:flex;
  position:relative;
`
export const BoxInputWave = ({ setting, setSetting, amplitudeScaler, setAmplitudeScaler, setShowWindow }) => {
  const timeoutIdRef = useRef();
  const [dispLambda, setDispLambda] = useState(0);//rc-sliderが少数点の値を扱えないため、d*100したもの
  const [marks, setMarks] = useState({});
  const [lambdaMax, setLambdaMax] = useState(0);
  const [lambdaMin, setLambdaMin] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    const { fieldX, split, lambda } = setting;
    if (lambda === undefined) return;
    setDispLambda(lambda);
    const initialMarks = calculateMarks(fieldX, split,setLambdaMin,setLambdaMax);
    setMarks(initialMarks);

    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, [setting]);
  useEffect(() => {
    clearTimeout(timeoutIdRef.current);
    startTimer();
  }, [dispLambda])
  useEffect(() => {
    if (amplitudeScaler.Select === "Rise") setSelectedIndex(0);
    if (amplitudeScaler.Select === "Pulse") setSelectedIndex(1);
  }, [amplitudeScaler])
  const handleSliderChanged = (newValue) => {
    setDispLambda(newValue);
  };

  const handleTimeout = () => {
    setSetting({ ...setting, lambda: dispLambda});
  };

  const startTimer = () => {
    timeoutIdRef.current = setTimeout(handleTimeout, 300);
  };

  const changeObjectIndex = (index) => {
    if (index === 0) setAmplitudeScaler({ ...amplitudeScaler, Select: "Rise" });
    if (index === 1) setAmplitudeScaler({ ...amplitudeScaler, Select: "Pulse" });
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
                    <CustomH3 style={{ margin: 0 }}>波長と波形の選択</CustomH3>
                  </TitleWrapper>
                  <Button><SpanText onClick={() => { setShowWindow("settingInputWave") }}>カスタム設定</SpanText></Button>
                </FrontHeaderLeft>
              </FrontHeaderInner>
            </FrontHeader>

            <FrontBody>
              <ColumnLayout>
                <GridColumn>

                  <ColumnTitle style={{ fontFamily: "serif" }}>
                    波長[λ] : {getStrLambda(dispLambda)}
                  </ColumnTitle>
                  <SliderWrapper>
                    <Slider
                      value={dispLambda}
                      min={lambdaMin}
                      max={lambdaMax}
                      step={null}
                      marks={marks}
                      onChange={handleSliderChanged}
                      railStyle={{ backgroundColor: '#ddd', borderRadius: "5px", height: "10px" }}
                      trackStyle={{ backgroundColor: 'rgb(60,60,235)', borderRadius: "5px", height: "10px" }}
                      handleStyle={{ fontSize: '18px' }}
                    />
                  </SliderWrapper>
                  <ContentBodyRow onClick={() => changeObjectIndex(0)}>
                    <RadioButton>
                      <input
                        type="radio"
                        checked={selectedIndex === 0}
                        readOnly
                      />
                    </RadioButton>
                    <Label>正弦波</Label>
                  </ContentBodyRow>
                  <ContentBodyRow onClick={() => changeObjectIndex(1)}>
                    <RadioButton>
                      <input
                        type="radio"
                        checked={selectedIndex === 1}
                        readOnly
                      />
                    </RadioButton>
                    <Label>ガウスパルス</Label>
                  </ContentBodyRow>
                </GridColumn>
              </ColumnLayout>
            </FrontBody>
          </Front>
        </Content>
      </MainContentWrapper>
    </div>
  )
};
function roundToFourSignificantFigures(num) {
  if (num === 0) {
    return 0; // 0は特別に扱う
  }
  let d = Math.ceil(Math.log10(num < 0 ? -num : num)); // 数の大きさの桁数を求める
  let power = 4 - d; // 4桁の有効数字になるように桁を調整
  let magnitude = Math.pow(10, power);
  let shifted = Math.round(num * magnitude);
  return shifted / magnitude;
}
const calculateMarks = (fieldX, split,setLambdaMin,setLambdaMax) => {
  const initialMarks = {};
  const minlambdaOverDx = 10;
  const maxlambdaOverDx = 40;
  const numSliderSteps = 20;
  let start = roundToFourSignificantFigures(minlambdaOverDx * fieldX / split);
  let end = roundToFourSignificantFigures(maxlambdaOverDx * fieldX / split);
  let increment = roundToFourSignificantFigures(((maxlambdaOverDx - minlambdaOverDx) * fieldX / split) / numSliderSteps);
  let i;
  for (i = start; i <= end; i = roundToFourSignificantFigures(i + increment)) {
    // 繰り返し処理の中でiを有効数字4桁に丸め、それをキーとして使用
    initialMarks[i] = ' ';
  }
  setLambdaMin(roundToFourSignificantFigures(start));
  setLambdaMax(i-2*increment);
  return initialMarks;
};

const getStrLambda = (lambdaValue) => {
  let value;let unit;
  if (lambdaValue > 1) {
    value = lambdaValue.toFixed(2);
    unit = 'm';
  } else if (lambdaValue > 0.001) {
    value = (lambdaValue * 1000).toFixed(2);
    unit = 'mm';
  } else if (lambdaValue > 0.000001) {
    value = (lambdaValue * 1000000).toFixed(2);
    unit = 'µm';
  } else if (lambdaValue > 0.000000001) {
    value = (lambdaValue * 1000000000).toFixed(2);
    unit = 'nm';
  } else {
    value = (lambdaValue * 1000000000).toFixed(2);
    unit = 'nm';
  }
  return value+" "+unit;
};