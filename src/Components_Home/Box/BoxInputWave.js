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
padding:0px;
padding-bottom:2px;
line-height:20px;
cursor:grab;
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
const TextRow = styled.div`
display:flex;
flex-direction:row;
align-items:center;
`
const Text = styled.div`
font-size:18px;
margin:0;
padding:0;
`
const FreeSpaceTextWrapper = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  height:100%;
  margin-left:auto;
  font-size:12px;
`
//  align-item:center;
const FreeSpaceText=styled.div`
justify-content:center;

`
export const BoxInputWave = ({ setting, setSetting, amplitudeScaler, setAmplitudeScaler, setShowWindow }) => {
  const timeoutIdRef = useRef();
  const reserveIdRef = useRef(null);
  const [dispFreq, setDispFreq] = useState(setting.feq);//rc-sliderが少数点の値を扱えないため、d*100したもの
  const [marks, setMarks] = useState({});
  const [freqMax, setFreqMax] = useState(0);
  const [freqMin, setFreqMin] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const prevSettingRef = useRef(null);
  useEffect(() => {
    if (!checker_SETTING(setting)) return;
    if (checker_NOCHANGE(setting, prevSettingRef.current)) return;
    if (compare_ONLYFREQCHANGE(setting, prevSettingRef.current)) {
      const { freq } = setting;
      setDispFreq(freq);
    } else {
      const { fieldX, split, freq: freq } = setting;
      const initialMarks = calculateMarks(fieldX, split, setFreqMin, setFreqMax);
      setMarks(initialMarks);
      setDispFreq(freq);

    }
    prevSettingRef.current = setting;
    return () => {
      clearTimeout(reserveIdRef.current);
    };
  }, [setting]);
  useEffect(() => {
    if (reserveIdRef.current) {
      clearTimeout(reserveIdRef.current);
    }
    reserveIdRef.current = setTimeout(() => {
      setSetting({ ...setting, freq: dispFreq });
      reserveIdRef.current = null;
    }, 600);

    if (timeoutIdRef.current) return;
    setSetting({ ...setting, freq: dispFreq });
    timeoutIdRef.current = setTimeout(() => {
      timeoutIdRef.current = null;
    }, 100);

    return () => {
      if (reserveIdRef.current) {
        clearTimeout(reserveIdRef.current)
      }
    };
  }, [dispFreq])
  useEffect(() => {
    if (amplitudeScaler.Select === "Rise") setSelectedIndex(0);
    if (amplitudeScaler.Select === "Pulse") setSelectedIndex(1);
  }, [amplitudeScaler])
  const handleSliderChanged = (newValue) => {
    setDispFreq(newValue);
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
                    <CustomH3 style={{ margin: 0 }}>Frequency and WaveForm</CustomH3>
                  </TitleWrapper>
                  <Button><SpanText onClick={() => { setShowWindow("settingInputWave") }}>Setting</SpanText></Button>
                </FrontHeaderLeft>
              </FrontHeaderInner>
            </FrontHeader>

            <FrontBody>
              <ColumnLayout>
                <GridColumn>
                  <TextRow>
                    <Text style={{ fontSize: "13px",paddingBottom:"3px",alignSelf: "flex-end" }}>frequency[Hz]: </Text>
                    <Text>{getStrFreq(dispFreq, 2)}</Text>
                    <FreeSpaceTextWrapper><FreeSpaceText>free space WaveLength: {getStrLambda(dispFreq,1)}</FreeSpaceText></FreeSpaceTextWrapper>
                  </TextRow>
                  <SliderWrapper>
                    <Slider
                      value={dispFreq}
                      min={freqMin}
                      max={freqMax}
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
                    <Label>Sine Wave</Label>
                  </ContentBodyRow>
                  <ContentBodyRow onClick={() => changeObjectIndex(1)}>
                    <RadioButton>
                      <input
                        type="radio"
                        checked={selectedIndex === 1}
                        readOnly
                      />
                    </RadioButton>
                    <Label>modulated Gaussian</Label>
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
//  SETTING: { fieldX: 0.048, fieldY: 0.036, split: 200, lambda: 0.0042 },
const freeSpaceLambda=(value)=>{

}
function checker_SETTING(obj) {
  if (!obj) return false;
  const requiredFields = {
    fieldX: (data) => typeof data === 'number',
    fieldY: (data) => typeof data === 'number',
    split: (data) => typeof data === 'number',
    freq: (data) => typeof data === 'number',
  }
  return Object.keys(requiredFields).every(key => requiredFields[key](obj[key]));
}
function checker_NOCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const settingFields = ['fieldX', 'fieldY', 'split', 'freq'];
  if (fieldsMatch(obj1, obj2, settingFields)) return true;
  return false;
}
function compare_ONLYFREQCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const samesettingFields = ['fieldX', 'fieldY', 'split'];
  if (!fieldsMatch(obj1, obj2, samesettingFields)) return false;
  return obj1.freq !== obj2.freq;
}
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
const calculateMarks = (fieldX, split, setFreqMin, setFreqMax) => {
  const initialMarks = {};
  const minlambdaOverDx = 10;
  const maxlambdaOverDx = 40;
  const numSliderSteps = 20;

  const freqStart = 3e8 / (minlambdaOverDx * fieldX / split);
  let start = roundToFourSignificantFigures(freqStart);
  const freqEnd = 3e8 / (maxlambdaOverDx * fieldX / split);
  let end = roundToFourSignificantFigures(freqEnd);
  const freqIncrement = (freqStart - freqEnd) / numSliderSteps;
  let increment = roundToFourSignificantFigures(freqIncrement);
  let i;
  let index = 0;

  //console.log("start: " + start / 1e9 + "  end: " + end / 1e9 + " increment: " + increment / 1e9);
  for (i = end; i <= start; i = roundToFourSignificantFigures(i + increment)) {
    // 繰り返し処理の中でiを有効数字4桁に丸め、それをキーとして使用
    //console.log("i:" + i / 1e9);
    if (index % 5 === 0) {
      initialMarks[i] = getStrFreq(i, 1);
    } else {
      initialMarks[i] = ' ';
    }
    index += 1;

  }
  setFreqMin(roundToFourSignificantFigures(end));
  setFreqMax(i - increment);

  return initialMarks;
};
function fieldsMatch(obj1, obj2, fields) {
  return fields.every(field => obj1[field] === obj2[field]);
}

const getStrFreq = (freqValue, fixed) => {
  let value; let unit;
  if (freqValue < 1e3) {
    value = freqValue.toFixed(fixed);
    unit = 'Hz';
  } else if (freqValue < 1e6) {
    value = (freqValue * 1e-3).toFixed(fixed);
    unit = 'kHz';
  } else if (freqValue < 1e9) {
    value = (freqValue * 1e-6).toFixed(fixed);
    unit = 'MHz';
  } else if (freqValue < 1e12) {
    value = (freqValue * 1e-9).toFixed(fixed);
    unit = 'GHz';
  } else if (freqValue < 1e15) {
    value = (freqValue * 1e-12).toFixed(fixed);
    unit = 'THz';
  }
  return value + " " + unit;
};
const getStrLambda = (freqValue, fixed) => {

  let value; let unit;
  let lambda=3e8/freqValue;

  if (lambda > 1) {
    value = lambda.toFixed(fixed);
    unit = 'm';
  } else if (lambda > 1e-3) {
    value = (lambda * 1e3).toFixed(fixed);
    unit = 'mm';
  } else if (lambda < 1e-6) {
    value = (lambda * 1e6).toFixed(fixed);
    unit = 'um';
  } else if (lambda < 1e9) {
    value = (lambda * 1e-9).toFixed(fixed);
    unit = 'pm';
  } else if (lambda < 1e12) {
    value = (lambda * 1e-12).toFixed(fixed);
    unit = 'fm';
  }else{
    value = lambda.toFixed(fixed);
    unit = 'm';
  }
  return value + " " + unit;
};