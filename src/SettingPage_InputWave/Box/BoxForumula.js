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
padding:10px 20px 12px 20px;
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
  padding:10px 8px 5px 8px;
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
padding:4px 0px 5px 0px;
`
const FormulaLabel = styled.div`
  margin-left:5px;
  text-align:left;
  font-size:16px;
  display:flex;
justify-content:center;
align-items:center;
`
const Label = styled.div`
text-align:left;
font-size:14px;
margin:8px 0px 0px 7px;
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

const SVGWrapper = styled.div`
margin-left:20px;
  height: 40px;
  width: 280px;
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
const LabelRow = styled.div`
  display:flex;
  flex-direction:row;
  width:100%;
`
export const BoxFormula = ({}) => {

  return (
    <BoxWrapper>
      <Front>
        <FrontHeader>
          <FrontHeaderInner>
            <FrontHeaderLeft>
              <TitleWrapper>
                <CustomH3>入力波 数式</CustomH3>
              </TitleWrapper>
            </FrontHeaderLeft>
          </FrontHeaderInner>
        </FrontHeader>

        <FrontBody>
          <ColumnLayout>
            <GridColumn>
              <LabelRow>
                <FormulaLabel>正弦波 :</FormulaLabel>
                <SVGWrapper>
                  <SVGInner>
                    <StyledImg
                      src={`${process.env.PUBLIC_URL}/sineLaTeX.svg`}
                      alt="sine formula"
                    />
                  </SVGInner>
                </SVGWrapper>
              </LabelRow>

              <LabelRow>
                <FormulaLabel style={{ paddingTop: "22px" }}>ガウスパルス : </FormulaLabel>
                <SVGWrapper>
                  <SVGInner>
                    <StyledImg
                      src={`${process.env.PUBLIC_URL}/pulseLaTeX.svg`}
                      alt="pulse formula"
                    />
                  </SVGInner>
                </SVGWrapper>
              </LabelRow>
              <Label style={{fontSize:"14px"}}>x: シミュレーション回数</Label>
            </GridColumn>
          </ColumnLayout>
        </FrontBody>
      </Front>
    </BoxWrapper>
  )
};