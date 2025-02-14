import { Editor } from '@tinymce/tinymce-react';
import React from 'react';

interface TextEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

//Komponent for skrivefelt i detaljsidene av spiller/league/team
export function TextEditor({ initialContent, onContentChange }: TextEditorProps) {
  return (
    <Editor
      value={initialContent}
      onEditorChange={(content) => onContentChange(content)}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'print',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'paste',
          'code',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        setup: function (editor: any) {
          editor.on('Change', function () {
            onContentChange(editor.getContent());
          });
          editor.on('init', function () {
            const toolbar = document.querySelector('.tox-editor-header');
            if (toolbar) {
              (toolbar as HTMLElement).style.zIndex = '0';
            }
          });
        },
      }}
    />
  );
}
