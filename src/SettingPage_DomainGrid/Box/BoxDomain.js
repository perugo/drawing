import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import {
  validateInput,
  handleKeyDown,
  updateStringStates,
  isStateComplete,
  isValidNumber
} from './BoxDomain_helper';
import Select from 'react-select'
import './../../Components/reactSelect.css';
import {
  Box, FrontHeader, FrontHeaderInner, TitleWrapper, CustomH3, FrontBody,
  ColumnLayout, GridColumn, FrontHeaderLeft, customStyles
} from './../../Components/StyledBoxComponents';


const InputText = styled.input`
width:140px;
  text-align: right;
  box-sizing: border-box;
  font-size: 15px;
  padding: 4px;
  border: 1px solid #ccc;
`
const InputItemGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
`
const JustFlexRow = styled.div`
display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2px;
`
const SmallLabel = styled.div`
  width:100px;
  font-size:14px;
  text-align:left;
`;
const InputItemGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`
const meterOptions = [
  { value: 0, label: 'm' },
  { value: 3, label: 'mm' },
  { value: 6, label: 'um' },
  { value: 9, label: 'nm' },
  { value: 12, label: 'pm' },
]
export const BoxDomain = ({
  setting, setSetting
}) => {
  const [strField, setStrField] = useState({});
  const timeoutIdRef = useRef();
  const [meterExponent, setMeterExponent] = useState(0);
  const readOnce = useRef(false);
  const [selectedMeterOption, setSelectedMeterOption] = useState(meterOptions[0]);

  useEffect(() => {
    if (!isStateComplete(setting)) return;
    if (!readOnce.current) {
      const meteroptionExponent = initMeterExponent(setting.fieldX);
      const selectedMeterO = meterOptions.find(option => option.value === meteroptionExponent);
      setMeterExponent(meteroptionExponent);
      setSelectedMeterOption(selectedMeterO);
      setStrField({
        fieldX: RoundCustom(setting.fieldX * Math.pow(10, meteroptionExponent)),
        fieldY: RoundCustom(setting.fieldY * Math.pow(10, meteroptionExponent)),
      });
    } else {
      //console.log("fieldX:"+RoundCustom(setting.fieldX * Math.pow(10, meterExponent)));
      setStrField(() => ({
        fieldX: RoundCustom(setting.fieldX * Math.pow(10, meterExponent)),
        fieldY: RoundCustom(setting.fieldY * Math.pow(10, meterExponent)),
      }));
    }
    //updateStringStates(setting, setStrField);
    readOnce.current = true;
  }, [setting, meterExponent])
  useEffect(() => {
  }, [strField])
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (!validateInput(value)) return;
    clearTimeout(timeoutIdRef.current);
    setStrField((prevState) => ({
      ...prevState,
      [field]: value
    }));
    startSetInputTimer();
  };


  const startSetInputTimer = () => {
    timeoutIdRef.current = setTimeout(handleSetInputTimeout, 1600);
  };
  const handleSetInputTimeout = () => {
    setStrField((current) => {
      let updated = {
        fieldX: isValidNumber(current.fieldX) ? roundToFourSignificantFigures(current.fieldX/ Math.pow(10, meterExponent)) : roundToFourSignificantFigures(setting.fieldX),
        fieldY: isValidNumber(current.fieldY) ? roundToFourSignificantFigures(current.fieldY/ Math.pow(10, meterExponent)) : roundToFourSignificantFigures(setting.fieldY)
      }
      setSetting({ ...setting, ...updated });
    })
  };
  const dispMeterUnit = (value) => {
    const matchedOptions = meterOptions.find(option => option.value === value);
    return matchedOptions ? matchedOptions.label : "";
  }
  const inputFields = [
    { name: "x軸の幅", field: 'fieldX' },
    { name: "y軸の幅", field: 'fieldY' }
  ];
  const handleMeterChange = (option) => {
    setSelectedMeterOption(option);
    console.log(option);
    setMeterExponent(option.value);
  }
  return (
    <Box style={{ overflow: "visible" }}>
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
            {strField !== undefined && strField.fieldX !== undefined && (
              <InputItemGrid>
                {inputFields.map(({ name, field }, index) => {

                  const value = strField[field];
                  return (
                    <JustFlexRow key={field}>
                      <SmallLabel>{name} [ {dispMeterUnit(meterExponent)} ] : </SmallLabel>
                      <InputText
                        key={field}
                        maxLength="12"
                        type="text"
                        value={value}
                        onChange={handleInputChange(field)}
                        onKeyDown={handleKeyDown()}
                      />
                    </JustFlexRow>
                  );

                })}
                <JustFlexRow>
                  <SmallLabel style={{ marginLeft: "-2px", width: "54px" }}>単位 : </SmallLabel>
                  <Select
                    options={meterOptions}
                    styles={customStyles}
                    value={selectedMeterOption}
                    onChange={handleMeterChange}
                    isSearchable={false}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                  />
                </JustFlexRow>

              </InputItemGrid>
            )}

          </GridColumn>
        </ColumnLayout>
      </FrontBody>
    </Box>
  )
};

function RoundCustom(number) {
  // 数値を文字列に変換し、整数部と小数部に分割
  var parts = number.toString().split('.');
  var integerDigits = parts[0].length;
  var decimalDigits = 0;

  // 小数部がある場合、有効な小数桁数をカウント
  if (parts.length > 1) {
    var decimalPart = parts[1];
    for (var i = 0; i < decimalPart.length; i++) {
      decimalDigits++;
      if (decimalPart[i] !== '0') {
        break;
      }
    }
  }
  // 精度を設定
  var precision;
  if (decimalDigits > 0) { // 小数部がある場合
    precision = decimalDigits - integerDigits + 4; // 整数部と小数部の合計桁数から4を引く
  } else { // 整数部のみの場合
    return Number(number);
  }

  // 精度が負にならないように調整
  precision = Math.max(precision, 0);

  // 割り算の結果を計算して丸める
  return Number(number.toFixed(precision));

}
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

const initMeterExponent = (metervalue) => {
  if (metervalue > 1) {
    return 0;
  } else if (metervalue > 1e-3) {
    return 3;
  } else if (metervalue > 1e-6) {
    return 6;
  } else if (metervalue > 1e-9) {
    return 9;
  } else if (metervalue > 1e-12) {
    return 12;
  } else { return 0; }
}