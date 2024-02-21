import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import './../../Components/SliderOverride.css';
import {
  Box, FrontHeader, FrontHeaderInner, TitleWrapper, CustomH3, FrontBody,
  ColumnLayout, GridColumn, FrontHeaderLeft,SVGInner,StyledImg,RadioButton,RadioButtonInput
} from './../../Components/StyledBoxComponents';

const SliderWrapper = styled.div`
padding:0px;
padding-bottom:2px;
line-height:20px;
cursor:grab;
`
const TextRow = styled.div`
display:flex;
flex-direction:row;
`
const Text = styled.div`
font-size:18px;
margin:0;
padding:0;
line-height:1.1;
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
  margin-right:-3px;
`;

const TransitionText = styled.div`
margin-top:0px;
padding-right:6px;
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
    const obj = setInitialMarks(setThresholdMin, setThresholdMax);
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
    { label: "色遷移1", imageSrc: `${process.env.PUBLIC_URL}/colorTransition1.png` },
    { label: "色遷移2", imageSrc: `${process.env.PUBLIC_URL}/colorTransition2.png` }
  ];

  return (
    <Box>
      <FrontHeader>
        <FrontHeaderInner>
          <FrontHeaderLeft>
            <TitleWrapper>
              <CustomH3>色閾値</CustomH3>
            </TitleWrapper>
          </FrontHeaderLeft>
        </FrontHeaderInner>
      </FrontHeader>

      <FrontBody>
        <ColumnLayout>
          <GridColumn>
            <TextRow>
              <Text style={{ fontSize: "14px", padding: "3px 7px 0px 0px" }}>色閾値: </Text>
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
            <TransitionsWrapper style={{marginLeft:"-5px"}}>
              {TransitionObject.map((item, index) => (
                <Transition key={index} onClick={() => changeObjectIndex(index)}>
                  <RadioButton>
                    <RadioButtonInput
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
    </Box>
  )
};

const setInitialMarks = (setThresholdMin, setThresholdMax) => {
  const initialMarks = {};
  let i = 2;
  initialMarks[i] = (i / 100).toString();

  setThresholdMin(i);
  for (i = 4; i <= 10; i += 2.0) {
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