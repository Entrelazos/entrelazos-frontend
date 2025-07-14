import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Heading from '@tiptap/extension-heading';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import './tiptap-style.scss';

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
        Negrita
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        Cursiva
      </Button>
      <Button onClick={() => editor.chain().focus().toggleUnderline().run()}>
        Subrayado
      </Button>
      <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        Código
      </Button>
      <Button onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        Izquierda
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        Centro
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        Derecha
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
      Placeholder.configure({
        placeholder: 'Descripcion...',
      }),
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
      <EditorContent editor={editor} lang='es' />
    </Box>
  );
};

export default TiptapEditor;
