import React, { useState, useRef } from "react";
import {EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import "./Component_checker.css";
import Editor from '@draft-js-plugins/editor';
import "../../node_modules/draft-js/dist/Draft.css"

import createImagePlugin from '@draft-js-plugins/image';

const RichEditorExample = () => {
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const imagePlugin = createImagePlugin();

  const focus = () => editorRef.current.focus();
  const onChange = (newEditorState) => setEditorState(newEditorState);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };

  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        editorState,
        4, /* maxDepth */
      );
      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  const toggleBlockType = (blockType) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  // If the user changes block type before entering any text, we can
  // either style the placeholder or hide it. Let's just hide it now.
  let className = 'RichEditor-editor';
  var contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ' RichEditor-hidePlaceholder';
    }
  }
//   const plugins = [imagePlugin];
const sample = `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
<msup>
  <mi>1</mi>
  <mi>x</mi>
</msup>
<mo>+</mo>
<mfrac>
  <mrow>
    <mi>n</mi>
    <mi>x</mi>
  </mrow>
  <mrow>
    <mn>1</mn>
    <mo>!</mo>
  </mrow>
</mfrac>
<mo>+</mo>
<mfrac>
  <mrow>
    <mi>n</mi>
    <mi>x</mi>
    <msup>
      <mrow>
        <mi>n</mi>
        <mo>-</mo>
        <mn>1</mn>
      </mrow>
      <mrow>
        <mi>x</mi>
        <msup>
          <mi>2</mi>
        </msup>
      </mrow>
    </msup>
  </mrow>
  <mrow>
    <mn>2</mn>
    <mo>!</mo>
  </mrow>
</mfrac>
<mo>+</mo>
<mo>…</mo>
</math>
`
  return (
    <div className="RichEditor-root">
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
      <div className={className} onClick={focus}>
        <Editor
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          onChange={onChange}
          placeholder="Tell a story..."
          ref={editorRef}
          spellCheck={true}
          plugins={[imagePlugin]}
          
        />
        <div dangerouslySetInnerHTML={{__html: sample}} />
      </div>
    </div>
  );
};


// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H20', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
  {label: 'image Upload'}
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
export default RichEditorExample;