'use client'
import React from 'react';
import Checked from '@/assets/svg/check.svg';
import { isBlank } from '@/utils';
import './style.scss';

interface Checkbox {
  selected?: boolean;
  label?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  onChange?: (name: string, value: boolean) => void;
}

const Checkbox = (props: Checkbox) => {

  const onChange: React.MouseEventHandler<HTMLDivElement> = event => {
    // event.stopPropagation();
    props.onChange?.(props.name ?? '', !Boolean(props.selected));
  };
  return (
    <div className={`checkbox ${props.className ?? ''}`} onClick={onChange}>
      <button
        disabled={props.disabled}
        type="button"
        className={`square ${props.selected ? 'checked' : ''}`}
      >
        {props.selected && <Checked />}
      </button>
      {!isBlank(props.label) && (
        <div className="label text-medium">{props.label}</div>
      )}
    </div>
  );
};

export default Checkbox;
