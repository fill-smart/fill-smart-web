import styled from 'styled-components';
import { palette } from 'styled-theme';

const WidgetWrapper = styled.div`
  margin: 0 10px;
  width: ${(props:any) => props.width}px;
  margin-top: ${(props:any) => props.gutterTop}px;
  margin-right: ${(props:any) => props.gutterRight}px;
  margin-bottom: ${(props:any) => props.gutterBottom}px;
  margin-left: ${(props:any) => props.gutterLeft}px;
  padding: ${(props:any) => props.padding};
  background-color: ${(props:any) => props.bgColor}px;
  @media only screen and (max-width: 767) {
    margin-right: 0 !important;
  }
`;

const WidgetBox:any = styled.div`
  width: 100%;
  height: ${(props:any) => (props.height ? `${props.height}px` : '100%')};
  padding: ${(props:any) => (props.padding ? props.padding : '20px')};
  background-color: #ffffff;
  border: 1px solid ${palette('border', 2)};

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;
const getAlignContent = (align = 'flex-start') => {
  if (align === 'start') return 'flex-start';
  if (align === 'end') return 'flex-end';
  return align;
};
const WidgetColumn = styled.div`
  align-content: ${(props:any) => getAlignContent(props.align)};
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin-top: ${(props:any) => props.gutterTop}px;
  margin-right: ${(props:any) => props.gutterRight}px;
  margin-bottom: ${(props:any) => props.gutterBottom}px;
  margin-left: ${(props:any) => props.gutterLeft}px;
  padding: ${(props:any) => props.padding}px;
  width: ${(props:any) => props.width}px;
`;

export { WidgetWrapper, WidgetBox, WidgetColumn };
