declare module '@tinymce/tinymce-react' {
    import * as React from 'react';
  
    export interface EditorProps {
      apiKey?: string;
      value?: string;
      init?: Record<string, any>;
      onEditorChange?: (content: string, editor: any) => void;
      // Add other props as needed
    }
  
    export class Editor extends React.Component<EditorProps> {}
  }
  