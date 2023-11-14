import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';

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
 padding:6px 20px 3px 20px;
 box-sizing:border-box;
 border:none;
 line-height 22px;
 tex-align:left;
`
const TitleWrapper = styled.div`
flex-wrap:wrap;
justify-content:space-between;
display:flex;
align-content:center;
font-size:18px;
min-width:0;
color:#16191f;
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
  padding:7px 10px 5px 10px;
  box-sizing:border-box;
  display:flex;
  position:relative;
  flex-direction:column;
`

const FrontHeaderLeft = styled.div`
line-height:none;
display:flex;
flex-direction:row;
`
const ButtonSmallWrapper = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
`
const ButtonSmall = styled.div`
  backface-visibility: hidden;
  background-color:rgb(255,153,0);
  border: 0;
  box-sizing: border-box;
  color:rgb(0,0,0);
  cursor: pointer;
  display: inline-block;
  font-family:sans-serif,Arial, Helvetica,Circular,Helvetica,sans-serif;
  font-weight: 500;
  font-size:16px;
  line-height:1.6;
  position: relative;
  text-align: left;
  text-decoration: none;
  letter-spacing:.25px;
  border-radius:4px;
  padding: 0px 13px;
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
const MediumSettingWrapper = styled.div`
  position:relative;
  display:flex;
  flex-direction:column;
  width:100%;
  width:100%;
  height:fit-content;
`
const ContentBodyRow = styled.div`
  margin-bottom:2px;
  position:relative;
  display: inline-block;
  display:flex;
`
const MediumColorIcon = styled.div`
  width:25px;
  height:20px;
  margin-top:3px;
  margin-bottom:3px;
  margin:3px 3px 3px 3px;
  border:1px solid black;
  background-color: ${({ color }) => color};
`
const SectionColumn = styled.div`
  flex: 1;              // This ensures all children take equal width
  display:flex;
  flex-direction:column;
  height: 100%;
  align-items: center;
`
const RadioButton = styled.label`
  font-size: 15px;
  display:flex;
  position:relative;
`
const Label = styled.div`
  width:100%;
  text-align:right;
  font-size:13px;
`
const SVGWrapper = styled.div`
  padding-left:30px;
  height: 17px;
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

const LabelCell = styled.div`
  flex: 1;              // This ensures all children take equal width
  height: 100%;
  position:relative;
  -webkit-box-align: center;
  margin-right:5px;
  align-items: center; /* This is for vertical centering when the parent is a flex container */
`
const LabelRow = styled.div`
  display:flex;
  flex-direction:row;
  width:100%;
`
const Mantissa = styled.span`
  font-size: 18px;
`
const MantissaWrapper = styled.div`
  display:flex;
  flex-direction:column-reverse;
`
const Exponent = styled.sup`
  font-size: 14px;
  vertical-align: super;
  margin-top:2px;
`;
const Exponential = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-end;
  vertical-align:bottom;
  height:100%;
  width:100%;
