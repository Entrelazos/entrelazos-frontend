import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Heading from '@tiptap/extension-heading';
import CodeBlock from '@tiptap/extension-code-block';
import React, { useEffect } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <ButtonGroup
      variant='outlined'
      size='small'
      sx={{ mb: 1, flexWrap: 'wrap' }}
    >
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        Bold
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        Italic
      </Button>
      <Button onClick={() => editor.chain().focus().toggleUnderline().run()}>
        Underline
      </Button>
      <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        Code Block
      </Button>
      <Button onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        Left
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        Center
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        Right
      </Button>
    </ButtonGroup>
  );
};

const TiptapEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Color,
      Highlight,
      Heading.configure({ levels: [1, 2] }),
      CodeBlock,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <Box
      border='1px solid #ccc'
      borderRadius={1}
      p={2}
      sx={{ '& .ProseMirror': { minHeight: '150px', outline: 'none' } }}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </Box>
  );
};

export default TiptapEditor;
