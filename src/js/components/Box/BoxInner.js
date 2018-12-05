import React, { Children, Component } from 'react';

import { backgroundIsDark, removeKeys } from '../../utils';
import { ThemeContext } from '../../contexts';

import { StyledBoxGap } from './StyledBox';
import { boxProps } from './doc';

export class BoxInner extends Component {
  static displayName = 'Box';

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
        backgroundChanged: false,
      };
    }
    return null;
  }

  render() {
    const {
      a11yTitle,
      as,
      background,
      children,
      direction,
      forwardedRef,
      gap,
      responsive,
      tag = 'div',
      theme,
      ...rest
    } = this.props;
    const { backgroundChanged } = this.state;

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
                direction={direction}
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

    const Component = tag;

    return (
      <Component
        aria-label={a11yTitle}
        ref={forwardedRef}
        {...removeKeys(rest, boxProps)}
      >
        {contents}
      </Component>
    );
  }
}
