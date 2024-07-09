import * as UiKit from '@rocket.chat/ui-kit';
import { parse } from '@rocket.chat/message-parser';
import React, { Fragment } from 'react';
import { Markup } from '@embeddedchat/markups';
import ActionsBlock from '../blocks/ActionsBlock';
import ContextBlock from '../blocks/ContextBlock';
import DividerBlock from '../blocks/DividerBlock';
import ImageBlock from '../blocks/ImageBlock';
import InputBlock from '../blocks/InputBlock';
import PreviewBlock from '../blocks/PreviewBlock';
import SectionBlock from '../blocks/SectionBlock';
import ButtonElement from '../elements/ButtonElement';
import DatePickerElement from '../elements/DatePickerElement';
import ImageElement from '../elements/ImageElement';
import LinearScaleElement from '../elements/LinearScaleElement';
import MultiStaticSelectElement from '../elements/MultiStaticSelectElement';
import OverflowElement from '../elements/OverflowElement';
import PlainTextInputElement from '../elements/PlainTextInputElement';
import StaticSelectElement from '../elements/StaticSelectElement';

export class FuselageSurfaceRenderer extends UiKit.SurfaceRenderer {
  constructor(allowedBlocks) {
    super(
      allowedBlocks || [
        'actions',
        'context',
        'divider',
        'image',
        'input',
        'section',
        'preview',
      ]
    );
  }

  plain_text({ text = '' }, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return null;
    }

    return text ? <Fragment key={index}>{text}</Fragment> : null;
  }

  mrkdwn({ text = '' }, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return null;
    }

    return text ? (
      <Markup key={index} tokens={parse(text, { emoticons: false })} />
    ) : null;
  }

  text(textObject, context, index) {
    if (textObject.type !== 'mrkdwn') {
      return this.plain_text(textObject, context, index);
    }

    return this.mrkdwn(textObject, context, index);
  }

  actions(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return (
        <ActionsBlock
          key={index}
          block={block}
          context={context}
          index={index}
          surfaceRenderer={this}
        />
      );
    }

    return null;
  }

  preview(block, context, index) {
    if (context !== UiKit.BlockContext.BLOCK) {
      return null;
    }

    return (
      <PreviewBlock
        key={index}
        block={block}
        context={context}
        index={index}
        surfaceRenderer={this}
      />
    );
  }

  context(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return (
        <ContextBlock
          key={index}
          block={block}
          context={context}
          index={index}
          surfaceRenderer={this}
        />
      );
    }

    return null;
  }

  divider(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return (
        <DividerBlock
          key={index}
          block={block}
          context={context}
          index={index}
          surfaceRenderer={this}
        />
      );
    }

    return null;
  }

  image(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return (
        <ImageBlock
          key={index}
          block={block}
          context={context}
          index={index}
          surfaceRenderer={this}
        />
      );
    }

    return (
      <ImageElement
        key={index}
        block={block}
        context={context}
        index={index}
        surfaceRenderer={this}
      />
    );
  }

  input(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return (
        <InputBlock
          key={block.element.actionId || index}
          block={block}
          context={context}
          index={index}
          surfaceRenderer={this}
        />
      );
    }

    return null;
  }

  section(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return (
        <SectionBlock
          key={index}
          block={block}
          context={context}
          index={index}
          surfaceRenderer={this}
        />
      );
    }

    return null;
  }

  button(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return null;
    }

    return (
      <ButtonElement
        key={index}
        block={block}
        context={context}
        index={index}
        surfaceRenderer={this}
      />
    );
  }

  datepicker(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return null;
    }

    return (
      <DatePickerElement
        key={block.actionId || index}
        block={block}
        context={context}
        index={index}
        surfaceRenderer={this}
      />
    );
  }

  static_select(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return null;
    }

    return (
      <StaticSelectElement
        key={block.actionId || index}
        block={block}
        context={context}
        index={index}
        surfaceRenderer={this}
      />
    );
  }

  multi_static_select(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return null;
    }

    return (
      <MultiStaticSelectElement
        key={block.actionId || index}
        block={block}
        context={context}
        index={index}
        surfaceRenderer={this}
      />
    );
  }

  overflow(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return null;
    }

    return (
      <OverflowElement
        key={index}
        block={block}
        context={context}
        index={index}
        surfaceRenderer={this}
      />
    );
  }

  plain_text_input(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return null;
    }

    return (
      <PlainTextInputElement
        key={block.actionId || index}
        block={block}
        context={context}
        index={index}
        surfaceRenderer={this}
      />
    );
  }

  linear_scale(block, context, index) {
    if (context === UiKit.BlockContext.BLOCK) {
      return null;
    }

    return (
      <LinearScaleElement
        key={block.actionId || index}
        block={block}
        context={context}
        index={index}
        surfaceRenderer={this}
      />
    );
  }
}
