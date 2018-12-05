import React, { Children, Component } from 'react';
import { compose } from 'recompose';

import { withDocs, withForwardRef } from '../hocs';
import { ThemeContext } from '../../contexts';
import { backgroundIsDark } from '../../utils';
import { defaultProps } from '../../default-props';

import { StyledBox, StyledBoxGap } from './StyledBox';

const wrapWithHocs = compose(
  withForwardRef,
  withDocs('Box'),
);

class BoxImpl extends Component {
  static displayName = 'Box';

  static contextType = ThemeContext;

  static defaultProps = {
    direction: 'column',
    margin: 'none',
    pad: 'none',
    responsive: true,
  };

  state = {
    backgroundChanged: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { background } = nextProps;
    const { previousBackground, backgroundChanged } = prevState;
    if (previousBackground !== background) {
      return {
        previousBackground: background,
        backgroundChanged: true,
      };
    }
    if (backgroundChanged) {
      return {
        previousBackground: background,
        backgroundChanged: false,
      };
    }
    return null;
  }

  render() {
    const {
      a11yTitle,
      background,
      children,
      direction,
      elevation, // munged to avoid styled-components putting it in the DOM
      fill, // munged to avoid styled-components putting it in the DOM
      forwardRef,
      gap,
      overflow, // munged to avoid styled-components putting it in the DOM
      responsive,
      tag,
      as,
      wrap, // munged to avoid styled-components putting it in the DOM,
      width, // munged to avoid styled-components putting it in the DOM
      height, // munged to avoid styled-components putting it in the DOM
      theme: defaultTheme,
      ...rest
    } = this.props;
    const { backgroundChanged } = this.state;
    const theme = this.context || defaultTheme;

    let contents = children;
    if (gap) {
      contents = [];
      let firstIndex;
      Children.forEach(children, (child, index) => {
        if (child) {
          if (firstIndex === undefined) {
            firstIndex = index;
          } else {
            contents.push(
              <StyledBoxGap
                key={index}
                gap={gap}
                directionProp={direction}
                responsive={responsive}
              />,
            );
          }
        }
        contents.push(child);
      });
    }

    if (backgroundChanged && background) {
      const dark = backgroundIsDark(background, theme);
      contents = (
        <ThemeContext.Provider value={{ ...theme, dark }}>
          {contents}
        </ThemeContext.Provider>
      );
    }

    return (
      <StyledBox
        as={!as && tag ? tag : as}
        aria-label={a11yTitle}
        ref={forwardRef}
        background={background}
        directionProp={direction}
        elevationProp={elevation}
        fillProp={fill}
        overflowProp={overflow}
        wrapProp={wrap}
        widthProp={width}
        heightProp={height}
        responsive={responsive}
        {...rest}
      >
        {contents}
      </StyledBox>
    );
  }
}

Object.setPrototypeOf(BoxImpl.defaultProps, defaultProps);

export const Box = wrapWithHocs(BoxImpl);
