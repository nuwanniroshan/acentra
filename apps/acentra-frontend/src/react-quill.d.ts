declare module 'react-quill' {
  import React from 'react';
  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    readOnly?: boolean;
    theme?: string;
    modules?: any;
    formats?: string[];
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    placeholder?: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
  }
  export default class ReactQuill extends React.Component<ReactQuillProps> {}
}
