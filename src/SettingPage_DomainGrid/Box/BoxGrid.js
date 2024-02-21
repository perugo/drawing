import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

import './../../Components/SliderOverride.css';
import {
  Box, FrontHeader, FrontHeaderInner, TitleWrapper, CustomH3, FrontBody,
  ColumnLayout, GridColumn, FrontHeaderLeft, SliderWrapper
} from './../../Components/StyledBoxComponents';

const ColumnTitle = styled.div`
  font-size:14px;
  font-weight:500;
  line-height:1.2;
  color:rgb(0,0,0);
  margin-bottom:2px;
  font-family:times new roman,serif;
  font-family:"times new roman", serif;
`

export const BoxGrid = ({ setting, setSetting }) => {
  const timeoutIdRef = useRef();
  const [split, setSplit] = useState(0);//rc-sliderが少数点の値を扱えないため、d*100したもの
  const [marks, setMarks] = useState({});
  const [splitMin, setSplitMin] = useState(0);
  const [splitMax, setSplitMax] = useState(0);
  useEffect(()=>{
    const initialMarks = calculateMarks(setSplitMin, setSplitMax);
    setMarks(initialMarks);
  },[])
  useEffect(() => {
    if (!checker_SETTING(setting)) return;
    const { split: firstSplit } = setting;
    setSplit(firstSplit);
  }, [setting]);
  useEffect(() => {
    clearTimeout(timeoutIdRef.current);
    startTimer();
  }, [split])

  const handleSliderChanged = (newValue) => {
    setSplit(newValue);
  };

  const handleTimeout = () => {
    setSetting({ ...setting, split: split });
  };

  const startTimer = () => {
    timeoutIdRef.current = setTimeout(handleTimeout, 300);
  };
  return (
    <Box>
      <FrontHeader>
        <FrontHeaderInner style={{ padding: "3px 20px 2px 20px" }}>
          <FrontHeaderLeft>
            <TitleWrapper>
              <CustomH3>ｘ軸の分割数</CustomH3>
            </TitleWrapper>
          </FrontHeaderLeft>
        </FrontHeaderInner>
      </FrontHeader>

      <FrontBody>
        <ColumnLayout>
          <GridColumn>

            <ColumnTitle >
              x軸の分割数 : {split}
            </ColumnTitle>
            <SliderWrapper>
              <Slider
                value={split}
                min={splitMin}
                max={splitMax}
                step={null}
                marks={marks}
                onChange={handleSliderChanged}
                railStyle={{ backgroundColor: '#ddd', borderRadius: "5px", height: "10px" }}
                trackStyle={{ backgroundColor: 'rgb(60,60,235)', borderRadius: "5px", height: "10px" }}
                handleStyle={{ fontSize: '18px' }}
              />
            </SliderWrapper>

          </GridColumn>
        </ColumnLayout>
      </FrontBody>
    </Box>
  )
};

const calculateMarks = (setSplitMin, setSplitMax) => {
  const initialMarks = {};
  let start = 80;
  let end = 500;
  let increment = 20;
  let i;
  for (i = start; i <= end; i = (i + increment)) {
    initialMarks[i] = ' ';
  }
  setSplitMin(start);
  setSplitMax(end);
  return initialMarks;
};

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