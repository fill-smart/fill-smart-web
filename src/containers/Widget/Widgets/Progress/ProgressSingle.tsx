import React from 'react';
import Progress from '../../../../components/uielements/progress';
import { SingleProgressWidgetBar } from './ProgressWidget.styles';

export default function SingleProgressWidget({
  label,
  percent,
  barHeight,
  status,
  info,
  fontColor,
}: { label: string, percent: number, barHeight: number, status: any, info: any, fontColor?: any }) {
  return (
    <SingleProgressWidgetBar className="isoSingleProgressBar">
      <h3 style={{ color: fontColor }}>{label}</h3>
      <Progress
        percent={percent}
        strokeWidth={barHeight}
        status={status}
        showInfo={info}
      />
    </SingleProgressWidgetBar>
  );
}