`

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

const MEDIUM_COLOR = ['rgb(255,255,255)', 'rgb(0,0,0)', 'rgb(0,0,200)', 'rgb(0,255,0)', 'rgb(255,255,0)'];
export const BoxMedium = ({ medium, selectedIndex, setSelectedIndex, setShowWindow, clearBitmap }) => {
  const [dispmedium, setDispMedium] = useState([]);

  useEffect(() => {
    if (!checker_MEDIUMARRAY) return;
    const stringMediumArray = medium.map(item => ({
      DielectricConstant: convertToExponential(item.DielectricConstant),
      DielectricLoss: convertToExponential(item.DielectricLoss),
      MagneticConstant: convertToExponential(item.MagneticConstant),
      MagneticLoss: convertToExponential(item.MagneticLoss)
    }));
    setDispMedium(stringMediumArray);
  }, [medium]);

  function changeObjectIndex(index) {
    setSelectedIndex(index);
  }
  const SECTIONS = [
    { label: 'DielectricConstant', imgSrc: '/epsilondash.svg', altText: 'Epsilon Dash Icon', },
    { label: 'DielectricLoss', imgSrc: '/epsilondash2.svg', altText: 'Epsilon Dash 2 Icon', },
    { label: 'MagneticConstant', imgSrc: '/mudash.svg', altText: 'Mu Dash Icon', },
    { label: 'MagneticLoss', imgSrc: '/mudash2.svg', altText: 'Mu Dash 2 Icon', },
  ];
  const ExponentialCell = ({ mantissa, exponent }) => (
    <LabelCell>
      <Exponential>
        <MantissaWrapper>
          <Mantissa>{mantissa}</Mantissa>
        </MantissaWrapper>
        <Exponent>{exponent}</Exponent>
      </Exponential>
    </LabelCell>
  );

  return (
    <BoxWrapper>
      <Front>
        <FrontHeader>
          <FrontHeaderInner>
            <FrontHeaderLeft>
              <TitleWrapper>
                <CustomH3>Medium</CustomH3>
              </TitleWrapper>
            </FrontHeaderLeft>
            <Button style={{marginLeft:"30px"}}>
              <SpanText onClick={() => setShowWindow("settingMedium")}>Add</SpanText>
            </Button>
            <ButtonSmallWrapper style={{ marginLeft: "30px" }}>
              <ButtonSmall onClick={() => clearBitmap()}>Clear</ButtonSmall>
            </ButtonSmallWrapper>

          </FrontHeaderInner>
        </FrontHeader>

        <FrontBody>
          <ColumnLayout>
            <GridColumn>
              <MediumSettingWrapper>
                <ContentBodyRow>
                  <RadioButton>
                    <input type="radio" style={{ visibility: "hidden" }} readOnly />
                  </RadioButton>
                  <MediumColorIcon color={'white'} style={{ border: '0px solid white' }}></MediumColorIcon>
                  <LabelRow>
                    {SECTIONS.map((section, index) => (
                      <SectionColumn key={index}>
                        <Label>{section.label}</Label>
                        <SVGWrapper>
                          <SVGInner>
                            <StyledImg
                              src={`${process.env.PUBLIC_URL}${section.imgSrc}`}
                              alt={section.altText}
                            />
                          </SVGInner>
                        </SVGWrapper>
                      </SectionColumn>
                    ))}
                  </LabelRow>
                </ContentBodyRow>
                {Array.isArray(dispmedium) && (dispmedium.map((column, index) => (
                  <ContentBodyRow key={index} onClick={() => changeObjectIndex(index)}>
                    <RadioButton>
                      <input
                        type="radio"
                        checked={selectedIndex === index}
                        readOnly
                      />
                    </RadioButton>
                    <MediumColorIcon color={MEDIUM_COLOR[index]}></MediumColorIcon>
                    <LabelRow>
                      <ExponentialCell {...column.DielectricConstant} />
                      <ExponentialCell {...column.DielectricLoss} />
                      <ExponentialCell {...column.MagneticConstant} />
                      <ExponentialCell {...column.MagneticLoss} />
                    </LabelRow>
                  </ContentBodyRow>
                )))}
              </MediumSettingWrapper>
            </GridColumn>
          </ColumnLayout>
        </FrontBody>
      </Front>
    </BoxWrapper>
  )
};
const convertToExponential = (num) => {
  if (Number.isInteger(num) && num >= 0 && num <= 100) {
    return {
      mantissa: num.toString(),
      exponent: "",
    };
  }
  const absoluteNumber = Math.abs(num);
  // 指数を計算
  const exponent = Math.floor(Math.log10(absoluteNumber));
  // 仮数を計算
  let mantissa = absoluteNumber / Math.pow(10, exponent);
  // 有効数字を取得（最大5桁）
  const yukosuji = get_yukosuji(mantissa, 4);
  mantissa = formatMantissa(mantissa, yukosuji);
  var str_mantissa = mantissa;
  var str_exponent = exponent.toString();
  if (exponent !== 0) { str_mantissa = mantissa + " ×10"; }
  if (exponent === 0) str_exponent = "";
  return {
    mantissa: str_mantissa,
    exponent: str_exponent
  };
};
function get_yukosuji(number, limit) {
  let strNum = number.toString();
  // 左端から連続する"0"と"."を取り除く
  strNum = strNum.replace(/^0+\.?/, '');
  // 右端から連続する"0"を取り除く（ただし整数部分の0は取り除かない）
  if (strNum.includes('.')) {
    strNum = strNum.replace(/0+$/, '');
  }
  // '.' を除外する
  strNum = strNum.replace('.', '');
  return Math.min(strNum.length, limit);
}

const formatMantissa = (mantissa, yukosuji) => {
  const parts = mantissa.toString().split(".");
  let result = parts[0];

  if (parts.length > 1) {
    const neededLength = yukosuji - parts[0].length;
    result += "." + parts[1].slice(0, neededLength);
  }

  return result;
};
function checker_MEDIUMARRAY(obj1) {
  if (!obj1) return false;
  const fields = ['DielectricConstant', 'DielectricLoss', 'MagneticConstant', 'MagneticLoss'];
  if (fields.every(field => obj1[0].hasOwnProperty(field))) {
    return true;
  } else {
    return false;
  }
}