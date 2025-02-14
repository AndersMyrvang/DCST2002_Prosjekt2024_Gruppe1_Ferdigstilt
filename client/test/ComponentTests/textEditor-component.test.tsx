import * as React from 'react';
import { Component } from 'react-simplified';
import { shallow, mount } from 'enzyme';
import { TextEditor } from '../../src/components/textEditor-component';
import { Editor } from '@tinymce/tinymce-react';

describe('TextEditor component tests', () => {
  const mockOnContentChange = jest.fn();
  const initialContent = 'Initial content';

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('TextEditor component renders correctly with initial content', () => {
    const wrapper = shallow(
      <TextEditor initialContent={initialContent} onContentChange={mockOnContentChange} />,
    );
    expect(wrapper.find(Editor).prop('value')).toBe(initialContent);
    expect(wrapper).toMatchSnapshot();
  });

  test('TextEditor calls onContentChange when editor content changes', () => {
    const wrapper = shallow(
      <TextEditor initialContent={initialContent} onContentChange={mockOnContentChange} />,
    );

    const mockEditorInstance = {};
    const onEditorChange = wrapper.find(Editor).prop('onEditorChange');
    if (onEditorChange) {
      onEditorChange('Updated content', mockEditorInstance);
    }

    expect(mockOnContentChange).toHaveBeenCalledWith('Updated content');
  });

  test('TextEditor correctly updates when initialContent changes', () => {
    const wrapper = shallow(
      <TextEditor initialContent="First content" onContentChange={mockOnContentChange} />,
    );
    expect(wrapper.find(Editor).prop('value')).toBe('First content');

    wrapper.setProps({ initialContent: 'Updated content' });
    wrapper.update();
    expect(wrapper.find(Editor).prop('value')).toBe('Updated content');
  });

  test('TextEditor setup function initializes correctly', () => {
    const wrapper = shallow(
      <TextEditor initialContent={initialContent} onContentChange={mockOnContentChange} />,
    );

    const initConfig = wrapper.find(Editor).prop('init');
    expect(initConfig).toMatchObject({
      height: 500,
      menubar: false,
      plugins: expect.arrayContaining(['advlist', 'autolink', 'lists', 'link']),
      toolbar: expect.stringContaining('undo redo | formatselect | bold italic backcolor'),
    });
  });

  test('TextEditor snapshot matches with initial content', () => {
    const wrapper = shallow(
      <TextEditor initialContent={initialContent} onContentChange={mockOnContentChange} />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('TextEditor renders correctly with empty initial content', () => {
    const wrapper = shallow(<TextEditor initialContent="" onContentChange={mockOnContentChange} />);
    expect(wrapper.find(Editor).prop('value')).toBe('');
    expect(wrapper).toMatchSnapshot();
  });

  test('TextEditor does not call onContentChange during initialization', () => {
    const wrapper = shallow(
      <TextEditor initialContent={initialContent} onContentChange={mockOnContentChange} />,
    );

    expect(mockOnContentChange).not.toHaveBeenCalled();
  });

  test('TextEditor correctly handles very large content', () => {
    const largeContent = 'a'.repeat(10000);
    const wrapper = shallow(
      <TextEditor initialContent={largeContent} onContentChange={mockOnContentChange} />,
    );
    expect(wrapper.find(Editor).prop('value')).toBe(largeContent);

    wrapper.find(Editor).prop('onEditorChange')!(largeContent, {});
    expect(mockOnContentChange).toHaveBeenCalledWith(largeContent);
  });

  test('TextEditor component renders correctly with initial content', () => {
    const wrapper = shallow(
      <TextEditor initialContent={initialContent} onContentChange={mockOnContentChange} />,
    );
    expect(wrapper.find(Editor).prop('value')).toBe(initialContent);
    expect(wrapper).toMatchSnapshot();
  });

  test('TextEditor calls onContentChange when editor content changes', () => {
    const wrapper = shallow(
      <TextEditor initialContent={initialContent} onContentChange={mockOnContentChange} />,
    );

    const mockEditorInstance = {};
    const onEditorChange = wrapper.find(Editor).prop('onEditorChange');
    if (onEditorChange) {
      onEditorChange('Updated content', mockEditorInstance);
    }

    expect(mockOnContentChange).toHaveBeenCalledWith('Updated content');
  });

  test('TextEditor triggers Change event and calls onContentChange', () => {
    const wrapper = shallow(
      <TextEditor initialContent={initialContent} onContentChange={mockOnContentChange} />,
    );

    const mockEditorInstance = {
      getContent: jest.fn().mockReturnValue('Updated content'),
      on: jest.fn(),
    };

    const init = wrapper.find(Editor).prop('init');
    if (init) {
      init.setup(mockEditorInstance);
    }

    mockEditorInstance.on.mock.calls.forEach((args) => {
      if (args[0] === 'Change') {
        args[1]();
      }
    });

    expect(mockOnContentChange).toHaveBeenCalledWith('Updated content');
    expect(mockEditorInstance.getContent).toHaveBeenCalled();
  });

  test('TextEditor renders correctly with empty initial content', () => {
    const wrapper = shallow(<TextEditor initialContent="" onContentChange={mockOnContentChange} />);
    expect(wrapper.find(Editor).prop('value')).toBe('');
    expect(wrapper).toMatchSnapshot();
  });
});
