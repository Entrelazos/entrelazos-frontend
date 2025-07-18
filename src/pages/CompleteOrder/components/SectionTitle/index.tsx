import { ReactNode } from 'react';
import { RegularText } from '../../../../components/Typography';
import { SectionTitleContainer } from './styles';

interface SectionTitleProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
}

export function SectionTitle({ title, icon }: SectionTitleProps) {
  return (
    <SectionTitleContainer>
      {icon}
      <div>
        <RegularText color='subtitle'>{title}</RegularText>
        <RegularText size='s'>{title}</RegularText>
      </div>
    </SectionTitleContainer>
  );
}
