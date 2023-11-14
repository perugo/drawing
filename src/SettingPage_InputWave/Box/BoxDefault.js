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
 padding:5px 20px 8px 20px;
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
  padding:10px 8px 10px 8px;
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
const ContentBodyColumn = styled.div`
  margin-bottom:4px;
  position:relative;
  display: inline-block;
  display:flex;
  flex-direction:column;
`
const FrontHeaderLeft = styled.div`
line-height:none;
display:flex;
flex-direction:row;
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
margin-left:5px;
text-align:left;
font-size:15px;
`

const JustFlexRow = styled.div`
display:flex;
flex-direction:row;
`
export const BoxDefault = ({ defaultSetting: { lambda }, defaultAmplitudeScaler: { Rise: { slope, shift }, Pulse: { peakPosition, widthFactor }, simulationNum } }) => {

  return (
    <BoxWrapper>
      <Front>
        <FrontHeader>
          <FrontHeaderInner>
            <FrontHeaderLeft>
              <TitleWrapper>
                <CustomH3>Initial Settings</CustomH3>
              </TitleWrapper>

            </FrontHeaderLeft>
          </FrontHeaderInner>
        </FrontHeader>

        <FrontBody>
          <ColumnLayout>
            <GridColumn>
              <ContentBodyColumn>
                <Label>Maximum Number of Simulations: {simulationNum}</Label>
                <Label>Wavelength[m]: {lambda}</Label>
              </ContentBodyColumn>
              <ContentBodyColumn>
                <div>
                  <JustFlexRow>
                    <Label>Sine Wave Settings : </Label>
                    <Label>slope: {slope}</Label>
                  </JustFlexRow>
                  <JustFlexRow>
                    <Label style={{ visibility: "hidden" }}>Sine Wave Settings : </Label>
                    <Label>shift: {shift}</Label>
                  </JustFlexRow>
                </div>
                <div>
                  <JustFlexRow>
                    <Label>Gaussian Pulse Settings : </Label>
                    <Label>peakPosition: {peakPosition}</Label>
                  </JustFlexRow>
                  <JustFlexRow>
                    <Label style={{ visibility: "hidden" }}>Gaussian Pulse Settings : </Label>
                    <Label>widthFactor: {widthFactor}</Label>
                  </JustFlexRow>
                </div>
              </ContentBodyColumn>
            </GridColumn>
          </ColumnLayout>
        </FrontBody>
      </Front>
    </BoxWrapper>
  )
};